import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the supabase modules before importing auth
const mockGetUser = vi.fn()
const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: { getUser: mockGetUser },
  })),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

// Chain setup helper
function setupProfileQuery(profile: Record<string, unknown> | null) {
  mockFrom.mockReturnValue({ select: mockSelect })
  mockSelect.mockReturnValue({ eq: mockEq })
  mockEq.mockReturnValue({ single: mockSingle })
  mockSingle.mockResolvedValue({ data: profile })
}

import { getCurrentUser, requireStaff, requireAdmin } from './auth'

describe('getCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no auth user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const result = await getCurrentUser()
    expect(result).toBeNull()
  })

  it('returns null when profile not found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery(null)
    const result = await getCurrentUser()
    expect(result).toBeNull()
  })

  it('returns profile for authenticated user', async () => {
    const profile = {
      id: 'user-1',
      email: 'admin@aquila.com',
      name: 'Admin User',
      user_type: 'admin',
      status: 'active',
      company_id: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery(profile)

    const result = await getCurrentUser()
    expect(result).toEqual(profile)
    expect(mockFrom).toHaveBeenCalledWith('profiles')
    expect(mockEq).toHaveBeenCalledWith('id', 'user-1')
  })
})

describe('requireStaff', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const result = await requireStaff()
    expect(result).toBeNull()
  })

  it('returns null for customer user_type', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery({
      id: 'user-1', email: 'cust@example.com', name: 'Customer',
      user_type: 'customer', status: 'active', company_id: 'comp-1',
      created_at: '2026-01-01', updated_at: '2026-01-01',
    })
    const result = await requireStaff()
    expect(result).toBeNull()
  })

  it('returns null for deactivated staff', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery({
      id: 'user-1', email: 'agent@aquila.com', name: 'Agent',
      user_type: 'agent', status: 'deactivated', company_id: null,
      created_at: '2026-01-01', updated_at: '2026-01-01',
    })
    const result = await requireStaff()
    expect(result).toBeNull()
  })

  it('returns profile for active admin', async () => {
    const profile = {
      id: 'user-1', email: 'admin@aquila.com', name: 'Admin',
      user_type: 'admin', status: 'active', company_id: null,
      created_at: '2026-01-01', updated_at: '2026-01-01',
    }
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery(profile)
    const result = await requireStaff()
    expect(result).toEqual(profile)
  })

  it('returns profile for active agent', async () => {
    const profile = {
      id: 'user-1', email: 'agent@aquila.com', name: 'Agent',
      user_type: 'agent', status: 'active', company_id: null,
      created_at: '2026-01-01', updated_at: '2026-01-01',
    }
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery(profile)
    const result = await requireStaff()
    expect(result).toEqual(profile)
  })
})

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const result = await requireAdmin()
    expect(result).toBeNull()
  })

  it('returns null for agent user_type', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery({
      id: 'user-1', email: 'agent@aquila.com', name: 'Agent',
      user_type: 'agent', status: 'active', company_id: null,
      created_at: '2026-01-01', updated_at: '2026-01-01',
    })
    const result = await requireAdmin()
    expect(result).toBeNull()
  })

  it('returns null for customer user_type', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery({
      id: 'user-1', email: 'cust@example.com', name: 'Customer',
      user_type: 'customer', status: 'active', company_id: 'comp-1',
      created_at: '2026-01-01', updated_at: '2026-01-01',
    })
    const result = await requireAdmin()
    expect(result).toBeNull()
  })

  it('returns null for deactivated admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery({
      id: 'user-1', email: 'admin@aquila.com', name: 'Admin',
      user_type: 'admin', status: 'deactivated', company_id: null,
      created_at: '2026-01-01', updated_at: '2026-01-01',
    })
    const result = await requireAdmin()
    expect(result).toBeNull()
  })

  it('returns profile for active admin', async () => {
    const profile = {
      id: 'user-1', email: 'admin@aquila.com', name: 'Admin',
      user_type: 'admin', status: 'active', company_id: null,
      created_at: '2026-01-01', updated_at: '2026-01-01',
    }
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    setupProfileQuery(profile)
    const result = await requireAdmin()
    expect(result).toEqual(profile)
  })
})
