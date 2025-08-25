'use client'

import { useState } from 'react'
import { Grid, List, LayoutGrid, LayoutList, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ResourceGridView } from '@/types/resources'
import { cn } from '@/lib/utils'

interface GridControlsProps {
  view: ResourceGridView
  onViewChange: (view: Partial<ResourceGridView>) => void
  totalResults: number
  currentPage: number
  pageSize: number
  className?: string
}

export function GridControls({ 
  view, 
  onViewChange, 
  totalResults, 
  currentPage, 
  pageSize,
  className 
}: GridControlsProps) {
  const [showSettings, setShowSettings] = useState(false)
  
  // Calculate result range
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalResults)
  
  return (
    <TooltipProvider>
      <div className={cn("flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3", className)}>
        {/* Results Info */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{start}-{end}</span> of{' '}
          <span className="font-medium">{totalResults}</span> resources
        </div>
        
        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex items-center border border-gray-200 rounded-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view.layout === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange({ layout: 'grid' })}
                  className="rounded-r-none border-r"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Grid View</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view.layout === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange({ layout: 'list' })}
                  className="rounded-l-none"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List View</TooltipContent>
            </Tooltip>
          </div>
          
          {/* Grid Columns (only for grid view) */}
          {view.layout === 'grid' && (
            <Select
              value={view.columns.toString()}
              onValueChange={(value) => onViewChange({ columns: parseInt(value) as 1 | 2 | 3 | 4 })}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {/* View Settings Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showSettings ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* View Settings Panel */}
      {showSettings && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700">View Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Show Thumbnails */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-thumbnails"
                checked={view.showThumbnails}
                onChange={(e) => onViewChange({ showThumbnails: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show-thumbnails" className="text-sm text-gray-700">
                Show Thumbnails
              </label>
            </div>
            
            {/* Compact Mode */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="compact-mode"
                checked={view.compactMode}
                onChange={(e) => onViewChange({ compactMode: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="compact-mode" className="text-sm text-gray-700">
                Compact Mode
              </label>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}
