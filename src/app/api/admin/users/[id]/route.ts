import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireStaff, isSuperAdmin } from '@/lib/auth'

// PATCH /api/admin/users/[id] - Update user
// Admins: full access (name, role, company, status)
// Agents: can only deactivate/reactivate users
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = staff.user_type === 'admin'

  const { id } = await params
  const body = await request.json()
  const { name, user_type, company_id, status } = body

  // Agents can only change status (deactivate/reactivate)
  if (!isAdmin && (name !== undefined || user_type !== undefined || company_id !== undefined)) {
    return NextResponse.json(
      { error: 'You do not have permission to modify user details' },
      { status: 403 }
    )
  }

  // Prevent staff from deactivating themselves
  if (id === staff.id && status === 'deactivated') {
    return NextResponse.json(
      { error: 'You cannot deactivate your own account' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Prevent modification of super admin accounts
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('email, user_type')
    .eq('id', id)
    .single()

  if (targetProfile && isSuperAdmin(targetProfile.email)) {
    return NextResponse.json(
      { error: 'This account cannot be modified' },
      { status: 403 }
    )
  }

  // Agents cannot modify admin or other agent accounts
  if (!isAdmin && targetProfile && (targetProfile.user_type === 'admin' || targetProfile.user_type === 'agent')) {
    return NextResponse.json(
      { error: 'You do not have permission to modify this account' },
      { status: 403 }
    )
  }

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
