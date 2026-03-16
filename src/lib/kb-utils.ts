/**
 * Generate a URL-safe slug from a title string.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Simple Markdown renderer for KB article content.
 * Converts common Markdown patterns to styled HTML.
 * Preserves embedded HTML for images, videos, and links.
 */
export function renderMarkdown(content: string): string {
  // Extract HTML blocks (video, img tags, anchor tags) before escaping
  const htmlBlocks: string[] = []
  let processed = content.replace(
    /<(video|img|a)\b[^>]*>(?:[\s\S]*?<\/\1>)?/gi,
    (match) => {
      htmlBlocks.push(match)
      return `%%HTML_BLOCK_${htmlBlocks.length - 1}%%`
    }
  )

  let html = processed
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Images (markdown syntax)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
    // Links (markdown syntax)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm font-mono"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-emerald pl-4 py-1 my-3 text-gray-600 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700">$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-6 border-gray-200" />')
    // Line breaks to paragraphs
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
    .replace(/\n/g, '<br />')

  // Wrap consecutive <li> elements with appropriate list tag
  html = html.replace(
    /(<li[^>]*>.*?<\/li>(<br \/>)?[\s]*)+/g,
    (match) => {
      const isOrdered = match.includes('list-decimal')
      const tag = isOrdered ? 'ol' : 'ul'
      const cleaned = match.replace(/<br \/>/g, '')
      return `<${tag} class="my-3 space-y-1">${cleaned}</${tag}>`
    }
  )

  // Restore HTML blocks
  htmlBlocks.forEach((block, i) => {
    html = html.replace(`%%HTML_BLOCK_${i}%%`, block)
  })

  return `<p class="text-gray-700 leading-relaxed mb-4">${html}</p>`
}
