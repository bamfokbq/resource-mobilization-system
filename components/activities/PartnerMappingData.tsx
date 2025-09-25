"use client";

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  EditIcon,
  CheckCircle,
  X,
  Save,
  RefreshCw,
  AlertTriangle
} from "lucide-react"
import { getAllPartnerMappings, deletePartnerMapping, updatePartnerMapping, getPartnerMappingById } from '@/actions/partnerMappingActions'
import { toast } from 'sonner'

export default function PartnerMappingData() {
  const [partnerMappingData, setPartnerMappingData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedMapping, setSelectedMapping] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingMapping, setEditingMapping] = useState<any>(null)

  // Enhanced table state
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("submissionDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [mappingToDelete, setMappingToDelete] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>(null)

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
              mappingId: mapping.id,
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


  const handleViewMapping = async (mappingId: string) => {
    try {
      const result = await getPartnerMappingById(mappingId)
      if (result.success && result.partnerMapping) {
        setSelectedMapping(result.partnerMapping)
        setIsSheetOpen(true)
        setIsEditing(false)
      } else {
        toast.error(result.message || 'Failed to load mapping details')
      }
    } catch (error) {
      console.error('Error loading mapping:', error)
      toast.error('Failed to load mapping details')
    }
  }

  const handleEditMapping = async (mappingId: string) => {
    try {
      const result = await getPartnerMappingById(mappingId)
      if (result.success && result.partnerMapping) {
        setEditingMapping(result.partnerMapping)
        setSelectedMapping(result.partnerMapping)
        setEditFormData(result.partnerMapping.data.partnerMappings[0])
        setIsSheetOpen(true)
        setIsEditing(true)
      } else {
        toast.error(result.message || 'Failed to load mapping for editing')
      }
    } catch (error) {
      console.error('Error loading mapping for editing:', error)
      toast.error('Failed to load mapping for editing')
    }
  }

  const handleDeleteMapping = (mappingId: string) => {
    setMappingToDelete(mappingId)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteMapping = async () => {
    if (!mappingToDelete) return

    setIsDeleting(mappingToDelete)
    try {
      const result = await deletePartnerMapping(mappingToDelete)
      if (result.success) {
        toast.success('Partner mapping deleted successfully')
        // Refresh the data
        const refreshResult = await getAllPartnerMappings()
        if (refreshResult.success && refreshResult.partnerMappings) {
          const transformedData = refreshResult.partnerMappings.flatMap((mapping, mappingIndex) => 
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
              submissionDate: mapping.createdAt,
              mappingId: mapping.id
            }))
          )
          setPartnerMappingData(transformedData)
        }
      } else {
        toast.error(result.message || 'Failed to delete partner mapping')
      }
    } catch (error) {
      console.error('Error deleting mapping:', error)
      toast.error('Failed to delete partner mapping')
    } finally {
      setIsDeleting(null)
      setIsDeleteModalOpen(false)
      setMappingToDelete(null)
    }
  }

  const cancelDeleteMapping = () => {
    setIsDeleteModalOpen(false)
    setMappingToDelete(null)
  }

  const handleFormInputChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUpdateMapping = async (mappingId: string, updateData: any) => {
    setIsUpdating(mappingId)
    try {
      const result = await updatePartnerMapping(mappingId, updateData)
      if (result.success) {
        toast.success('Partner mapping updated successfully')
        setIsEditing(false)
        setIsSheetOpen(false)
        // Refresh the data
        const refreshResult = await getAllPartnerMappings()
        if (refreshResult.success && refreshResult.partnerMappings) {
          const transformedData = refreshResult.partnerMappings.flatMap((mapping, mappingIndex) => 
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
              submissionDate: mapping.createdAt,
              mappingId: mapping.id
            }))
          )
          setPartnerMappingData(transformedData)
        }
      } else {
        toast.error(result.message || 'Failed to update partner mapping')
      }
    } catch (error) {
      console.error('Error updating mapping:', error)
      toast.error('Failed to update partner mapping')
    } finally {
      setIsUpdating(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Enhanced Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border border-green-200">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-2xl"></div>
                  <div className="w-16 h-6 bg-yellow-200 rounded-full"></div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-8 bg-red-200 rounded mb-2"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Table Loading Skeleton */}
        <Card className="border-0 shadow-2xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 h-20">
            <div className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-300 rounded-2xl"></div>
                <div>
                  <div className="w-64 h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="w-96 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-4 animate-pulse"></div>
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
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

        {/* Enhanced Search and Filter Section */}
        <Card className="border-0 shadow-2xl bg-white">
        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-0 shadow-2xl bg-green-200 text-green-800 overflow-hidden relative">
            <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{summaryStats.totalSubmissions}</div>
                  <div className="text-green-800 text-sm sm:text-base lg:text-lg font-semibold">Total Submissions</div>
                  <div className="text-xs text-green-700 mt-1 sm:mt-2">Individual survey submissions</div>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-300 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <BuildingIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-yellow-200 text-yellow-800 overflow-hidden relative">
            <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{summaryStats.uniqueOrganizations}</div>
                  <div className="text-yellow-800 text-sm sm:text-base lg:text-lg font-semibold">Unique Organizations</div>
                  <div className="text-xs text-yellow-700 mt-1 sm:mt-2">Participating in partnerships</div>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-300 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-red-200 text-red-800 overflow-hidden relative">
            <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{summaryStats.uniquePartners}</div>
                <div className="text-red-800 text-sm sm:text-base lg:text-lg font-semibold">Unique Partners</div>
                <div className="text-xs text-red-700 mt-1 sm:mt-2">Partner organizations</div>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-300 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <TargetIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-blue-200 text-blue-800 overflow-hidden relative">
            <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{summaryStats.regionalCoverage}</div>
                  <div className="text-blue-800 text-sm sm:text-base lg:text-lg font-semibold">Regions Covered</div>
                  <div className="text-xs text-blue-700 mt-1 sm:mt-2">Geographic coverage</div>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-300 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPinIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Search organizations, projects, partners, roles, or diseases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 h-12 sm:h-14 border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-300 text-base sm:text-lg rounded-xl sm:rounded-2xl"
              />
            </div>

            {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-500 rounded-full"></div>
                  Region Filter
                </label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-12 sm:h-14 border-2 border-gray-200 hover:border-gray-400 focus:border-gray-500 transition-all duration-300 rounded-xl sm:rounded-2xl">
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
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-500 rounded-full"></div>
                  Items per Page
                </label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="h-12 sm:h-14 border-2 border-gray-200 hover:border-gray-400 focus:border-gray-500 transition-all duration-300 rounded-xl sm:rounded-2xl">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-sm bg-gradient-to-r from-green-50 to-yellow-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-green-200">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800 text-xs sm:text-sm">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                  </span>
                </div>
              </div>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-300 text-xs sm:text-sm"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>


        {/* Enhanced Partner Mapping Data Table */}
        <Card className="border-0 shadow-2xl bg-white overflow-hidden">
          <CardHeader className="bg-gray-600 text-white relative overflow-hidden">
            <h3 className="text-2xl font-bold">Partners Mapping Table</h3>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <Table className="relative">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-green-50 to-yellow-50 border-b-2 border-green-200">
                    <TableHead 
                    className="font-bold text-green-800 cursor-pointer hover:bg-green-100 transition-all duration-200 px-6 py-6 group w-1/4"
                      onClick={() => handleSort('organization')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wide">Organization</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-green-600 ${
                          sortField === 'organization' ? 'text-green-600' : 'text-green-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-green-800 cursor-pointer hover:bg-green-100 transition-all duration-200 px-6 py-6 group w-1/4"
                      onClick={() => handleSort('projectName')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wide">Project Name</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-green-600 ${
                          sortField === 'projectName' ? 'text-green-600' : 'text-green-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-green-800 cursor-pointer hover:bg-green-100 transition-all duration-200 px-6 py-6 group w-1/6"
                      onClick={() => handleSort('projectRegion')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wide">Region</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-green-600 ${
                          sortField === 'projectRegion' ? 'text-green-600' : 'text-green-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-green-800 cursor-pointer hover:bg-green-100 transition-all duration-200 px-6 py-6 group w-1/6"
                      onClick={() => handleSort('disease')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wide">Disease Focus</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-green-600 ${
                          sortField === 'disease' ? 'text-green-600' : 'text-green-400'
                        }`} />
                      </div>
                    </TableHead>
                    <TableHead 
                    className="font-bold text-green-800 cursor-pointer hover:bg-green-100 transition-all duration-200 px-6 py-6 group w-1/8"
                      onClick={() => handleSort('year')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wide">Year</span>
                        <ArrowUpDownIcon className={`w-4 h-4 transition-colors group-hover:text-green-600 ${
                          sortField === 'year' ? 'text-green-600' : 'text-green-400'
                        }`} />
                      </div>
                    </TableHead>
                  <TableHead className="font-bold text-green-800 px-6 py-6 w-16">
                      <span className="text-sm font-bold tracking-wide">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={6} className="px-4 py-16 text-center">
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
                                className="text-green-600 border-green-200 hover:bg-green-50"
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
                      className={`group transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r hover:from-green-50 hover:to-yellow-50 border-b border-green-100 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50/30'}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {item.organization.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              {item.organization}
                            </div>
                            <div className="text-xs text-green-600 font-medium">Organization</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="max-w-[200px]">
                          <div className="font-medium text-gray-900 truncate group-hover:text-green-700 transition-colors" title={item.projectName}>
                            {item.projectName}
                          </div>
                          <div className="text-xs text-yellow-600 font-medium mt-1">Project</div>
                        </div>
                      </TableCell>
                        <TableCell className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-2xl flex items-center justify-center shadow-sm">
                            <MapPinIcon className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                              {item.projectRegion}
                            </div>
                            {item.district && (
                              <div className="text-xs text-green-600">{item.district}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="max-w-[150px]">
                          <div className="text-sm text-gray-900 truncate group-hover:text-green-700 transition-colors" title={Array.isArray(item.disease) ? item.disease.join(', ') : item.disease}>
                            {Array.isArray(item.disease) ? item.disease.join(', ') : item.disease}
                          </div>
                          <div className="text-xs text-red-600 font-medium mt-1">Disease Focus</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-2xl flex items-center justify-center shadow-sm">
                            <CalendarIcon className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              {item.year}
                            </div>
                            <div className="text-xs text-yellow-600 font-medium">Year</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
                            >
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleViewMapping(item.mappingId)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <EyeIcon className="w-4 h-4 text-blue-600" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditMapping(item.mappingId)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <EditIcon className="w-4 h-4 text-orange-600" />
                              <span>Edit Mapping</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMapping(item.mappingId)}
                              disabled={isDeleting === item.mappingId}
                              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            >
                              {isDeleting === item.mappingId ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <TrashIcon className="w-4 h-4" />
                              )}
                              <span>Delete Mapping</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {paginatedData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BuildingIcon className="w-10 h-10 text-gray-400" />
                  </div>
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
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                paginatedData.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className="group transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white border-green-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6">
                      {/* Header with Organization and Actions */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                            {item.organization.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">
                              {item.organization}
                            </h3>
                            <p className="text-sm text-green-600 font-medium">Organization</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
                            >
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleViewMapping(item.mappingId)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <EyeIcon className="w-4 h-4 text-blue-600" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditMapping(item.mappingId)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <EditIcon className="w-4 h-4 text-orange-600" />
                              <span>Edit Mapping</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMapping(item.mappingId)}
                              disabled={isDeleting === item.mappingId}
                              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            >
                              {isDeleting === item.mappingId ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <TrashIcon className="w-4 h-4" />
                              )}
                              <span>Delete Mapping</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Project Information */}
                      <div className="space-y-3">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <BuildingIcon className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-800 text-sm">Project</span>
                          </div>
                          <p className="font-medium text-gray-900">{item.projectName}</p>
                          <p className="text-xs text-green-600 mt-1">Year: {item.year}</p>
                        </div>

                        {/* Location and Disease */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPinIcon className="w-4 h-4 text-yellow-600" />
                              <span className="font-semibold text-yellow-800 text-sm">Location</span>
                            </div>
                            <p className="font-medium text-gray-900">{item.projectRegion}</p>
                            {item.district && (
                              <p className="text-xs text-yellow-600 mt-1">{item.district}</p>
                            )}
                          </div>

                          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                              <TargetIcon className="w-4 h-4 text-red-600" />
                              <span className="font-semibold text-red-800 text-sm">Disease Focus</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">
                              {Array.isArray(item.disease) ? item.disease.join(', ') : item.disease}
                            </p>
                          </div>
                        </div>

                        {/* Partner Information */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <UsersIcon className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-gray-800 text-sm">Partner</span>
                          </div>
                          <p className="font-medium text-gray-900">{item.partner}</p>
                          <p className="text-xs text-gray-600 mt-1">Role: {item.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Enhanced Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t bg-gradient-to-r from-green-50 to-yellow-50 px-4 sm:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm">
                    <div className="flex items-center gap-2 sm:gap-3 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-bold">Page {currentPage} of {totalPages}</span>
                      <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                      <span className="text-green-600">{filteredAndSortedData.length} total items</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-600">
                      <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)}</span>
                    </div>
                  </div>
                  
                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-green-300"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-green-300"
                    >
                      <ChevronLeftIcon className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1 mx-3">
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
                            className={`w-12 h-10 p-0 font-bold transition-all duration-200 ${
                              currentPage === pageNum 
                                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                                : 'text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 border-green-300'
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
                      className="px-4 py-2 text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-green-300"
                    >
                      Next
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-green-300"
                    >
                      Last
                    </Button>
                  </div>

                  {/* Mobile Pagination */}
                  <div className="flex sm:hidden items-center gap-2 w-full justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-green-300"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    
                    {/* Mobile Page numbers - show fewer */}
                    <div className="flex items-center gap-1 mx-2">
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 p-0 font-bold transition-all duration-200 ${
                              currentPage === pageNum 
                                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                                : 'text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 border-green-300'
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
                      className="px-3 py-2 text-green-700 hover:text-green-800 hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-green-300"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sheet for Viewing/Editing Partner Mapping */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-[800px] sm:max-w-[800px] p-0">
            <SheetHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  {isEditing ? <EditIcon className="w-6 h-6 text-white" /> : <EyeIcon className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Partner Mapping' : 'View Partner Mapping'}
                  </SheetTitle>
                  <SheetDescription className="text-gray-600">
                    {isEditing ? 'Modify the partner mapping details below' : 'Review the partner mapping details below'}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {selectedMapping && (
              <div className="h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="space-y-6 p-6">
                {/* Project Overview */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BuildingIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    Project Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Organization</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.organization || ''}
                          onChange={(e) => handleFormInputChange('organization', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.organization}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Project Name</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.projectName || ''}
                          onChange={(e) => handleFormInputChange('projectName', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.projectName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Year</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.year || ''}
                          onChange={(e) => handleFormInputChange('year', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.year}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Work Nature</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.workNature || ''}
                          onChange={(e) => handleFormInputChange('workNature', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.workNature}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location and Disease Focus */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    Location & Focus
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Region</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.projectRegion || ''}
                          onChange={(e) => handleFormInputChange('projectRegion', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.projectRegion}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">District</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.district || ''}
                          onChange={(e) => handleFormInputChange('district', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.district || 'N/A'}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Disease Focus</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.disease || ''}
                          onChange={(e) => handleFormInputChange('disease', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.disease}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Partner Information */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <UsersIcon className="w-4 h-4 text-orange-600" />
                    </div>
                    Partner Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Partner Organization</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.partner || ''}
                          onChange={(e) => handleFormInputChange('partner', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.partner}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Role</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.role || ''}
                          onChange={(e) => handleFormInputChange('role', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.role}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sector</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.sector || ''}
                          onChange={(e) => handleFormInputChange('sector', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.sector || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Work Nature</label>
                      {isEditing ? (
                        <Input
                          value={editFormData?.workNature || ''}
                          onChange={(e) => handleFormInputChange('workNature', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.workNature}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                {(selectedMapping.data.partnerMappings[0]?.phone || selectedMapping.data.partnerMappings[0]?.email || selectedMapping.data.partnerMappings[0]?.website) && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BuildingIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMapping.data.partnerMappings[0]?.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Phone</label>
                          <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.phone}</p>
                        </div>
                      )}
                      {selectedMapping.data.partnerMappings[0]?.email && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-gray-900 font-medium mt-1">{selectedMapping.data.partnerMappings[0]?.email}</p>
                        </div>
                      )}
                      {selectedMapping.data.partnerMappings[0]?.website && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-600">Website</label>
                          <a 
                            href={selectedMapping.data.partnerMappings[0]?.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-medium mt-1 block"
                          >
                            {selectedMapping.data.partnerMappings[0]?.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submission Details */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    Submission Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created</label>
                      <p className="text-gray-900 font-medium mt-1">
                        {new Date(selectedMapping.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Updated</label>
                      <p className="text-gray-900 font-medium mt-1">
                        {new Date(selectedMapping.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <Badge 
                        variant="outline" 
                        className="bg-gray-100 text-gray-800 border-gray-300 mt-1"
                      >
                        {selectedMapping.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Mapping ID</label>
                      <p className="text-gray-900 font-mono text-sm mt-1">{selectedMapping.id}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={() => handleUpdateMapping(selectedMapping.id, { ...selectedMapping.data, partnerMappings: [editFormData] })}
                        disabled={isUpdating === selectedMapping.id}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-lg"
                      >
                        {isUpdating === selectedMapping.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 flex items-center gap-2"
                      >
                        <EditIcon className="w-4 h-4" />
                        Edit Mapping
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteMapping(selectedMapping.id)}
                        className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Mapping
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsSheetOpen(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Close
                      </Button>
                    </>
                  )}
                </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-red-800">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </div>
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-gray-600 pt-2">
                Are you sure you want to delete this partner mapping? This action cannot be undone and will permanently remove all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={cancelDeleteMapping}
                disabled={isDeleting !== null}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteMapping}
                disabled={isDeleting !== null}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Mapping
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
