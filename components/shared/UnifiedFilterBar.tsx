'use client'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format, subDays, subMonths, subYears } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { DateRange } from "react-day-picker"
import { 
  CalendarIcon, 
  FilterIcon, 
  X, 
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  BarChart3
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
  onAddClick?: () => void
  onExportExcel?: () => void
  onExportPDF?: () => void
  onDownloadVisualization?: () => void
  className?: string
  title?: string
}

export function UnifiedFilterBar({
  options,
  showAddButton = false,
  showExportButtons = true,
  showVisualizationDownload = true,
  onAddClick,
  onExportExcel,
  onExportPDF,
  onDownloadVisualization,
  className,
  title = "Filters"
}: UnifiedFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Preset date ranges
  const presetRanges = {
    'Last Week': {
      from: subDays(new Date(), 7),
      to: new Date()
    },
    'Last Month': {
      from: subMonths(new Date(), 1),
      to: new Date()
    },
    'Last 3 Months': {
      from: subMonths(new Date(), 3),
      to: new Date()
    },
    'Last Year': {
      from: subYears(new Date(), 1),
      to: new Date()
    }
  }

  // Get current filter values from URL
  const currentFilters = {
    dateRange: searchParams.get('dateRange') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    region: searchParams.get('region') || 'all',
    organization: searchParams.get('organization') || 'all',
    disease: searchParams.get('disease') || 'all',
    status: searchParams.get('status') || 'all',
    ageGroup: searchParams.get('ageGroup') || 'all',
    implementer: searchParams.get('implementer') || 'all'
  }

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (currentFilters.startDate && currentFilters.endDate) {
      return {
        from: new Date(currentFilters.startDate),
        to: new Date(currentFilters.endDate)
      }
    }
    return undefined
  })

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

  // Handle date range changes
  const handleDateSelect = (selectedDate?: DateRange) => {
    setDate(selectedDate)
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (selectedDate?.from && selectedDate?.to) {
      params.set('startDate', selectedDate.from.toISOString())
      params.set('endDate', selectedDate.to.toISOString())
      params.delete('dateRange') // Clear preset if custom range selected
    } else {
      params.delete('startDate')
      params.delete('endDate')
      params.delete('dateRange')
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handle preset range selection
  const handlePresetSelect = (preset: keyof typeof presetRanges) => {
    const selectedRange = presetRanges[preset]
    setDate(selectedRange)
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('dateRange', preset)
    params.set('startDate', selectedRange.from.toISOString())
    params.set('endDate', selectedRange.to.toISOString())
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setDate(undefined)
    router.push(window.location.pathname, { scroll: false })
  }

  // Count active filters
  const activeFilterCount = Object.entries(currentFilters).filter(([key, value]) => {
    if (key === 'startDate' || key === 'endDate') return false
    return value !== 'all' && value !== ''
  }).length + (date ? 1 : 0)

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
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Date Range Filter */}
        <div className="lg:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          <div className="flex gap-2">
            <Select onValueChange={handlePresetSelect}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Quick Select" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(presetRanges).map((preset) => (
                  <SelectItem key={preset} value={preset}>
                    {preset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "MMM dd")} - {format(date.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(date.from, "MMM dd, yyyy")
                    )
                  ) : (
                    "Custom Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Region</label>
          <Select value={currentFilters.region} onValueChange={(value) => updateFilter('region', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {options.regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Organization Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Organization</label>
          <Select value={currentFilters.organization} onValueChange={(value) => updateFilter('organization', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Organizations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {options.organizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Disease Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Disease</label>
          <Select value={currentFilters.disease} onValueChange={(value) => updateFilter('disease', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Diseases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diseases</SelectItem>
              {options.diseases.map((disease) => (
                <SelectItem key={disease} value={disease}>
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
                {options.statuses.map((status) => (
                  <SelectItem key={status} value={status}>
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
                {options.ageGroups.map((ageGroup) => (
                  <SelectItem key={ageGroup} value={ageGroup}>
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
                {options.implementers.map((implementer) => (
                  <SelectItem key={implementer} value={implementer}>
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
            if (key === 'startDate' || key === 'endDate') return null
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
          
          {date && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {format(date.from!, "MMM dd")} - {format(date.to!, "MMM dd, yyyy")}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-gray-200"
                onClick={() => handleDateSelect(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

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
