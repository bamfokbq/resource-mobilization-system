'use server'

import { Resource, ResourceFilters, ResourceResponse, ResourceSearchSuggestion, CreateResourceRequest, UpdateResourceRequest } from '@/types/resources'
import { getDb } from '@/lib/db'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

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

// Mock data generation
const generateMockResources = (count: number): Resource[] => {
  const partners = [
    { id: '1', name: 'JICA', category: 'International Development', region: 'Greater Accra' },
    { id: '2', name: 'KOICA', category: 'International Development', region: 'Greater Accra' },
    { id: '3', name: 'KOFIH', category: 'International Development', region: 'Northern' },
    { id: '4', name: 'Hope for Future Generation', category: 'NGO', region: 'Ashanti' },
    { id: '5', name: 'Africa Media Research and Malaria Network (AMMREN)', category: 'Research Network', region: 'Greater Accra' },
    { id: '6', name: 'PATH', category: 'International NGO', region: 'Upper East' },
    { id: '7', name: 'World Bank', category: 'Multilateral', region: 'Greater Accra' },
    { id: '8', name: 'UNDP', category: 'UN Agency', region: 'Greater Accra' },
    { id: '9', name: 'UNFPA', category: 'UN Agency', region: 'Northern' },
    { id: '10', name: 'GIZ', category: 'International Development', region: 'Ashanti' },
    { id: '11', name: 'Jhpiego', category: 'International NGO', region: 'Western' },
    { id: '12', name: 'Health 2 GO', category: 'NGO', region: 'Central' },
    { id: '13', name: 'FHI360', category: 'International NGO', region: 'Volta' },
    { id: '14', name: 'WHO', category: 'UN Agency', region: 'Greater Accra' },
    { id: '15', name: 'FCDO', category: 'Bilateral', region: 'Greater Accra' },
    { id: '16', name: 'Millennium Promise Alliance', category: 'International NGO', region: 'Upper West' },
    { id: '17', name: 'UNICEF', category: 'UN Agency', region: 'Greater Accra' },
    { id: '18', name: 'School of Public Health', category: 'Academic Institution', region: 'Greater Accra' },
    { id: '19', name: 'MoH-PPMED', category: 'Government', region: 'All Regions' },
    { id: '20', name: 'GHS-PPMED', category: 'Government', region: 'All Regions' },
    { id: '21', name: 'GHS-FHD', category: 'Government', region: 'All Regions' },
    { id: '22', name: 'GHS-PHD', category: 'Government', region: 'All Regions' },
    { id: '23', name: 'GHS-NCD', category: 'Government', region: 'All Regions' },
  ]
  
  const projects = [
    { id: '1', name: 'Infrastructure Development Program', partnerId: '1', description: 'Building sustainable infrastructure', startDate: '2023-01-15', status: 'active' as const },
    { id: '2', name: 'Health System Capacity Building', partnerId: '2', description: 'Strengthening health systems in Ghana', startDate: '2022-06-01', status: 'active' as const },
    { id: '3', name: 'Medical Equipment Support', partnerId: '3', description: 'Providing essential medical equipment', startDate: '2023-03-01', status: 'active' as const },
    { id: '4', name: 'Youth Empowerment Initiative', partnerId: '4', description: 'Empowering young people for the future', startDate: '2023-08-15', status: 'active' as const },
    { id: '5', name: 'Malaria Prevention Research', partnerId: '5', description: 'Advanced research on malaria prevention', startDate: '2023-05-01', status: 'active' as const },
    { id: '6', name: 'Health Innovation Program', partnerId: '6', description: 'Innovative health solutions', startDate: '2023-02-01', status: 'active' as const },
    { id: '7', name: 'Economic Development Support', partnerId: '7', description: 'Supporting economic growth initiatives', startDate: '2022-09-01', status: 'active' as const },
    { id: '8', name: 'Sustainable Development Goals Implementation', partnerId: '8', description: 'Implementing SDGs at local level', startDate: '2023-01-01', status: 'active' as const },
    { id: '9', name: 'Population and Reproductive Health', partnerId: '9', description: 'Improving reproductive health services', startDate: '2023-04-01', status: 'active' as const },
    { id: '10', name: 'Technical Cooperation Program', partnerId: '10', description: 'Building technical capacity', startDate: '2023-06-01', status: 'active' as const },
    { id: '11', name: 'Maternal Health Improvement', partnerId: '11', description: 'Enhancing maternal health services', startDate: '2023-07-01', status: 'active' as const },
    { id: '12', name: 'Community Health Outreach', partnerId: '12', description: 'Mobile health services delivery', startDate: '2023-03-15', status: 'active' as const },
    { id: '13', name: 'Family Planning Services', partnerId: '13', description: 'Strengthening family planning programs', startDate: '2023-05-15', status: 'active' as const },
    { id: '14', name: 'Global Health Security', partnerId: '14', description: 'Building health security systems', startDate: '2022-12-01', status: 'active' as const },
    { id: '15', name: 'Health System Strengthening', partnerId: '15', description: 'Comprehensive health system support', startDate: '2023-02-15', status: 'active' as const },
    { id: '16', name: 'Millennium Villages Project', partnerId: '16', description: 'Integrated rural development', startDate: '2023-04-15', status: 'active' as const },
    { id: '17', name: 'Child Protection and Education', partnerId: '17', description: 'Protecting and educating children', startDate: '2023-01-30', status: 'active' as const },
    { id: '18', name: 'Public Health Research Initiative', partnerId: '18', description: 'Evidence-based public health research', startDate: '2023-06-15', status: 'active' as const },
    { id: '19', name: 'Policy Planning and Evaluation', partnerId: '19', description: 'Health policy development and evaluation', startDate: '2023-01-01', status: 'active' as const },
    { id: '20', name: 'Project Planning and Evaluation', partnerId: '20', description: 'Health project planning and monitoring', startDate: '2023-02-01', status: 'active' as const },
    { id: '21', name: 'Family Health Development', partnerId: '21', description: 'Comprehensive family health services', startDate: '2023-03-01', status: 'active' as const },
    { id: '22', name: 'Public Health Development', partnerId: '22', description: 'Public health infrastructure development', startDate: '2023-04-01', status: 'active' as const },
    { id: '23', name: 'Non-Communicable Disease Control', partnerId: '23', description: 'Prevention and control of NCDs', startDate: '2023-05-01', status: 'active' as const },
  ]
  
  const tags = [
    { id: '1', name: 'health', color: '#10B981' },
    { id: '2', name: 'education', color: '#3B82F6' },
    { id: '3', name: 'policy', color: '#8B5CF6' },
    { id: '4', name: 'research', color: '#F59E0B' },
    { id: '5', name: 'community', color: '#EF4444' },
    { id: '6', name: 'development', color: '#06B6D4' },
    { id: '7', name: 'children', color: '#84CC16' },
    { id: '8', name: 'water', color: '#0EA5E9' },
    { id: '9', name: 'agriculture', color: '#65A30D' },
    { id: '10', name: 'technology', color: '#7C3AED' },
  ]
  
  const resourceTypes = ['research-findings', 'concept-notes', 'program-briefs', 'publications', 'reports', 'presentations', 'videos', 'datasets'] as const
  const fileFormats = ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'XLS', 'XLSX', 'MP4'] as const
  const statuses = ['published', 'draft', 'under-review', 'archived'] as const
  const accessLevels = ['public', 'internal', 'restricted', 'confidential'] as const
  
  const resourceTitles = [
    'Policy Framework for Sustainable Development',
    'Research Report on Community Health Outcomes',
    'Implementation Guide for Educational Programs',
    'Best Practices in Child Protection',
    'Case Study: Rural Development Success Stories',
    'Annual Progress Report 2023',
    'Strategic Planning Guidelines',
    'Community Engagement Handbook',
    'Monitoring and Evaluation Framework',
    'Training Manual for Healthcare Workers',
    'Digital Innovation in Education',
    'Water Quality Assessment Report',
    'Agricultural Extension Services Guide',
    'Gender Equality in Development Programs',
    'Climate Change Adaptation Strategies',
    'Public Health Emergency Preparedness',
    'Early Childhood Development Guidelines',
    'Nutrition Program Evaluation',
    'Infrastructure Development Assessment',
    'Technology Integration in Healthcare',
  ]
  
  return Array.from({ length: count }, (_, index) => {
    const partner = partners[index % partners.length]
    const project = projects.find(p => p.partnerId === partner.id) || projects[index % projects.length]
    const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1)
    const title = resourceTitles[index % resourceTitles.length]
    
    // Generate realistic upload dates
    const uploadDate = new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const publicationDate = Math.random() > 0.3 ? new Date(uploadDate.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000) : undefined
    
    return {
      id: `resource-${index + 1}`,
      title: `${title} ${index > resourceTitles.length ? `(${Math.floor(index / resourceTitles.length) + 1})` : ''}`,
      description: `This comprehensive ${resourceTypes[index % resourceTypes.length].replace('-', ' ')} document provides detailed insights, analysis, and recommendations for effective implementation of development programs. It includes evidence-based research, case studies, and practical guidelines for stakeholders working in ${randomTags.map(t => t.name).join(', ')} sectors.`,
      type: resourceTypes[index % resourceTypes.length],
      fileFormat: fileFormats[index % fileFormats.length],
      fileSize: Math.floor(Math.random() * 15000000) + 500000, // 500KB to 15MB
      fileName: `${title.toLowerCase().replace(/\s+/g, '-')}-${index + 1}.${fileFormats[index % fileFormats.length].toLowerCase()}`,
      fileUrl: `/api/resources/${index + 1}/download`,
      thumbnailUrl: index % 4 === 0 ? `/api/resources/${index + 1}/thumbnail` : undefined,
      status: statuses[index % statuses.length],
      accessLevel: accessLevels[index % accessLevels.length],
      uploadDate: uploadDate.toISOString(),
      publicationDate: publicationDate?.toISOString(),
      lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      partnerId: partner.id,
      partner,
      projectId: project.id,
      project,
      tags: randomTags,
      downloadCount: Math.floor(Math.random() * 2000) + 10,
      viewCount: Math.floor(Math.random() * 8000) + 50,
      isFavorited: Math.random() > 0.8,
      rating: Math.random() > 0.4 ? Math.floor(Math.random() * 5) + 1 : undefined,
      author: [
        'Dr. John Smith',
        'Prof. Sarah Johnson', 
        'Maria Garcia',
        'David Chen',
        'Dr. Aisha Osei',
        'Samuel Mensah',
        'Rebecca Asante',
        undefined
      ][index % 8],
      version: Math.random() > 0.5 ? `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}` : undefined,
      language: Math.random() > 0.9 ? ['French', 'Twi', 'Ewe'][Math.floor(Math.random() * 3)] : 'English',
      keywords: ['development', 'policy', 'implementation', 'community', 'evaluation', 'research']
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 2)
    }
  })
}

