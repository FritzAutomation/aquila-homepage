import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendTicketConfirmation, sendAdminNewTicketNotification, sendAdminCustomerReplyNotification } from '@/lib/resend'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { Resend } from 'resend'
import type { SupabaseClient } from '@supabase/supabase-js'
import path from 'path'

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

// Clean up plain text email body (remove quoted replies, signatures, etc.)
function cleanEmailBody(text: string): string {
  const lines = text.split('\n')
  const cleanLines: string[] = []

  for (const line of lines) {
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

// Clean up HTML email body — strip quoted replies but preserve inline images
function cleanEmailHtml(html: string): string {
  // Remove <style> and <head> blocks entirely
  let cleaned = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')

  // Remove common quoted reply containers
  // Gmail: <div class="gmail_quote">
  cleaned = cleaned.replace(/<div[^>]*class="gmail_quote"[^>]*>[\s\S]*$/gi, '')
  // Outlook: <div id="appendonsend">  or <!--[if !mso]> reply block
  cleaned = cleaned.replace(/<div[^>]*id="appendonsend"[^>]*>[\s\S]*$/gi, '')
  // Generic: <blockquote> used for quoted replies
  cleaned = cleaned.replace(/<blockquote[^>]*>[\s\S]*$/gi, '')
  // "On ... wrote:" pattern in a <div> or <p>
  cleaned = cleaned.replace(/<(?:div|p)[^>]*>On\s.+?wrote:[\s\S]*$/gi, '')
  // Outlook separator: <div style="border:none;border-top:solid #E1E1E1 1.0pt">
  cleaned = cleaned.replace(/<div[^>]*border-top[^>]*>[\s\S]*$/gi, '')

  // Strip all tags except img (preserve inline images)
  // Also preserve <br> as newlines
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n')
  cleaned = cleaned.replace(/<\/(?:p|div|tr|li|h[1-6])>/gi, '\n')
  cleaned = cleaned.replace(/<(?!img\s)[^>]+>/gi, '')

  // Clean up whitespace but preserve newlines
  cleaned = cleaned.replace(/[ \t]+/g, ' ')
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
  cleaned = cleaned.trim()

  // Decode common HTML entities
  cleaned = cleaned.replace(/&nbsp;/gi, ' ')
  cleaned = cleaned.replace(/&amp;/gi, '&')
  cleaned = cleaned.replace(/&lt;/gi, '<')
  cleaned = cleaned.replace(/&gt;/gi, '>')
  cleaned = cleaned.replace(/&quot;/gi, '"')
  cleaned = cleaned.replace(/&#39;/gi, "'")

  return cleaned
}

// Extract base64 data URIs from HTML, upload to Storage, and replace with public URLs
async function resolveDataUriImages(
  supabase: SupabaseClient,
  ticketId: string,
  messageId: string,
  content: string
): Promise<string> {
  const dataUriRegex = /data:(image\/[a-zA-Z+]+);base64,([A-Za-z0-9+/=]+)/g
  let resolved = content
  let match: RegExpExecArray | null

  const replacements: Array<{ original: string; url: string }> = []

  while ((match = dataUriRegex.exec(content)) !== null) {
    const mimeType = match[1]
    const base64Data = match[2]

    try {
      const buffer = Buffer.from(base64Data, 'base64')
      const extMap: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg' }
      const ext = extMap[mimeType] || '.png'
      const randomId = crypto.randomUUID()
      const timestamp = Date.now()
      const storagePath = `tickets/${ticketId}/${timestamp}-${randomId}${ext}`

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(storagePath, buffer, { contentType: mimeType, upsert: false })

      if (uploadError) {
        console.error('Failed to upload inline data URI image:', uploadError)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(storagePath)

      // Record in attachments table
      await supabase.from('attachments').insert({
        filename: `inline-image${ext}`,
        storage_path: storagePath,
        url: urlData.publicUrl,
        mime_type: mimeType,
        size: buffer.length,
        ticket_id: ticketId,
        message_id: messageId
      })

      replacements.push({ original: match[0], url: urlData.publicUrl })
    } catch (error) {
      console.error('Error processing data URI image:', error)
    }
  }

  for (const { original, url } of replacements) {
    resolved = resolved.replace(original, url)
  }

  return resolved
}

// Process email attachments: fetch from Resend API, upload to Storage, record in database
// Resend webhooks only include attachment metadata, not content.
// We must use the Attachments API to get download URLs, then fetch the actual files.
async function processAttachments(
  supabase: SupabaseClient,
  ticketId: string,
  messageId: string,
  emailId: string
): Promise<Map<string, string>> {
  const cidMap = new Map<string, string>() // content_id -> public URL
  if (!emailId || !process.env.RESEND_API_KEY) return cidMap

  const resend = new Resend(process.env.RESEND_API_KEY)

  // Fetch attachment list with download URLs from Resend
  let attachmentList: Array<{
    filename: string
    content_type: string
    content_length: number
    content_id: string | null
    download_url: string
  }>

  try {
    const { data, error } = await resend.emails.receiving.attachments.list({ emailId })
    if (error || !data) {
      console.error('Failed to list attachments from Resend:', error)
      return cidMap
    }
    // The Resend SDK may return { data: [...] } or the array directly
    const rawData = data as unknown as Record<string, unknown>
    if (Array.isArray(rawData)) {
      attachmentList = rawData as unknown as typeof attachmentList
    } else if (rawData && Array.isArray((rawData as Record<string, unknown>).data)) {
      attachmentList = (rawData as Record<string, unknown>).data as unknown as typeof attachmentList
    } else {
      console.error('Unexpected attachment list structure:', JSON.stringify(data).substring(0, 500))
      return cidMap
    }
  } catch (error) {
    console.error('Error fetching attachment list:', error)
    return cidMap
  }

  if (!attachmentList || attachmentList.length === 0) return cidMap

  const attachmentMetadata: Array<{ filename: string; url: string; mime_type: string; size: number }> = []

  for (const attachment of attachmentList) {
    try {
      // Download the file content from Resend's temporary URL
      const response = await fetch(attachment.download_url)
      if (!response.ok) {
        console.error('Failed to download attachment:', attachment.filename, response.status)
        continue
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const ext = path.extname(attachment.filename) || ''
      const randomId = crypto.randomUUID()
      const timestamp = Date.now()
      const storagePath = `tickets/${ticketId}/${timestamp}-${randomId}${ext}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(storagePath, buffer, {
          contentType: attachment.content_type,
          upsert: false
        })

      if (uploadError) {
        console.error('Failed to upload attachment:', attachment.filename, uploadError)
        continue
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(storagePath)

      const publicUrl = urlData.publicUrl

      // Track content_id -> URL mapping for resolving cid: references in HTML
      if (attachment.content_id) {
        // content_id often comes wrapped in angle brackets like <image001.png@...>
        const cleanCid = attachment.content_id.replace(/^<|>$/g, '')
        cidMap.set(cleanCid, publicUrl)
      }

      // Insert record into attachments table
      const { error: insertError } = await supabase
        .from('attachments')
        .insert({
          filename: attachment.filename,
          storage_path: storagePath,
          url: publicUrl,
          mime_type: attachment.content_type,
          size: buffer.length,
          ticket_id: ticketId,
          message_id: messageId
        })

      if (insertError) {
        console.error('Failed to insert attachment record:', attachment.filename, insertError)
        continue
      }

      attachmentMetadata.push({
        filename: attachment.filename,
        url: publicUrl,
        mime_type: attachment.content_type,
        size: buffer.length
      })
    } catch (error) {
      console.error('Error processing attachment:', attachment.filename, error)
    }
  }

  // Update message with attachment metadata
  if (attachmentMetadata.length > 0) {
    const { error: updateError } = await supabase
      .from('messages')
      .update({ attachments: attachmentMetadata })
      .eq('id', messageId)

    if (updateError) {
      console.error('Failed to update message attachments:', updateError)
    }
  }

  return cidMap
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

    // Get body from email — prefer HTML to preserve inline images, fall back to text
    let body = ''
    let rawHtml = '' // Keep raw HTML for cid: resolution after attachment processing

    // Check if body is in the webhook payload first
    if (emailData.html) {
      rawHtml = emailData.html
      body = cleanEmailHtml(emailData.html)
    } else if (emailData.text) {
      body = cleanEmailBody(emailData.text)
    }

    // If no body in webhook, fetch full email using Resend SDK's receiving API
    if (!body && emailId && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { data: fullEmail, error: fetchError } = await resend.emails.receiving.get(emailId)

        if (fetchError) {
          console.error('Error fetching inbound email:', fetchError)
        } else if (fullEmail) {
          if (fullEmail.html) {
            rawHtml = fullEmail.html
            body = cleanEmailHtml(fullEmail.html)
          } else if (fullEmail.text) {
            body = cleanEmailBody(fullEmail.text)
          }
        }
      } catch (error) {
        console.error('Error fetching inbound email from Resend:', error)
      }
    }

    // If still no body, use a helpful fallback message
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
      // Already processed this email - skip to prevent duplicates
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
        .select('id, email, status, subject')
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
      const { data: replyMessage, error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: existingTicket.id,
          content: body,
          sender_type: 'customer',
          sender_email: senderEmail,
          sender_name: senderName
        })
        .select()
        .single()

      if (messageError || !replyMessage) {
        console.error('Failed to add message:', messageError)
        return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
      }

      // Process attachments via Resend API and resolve inline images
      if (emailId) {
        try {
          const cidMap = await processAttachments(supabase, existingTicket.id, replyMessage.id, emailId)

          // Replace cid: references in message content with actual Storage URLs
          let resolvedBody = body
          if (cidMap.size > 0) {
            for (const [cid, url] of cidMap) {
              resolvedBody = resolvedBody.replace(new RegExp(`cid:${cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'), url)
            }
          }

          // Extract and upload base64 data URI images embedded in the HTML
          if (resolvedBody.includes('data:image/')) {
            resolvedBody = await resolveDataUriImages(supabase, existingTicket.id, replyMessage.id, resolvedBody)
          }

          if (resolvedBody !== body) {
            await supabase
              .from('messages')
              .update({ content: resolvedBody })
              .eq('id', replyMessage.id)
          }
        } catch (error) {
          console.error('Failed to process attachments for reply:', error)
        }
      }

      // Reopen ticket if it was resolved/closed
      const wasReopened = existingTicket.status === 'resolved' || existingTicket.status === 'closed'
      if (wasReopened) {
        await supabase
          .from('tickets')
          .update({ status: 'open', reopened_at: new Date().toISOString() })
          .eq('id', existingTicket.id)
      }

      // Notify admin of customer reply
      await sendAdminCustomerReplyNotification({
        ticketNumber,
        subject: existingTicket.subject,
        customerEmail: senderEmail,
        customerName: senderName || undefined,
        replyPreview: body.substring(0, 300),
        wasReopened
      })

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
      const { data: newMessage, error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          content: body,
          sender_type: 'customer',
          sender_email: senderEmail,
          sender_name: senderName
        })
        .select()
        .single()

      if (messageError) {
        console.error('Failed to add message to ticket:', messageError)
        // Don't fail the whole request, ticket was created
      }

      // Process attachments via Resend API and resolve inline images
      if (newMessage && emailId) {
        try {
          const cidMap = await processAttachments(supabase, ticket.id, newMessage.id, emailId)

          // Replace cid: references in message content with actual Storage URLs
          let resolvedBody = body
          if (cidMap.size > 0) {
            for (const [cid, url] of cidMap) {
              resolvedBody = resolvedBody.replace(new RegExp(`cid:${cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'), url)
            }
          }

          // Extract and upload base64 data URI images embedded in the HTML
          if (resolvedBody.includes('data:image/')) {
            resolvedBody = await resolveDataUriImages(supabase, ticket.id, newMessage.id, resolvedBody)
          }

          if (resolvedBody !== body) {
            await supabase
              .from('messages')
              .update({ content: resolvedBody })
              .eq('id', newMessage.id)
          }
        } catch (error) {
          console.error('Failed to process attachments for new ticket:', error)
        }
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

      // Notify admin of new ticket
      await sendAdminNewTicketNotification({
        ticketNumber: ticket.ticket_number,
        subject: subject,
        customerEmail: senderEmail,
        customerName: senderName || undefined,
        product: 'General',
        issueType: 'Other'
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
