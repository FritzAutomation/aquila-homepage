import { describe, it, expect } from 'vitest'
import {
  parseEmailAddress,
  extractTicketNumber,
  cleanEmailBody,
  cleanEmailHtml,
} from './email-utils'

describe('parseEmailAddress', () => {
  it('parses "Name <email>" format', () => {
    const result = parseEmailAddress('John Doe <john@example.com>')
    expect(result).toEqual({ name: 'John Doe', email: 'john@example.com' })
  })

  it('parses plain email address', () => {
    const result = parseEmailAddress('john@example.com')
    expect(result).toEqual({ name: null, email: 'john@example.com' })
  })

  it('parses quoted name format', () => {
    const result = parseEmailAddress('"John Doe" <john@example.com>')
    expect(result).toEqual({ name: 'John Doe', email: 'john@example.com' })
  })

  it('parses single-quoted name format', () => {
    const result = parseEmailAddress("'John Doe' <john@example.com>")
    expect(result).toEqual({ name: 'John Doe', email: 'john@example.com' })
  })

  it('lowercases email addresses', () => {
    const result = parseEmailAddress('John@EXAMPLE.COM')
    expect(result.email).toBe('john@example.com')
  })

  it('lowercases email in bracket format', () => {
    const result = parseEmailAddress('John Doe <John@EXAMPLE.COM>')
    expect(result.email).toBe('john@example.com')
  })

  it('trims whitespace', () => {
    const result = parseEmailAddress('  John Doe  < john@example.com >')
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
  })

  it('handles angle-bracket-only format via fallback', () => {
    // "<email>" without a name prefix doesn't match the bracket regex
    // (which requires at least one char before the <), so it falls through
    const result = parseEmailAddress('<john@example.com>')
    expect(result.email).toBe('<john@example.com>')
    expect(result.name).toBeNull()
  })

  it('handles fallback for unusual formats', () => {
    const result = parseEmailAddress('not a normal format')
    expect(result).toEqual({ name: null, email: 'not a normal format' })
  })
})

describe('extractTicketNumber', () => {
  it('extracts ticket number from subject', () => {
    expect(extractTicketNumber('[TKT-0001] Some subject')).toBe(1)
  })

  it('extracts multi-digit ticket numbers', () => {
    expect(extractTicketNumber('[TKT-0123] Something')).toBe(123)
  })

  it('extracts ticket number from Re: prefix', () => {
    expect(extractTicketNumber('Re: [TKT-0042] Follow up')).toBe(42)
  })

  it('extracts ticket number from Fwd: prefix', () => {
    expect(extractTicketNumber('Fwd: [TKT-0099] Forwarded issue')).toBe(99)
  })

  it('returns null when no ticket number present', () => {
    expect(extractTicketNumber('No ticket here')).toBeNull()
  })

  it('returns null for empty subject', () => {
    expect(extractTicketNumber('')).toBeNull()
  })

  it('returns null for similar but wrong format', () => {
    expect(extractTicketNumber('TKT-0001 without brackets')).toBeNull()
    expect(extractTicketNumber('[TKT-] missing number')).toBeNull()
  })
})

describe('cleanEmailBody', () => {
  it('returns plain text as-is (trimmed)', () => {
    expect(cleanEmailBody('Hello world')).toBe('Hello world')
  })

  it('preserves multi-line text', () => {
    const text = 'Line 1\nLine 2\nLine 3'
    expect(cleanEmailBody(text)).toBe(text)
  })

  it('strips "On ... wrote:" quoted replies', () => {
    const text = 'My reply\n\nOn Mon, Jan 1, 2026 at 10:00 AM Someone wrote:\n> Original message'
    expect(cleanEmailBody(text)).toBe('My reply')
  })

  it('does not break on "On" without "wrote:"', () => {
    const text = 'On the other hand\nthis should be kept'
    expect(cleanEmailBody(text)).toBe(text)
  })

  it('strips lines starting with ">"', () => {
    const text = 'My reply\n> quoted text\n> more quoted'
    expect(cleanEmailBody(text)).toBe('My reply')
  })

  it('strips "From:" header lines', () => {
    const text = 'My reply\nFrom: someone@example.com\nSent: Monday'
    expect(cleanEmailBody(text)).toBe('My reply')
  })

  it('strips "Sent:" header lines', () => {
    const text = 'My reply\nSent: Monday, January 1\nTo: me'
    expect(cleanEmailBody(text)).toBe('My reply')
  })

  it('strips "---" separator', () => {
    const text = 'My reply\n---\nOriginal message below'
    expect(cleanEmailBody(text)).toBe('My reply')
  })

  it('strips "___" separator', () => {
    const text = 'My reply\n___\nOriginal message below'
    expect(cleanEmailBody(text)).toBe('My reply')
  })

  it('strips "Original Message" marker', () => {
    const text = 'My reply\n----- Original Message -----\nFrom: someone'
    expect(cleanEmailBody(text)).toBe('My reply')
  })

  it('trims leading and trailing whitespace', () => {
    const text = '  \n  Hello  \n  '
    expect(cleanEmailBody(text)).toBe('Hello')
  })
})

