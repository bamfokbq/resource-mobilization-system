import { NextRequest, NextResponse } from 'next/server'
import { getResourceById, updateResource, deleteResource } from '@/actions/resources'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const resource = await getResourceById(id)
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as any
    const status = formData.get('status') as any
    const accessLevel = formData.get('accessLevel') as any
    const partnerId = formData.get('partnerId') as string
    const projectId = formData.get('projectId') as string
    const author = formData.get('author') as string
    const file = formData.get('file') as File | null
    const keywords = formData.get('keywords') as string
    const tags = formData.get('tags') as string

    // Parse keywords and tags
    const parsedKeywords = keywords ? keywords.split(',').map(k => k.trim()) : undefined
    const parsedTags = tags ? tags.split(',').map(t => t.trim()) : undefined

    const result = await updateResource({
      id: id,
      title: title || undefined,
      description: description || undefined,
      type: type || undefined,
      status: status || undefined,
      accessLevel: accessLevel || undefined,
      partnerId: partnerId || undefined,
      projectId: projectId || undefined,
      author: author || undefined,
      file: file || undefined,
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
      message: result.message
      // No shouldRefreshStats - updates don't affect stats
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteResource(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      shouldRefreshStats: true // Signal client to refresh stats after deletion
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
