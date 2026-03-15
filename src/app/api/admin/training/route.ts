import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/training — Training progress summary by organization
 * Returns modules with per-org completion stats
 */
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Get all modules with lessons and steps
  const { data: modules } = await supabase
    .from('training_modules')
    .select(`
      id, title, slug, product,
      lessons:training_lessons(
        id,
        steps:training_steps(id)
      )
    `)
    .eq('is_published', true)
    .order('sort_order')

  // Get all companies with their users
  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .eq('status', 'active')
    .order('name')

  // Get all user profiles with company assignments
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email, company_id')
    .eq('status', 'active')
    .not('company_id', 'is', null)

  // Get all training progress records
  const { data: progress } = await supabase
    .from('training_progress')
    .select('user_id, step_id, completed')
    .eq('completed', true)

  if (!modules || !companies || !profiles || !progress) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }

  // Build step-to-module mapping
  const stepToModule: Record<string, string> = {}
  const moduleStepCounts: Record<string, number> = {}
  for (const mod of modules) {
    const lessons = (mod.lessons || []) as { id: string; steps: { id: string }[] }[]
    let count = 0
    for (const lesson of lessons) {
      for (const step of lesson.steps || []) {
        stepToModule[step.id] = mod.id
        count++
      }
    }
    moduleStepCounts[mod.id] = count
  }

  // Build user-to-company mapping
  const userToCompany: Record<string, string> = {}
  for (const p of profiles) {
    if (p.company_id) userToCompany[p.id] = p.company_id
  }

  // Aggregate: per company, per module, count completed steps
  // Key: `${company_id}:${module_id}` → Set of completed step_ids
  const companyModuleProgress: Record<string, Set<string>> = {}
  const companyUsers: Record<string, Set<string>> = {}

  for (const p of progress) {
    const companyId = userToCompany[p.user_id]
    if (!companyId) continue
    const moduleId = stepToModule[p.step_id]
    if (!moduleId) continue

    const key = `${companyId}:${moduleId}`
    if (!companyModuleProgress[key]) companyModuleProgress[key] = new Set()
    companyModuleProgress[key].add(p.step_id)

    if (!companyUsers[companyId]) companyUsers[companyId] = new Set()
    companyUsers[companyId].add(p.user_id)
  }

  // Build response
  const orgProgress = companies.map((company) => {
    const activeUsers = companyUsers[company.id]?.size || 0
    const totalUsers = profiles.filter((p) => p.company_id === company.id).length

    const moduleProgress = modules.map((mod) => {
      const key = `${company.id}:${mod.id}`
      const completedSteps = companyModuleProgress[key]?.size || 0
      const totalSteps = moduleStepCounts[mod.id] || 0
      const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

      return {
        module_id: mod.id,
        module_title: mod.title,
        product: mod.product,
        completed_steps: completedSteps,
        total_steps: totalSteps,
        percent,
      }
    })

    const overallCompleted = moduleProgress.reduce((s, m) => s + m.completed_steps, 0)
    const overallTotal = moduleProgress.reduce((s, m) => s + m.total_steps, 0)
    const overallPercent = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0

    return {
      company_id: company.id,
      company_name: company.name,
      total_users: totalUsers,
      active_learners: activeUsers,
      overall_percent: overallPercent,
      modules: moduleProgress,
    }
  })

  // Also return a summary for the dashboard widget
  const totalLearners = new Set(progress.map((p) => p.user_id)).size
  const totalCompletions = progress.length

  return NextResponse.json({
    summary: {
      total_modules: modules.length,
      total_learners: totalLearners,
      total_completions: totalCompletions,
      orgs_with_progress: orgProgress.filter((o) => o.active_learners > 0).length,
    },
    organizations: orgProgress,
  })
}
