'use client'

import { useState } from 'react'
import { X, Download, Share2, ExternalLink, Calendar, Building, User, Tag, Eye, Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Resource } from '@/types/resources'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ResourceModalProps {
  resource: Resource | null
  isOpen: boolean
  onClose: () => void
  onDownload: (resource: Resource) => void
  onShare: (resource: Resource) => void
  onFavorite: (resource: Resource) => void
}

export function ResourceModal({ 
  resource, 
  isOpen, 
  onClose, 
  onDownload, 
  onShare, 
  onFavorite 
}: ResourceModalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  
  if (!resource) return null
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }
  
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold pr-8">
            {resource.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="space-y-6 pr-4">
            {/* Resource Preview */}
            <div className="relative">
              {resource.thumbnailUrl ? (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-300",
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-gray-400 mb-2">{resource.fileFormat}</div>
                    <div className="text-sm text-gray-500">No preview available</div>
                  </div>
                </div>
              )}
              
              {/* Status and Access Level Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={cn("text-xs", getStatusColor(resource.status))}>
                  {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                </Badge>
                <Badge className={cn("text-xs", getAccessLevelColor(resource.accessLevel))}>
                  {resource.accessLevel.charAt(0).toUpperCase() + resource.accessLevel.slice(1)}
                </Badge>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => onDownload(resource)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download ({formatFileSize(resource.fileSize)})
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => onShare(resource)}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => onFavorite(resource)}
                className={cn(
                  "flex items-center gap-2",
                  resource.isFavorited && "bg-red-50 text-red-600 border-red-200"
                )}
              >
                <Heart className={cn(
                  "h-4 w-4",
                  resource.isFavorited && "fill-current"
                )} />
                {resource.isFavorited ? 'Unfavorite' : 'Favorite'}
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
            </div>
            
            {/* Description */}
            {resource.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{resource.description}</p>
              </div>
            )}
            
            <Separator />
            
            {/* Resource Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Resource Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{resource.partner.name}</div>
                      <div className="text-sm text-gray-500">{resource.partner.category}</div>
                    </div>
                  </div>
                  
                  {resource.project && (
                    <div className="flex items-start gap-3">
                      <ExternalLink className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">{resource.project.name}</div>
                        <div className="text-sm text-gray-500">
                          {resource.project.status === 'active' ? 'Active Project' : 
                           resource.project.status === 'completed' ? 'Completed Project' : 
                           'Planned Project'}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {resource.author && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Author</div>
                        <div className="text-sm text-gray-500">{resource.author}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Upload Date</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(resource.uploadDate), 'MMMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  {resource.publicationDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">Publication Date</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(resource.publicationDate), 'MMMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Resource Type</div>
                    <Badge variant="outline">
                      {resource.type.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900 mb-1">File Format</div>
                    <Badge variant="outline">{resource.fileFormat}</Badge>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900 mb-1">File Size</div>
                    <div className="text-sm text-gray-700">{formatFileSize(resource.fileSize)}</div>
                  </div>
                  
                  {resource.version && (
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Version</div>
                      <div className="text-sm text-gray-700">{resource.version}</div>
                    </div>
                  )}
                  
                  {resource.language && (
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Language</div>
                      <div className="text-sm text-gray-700">{resource.language}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {resource.viewCount} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {resource.downloadCount} downloads
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            {resource.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                        style={{ 
                          backgroundColor: `${tag.color}20`, 
                          color: tag.color,
                          borderColor: `${tag.color}40`
                        }}
                      >
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* Keywords */}
            {resource.keywords && resource.keywords.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
