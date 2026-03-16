import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireStaff } from '@/lib/auth'

// GET /api/admin/training/assignments?user_id=X or ?company_id=X
export async function GET(request: NextRequest) {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  const companyId = searchParams.get('company_id')

  const supabase = createAdminClient()

  let query = supabase
    .from('training_assignments')
    .select('*, module:training_modules(id, title, slug, product), user:profiles(id, name, email)')
    .order('assigned_at', { ascending: false })

  if (userId) query = query.eq('user_id', userId)
  if (companyId) {
    // Get all user IDs in this company first
    const { data: users } = await supabase
      .from('profiles')
      .select('id')
      .eq('company_id', companyId)
      .eq('status', 'active')

    if (users && users.length > 0) {
      query = query.in('user_id', users.map(u => u.id))
    } else {
      return NextResponse.json([])
    }
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/admin/training/assignments — assign modules to users
// Body: { user_ids: string[], module_ids: string[], due_date?: string }
export async function POST(request: NextRequest) {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { user_ids, module_ids, due_date } = body

  if (!user_ids?.length || !module_ids?.length) {
    return NextResponse.json(
      { error: 'user_ids and module_ids are required' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Build all assignment rows
  const assignments = user_ids.flatMap((userId: string) =>
    module_ids.map((moduleId: string) => ({
      user_id: userId,
      module_id: moduleId,
      assigned_by: staff.id,
      due_date: due_date || null,
    }))
  )

  const { data, error } = await supabase
    .from('training_assignments')
    .upsert(assignments, { onConflict: 'user_id,module_id' })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: data?.length || 0 })
}

// DELETE /api/admin/training/assignments — remove assignments
// Body: { assignment_ids: string[] }
export async function DELETE(request: NextRequest) {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { assignment_ids } = body

  if (!assignment_ids?.length) {
    return NextResponse.json({ error: 'assignment_ids required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('training_assignments')
    .delete()
    .in('id', assignment_ids)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
