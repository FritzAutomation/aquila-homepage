import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock auth
const mockGetCurrentUser = vi.fn()
vi.mock('@/lib/auth', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

import { GET } from './route'

describe('GET /api/auth/me', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 401 when not authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Not authenticated')
  })

  it('returns user profile when authenticated', async () => {
    const profile = {
      id: 'user-1', email: 'user@example.com', name: 'Test User',
      user_type: 'customer', status: 'active', company_id: 'c1',
    }
    mockGetCurrentUser.mockResolvedValue(profile)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.email).toBe('user@example.com')
    expect(body.name).toBe('Test User')
    expect(body.user_type).toBe('customer')
  })

  it('returns admin profile', async () => {
    const profile = {
      id: 'admin-1', email: 'admin@aquila.com', name: 'Admin',
      user_type: 'admin', status: 'active', company_id: null,
    }
    mockGetCurrentUser.mockResolvedValue(profile)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.user_type).toBe('admin')
    expect(body.company_id).toBeNull()
  })
})
