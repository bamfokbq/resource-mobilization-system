'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useResourceFilters } from '@/hooks/useResourceFilters'
import { ResourceFilters } from '@/types/resources'
import { SortAsc, SortDesc } from 'lucide-react'
import { useState } from 'react'
import { ActiveFilters } from './ResourcesSearchAndFilter/ActiveFilters'
import { FilterPanel } from './ResourcesSearchAndFilter/FilterPanel'
import { SearchInput } from './ResourcesSearchAndFilter/SearchInput'

export default function ResourcesSearchAndFilter() {
  const {
    filters,
    updateFilters,
    updateFilter,
    clearFilters,
    clearFilter,
    activeFilterCount
  } = useResourceFilters()

  const [searchValue, setSearchValue] = useState(filters.search || '')

  // Handle search execution
  const handleSearch = (query: string) => {
    updateFilter('search', query || undefined)
  }

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<ResourceFilters>) => {
    updateFilters(newFilters)
  }

  // Handle removing individual filters
  const handleRemoveFilter = (key: keyof ResourceFilters, value?: string) => {
    if (key === 'search' || key === 'dateRange' || key === 'sortBy' || key === 'sortOrder') {
      clearFilter(key)
    } else if (value && Array.isArray(filters[key])) {
      const currentValues = filters[key] as string[]
      const newValues = currentValues.filter(v => v !== value)
      updateFilter(key, newValues.length > 0 ? newValues as any : undefined)
    } else {
      clearFilter(key)
    }
  }

  // Handle sort changes
  const handleSortChange = (sortBy: string) => {
    updateFilter('sortBy', sortBy as any)
  }

  const handleSortOrderToggle = () => {
    const newOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc'
    updateFilter('sortOrder', newOrder)
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Search and Sort Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search Input */}
        <div className="flex-1">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder="Search resources, documents, projects..."
            className="w-full"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.sortBy || 'relevance'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Upload Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
              <SelectItem value="downloads">Downloads</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSortOrderToggle}
            className="flex-shrink-0"
            title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={clearFilters}
      />

      {/* Results Summary */}
      {activeFilterCount > 0 && (
        <div className="text-sm text-gray-600 border-t pt-4">
          <span className="font-medium">{activeFilterCount}</span> filter{activeFilterCount !== 1 ? 's' : ''} applied
          {filters.search && (
            <span className="ml-2">
              • Searching for <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
