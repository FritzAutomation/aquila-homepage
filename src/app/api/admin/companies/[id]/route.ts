import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin, requireStaff } from '@/lib/auth'

// GET /api/admin/companies/[id] - Get company detail with members
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await requireStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { data: company, error } = await supabase
    .from('companies')
    .select(`
      *,
      profiles (id, email, name, user_type, status, created_at),
      tickets (id, status)
    `)
    .eq('id', id)
    .single()

  if (error || !company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...company,
    user_count: company.profiles?.length || 0,
    ticket_count: company.tickets?.length || 0,
    open_tickets: company.tickets?.filter(
      (t: { status: string }) => t.status === 'open' || t.status === 'in_progress'
    ).length || 0,
  })
}

// PATCH /api/admin/companies/[id] - Update company
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { name, domain, notes, status } = body

  const supabase = createAdminClient()

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name.trim()
  if (domain !== undefined) updateData.domain = domain?.trim() || null
  if (notes !== undefined) updateData.notes = notes?.trim() || null
  if (status !== undefined) updateData.status = status

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  // If renaming, check for duplicate
  if (name) {
    const { data: existing } = await supabase
      .from('companies')
      .select('id')
      .ilike('name', name.trim())
      .neq('id', id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A company with this name already exists' },
        { status: 409 }
      )
    }
  }

  const { data: company, error } = await supabase
    .from('companies')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }

  return NextResponse.json(company)
}
