import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock supabase admin client
const mockSupabase = {
  from: vi.fn(),
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

// Mock auth — default to admin (sees all tickets)
vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ user_type: 'admin', email: 'admin@aquila.com' }),
}))

// Mock resend
vi.mock('@/lib/resend', () => ({
  sendTicketConfirmation: vi.fn().mockResolvedValue({ success: true }),
  sendAdminNewTicketNotification: vi.fn().mockResolvedValue({ success: true }),
}))

import { GET, POST } from './route'

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function chainMock(result: { data: unknown; error: unknown; count?: number | null }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'insert', 'order', 'eq', 'is', 'or', 'range', 'single']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)
  chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    resolve({ data: result.data, error: result.error, count: result.count ?? null })
  })
  return chain
}

describe('POST /api/tickets', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 400 when required fields are missing', async () => {
    const req = createRequest('http://localhost:3000/api/tickets', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Missing required fields')
  })

  it('returns 400 when email is empty', async () => {
    const req = createRequest('http://localhost:3000/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        email: '', subject: 'Test', message: 'Help',
        product: 'dmm', issue_type: 'bug',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('creates ticket successfully', async () => {
    const ticket = {
      id: 't1', ticket_number: 42, email: 'user@example.com',
      subject: 'Need help', status: 'open', priority: 'normal',
    }

    // Company lookup (no match), ticket insert, message insert
    const companyChain = chainMock({ data: null, error: { code: 'PGRST116' } })
    const ticketChain = chainMock({ data: ticket, error: null })
    const messageChain = chainMock({ data: null, error: null })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      if (callCount === 1) return companyChain // company lookup
      if (callCount === 2) return ticketChain // ticket insert
      return messageChain // message insert
    })

    const req = createRequest('http://localhost:3000/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com', name: 'Test User',
        subject: 'Need help', message: 'Please help me',
        product: 'dmm', issue_type: 'bug',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.ticket.ticket_number).toBe(42)
    expect(body.ticket.ticket_id).toBe('TKT-0042')
  })

  it('returns 500 when ticket creation fails', async () => {
    const companyChain = chainMock({ data: null, error: { code: 'PGRST116' } })
    const ticketChain = chainMock({ data: null, error: { message: 'Insert failed' } })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount === 1 ? companyChain : ticketChain
    })

    const req = createRequest('http://localhost:3000/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com', subject: 'Help',
        message: 'Problem', product: 'dmm', issue_type: 'bug',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})

describe('GET /api/tickets', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns tickets with pagination', async () => {
    const tickets = [
      { id: 't1', subject: 'Issue 1', status: 'open' },
      { id: 't2', subject: 'Issue 2', status: 'resolved' },
    ]
    const chain = chainMock({ data: tickets, error: null, count: 2 })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/tickets')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.tickets).toHaveLength(2)
    expect(body.pagination.total).toBe(2)
    expect(body.pagination.page).toBe(1)
  })

  it('applies status filter', async () => {
    const chain = chainMock({ data: [], error: null, count: 0 })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/tickets?status=open')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(chain.eq).toHaveBeenCalledWith('status', 'open')
  })

  it('applies search filter', async () => {
    const chain = chainMock({ data: [], error: null, count: 0 })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/tickets?search=urgent')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(chain.or).toHaveBeenCalledWith(expect.stringContaining('urgent'))
  })

  it('handles unassigned filter', async () => {
    const chain = chainMock({ data: [], error: null, count: 0 })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/tickets?assigned_to=unassigned')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(chain.is).toHaveBeenCalledWith('assigned_to', null)
  })

  it('supports pagination parameters', async () => {
    const chain = chainMock({ data: [], error: null, count: 50 })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/tickets?page=3&limit=10')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.pagination.page).toBe(3)
    expect(body.pagination.limit).toBe(10)
    expect(body.pagination.total_pages).toBe(5)
    // offset = (3-1)*10 = 20, range(20, 29)
    expect(chain.range).toHaveBeenCalledWith(20, 29)
  })

  it('returns 500 on database error', async () => {
    const chain = chainMock({ data: null, error: { message: 'DB error' }, count: null })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/tickets')
    const res = await GET(req)
    expect(res.status).toBe(500)
  })
})
