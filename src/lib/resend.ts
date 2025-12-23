import { Resend } from 'resend'

// Lazy-load Resend client to avoid build-time errors when API key is not set
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev'
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'fritzjunker69@gmail.com'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquila-homepage.vercel.app'

interface SendTicketConfirmationParams {
  to: string
  ticketNumber: number
  subject: string
  customerName?: string
  product: string
  issueType: string
}

export async function sendTicketConfirmation({
  to,
  ticketNumber,
  subject,
  customerName,
  product,
  issueType
}: SendTicketConfirmationParams) {
  const ticketId = `TKT-${String(ticketNumber).padStart(4, '0')}`
  const statusUrl = `${BASE_URL}/support/status?ticket=${encodeURIComponent(ticketId)}&email=${encodeURIComponent(to)}`

  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: `Aquila Support <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: [to],
      subject: `[${ticketId}] We received your request: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1E3A5F; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">The Aquila Group</h1>
          </div>

          <div style="padding: 30px; background-color: #f8f9fa;">
            <p>Hi ${customerName || 'there'},</p>

            <p>Thank you for contacting The Aquila Group support.</p>

            <p>Your ticket <strong>${ticketId}</strong> has been created and our team will respond within 24 hours.</p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1E3A5F;">Ticket Summary</h3>
              <p><strong>Ticket ID:</strong> ${ticketId}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Product:</strong> ${product}</p>
              <p><strong>Category:</strong> ${issueType}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${statusUrl}"
                 style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View Your Ticket
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

            <p>You can also reply to this email to add more information to your ticket.</p>

            <p>Best regards,<br/>
            <strong>The Aquila Group Support Team</strong></p>
          </div>

          <div style="background-color: #1E3A5F; padding: 15px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">
              &copy; ${new Date().getFullYear()} The Aquila Group. All rights reserved.
            </p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Failed to send ticket confirmation:', error)
      return { success: false, error }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Error sending ticket confirmation:', error)
    return { success: false, error }
  }
}

interface SendAgentReplyParams {
  to: string
  ticketNumber: number
  originalSubject: string
  replyContent: string
  agentName: string
}

export async function sendAgentReply({
  to,
  ticketNumber,
  originalSubject,
  replyContent,
  agentName
}: SendAgentReplyParams) {
  const ticketId = `TKT-${String(ticketNumber).padStart(4, '0')}`
  const statusUrl = `${BASE_URL}/support/status?ticket=${encodeURIComponent(ticketId)}&email=${encodeURIComponent(to)}`

  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: `Aquila Support <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: [to],
      subject: `Re: [${ticketId}] ${originalSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1E3A5F; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">The Aquila Group</h1>
          </div>

          <div style="padding: 30px; background-color: #f8f9fa;">
            <p style="color: #666; font-size: 14px;">
              Ticket: ${ticketId}
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
              ${replyContent.split('\n').map(line => `<p style="margin: 0 0 10px 0;">${line}</p>`).join('')}
            </div>

            <p>Best regards,<br/>
            <strong>${agentName}</strong><br/>
            The Aquila Group Support Team</p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

            <div style="text-align: center; margin: 20px 0;">
              <a href="${statusUrl}"
                 style="display: inline-block; background-color: #1E3A5F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">
                View Your Ticket
              </a>
            </div>

            <p style="color: #666; font-size: 12px; text-align: center;">
              Reply to this email to continue the conversation.
            </p>
          </div>

          <div style="background-color: #1E3A5F; padding: 15px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">
              &copy; ${new Date().getFullYear()} The Aquila Group. All rights reserved.
            </p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Failed to send agent reply:', error)
      return { success: false, error }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Error sending agent reply:', error)
    return { success: false, error }
  }
}
