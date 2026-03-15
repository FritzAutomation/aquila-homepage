import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

// GET /api/auth/me - Get current user profile
export async function GET() {
  const profile = await getCurrentUser()

  if (!profile) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json(profile)
}
