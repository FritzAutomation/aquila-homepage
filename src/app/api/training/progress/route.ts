import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'

// GET /api/training/progress - Get current user's progress
// Optional query params: module_id (filter by module)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('module_id')

    const adminClient = createAdminClient()

    let query = adminClient
      .from('training_progress')
      .select('*')
      .eq('user_id', user.id)

    if (moduleId) {
      // Get step IDs for this module and filter progress
      const { data: steps } = await adminClient
        .from('training_steps')
        .select('id, training_lessons!inner(module_id)')
        .eq('training_lessons.module_id', moduleId)

      if (steps && steps.length > 0) {
        const stepIds = steps.map(s => s.id)
        query = query.in('step_id', stepIds)
      } else {
        return NextResponse.json([])
      }
    }

    const { data: progress, error } = await query

    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json(progress || [])
  } catch (error) {
    console.error('Training progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/training/progress - Record step completion
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { step_id, completed, quiz_answer_index, quiz_passed } = body

    if (!step_id) {
      return NextResponse.json({ error: 'step_id is required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Upsert progress record
    const progressData: Record<string, unknown> = {
      user_id: user.id,
      step_id,
      completed: completed ?? true,
      completed_at: completed !== false ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    if (quiz_answer_index !== undefined) {
      progressData.quiz_answer_index = quiz_answer_index
      progressData.quiz_passed = quiz_passed ?? false
    }

    // Check if record exists
    const { data: existing } = await adminClient
      .from('training_progress')
      .select('id, attempts')
      .eq('user_id', user.id)
      .eq('step_id', step_id)
      .single()

    let result
    if (existing) {
      const { data, error } = await adminClient
        .from('training_progress')
        .update({
          ...progressData,
          attempts: (existing.attempts || 0) + 1,
        })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      result = data
    } else {
      const { data, error } = await adminClient
        .from('training_progress')
        .insert({ ...progressData, attempts: 1 })
        .select()
        .single()
      if (error) throw error
      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Training progress update error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
