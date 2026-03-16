import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin, requireStaff } from '@/lib/auth'

// GET /api/admin/companies - List all companies with user counts
export async function GET(request: NextRequest) {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')

  const supabase = createAdminClient()

  let query = supabase
    .from('companies')
    .select(`
      id,
      name,
      domains,
      created_at,
      notes,
      status,
      profiles (id),
      tickets (id, status)
    `)
    .order('name', { ascending: true })

  if (search) {
    // Search by name only — domains is an array, handled client-side if needed
    query = query.ilike('name', `%${search}%`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: companies, error } = await query

  if (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }

  const companiesWithCounts = companies.map(company => ({
    id: company.id,
    name: company.name,
    domains: company.domains || [],
    created_at: company.created_at,
    notes: company.notes,
    status: company.status,
    user_count: company.profiles?.length || 0,
    ticket_count: company.tickets?.length || 0,
    open_tickets: company.tickets?.filter(
      (t: { status: string }) => t.status === 'open' || t.status === 'in_progress'
    ).length || 0,
  }))

  return NextResponse.json(companiesWithCounts)
}

// POST /api/admin/companies - Create a new company
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, domains, notes } = body

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Check for duplicate name
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .ilike('name', name.trim())
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'A company with this name already exists' },
      { status: 409 }
    )
  }

  // Clean domains: filter empty strings, lowercase, deduplicate
  const cleanDomains = Array.isArray(domains)
    ? [...new Set(domains.map((d: string) => d.trim().toLowerCase()).filter(Boolean))]
    : []

  const { data: company, error } = await supabase
    .from('companies')
    .insert({
      name: name.trim(),
      domains: cleanDomains,
      notes: notes?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }

  return NextResponse.json(company, { status: 201 })
}
