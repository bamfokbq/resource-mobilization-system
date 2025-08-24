'use client'

import { useState, useMemo, useEffect } from 'react'
import { ChevronDown, Filter, X, Calendar, Tag, Building, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ResourceFilters, ResourceType, FileFormat, ResourceStatus, AccessLevel } from '@/types/resources'
import { getResourcePartners, getResourceProjects, getResourceTags } from '@/actions/resources'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface FilterPanelProps {
  filters: ResourceFilters
  onFiltersChange: (filters: Partial<ResourceFilters>) => void
  onClearFilters: () => void
  activeFilterCount: number
  className?: string
}

// Dynamic data state
interface FilterData {
  partners: Array<{ id: string; name: string; category: string }>
  projects: Array<{ id: string; name: string; partnerId: string }>
  tags: Array<{ id: string; name: string; color: string }>
}

const resourceTypes: { value: ResourceType; label: string }[] = [
  { value: 'research-findings', label: 'Research Findings' },
  { value: 'concept-notes', label: 'Concept Notes' },
  { value: 'program-briefs', label: 'Program Briefs' },
  { value: 'publications', label: 'Publications' },
  { value: 'reports', label: 'Reports' },
  { value: 'presentations', label: 'Presentations' },
  { value: 'videos', label: 'Videos' },
  { value: 'datasets', label: 'Datasets' },
]

const fileFormats: { value: FileFormat; label: string }[] = [
  { value: 'PDF', label: 'PDF' },
  { value: 'DOC', label: 'Word Document' },
  { value: 'DOCX', label: 'Word Document (DOCX)' },
  { value: 'PPT', label: 'PowerPoint' },
  { value: 'PPTX', label: 'PowerPoint (PPTX)' },
  { value: 'XLS', label: 'Excel' },
  { value: 'XLSX', label: 'Excel (XLSX)' },
  { value: 'MP4', label: 'Video (MP4)' },
  { value: 'CSV', label: 'CSV' },
  { value: 'JSON', label: 'JSON' },
]

const statusOptions: { value: ResourceStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'archived', label: 'Archived' },
]

const accessLevels: { value: AccessLevel; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'internal', label: 'Internal' },
  { value: 'restricted', label: 'Restricted' },
  { value: 'confidential', label: 'Confidential' },
]

export function FilterPanel({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  activeFilterCount,
  className 
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState<'from' | 'to' | null>(null)
  const [filterData, setFilterData] = useState<FilterData>({
    partners: [],
    projects: [],
    tags: []
  })
  
  // Load filter data on mount
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [partners, projects, tags] = await Promise.all([
          getResourcePartners(),
          getResourceProjects(),
          getResourceTags()
        ])
        
        setFilterData({
          partners: partners.map(p => ({ id: p.id, name: p.name, category: p.category })),
          projects: projects.map(p => ({ id: p.id, name: p.name, partnerId: p.partnerId })),
          tags: tags.map(t => ({ id: t.id, name: t.name, color: t.color }))
        })
      } catch (error) {
        console.error('Failed to load filter data:', error)
      }
    }
    
    loadFilterData()
  }, [])
  
  // Handle checkbox change for array filters
  const handleArrayFilterChange = <K extends keyof ResourceFilters>(
    key: K,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (filters[key] as string[]) || []
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value)
    
    onFiltersChange({
      [key]: newValues.length > 0 ? newValues : undefined
    })
  }
  
  // Handle date range change
  const handleDateRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    const currentRange = filters.dateRange || { from: '', to: '', field: 'uploadDate' }
    const newRange = {
      ...currentRange,
      [field]: date ? format(date, 'yyyy-MM-dd') : ''
    }
    
    onFiltersChange({
      dateRange: newRange.from || newRange.to ? newRange : undefined
    })
    setDatePickerOpen(null)
  }
  
  // Handle date field change
  const handleDateFieldChange = (field: 'uploadDate' | 'publicationDate') => {
    const currentRange = filters.dateRange
    if (currentRange) {
      onFiltersChange({
        dateRange: { ...currentRange, field }
      })
    }
  }
  
  // Filter partners by selected project
  const filteredPartners = useMemo(() => {
    if (!filters.projectId?.length) return filterData.partners
    
    const projectPartnerIds = new Set(
      filterData.projects
        .filter(p => filters.projectId!.includes(p.id))
        .map(p => p.partnerId)
    )
    
    return filterData.partners.filter(p => projectPartnerIds.has(p.id))
  }, [filters.projectId, filterData.partners, filterData.projects])
  
  // Filter projects by selected partner
  const filteredProjects = useMemo(() => {
    if (!filters.partnerId?.length) return filterData.projects
    
    return filterData.projects.filter(p => filters.partnerId!.includes(p.partnerId))
  }, [filters.partnerId, filterData.projects])
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      
      {/* Filter Content */}
      {isOpen && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-6 bg-white shadow-sm">
          {/* Resource Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Resource Type
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {resourceTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.type?.includes(type.value) || false}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange('type', type.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`type-${type.value}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Partner/Organization */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Partner/Organization
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`partner-${partner.id}`}
                    checked={filters.partnerId?.includes(partner.id) || false}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange('partnerId', partner.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`partner-${partner.id}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {partner.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Project */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Project
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${project.id}`}
                    checked={filters.projectId?.includes(project.id) || false}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange('projectId', project.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`project-${project.id}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {project.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Label>
            
            {/* Date Field Selector */}
            <Select
              value={filters.dateRange?.field || 'uploadDate'}
              onValueChange={(value) => handleDateFieldChange(value as 'uploadDate' | 'publicationDate')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploadDate">Upload Date</SelectItem>
                <SelectItem value="publicationDate">Publication Date</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2">
              <Popover open={datePickerOpen === 'from'} onOpenChange={(open) => setDatePickerOpen(open ? 'from' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    {filters.dateRange?.from ? format(new Date(filters.dateRange.from), 'MMM dd, yyyy') : 'From date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateRange?.from ? new Date(filters.dateRange.from) : undefined}
                    onSelect={(date) => handleDateRangeChange('from', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover open={datePickerOpen === 'to'} onOpenChange={(open) => setDatePickerOpen(open ? 'to' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange?.to && "text-muted-foreground"
                    )}
                  >
                    {filters.dateRange?.to ? format(new Date(filters.dateRange.to), 'MMM dd, yyyy') : 'To date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateRange?.to ? new Date(filters.dateRange.to) : undefined}
                    onSelect={(date) => handleDateRangeChange('to', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Separator />
          
          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {filterData.tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={filters.tags?.includes(tag.name) || false}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange('tags', tag.name, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm text-gray-600 cursor-pointer flex items-center gap-1"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    #{tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* File Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              File Format
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fileFormats.map((format) => (
                <div key={format.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format.value}`}
                    checked={filters.fileFormat?.includes(format.value) || false}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange('fileFormat', format.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`format-${format.value}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {format.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status?.includes(status.value) || false}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange('status', status.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`status-${status.value}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Access Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Access Level
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {accessLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`access-${level.value}`}
                    checked={filters.accessLevel?.includes(level.value) || false}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange('accessLevel', level.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`access-${level.value}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
