import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/staff - Get all staff members
export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: staff, error } = await supabase
      .from('staff_profiles')
      .select('id, name, email, role')
      .order('name')

    if (error) {
      console.error('Failed to fetch staff:', error)
      return NextResponse.json(
        { error: 'Failed to fetch staff' },
        { status: 500 }
      )
    }

    return NextResponse.json({ staff })

  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