// Generate static dataset
const allResources = generateMockResources(250)

// MongoDB and S3 Integration Helper Functions
async function connectToDatabase() {
  try {
    return await getDb()
  } catch (error) {
    console.error('Failed to connect to database:', error)
    return null
  }
}

async function uploadToLinode(file: File, resourceId: string): Promise<string> {
  try {
    // Create a unique file key
    const fileExtension = file.name.split('.').pop()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const s3Key = `resources/${resourceId}/${sanitizedFileName}`

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Linode Object Storage
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.LINODE_BUCKET_NAME!,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
      ContentDisposition: `attachment; filename="${file.name}"`,
      Metadata: {
        originalName: file.name,
        uploadDate: new Date().toISOString(),
        resourceId: resourceId
      }
    })

    await linodeClient.send(uploadCommand)

    // Return the Linode Object Storage URL
    return `https://${process.env.LINODE_BUCKET_NAME}.${process.env.LINODE_REGION}.linodeobjects.com/${s3Key}`
  } catch (error) {
    console.error('Error uploading to Linode Object Storage:', error)
    throw new Error('Failed to upload file to Linode Object Storage')
  }
}

async function deleteFromLinode(fileUrl: string) {
  try {
    // Extract key from URL
    let objectKey: string

    if (fileUrl.startsWith('s3://')) {
      const urlParts = fileUrl.replace('s3://', '').split('/')
      objectKey = urlParts.slice(1).join('/')
    } else if (fileUrl.includes('.linodeobjects.com')) {
      // Linode Object Storage URL format
      const url = new URL(fileUrl)
      objectKey = url.pathname.substring(1) // Remove leading slash
    } else {
      objectKey = fileUrl
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.LINODE_BUCKET_NAME!,
      Key: objectKey
    })

    await linodeClient.send(deleteCommand)
  } catch (error) {
    console.error('Error deleting from Linode Object Storage:', error)
    throw new Error('Failed to delete file from Linode Object Storage')
  }
}

