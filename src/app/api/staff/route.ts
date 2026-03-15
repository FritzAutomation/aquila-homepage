import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireStaff } from '@/lib/auth'

// GET /api/staff - Get all staff members
export async function GET() {
  try {
    const user = await requireStaff()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data: staff, error } = await supabase
      .from('profiles')
      .select('id, name, email, user_type')
      .in('user_type', ['admin', 'agent'])
      .eq('status', 'active')
      .order('name')

    if (error) {
      console.error('Failed to fetch staff:', error)
      return NextResponse.json(
        { error: 'Failed to fetch staff' },
        { status: 500 }
      )
    }

    // Map user_type to role for backwards compatibility with existing UI
    const mappedStaff = (staff || []).map(s => ({
      ...s,
      role: s.user_type,
    }))

    return NextResponse.json({ staff: mappedStaff })

  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
