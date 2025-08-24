'use server'

import { Resource, ResourceFilters, ResourceResponse, ResourceSearchSuggestion } from '@/types/resources'

// Mock data generation
const generateMockResources = (count: number): Resource[] => {
  const partners = [
    { id: '1', name: 'UNICEF Ghana', category: 'International NGO', region: 'Greater Accra' },
    { id: '2', name: 'WHO Ghana', category: 'Multilateral', region: 'Greater Accra' },
    { id: '3', name: 'Ghana Health Service', category: 'Government', region: 'All Regions' },
    { id: '4', name: 'Plan International', category: 'International NGO', region: 'Northern' },
    { id: '5', name: 'Oxfam Ghana', category: 'International NGO', region: 'Upper East' },
    { id: '6', name: 'World Vision Ghana', category: 'International NGO', region: 'Ashanti' },
  ]
  
  const projects = [
    { id: '1', name: 'Education Reform Initiative', partnerId: '1', description: 'Comprehensive education system reform', startDate: '2023-01-15', status: 'active' as const },
    { id: '2', name: 'Health System Strengthening', partnerId: '2', description: 'Building resilient health systems', startDate: '2022-06-01', status: 'active' as const },
    { id: '3', name: 'Community Development Program', partnerId: '3', description: 'Grassroots community development', startDate: '2023-03-01', status: 'completed' as const },
    { id: '4', name: 'Child Protection Project', partnerId: '4', description: 'Protecting vulnerable children', startDate: '2023-08-15', status: 'active' as const },
    { id: '5', name: 'Water and Sanitation Program', partnerId: '5', description: 'Improving access to clean water', startDate: '2023-05-01', status: 'active' as const },
    { id: '6', name: 'Agricultural Development Initiative', partnerId: '6', description: 'Sustainable farming practices', startDate: '2023-02-01', status: 'active' as const },
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

// Server Actions
export async function fetchResources(
  filters: ResourceFilters,
  page: number = 1,
  pageSize: number = 25
): Promise<ResourceResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200))
    
    let filteredResources = [...allResources]
    
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
    return allResources.find(r => r.id === id) || null
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