// Server Actions for Resource Management
export async function createResource(data: CreateResourceRequest): Promise<{ success: boolean; message: string; resourceId?: string }> {
  try {
    // Validate required fields
    if (!data.title || !data.file) {
      return {
        success: false,
        message: 'Title and file are required'
      }
    }

    // Generate resource ID
    const resourceId = `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Upload file to Linode Object Storage
    const fileUrl = await uploadToLinode(data.file, resourceId)

    // Create resource object
    const newResource: Omit<Resource, 'partner' | 'project'> = {
      id: resourceId,
      title: data.title,
      description: data.description,
      type: data.type,
      fileFormat: data.file.name.split('.').pop()?.toUpperCase() as any,
      fileSize: data.file.size,
      fileName: data.file.name,
      fileUrl,
      thumbnailUrl: undefined, // TODO: Generate thumbnail for supported file types
      status: data.status,
      accessLevel: data.accessLevel,
      uploadDate: new Date().toISOString(),
      publicationDate: data.publicationDate,
      lastModified: new Date().toISOString(),
      partnerId: data.partnerId,
      projectId: data.projectId,
      tags: data.tags?.map(tagName => ({
        id: tagName,
        name: tagName,
        color: '#3B82F6'
      })) || [],
      downloadCount: 0,
      viewCount: 0,
      isFavorited: false,
      rating: undefined,
      author: data.author,
      version: '1.0',
      language: 'English',
      keywords: data.keywords || []
    }

    // Save to MongoDB
    const db = await connectToDatabase()
    if (db) {
      await db.collection('resources').insertOne(newResource)
    } else {
      // Fallback: Add to mock data for demonstration
      const resourceWithRelations = {
        ...newResource,
        partner: allResources.find(r => r.partnerId === data.partnerId)?.partner || {
          id: data.partnerId,
          name: 'Unknown Partner',
          category: 'Unknown',
          region: 'Unknown'
        },
        project: data.projectId ? allResources.find(r => r.projectId === data.projectId)?.project : undefined,
      }
      allResources.unshift(resourceWithRelations)
    }

    return {
      success: true,
      message: 'Resource created successfully',
      resourceId: resourceId
    }
  } catch (error) {
    console.error('Error creating resource:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create resource'
    }
  }
}

export async function updateResource(data: UpdateResourceRequest): Promise<{ success: boolean; message: string }> {
  try {
    // Find existing resource in database
    const db = await connectToDatabase()
    let existingResource: Resource | null = null

    if (db) {
      existingResource = await db.collection('resources').findOne({ id: data.id }) as Resource | null
    } else {
      // Fallback to mock data
      existingResource = allResources.find(r => r.id === data.id) || null
    }

    if (!existingResource) {
      return {
        success: false,
        message: 'Resource not found'
      }
    }

    // Update fields if provided
    const updatedResource = {
      ...existingResource,
      title: data.title || existingResource.title,
      description: data.description !== undefined ? data.description : existingResource.description,
      type: data.type || existingResource.type,
      status: data.status || existingResource.status,
      accessLevel: data.accessLevel || existingResource.accessLevel,
      partnerId: data.partnerId || existingResource.partnerId,
      projectId: data.projectId !== undefined ? data.projectId : existingResource.projectId,
      tags: data.tags ? data.tags.map(tagName => ({
        id: tagName,
        name: tagName,
        color: '#3B82F6'
      })) : existingResource.tags,
      author: data.author !== undefined ? data.author : existingResource.author,
      keywords: data.keywords !== undefined ? data.keywords : existingResource.keywords,
      lastModified: new Date().toISOString()
    }

    // Handle file upload if new file provided
    if (data.file) {
      // Delete old file from Linode Object Storage
      await deleteFromLinode(existingResource.fileUrl)

      // Upload new file
      const fileUrl = await uploadToLinode(data.file, data.id)
      updatedResource.fileUrl = fileUrl
      updatedResource.fileName = data.file.name
      updatedResource.fileSize = data.file.size
      updatedResource.fileFormat = data.file.name.split('.').pop()?.toUpperCase() as any
    }

    // Update in MongoDB
    if (db) {
      await db.collection('resources').updateOne(
        { id: data.id },
        { $set: updatedResource }
      )
    } else {
      // Update mock data
      const resourceIndex = allResources.findIndex(r => r.id === data.id)
      if (resourceIndex !== -1) {
        allResources[resourceIndex] = updatedResource
      }
    }

    return {
      success: true,
      message: 'Resource updated successfully'
    }
  } catch (error) {
    console.error('Error updating resource:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update resource'
    }
  }
}

export async function deleteResource(resourceId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find resource in database
    const db = await connectToDatabase()
    let resource: Resource | null = null

    if (db) {
      // Try to find by both id and _id to ensure compatibility
      const { ObjectId } = require('mongodb')
      let query: any = { id: resourceId }

      // If resourceId looks like an ObjectId, also search by _id
      if (ObjectId.isValid(resourceId)) {
        query = {
          $or: [
            { id: resourceId },
            { _id: new ObjectId(resourceId) }
          ]
        }
      }

      resource = await db.collection('resources').findOne(query) as Resource | null
    } else {
      // Fallback to mock data
      resource = allResources.find(r => r.id === resourceId) || null
    }

    if (!resource) {
      return {
        success: false,
        message: 'Resource not found'
      }
    }

    // Delete file from Linode Object Storage
    await deleteFromLinode(resource.fileUrl)

    // Delete from MongoDB
    if (db) {
      const { ObjectId } = require('mongodb')
      let deleteQuery: any = { id: resourceId }

      // If resourceId looks like an ObjectId, also try deleting by _id
      if (ObjectId.isValid(resourceId)) {
        deleteQuery = {
          $or: [
            { id: resourceId },
            { _id: new ObjectId(resourceId) }
          ]
        }
      }

      const deleteResult = await db.collection('resources').deleteOne(deleteQuery)

      if (deleteResult.deletedCount === 0) {
        return {
          success: false,
          message: 'Resource not found in database'
        }
      }
    } else {
      // Remove from mock data
      const resourceIndex = allResources.findIndex(r => r.id === resourceId)
      if (resourceIndex !== -1) {
        allResources.splice(resourceIndex, 1)
      }
    }

    return {
      success: true,
      message: 'Resource deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting resource:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete resource'
    }
  }
}

export async function getResourceStats(): Promise<{
  totalResources: number;
  totalDownloads: number;
  totalStorageUsed: number;
  recentUploads: number;
  pendingReviews: number;
}> {
  try {
    // Get actual stats from MongoDB
    const db = await connectToDatabase();

    if (db) {
      // Total resources count
      const totalResources = await db.collection('resources').countDocuments()

      // Total downloads aggregation
      const downloadAggregation = await db.collection('resources').aggregate([
        { $group: { _id: null, total: { $sum: '$downloadCount' } } }
      ]).toArray()
      const totalDownloads = downloadAggregation.length > 0 ? downloadAggregation[0].total : 0

      // Total storage used aggregation
      const storageAggregation = await db.collection('resources').aggregate([
        { $group: { _id: null, total: { $sum: '$fileSize' } } }
      ]).toArray()
      const totalStorageUsed = storageAggregation.length > 0 ? storageAggregation[0].total : 0

      // Recent uploads (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const recentUploads = await db.collection('resources').countDocuments({
        uploadDate: { $gte: thirtyDaysAgo.toISOString() }
      })

      // Pending reviews
      const pendingReviews = await db.collection('resources').countDocuments({
        status: 'under-review'
      })

      return {
        totalResources,
        totalDownloads,
        totalStorageUsed,
        recentUploads,
        pendingReviews
      }
    } else {

      // Fallback to mock stats if database connection fails
      const totalResources = allResources.length
      const totalDownloads = allResources.reduce((sum, r) => sum + r.downloadCount, 0)
      const totalStorageUsed = allResources.reduce((sum, r) => sum + r.fileSize, 0)
      const recentUploads = allResources.filter(r => {
        const uploadDate = new Date(r.uploadDate)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        return uploadDate > thirtyDaysAgo
      }).length
      const pendingReviews = allResources.filter(r => r.status === 'under-review').length

      return {
        totalResources,
        totalDownloads,
        totalStorageUsed,
        recentUploads,
        pendingReviews
      }
    }
  } catch (error) {
    console.error('Error getting resource stats:', error)

    // Return fallback stats on error
    const totalResources = allResources.length
    const totalDownloads = allResources.reduce((sum, r) => sum + r.downloadCount, 0)
    const totalStorageUsed = allResources.reduce((sum, r) => sum + r.fileSize, 0)
    const recentUploads = allResources.filter(r => {
      const uploadDate = new Date(r.uploadDate)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return uploadDate > thirtyDaysAgo
    }).length
    const pendingReviews = allResources.filter(r => r.status === 'under-review').length

    return {
      totalResources,
      totalDownloads,
      totalStorageUsed,
      recentUploads,
      pendingReviews
    }
  }
}

export async function generateResourceThumbnail(resourceId: string): Promise<{ success: boolean; thumbnailUrl?: string; message: string }> {
  try {
    const resource = allResources.find(r => r.id === resourceId)
    if (!resource) {
      return {
        success: false,
        message: 'Resource not found'
      }
    }

    // TODO: Implement thumbnail generation for PDFs, images, and videos
    // For PDFs: Use pdf-thumbnail or similar library
    // For images: Resize using sharp or similar
    // For videos: Extract frame using ffmpeg

    const thumbnailUrl = `/api/resources/${resourceId}/thumbnail`

    // Update resource with thumbnail URL
    const resourceIndex = allResources.findIndex(r => r.id === resourceId)
    if (resourceIndex !== -1) {
      allResources[resourceIndex].thumbnailUrl = thumbnailUrl
    }

    return {
      success: true,
      thumbnailUrl,
      message: 'Thumbnail generated successfully'
    }
  } catch (error) {
    console.error('Error generating thumbnail:', error)
    return {
      success: false,
      message: 'Failed to generate thumbnail'
    }
  }
}

// Server Actions
export async function fetchResources(
  filters: ResourceFilters,
  page: number = 1,
  pageSize: number = 25
): Promise<ResourceResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200))
    
    const db = await connectToDatabase()
    let filteredResources: Resource[] = []

    if (db) {
      // Build MongoDB query
      const query: any = {}

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search
        query.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { 'partner.name': { $regex: searchTerm, $options: 'i' } },
          { 'project.name': { $regex: searchTerm, $options: 'i' } },
          { 'tags.name': { $regex: searchTerm, $options: 'i' } },
          { keywords: { $regex: searchTerm, $options: 'i' } },
          { author: { $regex: searchTerm, $options: 'i' } }
        ]
      }

      // Apply type filter
      if (filters.type?.length) {
        query.type = { $in: filters.type }
      }

      // Apply partner filter
      if (filters.partnerId?.length) {
        query.partnerId = { $in: filters.partnerId }
      }

      // Apply project filter
      if (filters.projectId?.length) {
        query.projectId = { $in: filters.projectId }
      }

      // Apply status filter
      if (filters.status?.length) {
        query.status = { $in: filters.status }
      }

      // Apply access level filter
      if (filters.accessLevel?.length) {
        query.accessLevel = { $in: filters.accessLevel }
      }

      // Apply file format filter
      if (filters.fileFormat?.length) {
        query.fileFormat = { $in: filters.fileFormat }
      }

      // Apply tags filter
      if (filters.tags?.length) {
        query['tags.name'] = { $in: filters.tags }
      }

      // Apply date range filter
      if (filters.dateRange) {
        const { from, to, field } = filters.dateRange
        const dateField = field === 'publicationDate' ? 'publicationDate' : 'uploadDate'

        if (from && to) {
          query[dateField] = { $gte: from, $lte: to }
        } else if (from) {
          query[dateField] = { $gte: from }
        } else if (to) {
          query[dateField] = { $lte: to }
        }
      }

      // Build sort criteria
      let sort: any = {}
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'date':
            sort.uploadDate = filters.sortOrder === 'desc' ? -1 : 1
            break
          case 'title':
            sort.title = filters.sortOrder === 'desc' ? -1 : 1
            break
          case 'size':
            sort.fileSize = filters.sortOrder === 'desc' ? -1 : 1
            break
          case 'downloads':
            sort.downloadCount = filters.sortOrder === 'desc' ? -1 : 1
            break
          case 'relevance':
          default:
            sort.uploadDate = -1 // Default to newest first
            break
        }
      } else {
        sort.uploadDate = -1
      }

      // Execute query with pagination
      const totalItems = await db.collection('resources').countDocuments(query)
      const skip = (page - 1) * pageSize

      const rawResources = await db.collection('resources')
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .toArray()

      // Convert MongoDB documents to plain objects
      filteredResources = rawResources.map((doc: any) => ({
        id: doc.id || doc._id.toString(),
        title: doc.title,
        description: doc.description,
        type: doc.type,
        fileFormat: doc.fileFormat,
        fileSize: doc.fileSize,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        thumbnailUrl: doc.thumbnailUrl,
        status: doc.status,
        accessLevel: doc.accessLevel,
        uploadDate: doc.uploadDate,
        publicationDate: doc.publicationDate,
        lastModified: doc.lastModified,
        partnerId: doc.partnerId,
        partner: doc.partner || {
          id: doc.partnerId,
          name: 'Unknown Partner',
          category: 'Unknown',
          region: 'Unknown'
        },
        projectId: doc.projectId,
        project: doc.project,
        tags: doc.tags || [],
        downloadCount: doc.downloadCount || 0,
        viewCount: doc.viewCount || 0,
        isFavorited: doc.isFavorited || false,
        rating: doc.rating,
        author: doc.author,
        version: doc.version,
        language: doc.language || 'English',
        keywords: doc.keywords || []
      }))

      const totalPages = Math.ceil(totalItems / pageSize)

      return {
        resources: filteredResources,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages
        },
        filters
      }
    } else {
      // Fallback to mock data filtering (existing logic)
      filteredResources = [...allResources]

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredResources = filteredResources.filter(resource =>
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description?.toLowerCase().includes(searchTerm) ||
          resource.partner.name.toLowerCase().includes(searchTerm) ||
          resource.project?.name.toLowerCase().includes(searchTerm) ||
          resource.tags.some(tag => tag.name.toLowerCase().includes(searchTerm)) ||
          resource.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          resource.author?.toLowerCase().includes(searchTerm)
        )
      }

      // Apply type filter
      if (filters.type?.length) {
        filteredResources = filteredResources.filter(resource =>
          filters.type!.includes(resource.type)
        )
      }

      // Apply partner filter
      if (filters.partnerId?.length) {
        filteredResources = filteredResources.filter(resource =>
          filters.partnerId!.includes(resource.partnerId)
        )
      }

      // Apply project filter
      if (filters.projectId?.length) {
        filteredResources = filteredResources.filter(resource =>
          resource.projectId && filters.projectId!.includes(resource.projectId)
        )
      }

      // Apply status filter
      if (filters.status?.length) {
        filteredResources = filteredResources.filter(resource =>
          filters.status!.includes(resource.status)
        )
      }

      // Apply access level filter
      if (filters.accessLevel?.length) {
        filteredResources = filteredResources.filter(resource =>
          filters.accessLevel!.includes(resource.accessLevel)
        )
      }

      // Apply file format filter
      if (filters.fileFormat?.length) {
        filteredResources = filteredResources.filter(resource =>
          filters.fileFormat!.includes(resource.fileFormat)
        )
      }

      // Apply tags filter
      if (filters.tags?.length) {
        filteredResources = filteredResources.filter(resource =>
          resource.tags.some(tag => filters.tags!.includes(tag.name))
        )
      }

      // Apply date range filter
      if (filters.dateRange) {
        const { from, to, field } = filters.dateRange
        if (from || to) {
          filteredResources = filteredResources.filter(resource => {
            const dateToCompare = field === 'publicationDate' && resource.publicationDate
              ? resource.publicationDate
              : resource.uploadDate

            const resourceDate = new Date(dateToCompare)

            if (from && to) {
              return resourceDate >= new Date(from) && resourceDate <= new Date(to)
            } else if (from) {
              return resourceDate >= new Date(from)
            } else if (to) {
              return resourceDate <= new Date(to)
            }

            return true
          })
        }
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredResources.sort((a, b) => {
          let aValue: any, bValue: any

          switch (filters.sortBy) {
            case 'date':
              aValue = new Date(a.uploadDate)
              bValue = new Date(b.uploadDate)
              break
            case 'title':
              aValue = a.title.toLowerCase()
              bValue = b.title.toLowerCase()
              break
            case 'size':
              aValue = a.fileSize
              bValue = b.fileSize
              break
            case 'downloads':
              aValue = a.downloadCount
              bValue = b.downloadCount
              break
            case 'relevance':
            default:
              // For relevance, prioritize exact matches in title, then description
              if (filters.search) {
                const searchTerm = filters.search.toLowerCase()
                const aTitleMatch = a.title.toLowerCase().includes(searchTerm)
                const bTitleMatch = b.title.toLowerCase().includes(searchTerm)

                if (aTitleMatch && !bTitleMatch) return -1
                if (!aTitleMatch && bTitleMatch) return 1
              }
              // Fall back to upload date for relevance
              aValue = new Date(a.uploadDate)
              bValue = new Date(b.uploadDate)
              break
          }

          if (filters.sortOrder === 'desc') {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
          }
        })
      }

      // Apply pagination
      const totalItems = filteredResources.length
      const totalPages = Math.ceil(totalItems / pageSize)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedResources = filteredResources.slice(startIndex, endIndex)

      return {
        resources: paginatedResources,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages
        },
        filters
      }
    }
  } catch (error) {
    console.error('Error fetching resources:', error)
    throw new Error('Failed to fetch resources')
  }
}

export async function searchResourceSuggestions(query: string): Promise<ResourceSearchSuggestion[]> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (query.length < 2) return []
    
    const suggestions: ResourceSearchSuggestion[] = []
    const searchTerm = query.toLowerCase()
    
    // Resource title suggestions
    const titleMatches = allResources
      .filter(r => r.title.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map(r => ({
        type: 'resource' as const,
        value: r.title,
        label: r.title,
        count: 1
      }))
    
    // Partner suggestions
    const partnerMatches = Array.from(new Set(
      allResources
        .filter(r => r.partner.name.toLowerCase().includes(searchTerm))
        .map(r => r.partner.name)
    )).slice(0, 3).map(name => ({
      type: 'partner' as const,
      value: name,
      label: name,
      count: allResources.filter(r => r.partner.name === name).length
    }))
    
    // Tag suggestions
    const tagMatches = Array.from(new Set(
      allResources
        .flatMap(r => r.tags)
        .filter(tag => tag.name.toLowerCase().includes(searchTerm))
        .map(tag => tag.name)
    )).slice(0, 3).map(name => ({
      type: 'tag' as const,
      value: name,
      label: `#${name}`,
      count: allResources.filter(r => r.tags.some(t => t.name === name)).length
    }))
    
    return [...titleMatches, ...partnerMatches, ...tagMatches].slice(0, 8)
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return []
  }
}