describe('cleanEmailHtml', () => {
  it('strips <style> blocks', () => {
    const html = '<style>.foo { color: red; }</style><p>Hello</p>'
    expect(cleanEmailHtml(html)).toBe('Hello')
  })

  it('strips <head> blocks', () => {
    const html = '<head><meta charset="utf-8"></head><body><p>Hello</p></body>'
    expect(cleanEmailHtml(html)).toBe('Hello')
  })

  it('removes Gmail quoted reply', () => {
    const html = '<div>My reply</div><div class="gmail_quote"><div>On Mon wrote:<br>Original</div></div>'
    expect(cleanEmailHtml(html)).toBe('My reply')
  })

  it('removes Outlook quoted reply', () => {
    const html = '<div>My reply</div><div id="appendonsend"><div>Original message</div></div>'
    expect(cleanEmailHtml(html)).toBe('My reply')
  })

  it('removes blockquote replies', () => {
    const html = '<div>My reply</div><blockquote>Original message</blockquote>'
    expect(cleanEmailHtml(html)).toBe('My reply')
  })

  it('removes "On ... wrote:" in div/p tags', () => {
    const html = '<div>My reply</div><div>On Mon, Jan 1 wrote: some text</div>'
    expect(cleanEmailHtml(html)).toBe('My reply')
  })

  it('preserves <img> tags', () => {
    const html = '<div>Hello</div><img src="https://example.com/image.png" alt="test"><div>World</div>'
    const result = cleanEmailHtml(html)
    expect(result).toContain('<img src="https://example.com/image.png" alt="test">')
    expect(result).toContain('Hello')
    expect(result).toContain('World')
  })

  it('preserves <img> with cid: src', () => {
    const html = '<p>See image:</p><img src="cid:image001@abc" alt="screenshot">'
    const result = cleanEmailHtml(html)
    expect(result).toContain('<img src="cid:image001@abc" alt="screenshot">')
  })

  it('converts <br> to newlines', () => {
    const html = '<p>Line 1<br>Line 2<br/>Line 3</p>'
    const result = cleanEmailHtml(html)
    expect(result).toContain('Line 1\nLine 2\nLine 3')
  })

  it('converts closing block tags to newlines', () => {
    const html = '<p>Para 1</p><p>Para 2</p>'
    const result = cleanEmailHtml(html)
    expect(result).toContain('Para 1')
    expect(result).toContain('Para 2')
  })

  it('decodes HTML entities', () => {
    const html = '<p>A &amp; B &lt; C &gt; D &quot;E&quot; &#39;F&#39;</p>'
    const result = cleanEmailHtml(html)
    expect(result).toContain('A & B < C > D "E" \'F\'')
  })

  it('decodes &nbsp; to spaces', () => {
    const html = '<p>Hello&nbsp;World</p>'
    expect(cleanEmailHtml(html)).toContain('Hello World')
  })

  it('collapses excessive newlines', () => {
    const html = '<p>A</p><p></p><p></p><p></p><p></p><p>B</p>'
    const result = cleanEmailHtml(html)
    // Should have at most 2 consecutive newlines
    expect(result).not.toMatch(/\n{3,}/)
    expect(result).toContain('A')
    expect(result).toContain('B')
  })

  it('strips non-img HTML tags', () => {
    const html = '<div><strong>Bold</strong> and <em>italic</em> and <a href="#">link</a></div>'
    const result = cleanEmailHtml(html)
    expect(result).toBe('Bold and italic and link')
  })
})
