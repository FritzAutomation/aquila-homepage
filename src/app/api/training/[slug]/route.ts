import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/training/[slug] - Get module with all lessons and steps
// Public modules: anyone can view
// Non-public modules: staff or assigned users only
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const supabase = createAdminClient()

    const { data: module, error } = await supabase
      .from('training_modules')
      .select(`
        *,
        lessons:training_lessons(
          *,
          steps:training_steps(*)
        )
      `)
      .eq('slug', slug)
      .single()

    if (error || !module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Access control
    const profile = await getCurrentUser()
    const isStaff = profile?.user_type === 'admin' || profile?.user_type === 'agent'

    if (!module.is_published && !isStaff) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Non-public modules require staff access or assignment
    if (!module.is_public && !isStaff) {
      if (!profile) {
        return NextResponse.json({ error: 'Login required' }, { status: 401 })
      }
      // Check if user has this module assigned
      const { data: assignment } = await supabase
        .from('training_assignments')
        .select('id')
        .eq('user_id', profile.id)
        .eq('module_id', module.id)
        .single()

      if (!assignment) {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 })
      }
    }

    // Sort lessons and steps by sort_order
    const lessons = ((module.lessons || []) as Array<{
      sort_order: number
      steps: Array<{ sort_order: number }>
    }>)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(lesson => ({
        ...lesson,
        steps: (lesson.steps || []).sort((a, b) => a.sort_order - b.sort_order),
      }))

    return NextResponse.json({ ...module, lessons })
  } catch (error) {
    console.error('Training module error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/training/[slug] - Update module (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authClient = await createServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()
    const allowedFields = ['title', 'slug', 'description', 'product', 'cover_image', 'sort_order', 'is_published', 'is_public', 'estimated_minutes']
    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field]
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: module, error } = await supabase
      .from('training_modules')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Error updating module:', error)
      return NextResponse.json({ error: 'Failed to update module' }, { status: 500 })
    }

    return NextResponse.json(module)
  } catch (error) {
    console.error('Training update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
