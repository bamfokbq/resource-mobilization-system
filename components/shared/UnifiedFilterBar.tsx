'use client'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { 
  FilterIcon, 
  X, 
  FileSpreadsheet,
  FileText,
  Plus,
  BarChart3,
  Download,
  Image
} from "lucide-react"
import { toast } from "sonner"

interface FilterOptions {
  regions: string[]
  organizations: string[]
  diseases: string[]
  statuses?: string[]
  ageGroups?: string[]
  implementers?: string[]
}

interface UnifiedFilterBarProps {
  options: FilterOptions
  showAddButton?: boolean
  showExportButtons?: boolean
  showVisualizationDownload?: boolean
  showTablePngExport?: boolean
  showChartPngExport?: boolean
  onAddClick?: () => void
  onExportExcel?: () => void
  onExportPDF?: () => void
  onDownloadVisualization?: () => void
  onExportTablePng?: () => void
  onExportChartPng?: () => void
  className?: string
  title?: string
}

export function UnifiedFilterBar({
  options,
  showAddButton = false,
  showExportButtons = true,
  showVisualizationDownload = true,
  showTablePngExport = false,
  showChartPngExport = false,
  onAddClick,
  onExportExcel,
  onExportPDF,
  onDownloadVisualization,
  onExportTablePng,
  onExportChartPng,
  className,
  title = "Filters"
}: UnifiedFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()



  // Get current filter values from URL
  const currentFilters = {
    disease: searchParams.get('disease') || 'all',
    status: searchParams.get('status') || 'all',
    ageGroup: searchParams.get('ageGroup') || 'all',
    implementer: searchParams.get('implementer') || 'all'
  }



  // Update URL with new filter values
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }





  // Clear all filters
  const clearAllFilters = () => {
    router.push(window.location.pathname, { scroll: false })
  }

  // Count active filters
  const activeFilterCount = Object.entries(currentFilters).filter(([key, value]) => {
    return value !== 'all' && value !== ''
  }).length

  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4", className)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <FilterIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">
              Filter and analyze your data
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount} active
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {showAddButton && onAddClick && (
            <Button 
              onClick={onAddClick}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          )}

          {showExportButtons && (
            <>
              {onExportExcel && (
                <Button 
                  onClick={onExportExcel}
                  variant="outline"
                  className="border-green-200 hover:bg-green-50 text-green-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              )}
              
              {onExportPDF && (
                <Button 
                  onClick={onExportPDF}
                  variant="outline"
                  className="border-red-200 hover:bg-red-50 text-red-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </>
          )}

          {showVisualizationDownload && onDownloadVisualization && (
            <Button 
              onClick={onDownloadVisualization}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 text-purple-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Download Chart
            </Button>
          )}
          
          {showTablePngExport && onExportTablePng && (
            <Button 
              onClick={onExportTablePng}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 text-blue-700"
            >
              <Image className="h-4 w-4 mr-2" />
              Export Table PNG
            </Button>
          )}
          
          {showChartPngExport && onExportChartPng && (
            <Button 
              onClick={onExportChartPng}
              variant="outline"
              className="border-indigo-200 hover:bg-indigo-50 text-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Chart PNG
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Disease Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Disease</label>
          <Select value={currentFilters.disease} onValueChange={(value) => updateFilter('disease', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Diseases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diseases</SelectItem>
              {options.diseases.map((disease, index) => (
                <SelectItem key={`disease-${index}-${disease}`} value={disease}>
                  {disease}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Status Filter */}
        {options.statuses && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select value={currentFilters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {options.statuses.map((status, index) => (
                  <SelectItem key={`status-${index}-${status}`} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Conditional Age Group Filter */}
        {options.ageGroups && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Age Group</label>
            <Select value={currentFilters.ageGroup} onValueChange={(value) => updateFilter('ageGroup', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Age Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Age Groups</SelectItem>
                {options.ageGroups.map((ageGroup, index) => (
                  <SelectItem key={`ageGroup-${index}-${ageGroup}`} value={ageGroup}>
                    {ageGroup}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Conditional Implementer Filter */}
        {options.implementers && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Implementer</label>
            <Select value={currentFilters.implementer} onValueChange={(value) => updateFilter('implementer', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Implementers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Implementers</SelectItem>
                {options.implementers.map((implementer, index) => (
                  <SelectItem key={`implementer-${index}-${implementer}`} value={implementer}>
                    {implementer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          
          {Object.entries(currentFilters).map(([key, value]) => {
            if (value === 'all' || value === '') return null
            
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key}: {value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-gray-200"
                  onClick={() => updateFilter(key, 'all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="ml-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
