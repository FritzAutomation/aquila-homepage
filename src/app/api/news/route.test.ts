import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock supabase server client (for auth checks)
const mockGetUser = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve({
    auth: { getUser: mockGetUser },
  }),
}))

// Mock supabase admin client
const mockSupabase = {
  from: vi.fn(),
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

// Mock kb-utils
vi.mock('@/lib/kb-utils', () => ({
  generateSlug: (title: string) => title.toLowerCase().replace(/\s+/g, '-'),
}))

import { GET, POST } from './route'

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function chainMock(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'insert', 'order', 'eq', 'ilike', 'neq', 'update', 'single', 'is']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)
  chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    resolve(result)
  })
  return chain
}

describe('GET /api/news', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns published articles for public users', async () => {
    const articles = [
      { id: 'n1', title: 'Published News', slug: 'published-news', is_published: true },
    ]
    const chain = chainMock({ data: articles, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/news')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].title).toBe('Published News')
    // Should filter by is_published for public requests
    expect(chain.eq).toHaveBeenCalledWith('is_published', true)
  })

  it('returns all articles for admin users', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    const articles = [
      { id: 'n1', title: 'Published', is_published: true },
      { id: 'n2', title: 'Draft', is_published: false },
    ]
    const chain = chainMock({ data: articles, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/news?admin=true')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(2)
    // Should NOT filter by is_published for admin
    expect(chain.eq).not.toHaveBeenCalledWith('is_published', true)
  })

  it('returns 500 on database error', async () => {
    const chain = chainMock({ data: null, error: { message: 'DB error' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/news')
    const res = await GET(req)
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Failed to fetch articles')
  })
})

describe('POST /api/news', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = createRequest('http://localhost:3000/api/news', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Article' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 400 when title is missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const req = createRequest('http://localhost:3000/api/news', {
      method: 'POST',
      body: JSON.stringify({ content: 'Some content' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Title is required')
  })

  it('creates article successfully', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const article = {
      id: 'art-1', title: 'New Article', slug: 'new-article',
      content: 'Content here', is_published: false,
    }
    const chain = chainMock({ data: article, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/news', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Article', content: 'Content here' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.title).toBe('New Article')
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Article',
        slug: 'new-article',
        content: 'Content here',
        author_id: 'user-1',
      }),
    )
  })

  it('returns 409 when duplicate title exists', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = chainMock({ data: null, error: { code: '23505', message: 'duplicate' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/news', {
      method: 'POST',
      body: JSON.stringify({ title: 'Existing Article' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toContain('already exists')
  })
})
