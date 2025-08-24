'use client'

import ResourcesSearchAndFilter from './ResourcesSearchAndFilter'
import ResourcesGrid from './ResourcesGrid'
import ResourcesPagination from './ResourcesPagination'

/**
 * Main Resources Page Component
 * 
 * This component integrates all three main resource management components:
 * - ResourcesSearchAndFilter: Handles search input and advanced filtering
 * - ResourcesGrid: Displays resources in a responsive grid with actions
 * - ResourcesPagination: Provides pagination controls and page size selection
 * 
 * Each component manages its own state through custom hooks that handle 
 * URL state synchronization, ensuring the components work together seamlessly.
 */
export function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resource Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Discover, filter, and manage project documentation and resources
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                System Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filter Section */}
          <ResourcesSearchAndFilter />

          {/* Results Grid */}
          <ResourcesGrid />

          {/* Pagination Controls */}
          <ResourcesPagination />
        </div>
      </div>
    </div>
  )
}
