import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET /auth/redirect — Role-based redirect after login
 * Admins/agents go to /admin, customers go to /portal
 */
export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const profile = await getCurrentUser()

  if (!profile) {
    return NextResponse.redirect(`${origin}/login`)
  }

  if (profile.user_type === 'admin' || profile.user_type === 'agent') {
    return NextResponse.redirect(`${origin}/admin`)
  }

  return NextResponse.redirect(`${origin}/portal`)
}
