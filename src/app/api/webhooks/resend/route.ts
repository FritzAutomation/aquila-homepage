import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendTicketConfirmation } from '@/lib/resend'
import { headers } from 'next/headers'
import crypto from 'crypto'

// Resend inbound email webhook payload
interface ResendInboundEmail {
  email_id: string
  from: string
  to: string[]
  subject: string
  text?: string
  html?: string
  headers?: Record<string, string>
  attachments?: Array<{
    filename: string
    content: string // base64 encoded
    content_type: string
  }>
}

// Extract email address from "Name <email@example.com>" format
function parseEmailAddress(from: string): { email: string; name: string | null } {
  // Handle "Name <email@example.com>" format
  const bracketMatch = from.match(/^(.+?)\s*<([^<>]+@[^<>]+)>$/)
  if (bracketMatch) {
    return {
      name: bracketMatch[1].trim().replace(/^["']|["']$/g, '') || null,
      email: bracketMatch[2].toLowerCase().trim()
    }
  }

  // Handle plain email address
  const emailMatch = from.match(/^([^\s<>]+@[^\s<>]+)$/)
  if (emailMatch) {
    return {
      name: null,
      email: emailMatch[1].toLowerCase().trim()
    }
  }

  // Fallback - treat entire string as email
  return { email: from.toLowerCase().trim(), name: null }
}

// Extract ticket number from subject like "[TKT-0001] Some subject"
function extractTicketNumber(subject: string): number | null {
  const match = subject.match(/\[TKT-(\d+)\]/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

// Clean up email body (remove quoted replies, signatures, etc.)
function cleanEmailBody(text: string): string {
  // Remove common reply markers and everything after
  const lines = text.split('\n')
  const cleanLines: string[] = []

  for (const line of lines) {
    // Stop at common reply indicators
    if (
      line.startsWith('On ') && line.includes(' wrote:') ||
      line.startsWith('>') ||
      line.startsWith('From:') ||
      line.startsWith('Sent:') ||
      line.startsWith('---') ||
      line.startsWith('___') ||
      line.includes('Original Message')
    ) {
      break
    }
    cleanLines.push(line)
  }

  return cleanLines.join('\n').trim()
}

// Verify webhook signature from Resend (uses Svix)
async function verifyWebhookSignature(
  payload: string,
  svixId: string | null | undefined,
  svixTimestamp: string | null | undefined,
  svixSignature: string | null | undefined,
  webhookSecret: string | null | undefined
): Promise<boolean> {
  if (!webhookSecret) {
    console.warn('Webhook signature verification skipped - no secret configured')
    return true
  }

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn('Missing Svix headers, skipping verification')
    return true
  }

  try {
    // Svix signature format: v1,base64signature
    const signedPayload = `${svixId}.${svixTimestamp}.${payload}`

    // Remove 'whsec_' prefix if present
    const secretBytes = webhookSecret.startsWith('whsec_')
      ? Buffer.from(webhookSecret.slice(6), 'base64')
      : Buffer.from(webhookSecret, 'base64')

    const expectedSignature = crypto
      .createHmac('sha256', secretBytes)
      .update(signedPayload)
      .digest('base64')

    // Svix sends multiple signatures, check if any match
    const signatures = svixSignature.split(' ')
    for (const sig of signatures) {
      const [version, signature] = sig.split(',')
      if (version === 'v1' && signature === expectedSignature) {
        return true
      }
    }

    console.error('No matching signature found')
    return false
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const svixId = headersList.get('svix-id')
    const svixTimestamp = headersList.get('svix-timestamp')
    const svixSignature = headersList.get('svix-signature')
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET

    // Get raw body for signature verification
    const rawBody = await request.text()

    // Verify signature
    const isValid = await verifyWebhookSignature(
      rawBody,
      svixId,
      svixTimestamp,
      svixSignature,
      webhookSecret
    )
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)

    // Resend wraps inbound emails in a specific event structure
    const eventType = payload.type

    // Only process inbound email events
    if (eventType !== 'email.received') {
      return NextResponse.json({ message: 'Event type ignored' })
    }

    const emailData: ResendInboundEmail = payload.data
    const emailId = emailData.email_id // Unique ID from Resend
    const { email: senderEmail, name: senderName } = parseEmailAddress(emailData.from)
    const subject = emailData.subject || '(No subject)'

    // Get body from text, html, or check attachments for body content
    let body = ''

    // Check standard text/html fields first
    if (emailData.text) {
      body = cleanEmailBody(emailData.text)
    } else if (emailData.html) {
      body = emailData.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }

    // Check if body is in attachments (some email providers put body there)
    if (!body && emailData.attachments && emailData.attachments.length > 0) {
      for (const attachment of emailData.attachments) {
        if (attachment.content_type === 'text/plain' || attachment.filename === 'body.txt') {
          try {
            body = Buffer.from(attachment.content, 'base64').toString('utf-8')
            body = cleanEmailBody(body)
            break
          } catch {
            // Failed to decode attachment
          }
        } else if (attachment.content_type === 'text/html' || attachment.filename === 'body.html') {
          try {
            const htmlContent = Buffer.from(attachment.content, 'base64').toString('utf-8')
            body = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
            break
          } catch {
            // Failed to decode attachment
          }
        }
      }
    }

    // If still no body, use a helpful fallback message
    // Note: Resend inbound webhooks currently don't include body content
    if (!body) {
      body = `[Email ticket created]\n\nSubject: ${subject}\n\nNote: Email body content was not available. Please reply to this ticket through the support portal or send another email with your details.`
    }

    const supabase = createAdminClient()
    const ticketNumber = extractTicketNumber(subject)

    // Check for duplicate - same email and subject within last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: recentTicket } = await supabase
      .from('tickets')
      .select('id, ticket_number')
      .eq('email', senderEmail)
      .eq('subject', subject)
      .eq('source', 'email')
      .gte('created_at', fiveMinutesAgo)
      .limit(1)
      .single()

    if (recentTicket && !ticketNumber) {
      // Already processed this email
      console.log('Duplicate email detected, skipping:', emailId)
      return NextResponse.json({
        success: true,
        action: 'duplicate_skipped',
        ticket_id: `TKT-${String(recentTicket.ticket_number).padStart(4, '0')}`
      })
    }

    if (ticketNumber) {
      // This is a reply to an existing ticket
      const { data: existingTicket, error: ticketError } = await supabase
        .from('tickets')
        .select('id, email, status')
        .eq('ticket_number', ticketNumber)
        .single()

      if (ticketError || !existingTicket) {
        console.error('Ticket not found for reply:', ticketNumber)
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
      }

      // Verify the sender is the original ticket creator (basic security)
      if (existingTicket.email.toLowerCase() !== senderEmail) {
        console.warn('Email sender does not match ticket owner:', senderEmail, existingTicket.email)
        // Still allow it but log the mismatch - could be CC'd person replying
      }

      // Add message to the ticket
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: existingTicket.id,
          content: body,
          sender_type: 'customer',
          sender_email: senderEmail,
          sender_name: senderName
        })

      if (messageError) {
        console.error('Failed to add message:', messageError)
        return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
      }

      // Reopen ticket if it was resolved/closed
      if (existingTicket.status === 'resolved' || existingTicket.status === 'closed') {
        await supabase
          .from('tickets')
          .update({ status: 'open' })
          .eq('id', existingTicket.id)
      }

      return NextResponse.json({
        success: true,
        action: 'message_added',
        ticket_number: ticketNumber
      })

    } else {
      // This is a new ticket

      // Try to find company by email domain
      let companyId: string | null = null
      const emailDomain = senderEmail.split('@')[1]

      if (emailDomain) {
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('domain', emailDomain)
          .single()

        if (existingCompany) {
          companyId = existingCompany.id
        }
      }

      // Create the ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          email: senderEmail,
          name: senderName,
          company_id: companyId,
          subject: subject,
          product: 'general',  // Valid: dmm, green-light, custom, general
          issue_type: 'other',  // Valid values: bug, feature, training, integration, billing, other
          source: 'email',
          status: 'open',
          priority: 'normal'
        })
        .select()
        .single()

      if (ticketError || !ticket) {
        console.error('Failed to create ticket:', ticketError)
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
      }

      // Add the email body as the first message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          content: body,
          sender_type: 'customer',
          sender_email: senderEmail,
          sender_name: senderName
        })

      if (messageError) {
        console.error('Failed to add message to ticket:', messageError)
        // Don't fail the whole request, ticket was created
      }

      // Send confirmation email
      await sendTicketConfirmation({
        to: senderEmail,
        ticketNumber: ticket.ticket_number,
        subject: subject,
        customerName: senderName || undefined,
        product: 'Other',
        issueType: 'General Inquiry'
      })

      return NextResponse.json({
        success: true,
        action: 'ticket_created',
        ticket_id: `TKT-${String(ticket.ticket_number).padStart(4, '0')}`
      })
    }

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Respond to webhook validation requests
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' })
}
