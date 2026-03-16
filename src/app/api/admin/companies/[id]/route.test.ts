import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
const mockRequireAdmin = vi.fn()
vi.mock('@/lib/auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
  requireStaff: () => mockRequireAdmin(),
}))

// Mock supabase admin client
const mockSupabase = {
  from: vi.fn(),
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

import { GET, PATCH } from './route'

const adminProfile = {
  id: 'admin-1', email: 'admin@aquila.com', name: 'Admin',
  user_type: 'admin', status: 'active', company_id: null,
  created_at: '2026-01-01', updated_at: '2026-01-01',
}

const params = Promise.resolve({ id: 'comp-1' })

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function chainMock(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'order', 'or', 'eq', 'ilike', 'neq', 'insert', 'update', 'single']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)
  return chain
}

describe('GET /api/admin/companies/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not admin', async () => {
    mockRequireAdmin.mockResolvedValue(null)
    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1')
    const res = await GET(req, { params })
    expect(res.status).toBe(401)
  })

  it('returns 404 when company not found', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const chain = chainMock({ data: null, error: { code: 'PGRST116' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1')
    const res = await GET(req, { params })
    expect(res.status).toBe(404)
  })

  it('returns company with counts', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const company = {
      id: 'comp-1', name: 'Acme', domain: 'acme.com',
      created_at: '2026-01-01', notes: null, status: 'active',
      profiles: [{ id: 'u1', email: 'a@b.com', name: 'User', user_type: 'customer', status: 'active', created_at: '2026-01-01' }],
      tickets: [{ id: 't1', status: 'open' }, { id: 't2', status: 'resolved' }],
    }
    const chain = chainMock({ data: company, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1')
    const res = await GET(req, { params })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.user_count).toBe(1)
    expect(body.ticket_count).toBe(2)
    expect(body.open_tickets).toBe(1)
  })
})

describe('PATCH /api/admin/companies/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not admin', async () => {
    mockRequireAdmin.mockResolvedValue(null)
    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(401)
  })

  it('returns 400 when no fields provided', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1', {
      method: 'PATCH',
      body: JSON.stringify({}),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('No fields to update')
  })

  it('returns 409 on duplicate name', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    // Duplicate check returns existing
    const dupCheck = chainMock({ data: { id: 'other-comp' }, error: null })
    mockSupabase.from.mockReturnValue(dupCheck)

    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Existing Name' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(409)
  })

  it('updates company successfully', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const updated = {
      id: 'comp-1', name: 'Updated Corp', domain: null,
      created_at: '2026-01-01', notes: 'New notes', status: 'active',
    }

    // First call: dup check (no match), Second call: update
    const dupCheck = chainMock({ data: null, error: { code: 'PGRST116' } })
    const updateChain = chainMock({ data: updated, error: null })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount === 1 ? dupCheck : updateChain
    })

    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated Corp', notes: 'New notes' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('Updated Corp')
  })

  it('updates status without dup check', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const updated = {
      id: 'comp-1', name: 'Acme', domain: null,
      created_at: '2026-01-01', notes: null, status: 'inactive',
    }
    const updateChain = chainMock({ data: updated, error: null })
    mockSupabase.from.mockReturnValue(updateChain)

    const req = createRequest('http://localhost:3000/api/admin/companies/comp-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'inactive' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('inactive')
  })
})
