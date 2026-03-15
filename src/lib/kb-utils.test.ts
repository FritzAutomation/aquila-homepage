import { describe, it, expect } from 'vitest'
import { generateSlug, renderMarkdown } from './kb-utils'

describe('generateSlug', () => {
  it('converts title to lowercase slug', () => {
    expect(generateSlug('Getting Started with DMM')).toBe('getting-started-with-dmm')
  })

  it('replaces special characters with hyphens', () => {
    expect(generateSlug('How do I configure OEE?')).toBe('how-do-i-configure-oee')
  })

  it('removes leading and trailing hyphens', () => {
    expect(generateSlug('  Hello World!  ')).toBe('hello-world')
  })

  it('collapses multiple special characters into single hyphen', () => {
    expect(generateSlug('FAQ: Setup & Configuration')).toBe('faq-setup-configuration')
  })

  it('handles numbers in titles', () => {
    expect(generateSlug('Step 1: Install v2.0')).toBe('step-1-install-v2-0')
  })

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('')
  })

  it('handles string with only special characters', () => {
    expect(generateSlug('!@#$%')).toBe('')
  })
})

describe('renderMarkdown', () => {
  describe('headings', () => {
    it('renders h1', () => {
      const result = renderMarkdown('# Hello')
      expect(result).toContain('<h1')
      expect(result).toContain('Hello')
    })

    it('renders h2', () => {
      const result = renderMarkdown('## Section')
      expect(result).toContain('<h2')
      expect(result).toContain('Section')
    })

    it('renders h3', () => {
      const result = renderMarkdown('### Subsection')
      expect(result).toContain('<h3')
      expect(result).toContain('Subsection')
    })

    it('does not convert mid-line hashes', () => {
      const result = renderMarkdown('Use the # symbol')
      expect(result).not.toContain('<h1')
    })
  })

  describe('inline formatting', () => {
    it('renders bold text', () => {
      const result = renderMarkdown('This is **bold** text')
      expect(result).toContain('<strong>bold</strong>')
    })

    it('renders italic text', () => {
      const result = renderMarkdown('This is *italic* text')
      expect(result).toContain('<em>italic</em>')
    })

    it('renders bold italic text', () => {
      const result = renderMarkdown('This is ***bold italic*** text')
      expect(result).toContain('<strong><em>bold italic</em></strong>')
    })

    it('renders inline code', () => {
      const result = renderMarkdown('Use `npm install` to install')
      expect(result).toContain('<code')
      expect(result).toContain('npm install')
    })
  })

  describe('lists', () => {
    it('renders unordered list items', () => {
      const result = renderMarkdown('- Item one\n- Item two')
      expect(result).toContain('<ul')
      expect(result).toContain('Item one')
      expect(result).toContain('Item two')
    })

    it('renders ordered list items with ol tag', () => {
      const result = renderMarkdown('1. First\n2. Second\n3. Third')
      expect(result).toContain('<ol')
      expect(result).toContain('First')
      expect(result).toContain('Second')
    })

    it('uses ul for unordered and ol for ordered lists', () => {
      const result = renderMarkdown('- Bullet\n\n1. Number')
      expect(result).toContain('<ul')
      expect(result).toContain('<ol')
    })
  })

  describe('block elements', () => {
    it('renders blockquotes', () => {
      const result = renderMarkdown('> This is a tip')
      expect(result).toContain('<blockquote')
      expect(result).toContain('This is a tip')
    })

    it('renders horizontal rules', () => {
      const result = renderMarkdown('Above\n\n---\n\nBelow')
      expect(result).toContain('<hr')
    })

    it('renders code blocks', () => {
      const result = renderMarkdown('```js\nconsole.log("hi")\n```')
      expect(result).toContain('<pre')
      expect(result).toContain('<code')
      expect(result).toContain('console.log')
    })
  })

  describe('HTML safety', () => {
    it('escapes HTML tags in content', () => {
      const result = renderMarkdown('<script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('escapes ampersands', () => {
      const result = renderMarkdown('Tom & Jerry')
      expect(result).toContain('Tom &amp; Jerry')
    })
  })

  describe('paragraphs', () => {
    it('wraps content in paragraph tags', () => {
      const result = renderMarkdown('Hello world')
      expect(result).toMatch(/^<p.*>.*Hello world.*<\/p>$/)
    })

    it('creates new paragraphs on double newlines', () => {
      const result = renderMarkdown('Para one\n\nPara two')
      expect(result).toContain('</p><p')
    })

    it('converts single newlines to br tags', () => {
      const result = renderMarkdown('Line one\nLine two')
      expect(result).toContain('Line one<br />Line two')
    })
  })
})
