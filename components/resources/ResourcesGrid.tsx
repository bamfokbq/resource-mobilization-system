'use client'

import { useState, useEffect, useMemo } from 'react'
import { ResourceCard } from './ResourcesGrid/ResourceCard'
import { GridControls } from './ResourcesGrid/GridControls'
import { ResourceModal } from './ResourcesGrid/ResourceModal'
import { useResourceFilters } from '@/hooks/useResourceFilters'
import { usePagination } from '@/hooks/usePagination'
import { fetchResources } from '@/actions/resources'
import { Resource, ResourceGridView } from '@/types/resources'
import { cn } from '@/lib/utils'
import { Loader2, FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ResourcesGrid() {
    const { filters } = useResourceFilters()
    const { pagination, updateTotalItems, getPageInfo } = usePagination(25)

    const [resources, setResources] = useState<Resource[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Grid view state
    const [gridView, setGridView] = useState<ResourceGridView>({
        layout: 'grid',
        columns: 3,
        showThumbnails: true,
        compactMode: false
    })

    // Fetch resources when filters or pagination change
    useEffect(() => {
        const loadResources = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetchResources(filters, pagination.page, pagination.pageSize)
                setResources(response.resources)
                updateTotalItems(response.pagination.totalItems)
            } catch (err) {
                setError('Failed to load resources. Please try again.')
                console.error('Error fetching resources:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadResources()
    }, [filters, pagination.page, pagination.pageSize, updateTotalItems])

    // Handle resource actions
    const handleViewResource = (resource: Resource) => {
        setSelectedResource(resource)
        setIsModalOpen(true)
    }

    const handleDownloadResource = (resource: Resource) => {
        // Simulate download
        console.log('Downloading resource:', resource.fileName)
        // In a real app, this would trigger the actual download
        window.open(resource.fileUrl, '_blank')
    }

    const handleFavoriteResource = (resource: Resource) => {
        // Update local state
        setResources(prev => prev.map(r =>
            r.id === resource.id
                ? { ...r, isFavorited: !r.isFavorited }
                : r
        ))

        // In a real app, this would make an API call
        console.log(`${resource.isFavorited ? 'Removed from' : 'Added to'} favorites:`, resource.title)
    }

    const handleShareResource = (resource: Resource) => {
        // Simulate sharing
        if (navigator.share) {
            navigator.share({
                title: resource.title,
                text: resource.description,
                url: window.location.origin + '/resources/' + resource.id
            })
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.origin + '/resources/' + resource.id)
            console.log('Resource link copied to clipboard')
        }
    }

    // Grid layout classes
    const gridClasses = useMemo(() => {
        if (gridView.layout === 'list') {
            return 'grid grid-cols-1 gap-4'
        }

        const columnClasses = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }

        return `grid ${columnClasses[gridView.columns]} gap-6`
    }, [gridView])

    const pageInfo = getPageInfo()

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-red-500 mb-4">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">Error Loading Resources</h3>
                    <p className="text-sm text-gray-600 mt-1">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        )
    }

  return (
      <div className="space-y-6">
          {/* Grid Controls */}
          <GridControls
              view={gridView}
              onViewChange={(newView) => setGridView(prev => ({ ...prev, ...newView }))}
              totalResults={pageInfo.total}
              currentPage={pagination.page}
              pageSize={pagination.pageSize}
          />

          {/* Loading State */}
          {isLoading && (
              <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-600">Loading resources...</p>
                  </div>
              </div>
          )}

          {/* Empty State */}
          {!isLoading && resources.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
                  <p className="text-gray-600 max-w-md">
                      {Object.keys(filters).length > 0
                          ? "No resources match your current filters. Try adjusting your search criteria."
                          : "No resources are available at the moment."}
                  </p>
              </div>
          )}

          {/* Resource Grid */}
          {!isLoading && resources.length > 0 && (
              <div className={gridClasses}>
                  {resources.map((resource) => (
                      <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onView={handleViewResource}
                          onDownload={handleDownloadResource}
                          onFavorite={handleFavoriteResource}
                          onShare={handleShareResource}
                          className={cn(
                              gridView.compactMode && "compact",
                              gridView.layout === 'list' && "list-layout"
                          )}
                      />
                  ))}
              </div>
          )}

          {/* Resource Modal */}
          <ResourceModal
              resource={selectedResource}
              isOpen={isModalOpen}
              onClose={() => {
                  setIsModalOpen(false)
                  setSelectedResource(null)
              }}
              onDownload={handleDownloadResource}
              onShare={handleShareResource}
              onFavorite={handleFavoriteResource}
          />
      </div>
  )
}
