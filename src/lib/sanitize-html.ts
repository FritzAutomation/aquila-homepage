/**
 * Sanitize HTML to only allow safe <img> tags.
 * Strips all other tags and removes event handler attributes from img tags.
 */
export function sanitizeMessageHtml(html: string): string {
  // Strip all tags except <img>
  let sanitized = html.replace(/<(?!img\s|\/img)[^>]+>/gi, '')

  // Remove event handler attributes (onerror, onload, onclick, etc.) from img tags
  sanitized = sanitized.replace(/<img\s([^>]*)>/gi, (_match, attrs: string) => {
    const safeAttrs = attrs
      .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
      .replace(/\bjavascript\s*:/gi, '')
    return `<img style="max-width:100%;height:auto;border-radius:8px;margin:8px 0" ${safeAttrs.trim()}>`
  })

  return sanitized
}
