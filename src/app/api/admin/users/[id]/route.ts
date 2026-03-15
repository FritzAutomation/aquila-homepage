import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { name, user_type, company_id, status } = body

  // Prevent admin from deactivating themselves
  if (id === admin.id && status === 'deactivated') {
    return NextResponse.json(
      { error: 'You cannot deactivate your own account' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (user_type !== undefined) updateData.user_type = user_type
  if (company_id !== undefined) updateData.company_id = company_id || null
  if (status !== undefined) updateData.status = status

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select('*, company:companies(id, name)')
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }

  // If deactivating, also ban in Supabase auth
  if (status === 'deactivated') {
    await supabase.auth.admin.updateUserById(id, { ban_duration: '876000h' }) // ~100 years
  }
  // If reactivating, unban
  if (status === 'active') {
    await supabase.auth.admin.updateUserById(id, { ban_duration: 'none' })
  }

  return NextResponse.json(profile)
}
