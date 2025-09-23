'use client'

import { useState, useMemo, useEffect } from 'react'
import { ChevronDown, Filter, X, Calendar, Tag, Building, FolderOpen, FileText, Shield, Clock, Search, CheckCircle2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
  const [partnerSearch, setPartnerSearch] = useState('')
  const [projectSearch, setProjectSearch] = useState('')
  const [tagSearch, setTagSearch] = useState('')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    type: true,
    partners: true,
    projects: false,
    dates: false,
    tags: false,
    formats: false,
    status: false,
    access: false
  })
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
  
  // Toggle section open/closed
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

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
  
  // Filter partners by search
  const filteredPartnersBySearch = useMemo(() => {
    const searchablePartners = filteredPartners
    if (!partnerSearch) return searchablePartners

    return searchablePartners.filter(partner =>
      partner.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      partner.category.toLowerCase().includes(partnerSearch.toLowerCase())
    )
  }, [filteredPartners, partnerSearch])

  // Filter projects by search
  const filteredProjectsBySearch = useMemo(() => {
    const searchableProjects = filteredProjects
    if (!projectSearch) return searchableProjects

    return searchableProjects.filter(project =>
      project.name.toLowerCase().includes(projectSearch.toLowerCase())
    )
  }, [filteredProjects, projectSearch])

  // Filter tags by search
  const filteredTagsBySearch = useMemo(() => {
    if (!tagSearch) return filterData.tags

    return filterData.tags.filter(tag =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase())
    )
  }, [filterData.tags, tagSearch])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 h-10 px-4 bg-white hover:bg-gray-50 border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Filter className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      
      {/* Filter Content */}
      {isOpen && (
        <Card className="border border-gray-200 shadow-lg bg-gradient-to-b from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Settings className="h-5 w-5 text-blue-600" />
              Filter Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Resource Type */}
            <Collapsible open={openSections.type} onOpenChange={() => toggleSection('type')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <FolderOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">Resource Type</Label>
                      {filters.type?.length ? (
                        <p className="text-xs text-gray-500">{filters.type.length} selected</p>
                      ) : (
                        <p className="text-xs text-gray-500">All types</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.type && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                  {resourceTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={filters.type?.includes(type.value) || false}
                        onCheckedChange={(checked) =>
                          handleArrayFilterChange('type', type.value, checked as boolean)
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label
                        htmlFor={`type-${type.value}`}
                        className="text-sm text-gray-700 cursor-pointer font-medium flex-1"
                      >
                        {type.label}
                      </Label>
                      {filters.type?.includes(type.value) && (
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-6" />

            {/* Partner/Organization */}
            <Collapsible open={openSections.partners} onOpenChange={() => toggleSection('partners')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                      <Building className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">Partners & Organizations</Label>
                      {filters.partnerId?.length ? (
                        <p className="text-xs text-gray-500">{filters.partnerId.length} selected</p>
                      ) : (
                        <p className="text-xs text-gray-500">All partners</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.partners && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-3 pl-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search partners..."
                      value={partnerSearch}
                      onChange={(e) => setPartnerSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredPartnersBySearch.map((partner) => (
                      <div key={partner.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={`partner-${partner.id}`}
                          checked={filters.partnerId?.includes(partner.id) || false}
                          onCheckedChange={(checked) =>
                            handleArrayFilterChange('partnerId', partner.id, checked as boolean)
                          }
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`partner-${partner.id}`}
                            className="text-sm text-gray-700 cursor-pointer font-medium block"
                          >
                            {partner.name}
                          </Label>
                          <p className="text-xs text-gray-500">{partner.category}</p>
                        </div>
                        {filters.partnerId?.includes(partner.id) && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-6" />


            {/* Project */}
            <Collapsible open={openSections.projects} onOpenChange={() => toggleSection('projects')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                      <FolderOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">Projects</Label>
                      {filters.projectId?.length ? (
                        <p className="text-xs text-gray-500">{filters.projectId.length} selected</p>
                      ) : (
                        <p className="text-xs text-gray-500">All projects</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.projects && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-3 pl-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredProjectsBySearch.map((project) => (
                      <div key={project.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={`project-${project.id}`}
                          checked={filters.projectId?.includes(project.id) || false}
                          onCheckedChange={(checked) =>
                            handleArrayFilterChange('projectId', project.id, checked as boolean)
                          }
                          className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <Label
                          htmlFor={`project-${project.id}`}
                          className="text-sm text-gray-700 cursor-pointer font-medium flex-1"
                        >
                          {project.name}
                        </Label>
                        {filters.projectId?.includes(project.id) && (
                          <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-6" />

            {/* Date Range */}
            <Collapsible open={openSections.dates} onOpenChange={() => toggleSection('dates')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">Date Range</Label>
                      {filters.dateRange?.from || filters.dateRange?.to ? (
                        <p className="text-xs text-gray-500">Custom range</p>
                      ) : (
                        <p className="text-xs text-gray-500">All dates</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.dates && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-4 pl-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Popover open={datePickerOpen === 'from'} onOpenChange={(open) => setDatePickerOpen(open ? 'from' : null)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal h-10",
                            !filters.dateRange?.from && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
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
                            "justify-start text-left font-normal h-10",
                            !filters.dateRange?.to && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
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
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-6" />

            {/* Tags */}
            <Collapsible open={openSections.tags} onOpenChange={() => toggleSection('tags')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-50 group-hover:bg-pink-100 transition-colors">
                      <Tag className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">Tags</Label>
                      {filters.tags?.length ? (
                        <p className="text-xs text-gray-500">{filters.tags.length} selected</p>
                      ) : (
                        <p className="text-xs text-gray-500">All tags</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.tags && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-3 pl-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tags..."
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filteredTagsBySearch.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <Checkbox
                            id={`tag-${tag.id}`}
                            checked={filters.tags?.includes(tag.name) || false}
                            onCheckedChange={(checked) =>
                              handleArrayFilterChange('tags', tag.name, checked as boolean)
                            }
                            className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                          />
                          <Label
                            htmlFor={`tag-${tag.id}`}
                            className="text-sm text-gray-700 cursor-pointer flex items-center gap-2 flex-1"
                          >
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: tag.color }}
                            />
                            #{tag.name}
                          </Label>
                          {filters.tags?.includes(tag.name) && (
                            <CheckCircle2 className="h-4 w-4 text-pink-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-6" />

            {/* File Format */}
            <Collapsible open={openSections.formats} onOpenChange={() => toggleSection('formats')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                      <FileText className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">File Format</Label>
                      {filters.fileFormat?.length ? (
                        <p className="text-xs text-gray-500">{filters.fileFormat.length} selected</p>
                      ) : (
                        <p className="text-xs text-gray-500">All formats</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.formats && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-4">
                  {fileFormats.map((format) => (
                    <div key={format.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={`format-${format.value}`}
                        checked={filters.fileFormat?.includes(format.value) || false}
                        onCheckedChange={(checked) =>
                          handleArrayFilterChange('fileFormat', format.value, checked as boolean)
                        }
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <Label
                        htmlFor={`format-${format.value}`}
                        className="text-sm text-gray-700 cursor-pointer font-medium flex-1"
                      >
                        {format.label}
                      </Label>
                      {filters.fileFormat?.includes(format.value) && (
                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-6" />

            {/* Status */}
            <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-50 group-hover:bg-yellow-100 transition-colors">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">Status</Label>
                      {filters.status?.length ? (
                        <p className="text-xs text-gray-500">{filters.status.length} selected</p>
                      ) : (
                        <p className="text-xs text-gray-500">All statuses</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.status && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-2 gap-3 pl-4">
                  {statusOptions.map((status) => (
                    <div key={status.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={filters.status?.includes(status.value) || false}
                        onCheckedChange={(checked) =>
                          handleArrayFilterChange('status', status.value, checked as boolean)
                        }
                        className="data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                      />
                      <Label
                        htmlFor={`status-${status.value}`}
                        className="text-sm text-gray-700 cursor-pointer font-medium flex-1"
                      >
                        {status.label}
                      </Label>
                      {filters.status?.includes(status.value) && (
                        <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-6" />

            {/* Access Level */}
            <Collapsible open={openSections.access} onOpenChange={() => toggleSection('access')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto hover:bg-transparent group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                      <Shield className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-left">
                      <Label className="text-sm font-semibold text-gray-800">Access Level</Label>
                      {filters.accessLevel?.length ? (
                        <p className="text-xs text-gray-500">{filters.accessLevel.length} selected</p>
                      ) : (
                        <p className="text-xs text-gray-500">All levels</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSections.access && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-2 gap-3 pl-4">
                  {accessLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={`access-${level.value}`}
                        checked={filters.accessLevel?.includes(level.value) || false}
                        onCheckedChange={(checked) =>
                          handleArrayFilterChange('accessLevel', level.value, checked as boolean)
                        }
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <Label
                        htmlFor={`access-${level.value}`}
                        className="text-sm text-gray-700 cursor-pointer font-medium flex-1"
                      >
                        {level.label}
                      </Label>
                      {filters.accessLevel?.includes(level.value) && (
                        <CheckCircle2 className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

          </CardContent>
        </Card>
      )}
    </div>
  )
}
