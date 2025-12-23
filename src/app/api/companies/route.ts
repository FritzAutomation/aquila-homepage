import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/companies - List all companies with ticket counts
export async function GET() {
  try {
    const supabase = createAdminClient()

    // Get companies with ticket stats
    const { data: companies, error } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        domain,
        created_at,
        notes,
        tickets (
          id,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch companies:', error)
      return NextResponse.json(
        { error: 'Failed to fetch companies' },
        { status: 500 }
      )
    }

    // Transform to include counts
    const companiesWithCounts = companies.map(company => ({
      id: company.id,
      name: company.name,
      domain: company.domain,
      created_at: company.created_at,
      notes: company.notes,
      ticket_count: company.tickets?.length || 0,
      open_tickets: company.tickets?.filter(
        (t: { status: string }) => t.status === 'open' || t.status === 'in_progress'
      ).length || 0,
    }))

    return NextResponse.json({ companies: companiesWithCounts })

  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
