import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/canned-responses - Get all canned responses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const supabase = createAdminClient()

    let query = supabase
      .from('canned_responses')
      .select('*')
      .order('category')
      .order('title')

    if (category) {
      query = query.eq('category', category)
    }

    const { data: responses, error } = await query

    if (error) {
      console.error('Failed to fetch canned responses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch canned responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ responses })

  } catch (error) {
    console.error('Error fetching canned responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/canned-responses - Create a new canned response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, shortcut } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: response, error } = await supabase
      .from('canned_responses')
      .insert({
        title,
        content,
        category: category || null,
        shortcut: shortcut || null
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create canned response:', error)
      return NextResponse.json(
        { error: 'Failed to create canned response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Error creating canned response:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
