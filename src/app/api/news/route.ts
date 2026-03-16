import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/kb-utils'

// GET /api/news - List news articles (public: published only, admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    if (admin) {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createAdminClient()

    let query = supabase
      .from('news_articles')
      .select('id, title, slug, excerpt, category, is_featured, is_published, published_at, cover_image_url, sort_order, created_at, updated_at')
      .order('sort_order', { ascending: true })
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (!admin) {
      query = query.eq('is_published', true)
    }

    const { data: articles, error } = await query

    if (error) {
      console.error('Error fetching news articles:', error)
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('News list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/news - Create news article (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, category, is_featured, is_published, cover_image_url, cta_text, cta_url, sort_order, attachments } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const slug = generateSlug(title)
    const adminClient = createAdminClient()

    // If marking as featured, unfeature existing
    if (is_featured) {
      await adminClient
        .from('news_articles')
        .update({ is_featured: false })
        .eq('is_featured', true)
    }

    const { data: article, error } = await adminClient
      .from('news_articles')
      .insert({
        title,
        slug,
        content: content || '',
        excerpt: excerpt || null,
        category: category || 'news',
        is_featured: is_featured || false,
        is_published: is_published || false,
        published_at: is_published ? new Date().toISOString() : null,
        cover_image_url: cover_image_url || null,
        cta_text: cta_text || null,
        cta_url: cta_url || null,
        sort_order: sort_order || 0,
        attachments: attachments || [],
        author_id: user.id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An article with this title already exists' }, { status: 409 })
      }
      console.error('Error creating news article:', error)
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('News create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
