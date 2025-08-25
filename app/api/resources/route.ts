import { NextRequest, NextResponse } from 'next/server'
import { createResource } from '@/actions/resources'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as any
    const status = formData.get('status') as any
    const accessLevel = formData.get('accessLevel') as any
    const partnerId = formData.get('partnerId') as string
    const projectId = formData.get('projectId') as string
    const author = formData.get('author') as string
    const file = formData.get('file') as File
    const keywords = formData.get('keywords') as string
    const tags = formData.get('tags') as string

    // Validate required fields
    if (!title || !file) {
      return NextResponse.json(
        { error: 'Title and file are required' },
        { status: 400 }
      )
    }

    // Parse keywords and tags
    const parsedKeywords = keywords ? keywords.split(',').map(k => k.trim()) : []
    const parsedTags = tags ? tags.split(',').map(t => t.trim()) : []

    const result = await createResource({
      title,
      description: description || undefined,
      type,
      status,
      accessLevel,
      partnerId,
      projectId: projectId || undefined,
      author: author || undefined,
      file,
      keywords: parsedKeywords,
      tags: parsedTags
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      resourceId: result.resourceId,
      shouldRefreshStats: true // Signal client to refresh stats for new resource
    })
  } catch (error) {
    console.error('Error uploading resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
