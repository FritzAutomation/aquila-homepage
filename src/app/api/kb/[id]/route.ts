import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/kb-utils'

// GET /api/kb/[id] - Get single article by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Try by UUID first, then by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    let query = supabase
      .from('kb_articles')
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

    // If not published, check authentication
    if (!article.is_published) {
      const authClient = await createServerClient()
      const { data: { user } } = await authClient.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('KB get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Extract storage paths from content and attachments that point to our Supabase Storage bucket.
 * URL format: https://<project>.supabase.co/storage/v1/object/public/attachments/<path>
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

// PATCH /api/kb/[id] - Update article (admin only)
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
    const { title, content, excerpt, category, product, is_published, sort_order, attachments } = body

    const supabase = createAdminClient()

    // Fetch the current article to diff storage references
    const { data: existing } = await supabase
      .from('kb_articles')
      .select('content, attachments')
      .eq('id', id)
      .single()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (title !== undefined) {
      updateData.title = title
      updateData.slug = generateSlug(title)
    }
    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (category !== undefined) updateData.category = category
    if (product !== undefined) updateData.product = product
    if (is_published !== undefined) updateData.is_published = is_published
    if (sort_order !== undefined) updateData.sort_order = sort_order
    if (attachments !== undefined) updateData.attachments = attachments

    const { data: article, error } = await supabase
      .from('kb_articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An article with this title already exists' }, { status: 409 })
      }
      console.error('Error updating article:', error)
      return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
    }

    // Clean up removed files from Supabase Storage
    if (existing) {
      const oldPaths = extractStoragePaths(existing.content || '', existing.attachments || [])
      const newPaths = extractStoragePaths(
        content !== undefined ? content : existing.content || '',
        attachments !== undefined ? attachments : existing.attachments || []
      )
      const removedPaths = [...oldPaths].filter(p => !newPaths.has(p))
      if (removedPaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('attachments')
          .remove(removedPaths)
        if (storageError) {
          console.error('Storage cleanup error:', storageError)
        }
      }
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('KB update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/kb/[id] - Delete article (admin only)
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

    // Fetch article content before deleting so we can clean up storage
    const { data: existing } = await supabase
      .from('kb_articles')
      .select('content, attachments')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('kb_articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting article:', error)
      return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
    }

    // Clean up all storage files referenced by the deleted article
    if (existing) {
      const paths = extractStoragePaths(existing.content || '', existing.attachments || [])
      if (paths.size > 0) {
        const { error: storageError } = await supabase.storage
          .from('attachments')
          .remove([...paths])
        if (storageError) {
          console.error('Storage cleanup error:', storageError)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('KB delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
