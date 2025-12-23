import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/analytics - Get full analytics data
export async function GET() {
  try {
    const supabase = createAdminClient()

    // Get all tickets for analysis
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('status, priority, product, issue_type, first_response_at, resolved_at, created_at')

    if (error) {
      console.error('Failed to fetch analytics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      )
    }

    // Calculate stats
    const stats = {
      total_tickets: tickets.length,
      open_tickets: tickets.filter(t => t.status === 'open').length,
      in_progress_tickets: tickets.filter(t => t.status === 'in_progress').length,
      pending_tickets: tickets.filter(t => t.status === 'pending').length,
      resolved_tickets: tickets.filter(t => t.status === 'resolved').length,
      closed_tickets: tickets.filter(t => t.status === 'closed').length,
      avg_response_hours: null as number | null,
      avg_resolution_hours: null as number | null,
    }

    // Calculate average response time
    const ticketsWithResponse = tickets.filter(t => t.first_response_at)
    if (ticketsWithResponse.length > 0) {
      const totalResponseHours = ticketsWithResponse.reduce((sum, t) => {
        const created = new Date(t.created_at).getTime()
        const responded = new Date(t.first_response_at!).getTime()
        return sum + (responded - created) / 3600000
      }, 0)
      stats.avg_response_hours = totalResponseHours / ticketsWithResponse.length
    }

    // Calculate average resolution time
    const ticketsResolved = tickets.filter(t => t.resolved_at)
    if (ticketsResolved.length > 0) {
      const totalResolutionHours = ticketsResolved.reduce((sum, t) => {
        const created = new Date(t.created_at).getTime()
        const resolved = new Date(t.resolved_at!).getTime()
        return sum + (resolved - created) / 3600000
      }, 0)
      stats.avg_resolution_hours = totalResolutionHours / ticketsResolved.length
    }

    // Group by product
    const by_product: Record<string, number> = {}
    tickets.forEach(t => {
      by_product[t.product] = (by_product[t.product] || 0) + 1
    })

    // Group by issue type
    const by_issue_type: Record<string, number> = {}
    tickets.forEach(t => {
      by_issue_type[t.issue_type] = (by_issue_type[t.issue_type] || 0) + 1
    })

    // Group by priority
    const by_priority: Record<string, number> = {}
    tickets.forEach(t => {
      by_priority[t.priority] = (by_priority[t.priority] || 0) + 1
    })

    // Recent trend (last 7 days)
    const recent_trend: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = tickets.filter(t => t.created_at.startsWith(dateStr)).length
      recent_trend.push({ date: dateStr, count })
    }

    return NextResponse.json({
      stats,
      by_product,
      by_issue_type,
      by_priority,
      recent_trend,
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
