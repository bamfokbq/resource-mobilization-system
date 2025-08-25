'use client'

import { useState } from 'react'
import { 
  Download, 
  ExternalLink, 
  Eye, 
  Heart, 
  MoreVertical, 
  Share2, 
  Bookmark,
  Calendar,
  User,
  Building,
  Tag,
  FileText,
  File,
  FileVideo,
  FileSpreadsheet,
  FileImage
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Resource, FileFormat } from '@/types/resources'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ResourceCardProps {
  resource: Resource
  onView: (resource: Resource) => void
  onDownload: (resource: Resource) => void
  onFavorite: (resource: Resource) => void
  onShare: (resource: Resource) => void
  className?: string
}

// File type icon mapping
const getFileIcon = (format: FileFormat) => {
  switch (format) {
    case 'PDF':
      return <FileText className="h-5 w-5 text-red-500" />
    case 'DOC':
    case 'DOCX':
      return <FileText className="h-5 w-5 text-blue-500" />
    case 'PPT':
    case 'PPTX':
      return <FileText className="h-5 w-5 text-orange-500" />
    case 'XLS':
    case 'XLSX':
    case 'CSV':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case 'MP4':
    case 'AVI':
    case 'MOV':
      return <FileVideo className="h-5 w-5 text-purple-500" />
    case 'JSON':
      return <File className="h-5 w-5 text-gray-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'under-review':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'archived':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Get access level color
const getAccessLevelColor = (level: string) => {
  switch (level) {
    case 'public':
      return 'bg-green-100 text-green-800'
    case 'internal':
      return 'bg-blue-100 text-blue-800'
    case 'restricted':
      return 'bg-orange-100 text-orange-800'
    case 'confidential':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function ResourceCard({ 
  resource, 
  onView, 
  onDownload, 
  onFavorite, 
  onShare,
  className 
}: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onView(resource)}
      >
        {/* Thumbnail/Preview */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          {resource.thumbnailUrl ? (
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              {getFileIcon(resource.fileFormat)}
              <span className="text-2xl font-bold text-gray-400">
                {resource.fileFormat}
              </span>
            </div>
          )}
          
          {/* Overlay Actions */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onView(resource)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Resource</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownload(resource)
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onShare(resource)
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
            </div>
          )}
          
          {/* Status Badge */}
          <Badge 
            className={cn(
              "absolute top-2 left-2 text-xs",
              getStatusColor(resource.status)
            )}
          >
            {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
          </Badge>
          
          {/* Access Level Badge */}
          <Badge 
            className={cn(
              "absolute top-2 right-2 text-xs",
              getAccessLevelColor(resource.accessLevel)
            )}
          >
            {resource.accessLevel.charAt(0).toUpperCase() + resource.accessLevel.slice(1)}
          </Badge>
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-semibold text-lg text-gray-900 truncate leading-tight">
                    {resource.title}
                  </h3>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  {resource.title}
                </TooltipContent>
              </Tooltip>
              
              {resource.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {resource.description}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(resource)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(resource)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(resource)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onFavorite(resource)}>
                  <Heart className={cn(
                    "h-4 w-4 mr-2",
                    resource.isFavorited ? "fill-red-500 text-red-500" : ""
                  )} />
                  {resource.isFavorited ? 'Remove from' : 'Add to'} Favorites
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          {/* Resource Type & Format */}
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline" className="text-xs">
              {resource.type.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Badge>
            <span className="text-gray-500 text-xs">
              {formatFileSize(resource.fileSize)}
            </span>
          </div>
          
          {/* Partner & Project */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-700 truncate">
                    {resource.partner.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{resource.partner.name}</TooltipContent>
              </Tooltip>
            </div>
            
            {resource.project && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-gray-700 truncate">
                      {resource.project.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{resource.project.name}</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                >
                  #{tag.name}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Upload Date & Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(resource.uploadDate), 'MMM dd, yyyy')}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {resource.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {resource.downloadCount}
              </span>
            </div>
          </div>
          
          {/* Author */}
          {resource.author && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>by {resource.author}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
