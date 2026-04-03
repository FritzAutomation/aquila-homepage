import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock supabase admin client
const mockSupabase = {
  from: vi.fn(),
}
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}))

// Mock auth
vi.mock('@/lib/auth', () => ({
  requireStaff: vi.fn().mockResolvedValue({ id: 'staff-1', user_type: 'admin', email: 'admin@test.com' }),
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

  it('sets resolved_at when status changes to resolved', async () => {
    const oldChain = chainMock({ data: { status: 'open', email: 'u@test.com', name: 'U', subject: 'S', ticket_number: 1 }, error: null })
    const updateChain = chainMock({
      data: { id: 'ticket-1', ticket_number: 1, subject: 'S', status: 'resolved', email: 'u@test.com', company: null, assignee: null },
      error: null,
    })

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
    expect(res.status).toBe(200)
    // Verify update was called with resolved_at timestamp
    const updateCall = updateChain.update as ReturnType<typeof vi.fn>
    expect(updateCall).toHaveBeenCalledWith(
      expect.objectContaining({ resolved_at: expect.any(String), status: 'resolved' })
    )
  })

  it('sets closed_at when status changes to closed', async () => {
    const oldChain = chainMock({ data: { status: 'open', email: 'u@test.com', name: 'U', subject: 'S', ticket_number: 1 }, error: null })
    const updateChain = chainMock({
      data: { id: 'ticket-1', ticket_number: 1, subject: 'S', status: 'closed', email: 'u@test.com', company: null, assignee: null },
      error: null,
    })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount <= 1 ? oldChain : updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'closed' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    const updateCall = updateChain.update as ReturnType<typeof vi.fn>
    expect(updateCall).toHaveBeenCalledWith(
      expect.objectContaining({ closed_at: expect.any(String), status: 'closed' })
    )
  })

  it('sends status change notification when status changes', async () => {
    const { sendStatusChangeNotification } = await import('@/lib/resend')

    const oldChain = chainMock({ data: { status: 'open', email: 'u@test.com', name: 'User', subject: 'Help', ticket_number: 1 }, error: null })
    const updateChain = chainMock({
      data: { id: 'ticket-1', ticket_number: 1, subject: 'Help', status: 'in_progress', email: 'u@test.com', name: 'User', company: null, assignee: null },
      error: null,
    })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount <= 1 ? oldChain : updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'in_progress' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    expect(sendStatusChangeNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'u@test.com',
        ticketNumber: 1,
        subject: 'Help',
        newStatus: 'in_progress',
      })
    )
  })

  it('does not send notification when status unchanged', async () => {
    const { sendStatusChangeNotification } = await import('@/lib/resend')

    const oldChain = chainMock({ data: { status: 'open', email: 'u@test.com', name: 'User', subject: 'Help', ticket_number: 1 }, error: null })
    const updateChain = chainMock({
      data: { id: 'ticket-1', ticket_number: 1, subject: 'Help', status: 'open', email: 'u@test.com', name: 'User', company: null, assignee: null },
      error: null,
    })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      return callCount <= 1 ? oldChain : updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'open' }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    expect(sendStatusChangeNotification).not.toHaveBeenCalled()
  })

  it('sets first_response_at on first agent reply', async () => {
    // Call 1: check existing first_response_at (null = not set yet)
    const firstResponseCheckChain = chainMock({ data: { first_response_at: null }, error: null })
    // Call 2: get old ticket for status change detection
    const oldChain = chainMock({ data: { status: 'open', email: 'u@test.com', name: 'U', subject: 'S', ticket_number: 1 }, error: null })
    // Call 3: perform update
    const updateChain = chainMock({
      data: { id: 'ticket-1', ticket_number: 1, subject: 'S', status: 'open', email: 'u@test.com', company: null, assignee: null },
      error: null,
    })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      if (callCount === 1) return firstResponseCheckChain
      if (callCount === 2) return oldChain
      return updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'open', first_response: true }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    const updateCall = updateChain.update as ReturnType<typeof vi.fn>
    expect(updateCall).toHaveBeenCalledWith(
      expect.objectContaining({ first_response_at: expect.any(String) })
    )
  })

  it('does not overwrite existing first_response_at', async () => {
    // Call 1: check existing first_response_at (already set)
    const firstResponseCheckChain = chainMock({ data: { first_response_at: '2026-01-01T00:00:00Z' }, error: null })
    // Call 2: get old ticket
    const oldChain = chainMock({ data: { status: 'open', email: 'u@test.com', name: 'U', subject: 'S', ticket_number: 1 }, error: null })
    // Call 3: perform update
    const updateChain = chainMock({
      data: { id: 'ticket-1', ticket_number: 1, subject: 'S', status: 'open', email: 'u@test.com', company: null, assignee: null },
      error: null,
    })

    let callCount = 0
    mockSupabase.from.mockImplementation(() => {
      callCount++
      if (callCount === 1) return firstResponseCheckChain
      if (callCount === 2) return oldChain
      return updateChain
    })

    const req = createRequest('http://localhost:3000/api/tickets/ticket-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'open', first_response: true }),
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    const updateCall = updateChain.update as ReturnType<typeof vi.fn>
    expect(updateCall).toHaveBeenCalledWith(
      expect.not.objectContaining({ first_response_at: expect.any(String) })
    )
  })
})
