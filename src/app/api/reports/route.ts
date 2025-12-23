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
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
