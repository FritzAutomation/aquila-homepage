// Email parsing and cleaning utilities for the support ticket system

// Extract email address from "Name <email@example.com>" format
export function parseEmailAddress(from: string): { email: string; name: string | null } {
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
export function extractTicketNumber(subject: string): number | null {
  const match = subject.match(/\[TKT-(\d+)\]/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

// Clean up plain text email body (remove quoted replies, signatures, etc.)
export function cleanEmailBody(text: string): string {
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
export function cleanEmailHtml(html: string): string {
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
