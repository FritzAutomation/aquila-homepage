import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/analytics/stats - Get ticket statistics
export async function GET() {
  try {
    const supabase = createAdminClient()

    // Get counts by status
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('status, first_response_at, resolved_at, created_at')

    if (error) {
      console.error('Failed to fetch ticket stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
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

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
