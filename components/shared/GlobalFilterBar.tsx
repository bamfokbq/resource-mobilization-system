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
import { useSurveyDataFilters } from '@/components/providers/SurveyDataFilterProvider'
import * as React from "react"
import { DateRange } from "react-day-picker"
import { 
  CalendarIcon, 
  FilterIcon, 
  X,
} from "lucide-react"

interface GlobalFilterBarProps {
  className?: string
}

export function GlobalFilterBar({ className }: GlobalFilterBarProps) {
  const { globalFilters, updateGlobalFilter, clearGlobalFilters, getActiveFilterCount } = useSurveyDataFilters()

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

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (globalFilters.startDate && globalFilters.endDate) {
      return {
        from: new Date(globalFilters.startDate),
        to: new Date(globalFilters.endDate)
      }
    }
    return undefined
  })

  // Handle date range changes
  const handleDateSelect = (selectedDate?: DateRange) => {
    setDate(selectedDate)
    
    if (selectedDate?.from && selectedDate?.to) {
      updateGlobalFilter('startDate', selectedDate.from.toISOString())
      updateGlobalFilter('endDate', selectedDate.to.toISOString())
      updateGlobalFilter('dateRange', '') // Clear preset if custom range
    } else {
      updateGlobalFilter('startDate', undefined)
      updateGlobalFilter('endDate', undefined)
      updateGlobalFilter('dateRange', undefined)
    }
  }

  // Handle preset selection
  const handlePresetSelect = (presetKey: string) => {
    const preset = presetRanges[presetKey as keyof typeof presetRanges]
    if (preset) {
      setDate(preset)
      updateGlobalFilter('dateRange', presetKey)
      updateGlobalFilter('startDate', preset.from.toISOString())
      updateGlobalFilter('endDate', preset.to.toISOString())
    }
  }

  const activeFilterCount = getActiveFilterCount()

  // Filter options (in a real app, these would come from your data)
  const filterOptions = {
    regions: [
      "Greater Accra", "Ashanti", "Northern", "Western", "Eastern", 
      "Central", "Volta", "Upper East", "Upper West", "Brong Ahafo"
    ],
    organizations: [
      "Ghana Health Service", "WHO Ghana", "Korle Bu Teaching Hospital",
      "Mental Health Authority", "Ghana Cancer Society", "USAID",
      "Christian Health Association", "Regional Health Directorate"
    ],
    diseases: [
      "Hypertension", "Diabetes", "Mental Health", "Cancer",
      "Cardiovascular Disease", "Chronic Kidney Disease", "Respiratory Disease"
    ]
  }

  return (
    <div className={cn("bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm", className)}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Global Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearGlobalFilters}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                  <div className="border-r p-3 space-y-2">
                    <div className="text-sm font-medium">Quick Select</div>
                    {Object.keys(presetRanges).map((preset) => (
                      <Button
                        key={preset}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handlePresetSelect(preset)}
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Region Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Region</label>
            <Select 
              value={globalFilters.region || 'all'} 
              onValueChange={(value) => updateGlobalFilter('region', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {filterOptions.regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Organization Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Organization</label>
            <Select 
              value={globalFilters.organization || 'all'} 
              onValueChange={(value) => updateGlobalFilter('organization', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {filterOptions.organizations.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Disease Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Disease</label>
            <Select 
              value={globalFilters.disease || 'all'} 
              onValueChange={(value) => updateGlobalFilter('disease', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Diseases" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Diseases</SelectItem>
                {filterOptions.diseases.map(disease => (
                  <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 mt-4">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {Object.entries(globalFilters).map(([key, value]) => {
              if (key === 'startDate' || key === 'endDate') return null
              if (value === 'all' || !value) return null
              
              return (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {key}: {value}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-gray-200"
                    onClick={() => updateGlobalFilter(key, undefined)}
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
          </div>
        )}
      </div>
    </div>
  )
}
