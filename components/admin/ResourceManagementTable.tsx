'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Settings,
    Search,
    Filter,
    Edit,
    Trash2,
    File,
    FileText,
    FileSpreadsheet,
    Presentation,
    Video,
    Image
} from 'lucide-react'
import { useResources } from '@/hooks/useResources'
import { Resource, FileFormat } from '@/types/resources'

// Helper function to get file icon
const getFileIcon = (format: FileFormat) => {
    switch (format.toLowerCase()) {
        case 'pdf': return <File className="h-4 w-4 text-red-500" />
        case 'doc':
        case 'docx': return <FileText className="h-4 w-4 text-blue-500" />
        case 'xls':
        case 'xlsx': return <FileSpreadsheet className="h-4 w-4 text-green-500" />
        case 'ppt':
        case 'pptx': return <Presentation className="h-4 w-4 text-orange-500" />
        case 'mp4':
        case 'avi':
        case 'mov': return <Video className="h-4 w-4 text-purple-500" />
        case 'jpg':
        case 'jpeg':
        case 'png': return <Image className="h-4 w-4 text-pink-500" />
        default: return <File className="h-4 w-4 text-gray-500" />
    }
}

interface ResourceManagementTableProps {
    onEditResource?: (resource: Resource) => void
}

export function ResourceManagementTable({ onEditResource }: ResourceManagementTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    const {
        resources,
        loading,
        totalPages,
        handleDeleteResource
    } = useResources({
        searchTerm,
        statusFilter,
        typeFilter,
        currentPage,
        pageSize: 25
    })

    const handleEdit = (resource: Resource) => {
        onEditResource?.(resource)
    }

    const handleDelete = async (resourceId: string) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            await handleDeleteResource(resourceId)
        }
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Resource Management
                        </CardTitle>
                        <CardDescription>
                            View, edit, and manage all uploaded resources
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[140px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="reports">Reports</SelectItem>
                            <SelectItem value="guidelines">Guidelines</SelectItem>
                            <SelectItem value="tools">Tools</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="data">Data</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Resource</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Partner</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
                                                <div>
                                                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-1" />
                                                    <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><div className="h-4 w-16 bg-gray-200 animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-8 w-16 bg-gray-200 animate-pulse rounded" /></TableCell>
                                    </TableRow>
                                ))
                            ) : resources.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <div className="text-gray-500">
                                            <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium mb-2">No resources found</p>
                                            <p className="text-sm">
                                                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                                                    ? 'Try adjusting your filters or search terms'
                                                    : 'Upload your first resource to get started'
                                                }
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                resources.map((resource) => (
                                    <TableRow key={resource.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    {getFileIcon(resource.fileFormat)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {resource.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {resource.fileName}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {resource.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{resource.partner?.name || 'Unknown Partner'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    resource.status === 'published' ? 'default' :
                                                    resource.status === 'draft' ? 'secondary' : 'outline'
                                                }
                                            >
                                                {resource.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(resource.uploadDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(resource)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
