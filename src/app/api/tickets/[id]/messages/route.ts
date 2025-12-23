import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAgentReply } from '@/lib/resend'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/tickets/[id]/messages - Get all messages for a ticket
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to fetch messages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ messages })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tickets/[id]/messages - Add a reply to a ticket
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const { content, sender_type, sender_email, sender_name, send_email } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get the ticket to ensure it exists and get customer email
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Create the message
    const messageData = {
      ticket_id: id,
      content,
      sender_type: sender_type || 'agent',
      sender_email: sender_email || null,
      sender_name: sender_name || null
    }

    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (messageError) {
      console.error('Failed to create message:', messageError)
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      )
    }

    // If this is an agent reply, update first_response_at if not set
    if (sender_type === 'agent' && !ticket.first_response_at) {
      await supabase
        .from('tickets')
        .update({
          first_response_at: new Date().toISOString(),
          status: ticket.status === 'open' ? 'in_progress' : ticket.status
        })
        .eq('id', id)
    }

    // Send email notification if requested and this is an agent reply
    let emailSent = false
    if (send_email !== false && sender_type === 'agent') {
      const emailResult = await sendAgentReply({
        to: ticket.email,
        ticketNumber: ticket.ticket_number,
        originalSubject: ticket.subject,
        replyContent: content,
        agentName: sender_name || 'Support Team'
      })
      emailSent = emailResult.success

      if (!emailResult.success) {
        console.error('Failed to send reply email:', emailResult.error)
      }
    }

    return NextResponse.json({
      message,
      email_sent: emailSent
    })

  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
