"use client";

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  BuildingIcon, 
  FilterIcon, 
  EyeIcon, 
  UsersIcon, 
  MapPinIcon, 
  CalendarIcon, 
  TargetIcon,
  SearchIcon,
  ArrowUpDownIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  TrashIcon,
  EditIcon
} from "lucide-react"
import { getAllPartnerMappings } from '@/actions/partnerMappingActions'

export default function PartnerMappingData() {
  const [partnerMappingData, setPartnerMappingData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedMapping, setSelectedMapping] = useState<any>(null)

  // Enhanced table state
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("submissionDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Load mapping submission data
  useEffect(() => {
    const loadMappingData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await getAllPartnerMappings()
        
        if (result.success && result.partnerMappings) {
          // Transform the mapping submission data to match the expected format
          const transformedData = result.partnerMappings.flatMap((mapping, mappingIndex) => 
            mapping.data.partnerMappings.map((item: any, itemIndex: number) => ({
              id: `${mapping.id}-${mappingIndex}-${itemIndex}-${item.organization}-${item.projectName}`,
              organization: item.organization,
              projectName: item.projectName,
              projectRegion: item.projectRegion,
              district: item.district,
              disease: item.disease,
              workNature: item.workNature,
              year: item.year,
              partner: item.partner,
              role: item.role,
              sector: mapping.data.partnerMappings[0]?.sector || 'Unknown',
              contact: {
                phone: mapping.data.partnerMappings[0]?.phone || '',
                email: mapping.data.partnerMappings[0]?.email || '',
                website: mapping.data.partnerMappings[0]?.website || ''
              },
              submissionDate: mapping.createdAt
            }))
          )
          setPartnerMappingData(transformedData)
        } else {
          setError(result.message || 'Failed to load mapping submissions')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error loading mapping submissions:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadMappingData()
  }, [])

  // Enhanced filtering and sorting logic
  const filteredAndSortedData = useMemo(() => {
    if (!partnerMappingData || partnerMappingData.length === 0) {
      return []
    }

    let filtered = partnerMappingData.filter(item => {
      const regionMatch = selectedRegion === "all" || item.projectRegion === selectedRegion
      const searchMatch = searchTerm === "" || 
        item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(item.disease) ? item.disease.join(' ').toLowerCase() : item.disease.toLowerCase()).includes(searchTerm.toLowerCase())
      
      return regionMatch && searchMatch
    })

    // Sort the filtered data
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      // Handle array values (like disease)
      if (Array.isArray(aValue)) aValue = aValue.join(', ')
      if (Array.isArray(bValue)) bValue = bValue.join(', ')
      
      // Handle date values
      if (sortField === 'submissionDate') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [partnerMappingData, selectedRegion, searchTerm, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex)

  // Calculate summary statistics based on filtered data
  const summaryStats = useMemo(() => {
    if (!filteredAndSortedData || filteredAndSortedData.length === 0) {
      return {
        totalSubmissions: 0,
        uniqueOrganizations: 0,
        uniquePartners: 0,
        regionalCoverage: 0
      }
    }

    const totalSubmissions = filteredAndSortedData.length
    const uniqueOrganizations = new Set(filteredAndSortedData.map(item => item.organization)).size
    const uniquePartners = new Set(filteredAndSortedData.map(item => item.partner)).size
    const regionalCoverage = new Set(filteredAndSortedData.map(item => item.projectRegion)).size

    return {
      totalSubmissions,
      uniqueOrganizations,
      uniquePartners,
      regionalCoverage
    }
  }, [filteredAndSortedData])

  // Get unique regions for filters
  const regions = useMemo(() => {
    if (!partnerMappingData) return []
    const regionSet = new Set(partnerMappingData.map(item => item.projectRegion))
    return Array.from(regionSet).sort()
  }, [partnerMappingData])

  // Helper functions
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(item => item.id))
      setSelectedItems(allIds)
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedItems(newSelected)
  }

  const handleExport = () => {
    const csvContent = [
      ['Organization', 'Project Name', 'Region', 'Disease', 'Partner', 'Role', 'Year', 'Submission Date'],
      ...filteredAndSortedData.map(item => [
        item.organization,
        item.projectName,
        item.projectRegion,
        Array.isArray(item.disease) ? item.disease.join(', ') : item.disease,
        item.partner,
        item.role,
        item.year,
        new Date(item.submissionDate).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `partner-mapping-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleBulkDelete = () => {
    // This would typically call an API to delete the selected items
    console.log('Bulk delete items:', Array.from(selectedItems))
    setSelectedItems(new Set())
    setShowBulkActions(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Enhanced Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Table Loading Skeleton */}
        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 h-20">
            <div className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                <div>
                  <div className="w-64 h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="w-96 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="w-48 h-4 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="w-32 h-3 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading partner mapping data: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

        {/* Enhanced Search and Filter Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FilterIcon className="w-4 h-4 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Search & Filter Partner Mapping Data</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search organizations, projects, partners, roles, or diseases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 focus:border-indigo-300 transition-colors"
              />
            </div>

            {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Region
                </label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  Items per Page
                </label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <span>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
              </span>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.totalSubmissions}</div>
                  <div className="text-blue-100 mt-1 font-medium">Total Submissions</div>
                  <div className="text-xs text-blue-200 mt-2">Individual survey submissions</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BuildingIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.uniqueOrganizations}</div>
                  <div className="text-green-100 mt-1 font-medium">Unique Organizations</div>
                  <div className="text-xs text-green-200 mt-2">Participating in partnerships</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                <div className="text-3xl font-bold">{summaryStats.uniquePartners}</div>
                <div className="text-purple-100 mt-1 font-medium">Unique Partners</div>
                <div className="text-xs text-purple-200 mt-2">Partner organizations</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TargetIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.regionalCoverage}</div>
                  <div className="text-orange-100 mt-1 font-medium">Regions Covered</div>
                  <div className="text-xs text-orange-200 mt-2">Geographic coverage</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.size > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedItems.size === paginatedData.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="font-medium text-orange-800">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedItems(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Partner Mapping Data Table */}
        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}></div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <BuildingIcon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Partner Mapping Submissions</CardTitle>
                  <p className="text-indigo-100 text-sm mt-1 font-medium">
                    Comprehensive directory of partner mapping submissions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-indigo-100 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                >
                  <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                  Actions
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <Table className="relative">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <TableHead className="w-12 px-4 py-4">
                      <Checkbox
                        checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </TableHead>
                    <TableHead 
                    className="font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition-all duration-200 px-4 py-4 group w-1/4"
                      onClick={() => handleSort('organization')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-wide">Organization</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-indigo-600 ${
                          sortField === 'organization' ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition-all duration-200 px-4 py-4 group w-1/4"
                      onClick={() => handleSort('projectName')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-wide">Project Name</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-indigo-600 ${
                          sortField === 'projectName' ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition-all duration-200 px-4 py-4 group w-1/6"
                      onClick={() => handleSort('projectRegion')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-wide">Region</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-indigo-600 ${
                          sortField === 'projectRegion' ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition-all duration-200 px-4 py-4 group w-1/6"
                      onClick={() => handleSort('disease')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-wide">Disease Focus</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-indigo-600 ${
                          sortField === 'disease' ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition-all duration-200 px-4 py-4 group w-1/8"
                      onClick={() => handleSort('year')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-wide">Year</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-indigo-600 ${
                          sortField === 'year' ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </TableHead>
                  <TableHead className="font-bold text-gray-700 px-4 py-4 w-1/8">
                      <span className="text-sm font-semibold tracking-wide">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={7} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                            <BuildingIcon className="w-10 h-10 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partner Mappings Found</h3>
                            <p className="text-gray-500 mb-4">
                            {searchTerm || selectedRegion !== "all"
                                ? "Try adjusting your search criteria or filters to find what you're looking for."
                                : "No partner mapping submissions have been submitted yet."}
                            </p>
                          {(searchTerm || selectedRegion !== "all") && (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSearchTerm("")
                                  setSelectedRegion("all")
                                }}
                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                              >
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className={`group transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                        selectedItems.has(item.id) 
                          ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-indigo-500 shadow-sm' 
                          : 'border-b border-gray-100'
                      } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="px-4 py-4">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all duration-200"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {item.organization.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {item.organization}
                            </div>
                            <div className="text-xs text-gray-500">Organization</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="max-w-[200px]">
                          <div className="font-medium text-gray-900 truncate group-hover:text-indigo-700 transition-colors" title={item.projectName}>
                            {item.projectName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Project</div>
                        </div>
                      </TableCell>
                        <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <MapPinIcon className="w-3 h-3 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {item.projectRegion}
                            </div>
                            {item.district && (
                              <div className="text-xs text-gray-500">{item.district}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="max-w-[150px]">
                          <div className="text-sm text-gray-900 truncate group-hover:text-indigo-700 transition-colors" title={Array.isArray(item.disease) ? item.disease.join(', ') : item.disease}>
                            {Array.isArray(item.disease) ? item.disease.join(', ') : item.disease}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Disease Focus</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <CalendarIcon className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {item.year}
                            </div>
                            <div className="text-xs text-gray-500">Year</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMapping(item)}
                              className="flex items-center gap-2 bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300 text-indigo-700 hover:text-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span className="font-medium">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-indigo-900">
                                {item.organization} - Project Details
                              </DialogTitle>
                            </DialogHeader>

                            {selectedMapping && (
                              <div className="space-y-6">
                                {/* Project Overview */}
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Project Information</h3>
                                    <p className="text-blue-700 font-medium">{selectedMapping.projectName}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                      <span className="text-sm text-blue-600">{selectedMapping.year}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Location and Disease Focus */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                                    <div className="flex items-center gap-2">
                                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                                      <span>{selectedMapping.projectRegion}</span>
                                      {selectedMapping.district && (
                                        <span className="text-sm text-gray-500">- {selectedMapping.district}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Disease Focus</h3>
                                    <div className="text-sm text-gray-600">
                                      {Array.isArray(selectedMapping.disease) 
                                        ? selectedMapping.disease.join(', ') 
                                        : selectedMapping.disease}
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Information */}
                                {selectedMapping.contact && (
                                  <div className="p-4 bg-green-50 rounded-lg">
                                    <h3 className="font-semibold text-green-800 mb-2">Contact Information</h3>
                                    <div className="space-y-1 text-sm">
                                      {selectedMapping.contact.email && (
                                        <div>Email: {selectedMapping.contact.email}</div>
                                      )}
                                      {selectedMapping.contact.phone && (
                                        <div>Phone: {selectedMapping.contact.phone}</div>
                                      )}
                                      {selectedMapping.contact.website && (
                                        <div>Website: {selectedMapping.contact.website}</div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Partner Mapping Status */}
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <h3 className="font-semibold text-green-800 mb-2">Partner Mapping Information</h3>
                                  <div className="text-sm text-green-700">
                                    <div><strong>Partner:</strong> {selectedMapping.partner}</div>
                                    <div><strong>Role:</strong> {selectedMapping.role}</div>
                                    <div><strong>Sector:</strong> {selectedMapping.sector}</div>
                                    <div className="text-xs text-green-600 mt-2">
                                      ✓ Partner mapping information from submitted mapping form
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Enhanced Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Page {currentPage} of {totalPages}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-500">{filteredAndSortedData.length} total items</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-gray-500">
                      <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeftIcon className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1 mx-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 p-0 font-medium transition-all duration-200 ${
                              currentPage === pageNum 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-gray-600 hover:text-indigo-600 hover:border-indigo-300'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
