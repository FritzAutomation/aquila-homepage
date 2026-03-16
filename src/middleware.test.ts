import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock NextResponse
const mockRedirect = vi.fn().mockImplementation((url) => ({
  type: 'redirect',
  url: url.toString(),
  cookies: { set: vi.fn() },
}))
const mockNext = vi.fn().mockReturnValue({
  type: 'next',
  cookies: { set: vi.fn() },
})

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: (...args: unknown[]) => mockRedirect(...args),
    next: (...args: unknown[]) => mockNext(...args),
  },
}))

// Mock supabase auth
const mockGetUser = vi.fn()
const mockProfileSelect = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mockProfileSelect,
        }),
      }),
    }),
  }),
}))

import { middleware } from './middleware'

function createRequest(pathname: string) {
  const url = new URL(pathname, 'http://localhost:3000')
  return {
    cookies: {
      getAll: () => [],
      set: vi.fn(),
    },
    nextUrl: url,
    url: url.toString(),
  }
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNext.mockReturnValue({
      type: 'next',
      cookies: { set: vi.fn() },
    })
  })

  it('allows public pages through', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/')

    await middleware(req as any)

    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('redirects logged-in users away from /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    const req = createRequest('/login')

    await middleware(req as any)

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/auth/redirect' })
    )
  })

  it('allows unauthenticated /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/login')

    await middleware(req as any)

    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('redirects unauthenticated /portal to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/portal')

    await middleware(req as any)

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login' })
    )
  })

  it('redirects unauthenticated /admin to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/admin')

    await middleware(req as any)

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login' })
    )
  })

  it('redirects customers from /admin to /portal', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProfileSelect.mockResolvedValue({ data: { user_type: 'customer' } })
    const req = createRequest('/admin')

    await middleware(req as any)

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/portal' })
    )
  })

  it('redirects agents from /admin dashboard to /admin/tickets', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProfileSelect.mockResolvedValue({ data: { user_type: 'agent' } })
    const req = createRequest('/admin')

    await middleware(req as any)

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/admin/tickets' })
    )
  })

  it('allows agents to access /admin/tickets', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProfileSelect.mockResolvedValue({ data: { user_type: 'agent' } })
    const req = createRequest('/admin/tickets')

    const result = await middleware(req as any)

    expect(mockRedirect).not.toHaveBeenCalled()
    expect(result).toHaveProperty('type', 'next')
  })

  it('redirects agents from /admin/analytics to /admin/tickets', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProfileSelect.mockResolvedValue({ data: { user_type: 'agent' } })
    const req = createRequest('/admin/analytics')

    await middleware(req as any)

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/admin/tickets' })
    )
  })

  it('redirects agents from /admin/news to /admin/tickets', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProfileSelect.mockResolvedValue({ data: { user_type: 'agent' } })
    const req = createRequest('/admin/news')

    await middleware(req as any)

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/admin/tickets' })
    )
  })

  it('allows admins full /admin access', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProfileSelect.mockResolvedValue({ data: { user_type: 'admin' } })
    const req = createRequest('/admin')

    const result = await middleware(req as any)

    expect(mockRedirect).not.toHaveBeenCalled()
    expect(result).toHaveProperty('type', 'next')
  })
})
