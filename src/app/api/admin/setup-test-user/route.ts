import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/setup-test-user — Create a test customer user
 * TEMPORARY: Remove after testing
 */
export async function GET() {
  const supabase = createAdminClient()

  // Create auth user with password via admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'customer@testcompany.com',
    password: 'TestCustomer123!',
    email_confirm: true,
    user_metadata: { name: 'Test Customer' },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  if (!authData.user) {
    return NextResponse.json({ error: 'No user returned' }, { status: 500 })
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: 'customer@testcompany.com',
      name: 'Test Customer',
      user_type: 'customer',
      company_id: 'a43b2c99-652f-4e45-9ee6-426d9e438f6c',
      status: 'active',
    })

  if (profileError) {
    return NextResponse.json({ error: profileError.message, user_created: true }, { status: 500 })
  }

  return NextResponse.json({ success: true, user_id: authData.user.id })
}
