import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Profile } from '@/lib/types'

/**
 * Check if an email belongs to a super admin (developer/platform owner).
 * Super admins are hidden from regular admin user management and cannot be modified.
 * Configured via SUPER_ADMIN_EMAILS env var (comma-separated).
 */
export function isSuperAdmin(email: string): boolean {
  const superAdminEmails = (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  return superAdminEmails.includes(email.toLowerCase())
}

/**
 * Get the current authenticated user's profile.
 * Returns null if not authenticated or no profile exists.
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Require the current user to be authenticated staff (admin or agent).
 * Returns the profile if authorized, null otherwise.
 */
export async function requireStaff(): Promise<Profile | null> {
  const profile = await getCurrentUser()
  if (!profile) return null
  if (profile.user_type !== 'admin' && profile.user_type !== 'agent') return null
  if (profile.status === 'deactivated') return null
  return profile
}

/**
 * Require the current user to be an admin.
 * Returns the profile if authorized, null otherwise.
 */
export async function requireAdmin(): Promise<Profile | null> {
  const profile = await getCurrentUser()
  if (!profile) return null
  if (profile.user_type !== 'admin') return null
  if (profile.status === 'deactivated') return null
  return profile
}
