import { SupabaseClient } from '@supabase/supabase-js'

// Free/personal email providers that should NOT auto-create organizations
const FREE_EMAIL_PROVIDERS = new Set([
  'gmail.com', 'googlemail.com',
  'yahoo.com', 'yahoo.co.uk', 'ymail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'aol.com',
  'icloud.com', 'me.com', 'mac.com',
  'proton.me', 'protonmail.com', 'pm.me',
  'mail.com', 'email.com',
  'zoho.com', 'zohomail.com',
  'fastmail.com',
  'tutanota.com', 'tuta.com',
  'gmx.com', 'gmx.net',
  'yandex.com', 'yandex.ru',
  'inbox.com',
  'att.net', 'sbcglobal.net', 'bellsouth.net',
  'comcast.net', 'verizon.net', 'charter.net',
  'cox.net', 'earthlink.net',
])

export function isFreeEmailProvider(domain: string): boolean {
  return FREE_EMAIL_PROVIDERS.has(domain.toLowerCase())
}

/**
 * Find or auto-create a company based on email domain.
 * - Matches against the `domains` text[] column using array containment.
 * - Skips free email providers.
 * - Auto-creates a new company when no match is found (uses domain as placeholder name).
 * - If a company name is provided (from the ticket form), uses that instead.
 *
 * Returns the company ID or null.
 */
export async function resolveCompanyByEmail(
  supabase: SupabaseClient,
  email: string,
  companyName?: string
): Promise<string | null> {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return null

  // Check if a company already has this domain
  const { data: existingCompany } = await supabase
    .from('companies')
    .select('id')
    .contains('domains', [domain])
    .single()

  if (existingCompany) {
    return existingCompany.id
  }

  // Don't auto-create for free email providers
  if (isFreeEmailProvider(domain)) return null

  // Auto-create a new company
  const name = companyName?.trim() || domain
  const { data: newCompany } = await supabase
    .from('companies')
    .insert({ name, domains: [domain] })
    .select('id')
    .single()

  return newCompany?.id ?? null
}
