import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/tickets/lookup - Look up ticket by ticket ID and email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticketIdParam = searchParams.get('ticket_id')
    const email = searchParams.get('email')

    if (!ticketIdParam || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters: ticket_id and email' },
        { status: 400 }
      )
    }

    // Parse ticket number from ticket ID (e.g., "TKT-0001" -> 1)
    const ticketNumberMatch = ticketIdParam.match(/TKT-(\d+)/i)
    if (!ticketNumberMatch) {
      return NextResponse.json(
        { error: 'Invalid ticket ID format. Expected format: TKT-0001' },
        { status: 400 }
      )
    }
    const ticketNumber = parseInt(ticketNumberMatch[1], 10)

    const supabase = createAdminClient()

    // Find ticket by ticket number and email
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        subject,
        status,
        priority,
        product,
        issue_type,
        email,
        name,
        created_at,
        first_response_at,
        resolved_at,
        messages (
          id,
          content,
          sender_type,
          sender_name,
          created_at,
          is_internal
        )
      `)
      .eq('ticket_number', ticketNumber)
      .eq('email', email.toLowerCase())
      .single()

    if (error || !ticket) {
      return NextResponse.json(
        { error: 'Ticket not found. Please check your ticket ID and email address.' },
        { status: 404 }
      )
    }

    // Format response - filter out internal notes (customers shouldn't see them)
    const publicMessages = (ticket.messages || [])
      .filter((msg: { is_internal: boolean }) => !msg.is_internal)
      .sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

    const response = {
      id: ticket.id,
      ticket_number: ticket.ticket_number,
      ticket_id: `TKT-${String(ticket.ticket_number).padStart(4, '0')}`,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      product: ticket.product,
      issue_type: ticket.issue_type,
      created_at: ticket.created_at,
      first_response_at: ticket.first_response_at,
      resolved_at: ticket.resolved_at,
      messages: publicMessages
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error looking up ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
