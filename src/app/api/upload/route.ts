import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

// POST /api/upload - Upload a file to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const ticketId = formData.get('ticket_id') as string | null
    const messageId = formData.get('message_id') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomId}.${ext}`

    // Create path based on context
    let path = 'general'
    if (ticketId) {
      path = `tickets/${ticketId}`
    }
    if (messageId) {
      path = `messages/${messageId}`
    }

    const fullPath = `${path}/${filename}`

    // Convert File to ArrayBuffer then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(fullPath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      // Check if it's a bucket not found error
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json(
          { error: 'Storage not configured. Please create an "attachments" bucket in Supabase Storage.' },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(data.path)

    // Store attachment record in database
    const { data: attachment, error: dbError } = await supabase
      .from('attachments')
      .insert({
        filename: file.name,
        storage_path: data.path,
        url: urlData.publicUrl,
        mime_type: file.type,
        size: file.size,
        ticket_id: ticketId || null,
        message_id: messageId || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Still return success since file was uploaded
      return NextResponse.json({
        success: true,
        attachment: {
          filename: file.name,
          url: urlData.publicUrl,
          size: file.size,
          mime_type: file.type,
        }
      })
    }

    return NextResponse.json({
      success: true,
      attachment,
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
