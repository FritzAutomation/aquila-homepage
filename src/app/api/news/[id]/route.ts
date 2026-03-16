import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/kb-utils'

/**
 * Extract storage paths from content and attachments that point to our Supabase Storage bucket.
 */
function extractStoragePaths(content: string, articleAttachments?: { url: string }[]): Set<string> {
  const paths = new Set<string>()
  const bucketPattern = /\/storage\/v1\/object\/public\/attachments\/([^\s"')]+)/g
  let match
  while ((match = bucketPattern.exec(content)) !== null) {
    paths.add(match[1])
  }
  if (articleAttachments) {
    for (const att of articleAttachments) {
      const attMatch = att.url.match(/\/storage\/v1\/object\/public\/attachments\/(.+)/)
      if (attMatch) paths.add(attMatch[1])
    }
  }
  return paths
}

// GET /api/news/[id] - Get single news article by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    let query = supabase
      .from('news_articles')
      .select('*')

    if (isUuid) {
      query = query.eq('id', id)
    } else {
      query = query.eq('slug', id)
    }

    const { data: article, error } = await query.single()

    if (error || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    if (!article.is_published) {
      const authClient = await createServerClient()
      const { data: { user } } = await authClient.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('News get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/news/[id] - Update news article (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authClient = await createServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, content, excerpt, category, is_featured, is_published, cover_image_url, cta_text, cta_url, sort_order, attachments } = body

    const supabase = createAdminClient()

    // Fetch existing article for storage cleanup
    const { data: existing } = await supabase
      .from('news_articles')
      .select('content, attachments, is_published, published_at')
      .eq('id', id)
      .single()

    // If marking as featured, unfeature existing
    if (is_featured) {
      await supabase
        .from('news_articles')
        .update({ is_featured: false })
        .neq('id', id)
        .eq('is_featured', true)
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) {
      updateData.title = title
      updateData.slug = generateSlug(title)
    }
    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (category !== undefined) updateData.category = category
    if (is_featured !== undefined) updateData.is_featured = is_featured
    if (is_published !== undefined) {
      updateData.is_published = is_published
      if (is_published && !existing?.published_at) {
        updateData.published_at = new Date().toISOString()
      } else if (!is_published) {
        updateData.published_at = null
      }
    }
    if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url
    if (cta_text !== undefined) updateData.cta_text = cta_text
    if (cta_url !== undefined) updateData.cta_url = cta_url
    if (sort_order !== undefined) updateData.sort_order = sort_order
    if (attachments !== undefined) updateData.attachments = attachments

    const { data: article, error } = await supabase
      .from('news_articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An article with this title already exists' }, { status: 409 })
      }
      console.error('Error updating news article:', error)
      return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
    }

    // Clean up removed files from storage
    if (existing) {
      const oldPaths = extractStoragePaths(existing.content || '', existing.attachments || [])
      const newPaths = extractStoragePaths(
        content !== undefined ? content : existing.content || '',
        attachments !== undefined ? attachments : existing.attachments || []
      )
      const removedPaths = [...oldPaths].filter(p => !newPaths.has(p))
      if (removedPaths.length > 0) {
        await supabase.storage.from('attachments').remove(removedPaths)
      }
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('News update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/news/[id] - Delete news article (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authClient = await createServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('news_articles')
      .select('content, attachments')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news article:', error)
      return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
    }

    // Clean up storage
    if (existing) {
      const paths = extractStoragePaths(existing.content || '', existing.attachments || [])
      if (paths.size > 0) {
        await supabase.storage.from('attachments').remove([...paths])
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('News delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
