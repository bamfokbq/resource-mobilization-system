import { NextRequest, NextResponse } from 'next/server'
import { getResourceById, incrementResourceDownload } from '@/actions/resources'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize Linode Object Storage client
const linodeClient = new S3Client({
  region: process.env.LINODE_REGION!,
  endpoint: `https://${process.env.LINODE_REGION}.linodeobjects.com`,
  credentials: {
    accessKeyId: process.env.LINODE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.LINODE_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: false, // Linode supports virtual-hosted-style requests
})

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

    // Increment download count
    await incrementResourceDownload(id)

    // Extract object key from the file URL
    // Assuming fileUrl is in format: https://bucket-name.region.linodeobjects.com/path/to/file.ext
    // or s3://bucket-name/path/to/file.ext
    let objectKey: string
    
    if (resource.fileUrl.startsWith('s3://')) {
      // Direct S3 URL format: s3://bucket-name/path/to/file.ext
      const urlParts = resource.fileUrl.replace('s3://', '').split('/')
      objectKey = urlParts.slice(1).join('/')
    } else if (resource.fileUrl.includes('.linodeobjects.com')) {
      // Linode Object Storage URL format: https://bucket-name.region.linodeobjects.com/path/to/file.ext
      const url = new URL(resource.fileUrl)
      objectKey = url.pathname.substring(1) // Remove leading slash
    } else {
      // Fallback: assume it's already a key or relative path
      objectKey = resource.fileUrl
    }

    // Generate signed URL for secure download
    const command = new GetObjectCommand({
      Bucket: process.env.LINODE_BUCKET_NAME!,
      Key: objectKey,
      ResponseContentDisposition: `attachment; filename="${resource.fileName}"`,
    })

    const signedUrl = await getSignedUrl(linodeClient, command, {
      expiresIn: 300, // 5 minutes
    })

    // Return the signed URL for download
    return NextResponse.json({
      fileName: resource.fileName,
      fileSize: resource.fileSize,
      fileFormat: resource.fileFormat,
      downloadUrl: signedUrl,
      expiresIn: 300,
      message: 'Download URL generated successfully'
    })
  } catch (error) {
    console.error('Error generating download URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    )
  }
}
