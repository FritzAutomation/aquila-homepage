import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

// GET /api/training - List training modules
// - Admin/agent: all modules (or all published if not ?admin=true)
// - Customer: assigned modules + public modules
// - Unauthenticated: public modules only
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const product = searchParams.get('product')
    const admin = searchParams.get('admin') === 'true'

    // Admin requests require authentication
    if (admin) {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createAdminClient()

    // Check current user for role-based filtering
    const profile = await getCurrentUser()
    const isCustomer = profile?.user_type === 'customer'
    const isStaff = profile?.user_type === 'admin' || profile?.user_type === 'agent'

    // Get assigned module IDs for customers
    let assignedModuleIds: string[] = []
    if (isCustomer && profile) {
      const { data: assignments } = await supabase
        .from('training_assignments')
        .select('module_id')
        .eq('user_id', profile.id)
      assignedModuleIds = (assignments || []).map((a) => a.module_id)
    }

    let query = supabase
      .from('training_modules')
      .select(`
        *,
        lessons:training_lessons(
          id,
          steps:training_steps(id)
        )
      `)
      .order('sort_order', { ascending: true })

    if (admin && isStaff) {
      // Staff in admin mode: show all modules (published and unpublished)
    } else if (isStaff) {
      // Staff not in admin mode: show published only
      query = query.eq('is_published', true)
    } else if (isCustomer && assignedModuleIds.length > 0) {
      // Customer: show public OR assigned, but only published
      query = query.eq('is_published', true)
        .or(`is_public.eq.true,id.in.(${assignedModuleIds.join(',')})`)
    } else {
      // Unauthenticated or customer with no assignments: public only
      query = query.eq('is_published', true).eq('is_public', true)
    }

    if (product) {
      query = query.eq('product', product)
    }

    const { data: modules, error } = await query

    if (error) {
      console.error('Error fetching training modules:', error)
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
    }

    // Compute lesson/step counts and tag assigned status
    const result = (modules || []).map((m) => {
      const lessons = (m.lessons || []) as { id: string; steps: { id: string }[] }[]
      const totalSteps = lessons.reduce((sum, l) => sum + (l.steps?.length || 0), 0)
      return {
        ...m,
        lesson_count: lessons.length,
        step_count: totalSteps,
        is_assigned: assignedModuleIds.includes(m.id),
        lessons: undefined,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Training list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/training - Create a module (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, description, product, cover_image, sort_order, is_published, estimated_minutes } = body

    if (!title || !slug || !product) {
      return NextResponse.json({ error: 'title, slug, and product are required' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const { data: module, error } = await adminClient
      .from('training_modules')
      .insert({
        title, slug, description, product,
        cover_image: cover_image || null,
        sort_order: sort_order || 0,
        is_published: is_published || false,
        estimated_minutes: estimated_minutes || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A module with this slug already exists' }, { status: 409 })
      }
      console.error('Error creating module:', error)
      return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
    }

    return NextResponse.json(module, { status: 201 })
  } catch (error) {
    console.error('Training create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
