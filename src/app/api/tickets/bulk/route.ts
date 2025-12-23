import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/tickets/bulk - Perform bulk actions on tickets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticket_ids, action, value } = body

    if (!ticket_ids || !Array.isArray(ticket_ids) || ticket_ids.length === 0) {
      return NextResponse.json(
        { error: 'ticket_ids array is required' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { error: 'action is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    let updateData: Record<string, unknown> = {}

    switch (action) {
      case 'status':
        if (!value) {
          return NextResponse.json(
            { error: 'value is required for status action' },
            { status: 400 }
          )
        }
        updateData.status = value
        // Set resolved_at timestamp if status is resolved
        if (value === 'resolved') {
          updateData.resolved_at = new Date().toISOString()
        }
        // Set closed_at timestamp if status is closed
        if (value === 'closed') {
          updateData.closed_at = new Date().toISOString()
        }
        break

      case 'priority':
        if (!value) {
          return NextResponse.json(
            { error: 'value is required for priority action' },
            { status: 400 }
          )
        }
        updateData.priority = value
        break

      case 'assign':
        // Empty string means unassign
        updateData.assigned_to = value || null
        break

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    const { data: tickets, error } = await supabase
      .from('tickets')
      .update(updateData)
      .in('id', ticket_ids)
      .select('id')

    if (error) {
      console.error('Bulk update failed:', error)
      return NextResponse.json(
        { error: 'Failed to update tickets' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updated_count: tickets?.length || 0
    })

  } catch (error) {
    console.error('Error in bulk action:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