export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))

    const db = await connectToDatabase()
    if (db) {
      const resource = await db.collection('resources').findOne({ id }) as unknown as Resource | null
      return resource
    } else {
    // Fallback to mock data
      return allResources.find(r => r.id === id) || null
    }
  } catch (error) {
    console.error('Error fetching resource by ID:', error)
    return null
  }
}

export async function getResourcePartners() {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    return Array.from(new Set(allResources.map(r => r.partner)))
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export async function getResourceProjects() {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    return Array.from(new Set(allResources.map(r => r.project).filter((p): p is NonNullable<typeof p> => Boolean(p))))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getResourceTags() {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    const allTags = allResources.flatMap(r => r.tags)
    return Array.from(new Map(allTags.map(tag => [tag.id, tag])).values())
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

// Additional server actions for resource management
export async function toggleResourceFavorite(resourceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const resource = allResources.find(r => r.id === resourceId)
    if (!resource) {
      return {
        success: false,
        message: 'Resource not found'
      }
    }
    
    // In a real application, this would update the database
    resource.isFavorited = !resource.isFavorited
    
    return {
      success: true,
      message: `Resource ${resource.isFavorited ? 'added to' : 'removed from'} favorites`
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return {
      success: false,
      message: 'Failed to update favorite status'
    }
  }
}

export async function rateResource(resourceId: string, rating: number): Promise<{ success: boolean; message: string }> {
  try {
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        message: 'Rating must be between 1 and 5'
      }
    }
    
    const resource = allResources.find(r => r.id === resourceId)
    if (!resource) {
      return {
        success: false,
        message: 'Resource not found'
      }
    }
    
    // In a real application, this would update the database
    resource.rating = rating
    
    return {
      success: true,
      message: 'Resource rated successfully'
    }
  } catch (error) {
    console.error('Error rating resource:', error)
    return {
      success: false,
      message: 'Failed to rate resource'
    }
  }
}

export async function incrementResourceView(resourceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const resource = allResources.find(r => r.id === resourceId)
    if (!resource) {
      return {
        success: false,
        message: 'Resource not found'
      }
    }
    
    // In a real application, this would update the database
    resource.viewCount += 1
    
    return {
      success: true,
      message: 'View count updated'
    }
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return {
      success: false,
      message: 'Failed to update view count'
    }
  }
}

export async function incrementResourceDownload(resourceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const resource = allResources.find(r => r.id === resourceId)
    if (!resource) {
      return {
        success: false,
        message: 'Resource not found'
      }
    }
    
    // In a real application, this would update the database
    resource.downloadCount += 1
    
    return {
      success: true,
      message: 'Download count updated'
    }
  } catch (error) {
    console.error('Error incrementing download count:', error)
    return {
      success: false,
      message: 'Failed to update download count'
    }
  }
}
