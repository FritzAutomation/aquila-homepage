import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/settings - Get all settings
export async function GET() {
  try {
    const supabase = createAdminClient()

    // Get SLA config
    const { data: sla_config, error } = await supabase
      .from('sla_config')
      .select('*')
      .order('priority')

    if (error) {
      console.error('Failed to fetch settings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sla_config })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createAdminClient()

    // Update SLA config if provided
    if (body.sla_config) {
      for (const config of body.sla_config) {
        const { error } = await supabase
          .from('sla_config')
          .upsert({
            priority: config.priority,
            first_response_hours: config.first_response_hours,
            resolution_hours: config.resolution_hours,
          }, { onConflict: 'priority' })

        if (error) {
          console.error('Failed to update SLA config:', error)
          return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
