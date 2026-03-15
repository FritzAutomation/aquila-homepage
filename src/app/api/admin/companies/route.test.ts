import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
const mockRequireAdmin = vi.fn()
vi.mock('@/lib/auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
}))

// Mock supabase admin client
const mockSupabase = {
  from: vi.fn(),
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

import { GET, POST } from './route'

const adminProfile = {
  id: 'admin-1',
  email: 'admin@aquila.com',
  name: 'Admin',
  user_type: 'admin',
  status: 'active',
  company_id: null,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
}

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

// Helper to build chainable query mock
// All methods return the chain. The chain is thenable (for `await query`)
// and `.single()` resolves the result (for `.single()` calls).
function chainMock(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'order', 'or', 'eq', 'ilike', 'neq', 'insert', 'single']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)
  // Make chain awaitable for `const { data, error } = await query`
  chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    resolve(result)
  })
  return chain
}

describe('GET /api/admin/companies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not admin', async () => {
    mockRequireAdmin.mockResolvedValue(null)
    const req = createRequest('http://localhost:3000/api/admin/companies')
    const res = await GET(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns companies list when admin', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const companies = [
      {
        id: 'comp-1', name: 'Acme Corp', domain: 'acme.com',
        created_at: '2026-01-01', notes: null, status: 'active',
        profiles: [{ id: 'u1' }, { id: 'u2' }],
        tickets: [
          { id: 't1', status: 'open' },
          { id: 't2', status: 'closed' },
        ],
      },
    ]

    const chain = chainMock({ data: companies, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/companies')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('Acme Corp')
    expect(body[0].user_count).toBe(2)
    expect(body[0].ticket_count).toBe(2)
    expect(body[0].open_tickets).toBe(1)
  })

  it('returns 500 on database error', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const chain = chainMock({ data: null, error: { message: 'DB error' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/companies')
    const res = await GET(req)
    expect(res.status).toBe(500)
  })
})

describe('POST /api/admin/companies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not admin', async () => {
    mockRequireAdmin.mockResolvedValue(null)
    const req = createRequest('http://localhost:3000/api/admin/companies', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Co' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 when name is missing', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/companies', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Company name is required')
  })

  it('returns 400 when name is only whitespace', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/companies', {
      method: 'POST',
      body: JSON.stringify({ name: '   ' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 409 when company name already exists', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    // First call: duplicate check returns existing
    const dupCheck = chainMock({ data: { id: 'existing' }, error: null })
    mockSupabase.from.mockReturnValue(dupCheck)

    const req = createRequest('http://localhost:3000/api/admin/companies', {
      method: 'POST',
      body: JSON.stringify({ name: 'Existing Co' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toContain('already exists')
  })

  it('creates company successfully', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const newCompany = {
      id: 'comp-new', name: 'New Corp', domain: 'newcorp.com',
      created_at: '2026-03-15', notes: null, status: 'active',
    }

    // First call: duplicate check (no match)
    const dupCheck = chainMock({ data: null, error: { code: 'PGRST116' } })
    // Second call: insert
    const insertChain = chainMock({ data: newCompany, error: null })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount === 1 ? dupCheck : insertChain
    })

    const req = createRequest('http://localhost:3000/api/admin/companies', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Corp', domain: 'newcorp.com' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.name).toBe('New Corp')
  })
})
