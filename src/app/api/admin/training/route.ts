import { NextResponse } from 'next/server'
import { requireStaff } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/training — Training progress by organization with per-user detail
 *
 * Progress is calculated based on assigned training:
 * - Org completion % = total assigned steps completed across all users / total assigned steps
 * - Per-user % = user's completed steps in assigned modules / total steps in assigned modules
 */
export async function GET() {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Fetch everything in parallel
  const [modulesRes, companiesRes, profilesRes, progressRes, assignmentsRes] = await Promise.all([
    supabase
      .from('training_modules')
      .select(`id, title, slug, product, is_public, lessons:training_lessons(id, steps:training_steps(id))`)
      .eq('is_published', true)
      .order('sort_order'),
    supabase
      .from('companies')
      .select('id, name')
      .eq('status', 'active')
      .order('name'),
    supabase
      .from('profiles')
      .select('id, name, email, company_id, user_type')
      .eq('status', 'active')
      .not('company_id', 'is', null),
    supabase
      .from('training_progress')
      .select('user_id, step_id, completed')
      .eq('completed', true),
    supabase
      .from('training_assignments')
      .select('user_id, module_id'),
  ])

  const modules = modulesRes.data
  const companies = companiesRes.data
  const profiles = profilesRes.data
  const progress = progressRes.data
  const assignments = assignmentsRes.data

  if (!modules || !companies || !profiles || !progress || !assignments) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }

  // Build module step maps
  const moduleStepIds: Record<string, string[]> = {}
  const stepToModule: Record<string, string> = {}
  for (const mod of modules) {
    const stepIds: string[] = []
    for (const lesson of (mod.lessons || []) as { id: string; steps: { id: string }[] }[]) {
      for (const step of lesson.steps || []) {
        stepIds.push(step.id)
        stepToModule[step.id] = mod.id
      }
    }
    moduleStepIds[mod.id] = stepIds
  }

  // Build assignment map: user_id → Set of assigned module_ids
  const userAssignments: Record<string, Set<string>> = {}
  for (const a of assignments) {
    if (!userAssignments[a.user_id]) userAssignments[a.user_id] = new Set()
    userAssignments[a.user_id].add(a.module_id)
  }

  // Build user progress map: user_id → Set of completed step_ids
  const userProgress: Record<string, Set<string>> = {}
  for (const p of progress) {
    if (!userProgress[p.user_id]) userProgress[p.user_id] = new Set()
    userProgress[p.user_id].add(p.step_id)
  }

  // Group profiles by company
  const companyProfiles: Record<string, typeof profiles> = {}
  for (const p of profiles) {
    if (!p.company_id) continue
    if (!companyProfiles[p.company_id]) companyProfiles[p.company_id] = []
    companyProfiles[p.company_id].push(p)
  }

  // Build per-org response with per-user detail
  const organizations = companies.map((company) => {
    const users = companyProfiles[company.id] || []

    // Per-user progress based on their assignments
    const userDetails = users.map((user) => {
      const assignedModuleIds = userAssignments[user.id] || new Set()
      const completedSteps = userProgress[user.id] || new Set()

      // Total assigned steps for this user
      let totalAssignedSteps = 0
      let completedAssignedSteps = 0

      const userModules: {
        module_id: string
        module_title: string
        product: string
        completed_steps: number
        total_steps: number
        percent: number
      }[] = []

      for (const mod of modules) {
        if (!assignedModuleIds.has(mod.id)) continue
        const steps = moduleStepIds[mod.id] || []
        const completed = steps.filter((s) => completedSteps.has(s)).length
        totalAssignedSteps += steps.length
        completedAssignedSteps += completed
        userModules.push({
          module_id: mod.id,
          module_title: mod.title,
          product: mod.product as string,
          completed_steps: completed,
          total_steps: steps.length,
          percent: steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0,
        })
      }

      const percent = totalAssignedSteps > 0
        ? Math.round((completedAssignedSteps / totalAssignedSteps) * 100)
        : 0

      return {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        assigned_modules: assignedModuleIds.size,
        completed_steps: completedAssignedSteps,
        total_steps: totalAssignedSteps,
        percent,
        modules: userModules,
      }
    })

    // Org-level completion: sum of all users' assigned steps completed / sum of all assigned steps
    const orgTotalSteps = userDetails.reduce((s, u) => s + u.total_steps, 0)
    const orgCompletedSteps = userDetails.reduce((s, u) => s + u.completed_steps, 0)
    const orgPercent = orgTotalSteps > 0
      ? Math.round((orgCompletedSteps / orgTotalSteps) * 100)
      : 0

    const usersWithAssignments = userDetails.filter((u) => u.assigned_modules > 0).length

    return {
      company_id: company.id,
      company_name: company.name,
      total_users: users.length,
      users_with_assignments: usersWithAssignments,
      overall_percent: orgPercent,
      users: userDetails,
    }
  })

  // Summary stats
  const totalAssignments = assignments.length
  const usersWithAssignments = new Set(assignments.map((a) => a.user_id)).size
  const totalCompletions = progress.length

  return NextResponse.json({
    summary: {
      total_modules: modules.length,
      total_assignments: totalAssignments,
      users_with_assignments: usersWithAssignments,
      total_completions: totalCompletions,
      orgs_with_assignments: organizations.filter((o) => o.users_with_assignments > 0).length,
    },
    organizations,
  })
}
