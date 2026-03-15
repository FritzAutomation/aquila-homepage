import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock supabase admin client
const mockSupabase = {
  from: vi.fn(),
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

// Mock resend
vi.mock('@/lib/resend', () => ({
  sendStatusChangeNotification: vi.fn().mockResolvedValue({ success: true }),
}))

import { GET, PATCH } from './route'

function createRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function chainMock(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'update', 'order', 'eq', 'is', 'single']
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)
  chain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    resolve(result)
  })
  return chain
}

const params = Promise.resolve({ id: 'ticket-1' })

describe('GET /api/tickets/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns ticket with messages', async () => {
    const ticket = {
      id: 'ticket-1', ticket_number: 1, subject: 'Help',
      status: 'open', email: 'user@test.com',
      company: { id: 'c1', name: 'Acme' }, assignee: null,
    }
    const messages = [
      { id: 'm1', content: 'Hello', sender_type: 'customer', created_at: '2026-01-01' },
    ]

    const ticketChain = chainMock({ data: ticket, error: null })
    const messageChain = chainMock({ data: messages, error: null })
    // Messages query uses await (not .single()), so make it thenable
    messageChain['then'] = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
      resolve({ data: messages, error: null })
    })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount === 1 ? ticketChain : messageChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1')
    const res = await GET(req, { params })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.subject).toBe('Help')
    expect(body.messages).toHaveLength(1)
    expect(body.ticket_id).toBe('TKT-0001')
  })

  it('returns 404 when ticket not found', async () => {
    const chain = chainMock({ data: null, error: { code: 'PGRST116' } })
    mockSupabase.from.mockReturnValue(chain)

    const req = createRequest('http://localhost:3000/api/tickets/nonexistent')
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/tickets/[id]', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns 400 when no valid fields provided', async () => {
    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ invalid_field: 'value' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('No valid fields')
  })

  it('updates ticket status', async () => {
    const oldTicket = {
      status: 'open', email: 'user@test.com', name: 'User',
      subject: 'Help', ticket_number: 1,
    }
    const updatedTicket = {
      id: 'ticket-1', ticket_number: 1, subject: 'Help',
      status: 'in_progress', email: 'user@test.com', name: 'User',
      company: null, assignee: null,
    }

    const oldChain = chainMock({ data: oldTicket, error: null })
    const updateChain = chainMock({ data: updatedTicket, error: null })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      // Call 1: get old ticket for status change detection
      // Call 2: update ticket
      return callCount <= 1 ? oldChain : updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'in_progress' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('in_progress')
  })

  it('updates ticket priority', async () => {
    const oldTicket = {
      status: 'open', email: 'user@test.com', name: 'User',
      subject: 'Help', ticket_number: 1,
    }
    const updatedTicket = {
      id: 'ticket-1', ticket_number: 1, subject: 'Help',
      status: 'open', priority: 'high', email: 'user@test.com',
      company: null, assignee: null,
    }

    const oldChain = chainMock({ data: oldTicket, error: null })
    const updateChain = chainMock({ data: updatedTicket, error: null })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount <= 1 ? oldChain : updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ priority: 'high' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.priority).toBe('high')
  })

  it('returns 500 on database error', async () => {
    const oldChain = chainMock({ data: { status: 'open' }, error: null })
    const updateChain = chainMock({ data: null, error: { message: 'DB error' } })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount <= 1 ? oldChain : updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'resolved' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(500)
  })
})
