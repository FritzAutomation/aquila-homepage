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

import { GET, PATCH, DELETE } from './route'

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function chainMock(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'insert', 'update', 'delete', 'order', 'eq', 'or', 'single']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)
  chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    resolve(result)
  })
  return chain
}

const validUuid = '12345678-1234-1234-1234-123456789abc'

describe('GET /api/kb/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns published article by UUID', async () => {
    const article = {
      id: validUuid, title: 'Test Article', slug: 'test-article',
      is_published: true, content: 'Content',
    }
    const chain = chainMock({ data: article, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`)
    const res = await GET(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.title).toBe('Test Article')
    // Should use eq('id', ...) for UUID
    expect(chain.eq).toHaveBeenCalledWith('id', validUuid)
  })

  it('returns published article by slug', async () => {
    const article = {
      id: 'a1', title: 'Test Article', slug: 'test-article',
      is_published: true, content: 'Content',
    }
    const chain = chainMock({ data: article, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/kb/test-article')
    const res = await GET(req, { params: Promise.resolve({ id: 'test-article' }) })
    expect(res.status).toBe(200)
    // Should use eq('slug', ...) for non-UUID
    expect(chain.eq).toHaveBeenCalledWith('slug', 'test-article')
  })

  it('returns 404 when article not found', async () => {
    const chain = chainMock({ data: null, error: { code: 'PGRST116' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/kb/nonexistent')
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) })
    expect(res.status).toBe(404)
  })

  it('returns 404 for unpublished article when not authenticated', async () => {
    const article = {
      id: 'a1', title: 'Draft', slug: 'draft',
      is_published: false, content: 'Draft content',
    }
    const chain = chainMock({ data: article, error: null })
    mockSupabase.from.mockReturnValue(chain)
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = createRequest('http://localhost:3000/api/kb/draft')
    const res = await GET(req, { params: Promise.resolve({ id: 'draft' }) })
    expect(res.status).toBe(404)
  })

  it('returns unpublished article when authenticated', async () => {
    const article = {
      id: 'a1', title: 'Draft', slug: 'draft',
      is_published: false, content: 'Draft content',
    }
    const chain = chainMock({ data: article, error: null })
    mockSupabase.from.mockReturnValue(chain)
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const req = createRequest('http://localhost:3000/api/kb/draft')
    const res = await GET(req, { params: Promise.resolve({ id: 'draft' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.title).toBe('Draft')
  })
})

describe('PATCH /api/kb/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(401)
  })

  it('updates article successfully', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const updated = {
      id: validUuid, title: 'Updated Title', slug: 'updated-title',
      content: 'Updated content', is_published: true,
    }
    const chain = chainMock({ data: updated, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title', content: 'Updated content' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.title).toBe('Updated Title')
  })

  it('returns 409 on duplicate title', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = chainMock({ data: null, error: { code: '23505', message: 'duplicate' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Duplicate Title' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(409)
  })

  it('returns 500 on database error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = chainMock({ data: null, error: { code: 'OTHER', message: 'DB error' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Test' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(500)
  })
})

describe('DELETE /api/kb/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(401)
  })

  it('deletes article successfully', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = chainMock({ data: null, error: null })
    // delete() doesn't use single(), it resolves the chain directly
    chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
      resolve({ error: null })
    })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('returns 500 on database error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = chainMock({ data: null, error: { message: 'DB error' } })
    chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
      resolve({ error: { message: 'DB error' } })
    })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest(`http://localhost:3000/api/kb/${validUuid}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: validUuid }) })
    expect(res.status).toBe(500)
  })
})
