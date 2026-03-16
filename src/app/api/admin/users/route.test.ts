import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
const mockRequireAdmin = vi.fn()
vi.mock('@/lib/auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
  requireStaff: () => mockRequireAdmin(),
  isSuperAdmin: () => false,
}))

// Mock supabase admin client
const mockInviteUserByEmail = vi.fn()
const mockSupabase = {
  from: vi.fn(),
  auth: {
    admin: {
      inviteUserByEmail: mockInviteUserByEmail,
    },
  },
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

import { GET, POST } from './route'

const adminProfile = {
  id: 'admin-1', email: 'admin@aquila.com', name: 'Admin',
  user_type: 'admin', status: 'active', company_id: null,
  created_at: '2026-01-01', updated_at: '2026-01-01',
}

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function chainMock(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'order', 'or', 'eq', 'ilike', 'insert', 'single', 'update']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  // Both terminal methods should resolve
  chain['single'] = vi.fn().mockResolvedValue(result)
  // For query chains that end with the query (not .single())
  // Make the chain itself thenable for await
  return chain
}

describe('GET /api/admin/users', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not admin', async () => {
    mockRequireAdmin.mockResolvedValue(null)
    const req = createRequest('http://localhost:3000/api/admin/users')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns users list', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const users = [
      { id: 'u1', email: 'user@example.com', name: 'User One', user_type: 'customer', status: 'active', company: { id: 'c1', name: 'Acme' } },
    ]

    const queryChain: Record<string, unknown> = {}
    const methods = ['select', 'order', 'or', 'eq']
    for (const method of methods) {
      queryChain[method] = vi.fn().mockReturnValue(queryChain)
    }
    queryChain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
      resolve({ data: users, error: null })
    })

    mockSupabase.from.mockReturnValue(queryChain)

    const req = createRequest('http://localhost:3000/api/admin/users')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('User One')
  })

  it('applies search filter', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    // The code does `query = query.or(...)` so .or() must return the same chain
    // and the chain is then awaited with destructuring
    const orSpy = vi.fn()
    const queryChain: Record<string, ReturnType<typeof vi.fn>> = {}
    const methods = ['select', 'order', 'or', 'eq']
    for (const method of methods) {
      queryChain[method] = vi.fn().mockReturnValue(queryChain)
    }
    orSpy.mockReturnValue(queryChain)
    queryChain['or'] = orSpy
    // The final await on the query chain needs the last method in the chain
    // to return a promise. Since filters are applied after order, we need
    // the chain itself to be thenable. The code does:
    //   let query = supabase.from('profiles').select(...).order(...)
    //   if (search) query = query.or(...)
    //   const { data, error } = await query
    // So the chain needs a .then method for await to work
    queryChain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
      resolve({ data: [], error: null })
    })

    mockSupabase.from.mockReturnValue(queryChain)

    const req = createRequest('http://localhost:3000/api/admin/users?search=john')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(orSpy).toHaveBeenCalledWith(
      expect.stringContaining('john')
    )
  })

  it('returns 500 on database error', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const queryChain: Record<string, unknown> = {}
    const methods = ['select', 'order', 'or', 'eq']
    for (const method of methods) {
      queryChain[method] = vi.fn().mockReturnValue(queryChain)
    }
    queryChain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
      resolve({ data: null, error: { message: 'DB error' } })
    })

    mockSupabase.from.mockReturnValue(queryChain)

    const req = createRequest('http://localhost:3000/api/admin/users')
    const res = await GET(req)
    expect(res.status).toBe(500)
  })
})

describe('POST /api/admin/users', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not admin', async () => {
    mockRequireAdmin.mockResolvedValue(null)
    const req = createRequest('http://localhost:3000/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', name: 'New', user_type: 'customer' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 when email is missing', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'New', user_type: 'customer' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('required')
  })

  it('returns 400 when name is missing', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', user_type: 'customer' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid user_type', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', name: 'New', user_type: 'superadmin' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Invalid user_type')
  })

  it('returns 400 when customer has no company_id', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', name: 'New', user_type: 'customer' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Company is required')
  })

  it('returns 409 when email already exists', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const chain = chainMock({ data: { id: 'existing' }, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com', name: 'Existing', user_type: 'admin',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toContain('already exists')
  })

  it('creates admin user without company_id', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    // Duplicate check: no match
    const dupChain = chainMock({ data: null, error: { code: 'PGRST116' } })

    // Auth invite success
    mockInviteUserByEmail.mockResolvedValue({
      data: { user: { id: 'new-user-id' } },
      error: null,
    })

    // Profile insert
    const profile = {
      id: 'new-user-id', email: 'new@aquila.com', name: 'New Admin',
      user_type: 'admin', status: 'invited', company_id: null,
      company: null,
    }
    const insertChain = chainMock({ data: profile, error: null })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount === 1 ? dupChain : insertChain
    })

    const req = createRequest('http://localhost:3000/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'NEW@aquila.com', name: 'New Admin', user_type: 'admin' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)

    // Verify email was lowercased
    expect(mockInviteUserByEmail).toHaveBeenCalledWith(
      'new@aquila.com',
      expect.any(Object)
    )
  })
})
