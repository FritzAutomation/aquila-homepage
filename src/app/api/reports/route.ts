import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRODUCT_LABELS, ISSUE_TYPE_LABELS, type Product, type IssueType } from '@/lib/types'

// GET /api/reports - Generate a yearly report for a company
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    if (!companyId) {
      return NextResponse.json(
        { error: 'company_id is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get company info
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', companyId)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Get tickets for this company in the specified year
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('status, priority, product, issue_type, first_response_at, resolved_at, created_at')
      .eq('company_id', companyId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (ticketsError) {
      console.error('Failed to fetch tickets:', ticketsError)
      return NextResponse.json(
        { error: 'Failed to fetch tickets' },
        { status: 500 }
      )
    }

    // Calculate stats
    const total_tickets = tickets.length
    const resolved_tickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

    // Average response time
    let avg_response_hours: number | null = null
    const ticketsWithResponse = tickets.filter(t => t.first_response_at)
    if (ticketsWithResponse.length > 0) {
      const totalHours = ticketsWithResponse.reduce((sum, t) => {
        const created = new Date(t.created_at).getTime()
        const responded = new Date(t.first_response_at!).getTime()
        return sum + (responded - created) / 3600000
      }, 0)
      avg_response_hours = totalHours / ticketsWithResponse.length
    }

    // Average resolution time
    let avg_resolution_hours: number | null = null
    const ticketsResolved = tickets.filter(t => t.resolved_at)
    if (ticketsResolved.length > 0) {
      const totalHours = ticketsResolved.reduce((sum, t) => {
        const created = new Date(t.created_at).getTime()
        const resolved = new Date(t.resolved_at!).getTime()
        return sum + (resolved - created) / 3600000
      }, 0)
      avg_resolution_hours = totalHours / ticketsResolved.length
    }

    // Group by product
    const by_product: Record<string, number> = {}
    tickets.forEach(t => {
      const label = PRODUCT_LABELS[t.product as Product] || t.product
      by_product[label] = (by_product[label] || 0) + 1
    })

    // Group by issue type
    const by_issue_type: Record<string, number> = {}
    tickets.forEach(t => {
      const label = ISSUE_TYPE_LABELS[t.issue_type as IssueType] || t.issue_type
      by_issue_type[label] = (by_issue_type[label] || 0) + 1
    })

    // Monthly breakdown
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthly_breakdown = months.map((month, index) => {
      const monthNum = String(index + 1).padStart(2, '0')
      const count = tickets.filter(t => {
        const ticketMonth = t.created_at.substring(5, 7)
        return ticketMonth === monthNum
      }).length
      return { month, count }
    })

    // --- Training data for this company ---
    // Get users in this company
    const { data: companyUsers } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('company_id', companyId)
      .eq('status', 'active')

    const userIds = (companyUsers || []).map(u => u.id)

    let training_summary = {
      total_users: userIds.length,
      users_with_assignments: 0,
      total_assignments: 0,
      total_steps_completed: 0,
      total_quizzes_passed: 0,
      total_quizzes_failed: 0,
      user_progress: [] as {
        user_name: string;
        user_email: string;
        modules_assigned: number;
        steps_completed: number;
        total_steps: number;
        completion_percent: number;
        quizzes_passed: number;
        quizzes_failed: number;
      }[],
      by_module: [] as {
        module_title: string;
        product: string;
        users_assigned: number;
        users_completed: number;
        avg_completion: number;
      }[],
    }

    if (userIds.length > 0) {
      // Get assignments for these users
      const { data: assignments } = await supabase
        .from('training_assignments')
        .select('user_id, module_id')
        .in('user_id', userIds)

      // Get progress for these users
      const { data: progress } = await supabase
        .from('training_progress')
        .select('user_id, step_id, completed, quiz_passed')
        .in('user_id', userIds)
        .eq('completed', true)

      // Get modules with their step counts
      const { data: modules } = await supabase
        .from('training_modules')
        .select('id, title, product, lessons(steps(id))')
        .eq('is_published', true)

      const moduleStepCounts: Record<string, number> = {}
      const moduleInfo: Record<string, { title: string; product: string }> = {}
      const moduleStepIds: Record<string, Set<string>> = {}
      for (const mod of modules || []) {
        const stepIds = new Set<string>()
        for (const lesson of mod.lessons || []) {
          for (const step of lesson.steps || []) {
            stepIds.add(step.id)
          }
        }
        moduleStepCounts[mod.id] = stepIds.size
        moduleStepIds[mod.id] = stepIds
        moduleInfo[mod.id] = { title: mod.title, product: mod.product }
      }

      const assignmentList = assignments || []
      const progressList = progress || []
      const completedStepsByUser: Record<string, Set<string>> = {}
      const quizPassByUser: Record<string, number> = {}
      const quizFailByUser: Record<string, number> = {}

      for (const p of progressList) {
        if (!completedStepsByUser[p.user_id]) completedStepsByUser[p.user_id] = new Set()
        completedStepsByUser[p.user_id].add(p.step_id)
        if (p.quiz_passed === true) {
          quizPassByUser[p.user_id] = (quizPassByUser[p.user_id] || 0) + 1
        } else if (p.quiz_passed === false) {
          quizFailByUser[p.user_id] = (quizFailByUser[p.user_id] || 0) + 1
        }
      }

      // Per-user progress
      const usersWithAssignments = new Set<string>()
      const userAssignments: Record<string, string[]> = {}
      for (const a of assignmentList) {
        usersWithAssignments.add(a.user_id)
        if (!userAssignments[a.user_id]) userAssignments[a.user_id] = []
        userAssignments[a.user_id].push(a.module_id)
      }

      const userProgress = (companyUsers || [])
        .filter(u => usersWithAssignments.has(u.id))
        .map(u => {
          const assignedModules = userAssignments[u.id] || []
          let totalSteps = 0
          let stepsCompleted = 0
          for (const modId of assignedModules) {
            const stepIds = moduleStepIds[modId]
            if (stepIds) {
              totalSteps += stepIds.size
              const userCompleted = completedStepsByUser[u.id] || new Set()
              for (const sid of stepIds) {
                if (userCompleted.has(sid)) stepsCompleted++
              }
            }
          }
          return {
            user_name: u.name || u.email,
            user_email: u.email,
            modules_assigned: assignedModules.length,
            steps_completed: stepsCompleted,
            total_steps: totalSteps,
            completion_percent: totalSteps > 0 ? Math.round((stepsCompleted / totalSteps) * 100) : 0,
            quizzes_passed: quizPassByUser[u.id] || 0,
            quizzes_failed: quizFailByUser[u.id] || 0,
          }
        })

      // Per-module summary
      const moduleAssignees: Record<string, Set<string>> = {}
      for (const a of assignmentList) {
        if (!moduleAssignees[a.module_id]) moduleAssignees[a.module_id] = new Set()
        moduleAssignees[a.module_id].add(a.user_id)
      }

      const byModule = Object.entries(moduleAssignees).map(([modId, users]) => {
        const stepIds = moduleStepIds[modId] || new Set()
        const totalSteps = stepIds.size
        let usersCompleted = 0
        let totalCompletion = 0

        for (const userId of users) {
          const userCompleted = completedStepsByUser[userId] || new Set()
          let completed = 0
          for (const sid of stepIds) {
            if (userCompleted.has(sid)) completed++
          }
          const pct = totalSteps > 0 ? (completed / totalSteps) * 100 : 0
          totalCompletion += pct
          if (pct >= 100) usersCompleted++
        }

        return {
          module_title: moduleInfo[modId]?.title || 'Unknown',
          product: PRODUCT_LABELS[moduleInfo[modId]?.product as Product] || moduleInfo[modId]?.product || '',
          users_assigned: users.size,
          users_completed: usersCompleted,
          avg_completion: users.size > 0 ? Math.round(totalCompletion / users.size) : 0,
        }
      })

      training_summary = {
        total_users: userIds.length,
        users_with_assignments: usersWithAssignments.size,
        total_assignments: assignmentList.length,
        total_steps_completed: progressList.length,
        total_quizzes_passed: Object.values(quizPassByUser).reduce((a, b) => a + b, 0),
        total_quizzes_failed: Object.values(quizFailByUser).reduce((a, b) => a + b, 0),
        user_progress: userProgress,
        by_module: byModule,
      }
    }

    return NextResponse.json({
      company,
      year,
      total_tickets,
      resolved_tickets,
      avg_response_hours,
      avg_resolution_hours,
      by_product,
      by_issue_type,
      monthly_breakdown,
      training: training_summary,
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
