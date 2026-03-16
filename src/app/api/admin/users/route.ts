import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin, requireStaff, isSuperAdmin } from '@/lib/auth'

// GET /api/admin/users - List all users (excludes super admins)
export async function GET(request: NextRequest) {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const userType = searchParams.get('user_type')
  const status = searchParams.get('status')
  const companyId = searchParams.get('company_id')

  const supabase = createAdminClient()

  let query = supabase
    .from('profiles')
    .select('*, company:companies(id, name)')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (userType) {
    query = query.eq('user_type', userType)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (companyId) {
    query = query.eq('company_id', companyId)
  }

  const { data: users, error } = await query

  if (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  // Hide super admins from the user list — they cannot be managed by regular admins
  const filteredUsers = (users || []).filter(u => !isSuperAdmin(u.email))

  return NextResponse.json(filteredUsers)
}

// POST /api/admin/users - Invite a new user
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, name, user_type, company_id } = body

  if (!email || !name || !user_type) {
    return NextResponse.json(
      { error: 'Email, name, and user_type are required' },
      { status: 400 }
    )
  }

  if (!['admin', 'agent', 'customer'].includes(user_type)) {
    return NextResponse.json(
      { error: 'Invalid user_type' },
      { status: 400 }
    )
  }

  if (user_type === 'customer' && !company_id) {
    return NextResponse.json(
      { error: 'Company is required for customer users' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Check if user already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'A user with this email already exists' },
      { status: 409 }
    )
  }

  try {
    // Create Supabase auth user with invite
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
      email.toLowerCase(),
      {
        data: { name, user_type },
      }
    )

    if (authError) {
      console.error('Error inviting user:', authError)
      return NextResponse.json(
        { error: authError.message || 'Failed to invite user' },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        name,
        user_type,
        company_id: company_id || null,
        status: 'invited',
      })
      .select('*, company:companies(id, name)')
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      return NextResponse.json(
        { error: 'User invited but profile creation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Invite error:', error)
    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    )
  }
}
