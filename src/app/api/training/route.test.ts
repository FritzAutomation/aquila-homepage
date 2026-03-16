import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
const mockGetCurrentUser = vi.fn()
vi.mock('@/lib/auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
  getCurrentUser: () => mockGetCurrentUser(),
}))
const mockRequireAdmin = vi.fn()

// Mock supabase admin client
const mockSupabase = {
  from: vi.fn(),
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

// Mock supabase server client (used for auth checks in GET admin mode and POST)
const mockGetUser = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve({
    auth: { getUser: mockGetUser },
  }),
}))

import { GET, POST } from './route'

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function chainMock(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'order', 'eq', 'ilike', 'neq', 'insert', 'single', 'contains', 'is', 'in_', 'or']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  // Allow `in` as an alias for `in_` since `in` is a reserved word
  chain['in'] = chain['in_']
  // Terminal: .single() resolves the result
  chain['single'] = vi.fn().mockResolvedValue(result)
  // Make chain thenable so `await query` works
  chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    resolve({ data: result.data, error: result.error })
  })
  return chain
}

// ---------------------------------------------------------------------------
// GET /api/training
// ---------------------------------------------------------------------------
describe('GET /api/training', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns public modules for unauthenticated users', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const modules = [
      {
        id: 'm1', title: 'Public Module', slug: 'public-module',
        description: 'A public module', product: 'dmm', sort_order: 1,
        is_published: true, is_public: true, estimated_minutes: 30,
        lessons: [
          { id: 'l1', steps: [{ id: 's1' }, { id: 's2' }] },
        ],
      },
    ]

    const chain = chainMock({ data: modules, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/training')
    const res = await GET(req)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].title).toBe('Public Module')
    expect(body[0].lesson_count).toBe(1)
    expect(body[0].step_count).toBe(2)
    expect(body[0].is_assigned).toBe(false)
    // Nested lessons should be stripped
    expect(body[0].lessons).toBeUndefined()

    // Should filter to published + public
    expect(chain.eq).toHaveBeenCalledWith('is_published', true)
    expect(chain.eq).toHaveBeenCalledWith('is_public', true)
  })

  it('returns all published modules for agents', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 'a1', user_type: 'agent', email: 'agent@aquila.com',
    })

    const modules = [
      {
        id: 'm1', title: 'Module A', slug: 'module-a',
        description: '', product: 'dmm', sort_order: 1,
        is_published: true, is_public: false, estimated_minutes: 15,
        lessons: [],
      },
      {
        id: 'm2', title: 'Module B', slug: 'module-b',
        description: '', product: 'glm', sort_order: 2,
        is_published: true, is_public: true, estimated_minutes: 20,
        lessons: [{ id: 'l1', steps: [{ id: 's1' }] }],
      },
    ]

    const chain = chainMock({ data: modules, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/training')
    const res = await GET(req)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveLength(2)

    // Staff without admin param: published only filter
    expect(chain.eq).toHaveBeenCalledWith('is_published', true)
  })

  it('returns all modules for admin with admin=true query param', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 'a1', user_type: 'admin', email: 'admin@aquila.com',
    })
    // The admin=true path checks auth via createServerClient
    mockGetUser.mockResolvedValue({ data: { user: { id: 'a1' } } })

    const modules = [
      {
        id: 'm1', title: 'Published', slug: 'published',
        description: '', product: 'dmm', sort_order: 1,
        is_published: true, is_public: true, estimated_minutes: 10,
        lessons: [],
      },
      {
        id: 'm2', title: 'Draft', slug: 'draft',
        description: '', product: 'dmm', sort_order: 2,
        is_published: false, is_public: false, estimated_minutes: null,
        lessons: [],
      },
    ]

    const chain = chainMock({ data: modules, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/training?admin=true')
    const res = await GET(req)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveLength(2)

    // Admin mode should NOT filter by is_published
    expect(chain.eq).not.toHaveBeenCalledWith('is_published', true)
  })

  it('returns 500 on database error', async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const chain = chainMock({ data: null, error: { message: 'DB error' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/training')
    const res = await GET(req)
    expect(res.status).toBe(500)
  })
})

// ---------------------------------------------------------------------------
// POST /api/training
// ---------------------------------------------------------------------------
describe('POST /api/training', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = createRequest('http://localhost:3000/api/training', {
      method: 'POST',
      body: JSON.stringify({ title: 'New', slug: 'new', product: 'dmm' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 when required fields are missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })

    const req = createRequest('http://localhost:3000/api/training', {
      method: 'POST',
      body: JSON.stringify({ title: 'Only Title' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('required')
  })

  it('creates module successfully', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })

    const createdModule = {
      id: 'm-new', title: 'New Module', slug: 'new-module',
      description: 'desc', product: 'dmm', sort_order: 0,
      is_published: false, estimated_minutes: null,
    }

    const chain = chainMock({ data: createdModule, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/training', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Module', slug: 'new-module', product: 'dmm' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.title).toBe('New Module')
    expect(body.slug).toBe('new-module')
  })

  it('returns 409 when slug already exists', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })

    const chain = chainMock({ data: null, error: { code: '23505', message: 'duplicate' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/training', {
      method: 'POST',
      body: JSON.stringify({ title: 'Dup', slug: 'existing-slug', product: 'dmm' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toContain('slug already exists')
  })
})
