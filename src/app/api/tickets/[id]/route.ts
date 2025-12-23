import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/tickets/[id] - Get a single ticket with messages
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Get ticket with company info
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*, company:companies(id, name, domain)')
      .eq('id', id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Get messages for this ticket
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Failed to fetch messages:', messagesError)
    }

    return NextResponse.json({
      ...ticket,
      messages: messages || [],
      ticket_id: `TKT-${String(ticket.ticket_number).padStart(4, '0')}`
    })

  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/tickets/[id] - Update a ticket
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createAdminClient()

    // Build update object with only allowed fields
    const allowedFields = ['status', 'priority', 'assigned_to', 'product', 'issue_type', 'company_id']
    const updateData: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Handle status-specific timestamp updates
    if (body.status === 'resolved' && !body.resolved_at) {
      updateData.resolved_at = new Date().toISOString()
    }
    if (body.status === 'closed' && !body.closed_at) {
      updateData.closed_at = new Date().toISOString()
    }

    // Check if this is the first response (for SLA tracking)
    if (body.first_response) {
      const { data: existingTicket } = await supabase
        .from('tickets')
        .select('first_response_at')
        .eq('id', id)
        .single()

      if (existingTicket && !existingTicket.first_response_at) {
        updateData.first_response_at = new Date().toISOString()
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', id)
      .select('*, company:companies(id, name, domain)')
      .single()

    if (error) {
      console.error('Failed to update ticket:', error)
      return NextResponse.json(
        { error: 'Failed to update ticket' },
        { status: 500 }
      )
    }

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...ticket,
      ticket_id: `TKT-${String(ticket.ticket_number).padStart(4, '0')}`
    })

  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
