'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ResourceFilters } from '@/types/resources'
import { cn } from '@/lib/utils'

interface ActiveFiltersProps {
  filters: ResourceFilters
  onRemoveFilter: (key: keyof ResourceFilters, value?: string) => void
  onClearAll: () => void
  className?: string
}

const filterLabels: Record<keyof ResourceFilters, string> = {
  search: 'Search',
  type: 'Type',
  partnerId: 'Partner',
  projectId: 'Project',
  status: 'Status',
  accessLevel: 'Access',
  fileFormat: 'Format',
  tags: 'Tags',
  dateRange: 'Date Range',
  sortBy: 'Sort',
  sortOrder: 'Order'
}

// Mock data for labels
const partnerLabels: Record<string, string> = {
  '1': 'UNICEF Ghana',
  '2': 'WHO Ghana',
  '3': 'Ghana Health Service',
  '4': 'Plan International'
}

const projectLabels: Record<string, string> = {
  '1': 'Education Reform Initiative',
  '2': 'Health System Strengthening',
  '3': 'Community Development Program',
  '4': 'Child Protection Project'
}

const typeLabels: Record<string, string> = {
  'research-findings': 'Research Findings',
  'concept-notes': 'Concept Notes',
  'program-briefs': 'Program Briefs',
  'publications': 'Publications',
  'reports': 'Reports',
  'presentations': 'Presentations',
  'videos': 'Videos',
  'datasets': 'Datasets'
}

const statusLabels: Record<string, string> = {
  'draft': 'Draft',
  'published': 'Published',
  'under-review': 'Under Review',
  'archived': 'Archived'
}

const accessLabels: Record<string, string> = {
  'public': 'Public',
  'internal': 'Internal',
  'restricted': 'Restricted',
  'confidential': 'Confidential'
}

export function ActiveFilters({ 
  filters, 
  onRemoveFilter, 
  onClearAll,
  className 
}: ActiveFiltersProps) {
  const activeFilters: Array<{
    key: keyof ResourceFilters
    label: string
    value?: string
    displayValue: string
  }> = []
  
  // Build active filters array
  Object.entries(filters).forEach(([key, value]) => {
    const filterKey = key as keyof ResourceFilters
    
    if (!value) return
    
    if (filterKey === 'search' && typeof value === 'string') {
      activeFilters.push({
        key: filterKey,
        label: filterLabels[filterKey],
        displayValue: `"${value}"`
      })
    } else if (filterKey === 'dateRange' && typeof value === 'object') {
      const range = value as { from: string; to: string; field: string }
      if (range.from || range.to) {
        const dateDisplay = [
          range.from && `from ${range.from}`,
          range.to && `to ${range.to}`
        ].filter(Boolean).join(' ')
        
        activeFilters.push({
          key: filterKey,
          label: `${filterLabels[filterKey]} (${range.field})`,
          displayValue: dateDisplay
        })
      }
    } else if (Array.isArray(value) && value.length > 0) {
      value.forEach((item) => {
        let displayValue = item
        
        // Get human-readable labels
        if (filterKey === 'partnerId') {
          displayValue = partnerLabels[item] || item
        } else if (filterKey === 'projectId') {
          displayValue = projectLabels[item] || item
        } else if (filterKey === 'type') {
          displayValue = typeLabels[item] || item
        } else if (filterKey === 'status') {
          displayValue = statusLabels[item] || item
        } else if (filterKey === 'accessLevel') {
          displayValue = accessLabels[item] || item
        } else if (filterKey === 'tags') {
          displayValue = `#${item}`
        }
        
        activeFilters.push({
          key: filterKey,
          label: filterLabels[filterKey],
          value: item,
          displayValue
        })
      })
    } else if (typeof value === 'string') {
      activeFilters.push({
        key: filterKey,
        label: filterLabels[filterKey],
        displayValue: value
      })
    }
  })
  
  if (activeFilters.length === 0) {
    return null
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 px-3 text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.key}-${filter.value || 'single'}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            <span className="font-medium">{filter.label}:</span>
            <span>{filter.displayValue}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFilter(filter.key, filter.value)}
              className="h-4 w-4 p-0 ml-1 hover:bg-blue-200 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      {activeFilters.length > 3 && (
        <div className="text-xs text-gray-500">
          {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied
        </div>
      )}
    </div>
  )
}
