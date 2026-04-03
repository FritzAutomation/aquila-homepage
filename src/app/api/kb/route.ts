import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/kb-utils'

// GET /api/kb - List articles (public: published only, admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // For admin requests, verify authentication
    if (admin) {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createAdminClient()

    let query = supabase
      .from('kb_articles')
      .select('id, title, slug, excerpt, category, product, is_published, sort_order, created_at, updated_at, published_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    // Public requests only see published articles
    if (!admin) {
      query = query.eq('is_published', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      const sanitized = search.replace(/[%_,.()"\\]/g, '')
      if (sanitized) {
        query = query.or(`title.ilike.%${sanitized}%,content.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%`)
      }
    }

    const { data: articles, error } = await query

    if (error) {
      console.error('Error fetching KB articles:', error)
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('KB list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/kb - Create article (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, category, product, is_published, sort_order, attachments } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Generate slug from title
    const slug = generateSlug(title)

    const adminClient = createAdminClient()

    const { data: article, error } = await adminClient
      .from('kb_articles')
      .insert({
        title,
        slug,
        content: content || '',
        excerpt: excerpt || null,
        category: category || 'general',
        product: product || [],
        is_published: is_published || false,
        sort_order: sort_order || 0,
        attachments: attachments || [],
        author_id: user.id,
        published_at: is_published ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An article with this title already exists' }, { status: 409 })
      }
      console.error('Error creating article:', error)
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('KB create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
