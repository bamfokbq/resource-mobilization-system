export type ResourceType = 
  | 'research-findings'
  | 'concept-notes'
  | 'program-briefs'
  | 'publications'
  | 'reports'
  | 'presentations'
  | 'videos'
  | 'datasets'

export type FileFormat = 
  | 'PDF'
  | 'DOC'
  | 'DOCX'
  | 'PPT'
  | 'PPTX'
  | 'XLS'
  | 'XLSX'
  | 'MP4'
  | 'AVI'
  | 'MOV'
  | 'CSV'
  | 'JSON'

export type ResourceStatus = 
  | 'draft'
  | 'published'
  | 'under-review'
  | 'archived'

export type AccessLevel = 
  | 'public'
  | 'internal'
  | 'restricted'
  | 'confidential'

export interface ResourceTag {
  id: string
  name: string
  color: string
}

export interface ResourcePartner {
  id: string
  name: string
  category: string
  region?: string
}

export interface ResourceProject {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: 'active' | 'completed' | 'planned'
  partnerId: string
}

export interface Resource {
  id: string
  title: string
  description?: string
  type: ResourceType
  fileFormat: FileFormat
  fileSize: number
  fileName: string
  fileUrl: string
  thumbnailUrl?: string
  
  // Meta information
  status: ResourceStatus
  accessLevel: AccessLevel
  uploadDate: string
  publicationDate?: string
  lastModified: string
  
  // Relationships
  partnerId: string
  partner: ResourcePartner
  projectId?: string
  project?: ResourceProject
  
  // Content metadata
  tags: ResourceTag[]
  content?: string // For full-text search
  
  // User interactions
  downloadCount: number
  viewCount: number
  isFavorited?: boolean
  rating?: number
  
  // Additional metadata
  author?: string
  version?: string
  language?: string
  keywords?: string[]
}

export interface ResourceFilters {
  search?: string
  type?: ResourceType[]
  partnerId?: string[]
  projectId?: string[]
  status?: ResourceStatus[]
  accessLevel?: AccessLevel[]
  fileFormat?: FileFormat[]
  tags?: string[]
  dateRange?: {
    from: string
    to: string
    field: 'uploadDate' | 'publicationDate'
  }
  sortBy?: 'relevance' | 'date' | 'title' | 'size' | 'downloads'
  sortOrder?: 'asc' | 'desc'
}

export interface ResourcePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ResourceResponse {
  resources: Resource[]
  pagination: ResourcePagination
  filters: ResourceFilters
}

export interface ResourceSearchSuggestion {
  type: 'resource' | 'partner' | 'project' | 'tag'
  value: string
  label: string
  count?: number
}

export interface ResourceStats {
  totalResources: number
  totalDownloads: number
  totalPartners: number
  totalProjects: number
  recentUploads: number
  popularResources: Resource[]
  trendingTags: ResourceTag[]
}

// UI State types
export interface ResourceGridView {
  layout: 'grid' | 'list'
  columns: 1 | 2 | 3 | 4
  showThumbnails: boolean
  compactMode: boolean
}

export interface ResourceUIState {
  isLoading: boolean
  error?: string
  selectedResources: string[]
  gridView: ResourceGridView
  activeFilters: ResourceFilters
  searchHistory: string[]
  savedSearches: Array<{
    id: string
    name: string
    filters: ResourceFilters
  }>
}

// API types
export interface CreateResourceRequest {
  title: string
  description?: string
  type: ResourceType
  file: File
  partnerId: string
  projectId?: string
  tags: string[]
  status: ResourceStatus
  accessLevel: AccessLevel
  publicationDate?: string
  author?: string
  keywords?: string[]
}

export interface UpdateResourceRequest extends Partial<CreateResourceRequest> {
  id: string
}

export interface ResourceAnalytics {
  resourceId: string
  views: Array<{
    date: string
    count: number
  }>
  downloads: Array<{
    date: string
    count: number
    userId?: string
  }>
  searchQueries: Array<{
    query: string
    count: number
  }>
  popularTags: Array<{
    tag: string
    count: number
  }>
}
