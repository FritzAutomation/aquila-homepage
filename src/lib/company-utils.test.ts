import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isFreeEmailProvider, resolveCompanyByEmail } from './company-utils'

// Chainable Supabase mock
function createChainMock(overrides: { selectData?: unknown; insertData?: unknown } = {}) {
  const chainMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn(),
  }

  // Default: select query returns no match, insert succeeds
  let selectCalled = false
  chainMock.single.mockImplementation(() => {
    if (!selectCalled) {
      selectCalled = true
      return Promise.resolve({ data: overrides.selectData ?? null })
    }
    return Promise.resolve({ data: overrides.insertData ?? null })
  })

  return chainMock
}

describe('isFreeEmailProvider', () => {
  it('returns true for common free providers', () => {
    expect(isFreeEmailProvider('gmail.com')).toBe(true)
    expect(isFreeEmailProvider('yahoo.com')).toBe(true)
    expect(isFreeEmailProvider('outlook.com')).toBe(true)
    expect(isFreeEmailProvider('hotmail.com')).toBe(true)
  })

  it('returns true case-insensitively', () => {
    expect(isFreeEmailProvider('Gmail.COM')).toBe(true)
    expect(isFreeEmailProvider('YAHOO.COM')).toBe(true)
  })

  it('returns false for corporate domains', () => {
    expect(isFreeEmailProvider('acme.com')).toBe(false)
    expect(isFreeEmailProvider('cnh.com')).toBe(false)
  })
})

describe('resolveCompanyByEmail', () => {
  let supabase: ReturnType<typeof createChainMock>

  beforeEach(() => {
    supabase = createChainMock()
  })

  it('returns null for invalid email (no @ sign)', async () => {
    const result = await resolveCompanyByEmail(supabase as never, 'bademail')
    expect(result).toBeNull()
  })

  it('returns existing company ID when domain matches', async () => {
    supabase = createChainMock({ selectData: { id: 'company-123' } })

    const result = await resolveCompanyByEmail(supabase as never, 'user@acme.com')
    expect(result).toBe('company-123')
    expect(supabase.from).toHaveBeenCalledWith('companies')
    expect(supabase.contains).toHaveBeenCalledWith('domains', ['acme.com'])
  })

  it('returns null for free email providers with no existing company', async () => {
    supabase = createChainMock({ selectData: null })

    const result = await resolveCompanyByEmail(supabase as never, 'user@gmail.com')
    expect(result).toBeNull()
    // Should not attempt to insert
    expect(supabase.insert).not.toHaveBeenCalled()
  })

  it('auto-creates company with domain as name when no match and not free provider', async () => {
    supabase = createChainMock({
      selectData: null,
      insertData: { id: 'new-company-456' },
    })

    const result = await resolveCompanyByEmail(supabase as never, 'user@acme.com')
    expect(result).toBe('new-company-456')
    expect(supabase.insert).toHaveBeenCalledWith({
      name: 'acme.com',
      domains: ['acme.com'],
    })
  })

  it('auto-creates company with provided company name when given', async () => {
    supabase = createChainMock({
      selectData: null,
      insertData: { id: 'new-company-789' },
    })

    const result = await resolveCompanyByEmail(
      supabase as never,
      'user@acme.com',
      'Acme Corporation'
    )
    expect(result).toBe('new-company-789')
    expect(supabase.insert).toHaveBeenCalledWith({
      name: 'Acme Corporation',
      domains: ['acme.com'],
    })
  })

  it('returns null when auto-create insert fails', async () => {
    supabase = createChainMock({
      selectData: null,
      insertData: null,
    })

    const result = await resolveCompanyByEmail(supabase as never, 'user@acme.com')
    expect(result).toBeNull()
  })
})
