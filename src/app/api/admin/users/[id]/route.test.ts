import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
const mockRequireAdmin = vi.fn()
vi.mock('@/lib/auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
}))

// Mock supabase admin client
const mockUpdateUserById = vi.fn()
const mockSupabase = {
  from: vi.fn(),
  auth: {
    admin: {
      updateUserById: mockUpdateUserById,
    },
  },
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

import { PATCH } from './route'

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
  const methods = ['select', 'update', 'eq', 'single']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)
  return chain
}

describe('PATCH /api/admin/users/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not admin', async () => {
    mockRequireAdmin.mockResolvedValue(null)
    const req = createRequest('http://localhost:3000/api/admin/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'user-1' }) })
    expect(res.status).toBe(401)
  })

  it('prevents admin from deactivating themselves', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)
    const req = createRequest('http://localhost:3000/api/admin/users/admin-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'deactivated' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'admin-1' }) })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('cannot deactivate your own account')
  })

  it('updates user name', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const updated = {
      id: 'user-1', email: 'user@example.com', name: 'New Name',
      user_type: 'customer', status: 'active', company: { id: 'c1', name: 'Acme' },
    }
    const chain = chainMock({ data: updated, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'user-1' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('New Name')
  })

  it('bans user in auth when deactivating', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const updated = {
      id: 'user-2', email: 'user@example.com', name: 'User',
      user_type: 'customer', status: 'deactivated', company: null,
    }
    const chain = chainMock({ data: updated, error: null })
    mockSupabase.from.mockReturnValue(chain)
    mockUpdateUserById.mockResolvedValue({})

    const req = createRequest('http://localhost:3000/api/admin/users/user-2', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'deactivated' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'user-2' }) })
    expect(res.status).toBe(200)
    expect(mockUpdateUserById).toHaveBeenCalledWith('user-2', { ban_duration: '876000h' })
  })

  it('unbans user in auth when reactivating', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const updated = {
      id: 'user-2', email: 'user@example.com', name: 'User',
      user_type: 'customer', status: 'active', company: null,
    }
    const chain = chainMock({ data: updated, error: null })
    mockSupabase.from.mockReturnValue(chain)
    mockUpdateUserById.mockResolvedValue({})

    const req = createRequest('http://localhost:3000/api/admin/users/user-2', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'active' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'user-2' }) })
    expect(res.status).toBe(200)
    expect(mockUpdateUserById).toHaveBeenCalledWith('user-2', { ban_duration: 'none' })
  })

  it('changes user role', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const updated = {
      id: 'user-2', email: 'user@example.com', name: 'User',
      user_type: 'agent', status: 'active', company: null,
    }
    const chain = chainMock({ data: updated, error: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/users/user-2', {
      method: 'PATCH',
      body: JSON.stringify({ user_type: 'agent' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'user-2' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.user_type).toBe('agent')
    // Should not call updateUserById since status didn't change
    expect(mockUpdateUserById).not.toHaveBeenCalled()
  })

  it('returns 500 on database error', async () => {
    mockRequireAdmin.mockResolvedValue(adminProfile)

    const chain = chainMock({ data: null, error: { message: 'DB error' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/admin/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Test' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'user-1' }) })
    expect(res.status).toBe(500)
  })
})
