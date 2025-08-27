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
import { motion, AnimatePresence } from "motion/react"
import { 
  CalendarIcon, 
  FilterIcon, 
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface GlobalFilterBarProps {
  className?: string
}

export function GlobalFilterBar({ className }: GlobalFilterBarProps) {
  const { globalFilters, updateGlobalFilter, clearGlobalFilters, getActiveFilterCount } = useSurveyDataFilters()
  const [isExpanded, setIsExpanded] = React.useState(false)

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



  // Single component that handles both states with animations
  return (
    <motion.div 
      className={cn("bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm", className)}
      initial={{ height: "auto" }}
      animate={{ height: "auto" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="px-6 py-3">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <FilterIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Global Filters</span>
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} active
                </Badge>
              </motion.div>
            )}
            
            {/* Show current filter values as icons/text */}
            <AnimatePresence>
              {!isExpanded && (
                <motion.div 
                  className="flex items-center gap-2 ml-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {date && (
                    <motion.div 
                      className="flex items-center gap-1 text-xs text-gray-500"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <CalendarIcon className="w-3 h-3" />
                      <span>{format(date.from!, "MMM dd")} - {format(date.to!, "MMM dd")}</span>
                    </motion.div>
                  )}
                  {globalFilters.region && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                    >
                      <Badge variant="outline" className="text-xs">
                        {globalFilters.region}
                      </Badge>
                    </motion.div>
                  )}
                  {globalFilters.organization && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    >
                      <Badge variant="outline" className="text-xs">
                        {globalFilters.organization}
                      </Badge>
                    </motion.div>
                  )}
                  {globalFilters.disease && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.25 }}
                    >
                      <Badge variant="outline" className="text-xs">
                        {globalFilters.disease}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </motion.div>
        </Button>
      </div>

      {/* Expanded Filter Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
            className="px-6 pb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
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
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
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
            </motion.div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <motion.div 
                className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                
                {Object.entries(globalFilters).map(([key, value]) => {
                  if (key === 'startDate' || key === 'endDate') return null
                  if (value === 'all' || !value) return null
                  
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
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
                    </motion.div>
                  )
                })}
                
                {date && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
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
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
