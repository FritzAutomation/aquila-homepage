import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendTicketConfirmation } from '@/lib/resend'
import { PRODUCT_LABELS, ISSUE_TYPE_LABELS, type Product, type IssueType } from '@/lib/types'

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { email, name, phone, company, subject, message, product, issue_type } = body

    if (!email || !subject || !message || !product || !issue_type) {
      return NextResponse.json(
        { error: 'Missing required fields: email, subject, message, product, issue_type' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Try to find or create company based on email domain
    let companyId: string | null = null
    const emailDomain = email.split('@')[1]?.toLowerCase()

    if (emailDomain) {
      // Check if company exists with this domain
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('domain', emailDomain)
        .single()

      if (existingCompany) {
        companyId = existingCompany.id
      } else if (company) {
        // Create new company if company name provided
        const { data: newCompany } = await supabase
          .from('companies')
          .insert({ name: company, domain: emailDomain })
          .select('id')
          .single()

        if (newCompany) {
          companyId = newCompany.id
        }
      }
    }

    // Create the ticket
    const ticketData = {
      email,
      name: name || null,
      phone: phone || null,
      company_id: companyId,
      subject,
      product,
      issue_type,
      source: 'web',
      status: 'open',
      priority: 'normal'
    }

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()
      .single()

    if (ticketError) {
      console.error('Failed to create ticket:', ticketError)
      return NextResponse.json(
        { error: 'Failed to create ticket' },
        { status: 500 }
      )
    }

    // Create the initial message
    const messageData = {
      ticket_id: ticket.id,
      content: message,
      sender_type: 'customer',
      sender_email: email,
      sender_name: name || null
    }

    const { error: messageError } = await supabase
      .from('messages')
      .insert(messageData)

    if (messageError) {
      console.error('Failed to create message:', messageError)
      // Don't fail the whole request, ticket was created
    }

    // Send confirmation email
    const emailResult = await sendTicketConfirmation({
      to: email,
      ticketNumber: ticket.ticket_number,
      subject,
      customerName: name,
      product: PRODUCT_LABELS[product as Product] || product,
      issueType: ISSUE_TYPE_LABELS[issue_type as IssueType] || issue_type
    })

    if (!emailResult.success) {
      console.error('Failed to send confirmation email:', emailResult.error)
      // Don't fail the request, ticket was created
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        ticket_id: `TKT-${String(ticket.ticket_number).padStart(4, '0')}`
      },
      email_sent: emailResult.success
    })

  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/tickets - List tickets with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Filter parameters
    const status = searchParams.get('status')
    const product = searchParams.get('product')
    const issue_type = searchParams.get('issue_type')
    const priority = searchParams.get('priority')
    const company_id = searchParams.get('company_id')
    const assigned_to = searchParams.get('assigned_to')
    const search = searchParams.get('search')

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const supabase = createAdminClient()

    let query = supabase
      .from('tickets')
      .select('*, company:companies(id, name, domain), assignee:staff_profiles(id, name)', { count: 'exact' })

    // Apply filters
    if (status) query = query.eq('status', status)
    if (product) query = query.eq('product', product)
    if (issue_type) query = query.eq('issue_type', issue_type)
    if (priority) query = query.eq('priority', priority)
    if (company_id) query = query.eq('company_id', company_id)
    if (assigned_to === 'unassigned') {
      query = query.is('assigned_to', null)
    } else if (assigned_to) {
      query = query.eq('assigned_to', assigned_to)
    }

    // Search in subject or email
    if (search) {
      query = query.or(`subject.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Order and paginate
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: tickets, error, count } = await query

    if (error) {
      console.error('Failed to fetch tickets:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tickets' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
