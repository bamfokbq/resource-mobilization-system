'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
    Folder,
    Upload,
    Download,
    Eye,
    Users,
    FileText,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    Edit,
    Trash2,
    Star,
    Calendar,
    FileCheck,
    AlertCircle,
    CheckCircle,
    Clock,
    Archive,
    Image,
    Video,
    File,
    FileSpreadsheet,
    Presentation,
    FilePlus,
    CloudUpload,
    Database,
    Tags,
    User,
    Building,
    Settings,
    BarChart3,
    TrendingUp,
    Activity,
    Zap
} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { 
    Resource, 
    ResourceType, 
    ResourceStatus, 
    AccessLevel, 
    FileFormat,
    CreateResourceRequest
} from '@/types/resources'
import { createResource, deleteResource, fetchResources, getResourceStats } from '@/actions/resources'

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
        case 'png':
        case 'gif': return <Image className="h-4 w-4 text-pink-500" />
        default: return <File className="h-4 w-4 text-gray-500" />
    }
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to get status color
const getStatusColor = (status: ResourceStatus) => {
    switch (status) {
        case 'published': return 'text-green-600 bg-green-50 border-green-200'
        case 'draft': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        case 'under-review': return 'text-blue-600 bg-blue-50 border-blue-200'
        case 'archived': return 'text-gray-600 bg-gray-50 border-gray-200'
        default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
}

// Helper function to get access level color
const getAccessLevelColor = (accessLevel: AccessLevel) => {
    switch (accessLevel) {
        case 'public': return 'text-green-600 bg-green-50 border-green-200'
        case 'internal': return 'text-blue-600 bg-blue-50 border-blue-200'
        case 'restricted': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        case 'confidential': return 'text-red-600 bg-red-50 border-red-200'
        default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
}

// Header Section Component
export function AdminResourcesHeaderSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Folder className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">
                                    Resource Management
                                </CardTitle>
                                <CardDescription className="text-blue-100">
                                    Manage, upload, and organize organizational resources
                                </CardDescription>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-blue-100">
                                Last updated
                            </div>
                            <div className="text-lg font-semibold">
                                {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </motion.div>
    )
}

// Stats Section Component
export function AdminResourcesStatsSection() {
    const [stats, setStats] = useState([
        {
            title: 'Total Resources',
            value: '0',
            change: '+0%',
            changeType: 'positive' as const,
            icon: FileText,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Total Downloads',
            value: '0',
            change: '+0%',
            changeType: 'positive' as const,
            icon: Download,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Storage Used',
            value: '0 GB',
            change: '+0%',
            changeType: 'positive' as const,
            icon: Database,
            color: 'text-purple-600 bg-purple-50'
        },
        {
            title: 'Pending Reviews',
            value: '0',
            change: '0%',
            changeType: 'neutral' as const,
            icon: Clock,
            color: 'text-orange-600 bg-orange-50'
        }
    ])

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 GB'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    useEffect(() => {
        const loadStats = async () => {
            try {
                const resourceStats = await getResourceStats()

                setStats([
                    {
                        title: 'Total Resources',
                        value: resourceStats.totalResources.toLocaleString(),
                        change: '+12%', // You can calculate this based on historical data
                        changeType: 'positive' as const,
                        icon: FileText,
                        color: 'text-blue-600 bg-blue-50'
                    },
                    {
                        title: 'Total Downloads',
                        value: resourceStats.totalDownloads.toLocaleString(),
                        change: '+23%',
                        changeType: 'positive' as const,
                        icon: Download,
                        color: 'text-green-600 bg-green-50'
                    },
                    {
                        title: 'Storage Used',
                        value: formatFileSize(resourceStats.totalStorageUsed),
                        change: '+8%',
                        changeType: 'positive' as const,
                        icon: Database,
                        color: 'text-purple-600 bg-purple-50'
                    },
                    {
                        title: 'Pending Reviews',
                        value: resourceStats.pendingReviews.toString(),
                        change: resourceStats.pendingReviews > 0 ? '+5%' : '0%',
                        changeType: resourceStats.pendingReviews > 0 ? 'positive' as const : 'neutral' as const,
                        icon: Clock,
                        color: 'text-orange-600 bg-orange-50'
                    }
                ])
            } catch (error) {
                console.error('Error loading resource stats:', error)
            }
        }

        loadStats()
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {stat.title}
                                        </p>
                                        <div className="flex items-baseline mt-2">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                            <span className={`ml-2 text-sm font-medium ${
                                                stat.changeType === 'positive' 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

// Resource Management Section Component
export function AdminResourcesManagementSection() {
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const pageSize = 25

    // Load resources from database
    const loadResources = useCallback(async () => {
        setLoading(true)
        try {
            const filters = {
                search: searchTerm || undefined,
                status: statusFilter !== 'all' ? [statusFilter] as any : undefined,
                type: typeFilter !== 'all' ? [typeFilter] as any : undefined,
                sortBy: 'date' as const,
                sortOrder: 'desc' as const
            }

            const response = await fetchResources(filters, currentPage, pageSize)
            setResources(response.resources)
            setTotalPages(response.pagination.totalPages)
        } catch (error) {
            console.error('Error loading resources:', error)
            toast.error('Failed to load resources')
        } finally {
            setLoading(false)
        }
    }, [searchTerm, statusFilter, typeFilter, currentPage, refreshTrigger])

    useEffect(() => {
        loadResources()
    }, [loadResources])

    // Listen for resource updates
    useEffect(() => {
        const handleResourcesUpdated = () => {
            // Reload resources when new ones are uploaded
            setCurrentPage(1)
            // Force refresh the resources list by incrementing the trigger
            setRefreshTrigger(prev => prev + 1)
        }

        window.addEventListener('resourcesUpdated', handleResourcesUpdated)

        return () => {
            window.removeEventListener('resourcesUpdated', handleResourcesUpdated)
        }
    }, []) // Empty dependency array - this effect should only run once

    // Debounced search
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setCurrentPage(1) // Reset to first page when search changes
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchTerm])

    const filteredResources = useMemo(() => {
        if (loading) return []
        return resources
    }, [resources, loading])

    const handleDeleteResource = useCallback(async (resourceId: string) => {
        try {
            const result = await deleteResource(resourceId)

            if (result.success) {
                toast.success('Resource deleted successfully')
                // Refresh the resources list by incrementing the trigger
                setRefreshTrigger(prev => prev + 1)
            } else {
                toast.error(result.message || 'Failed to delete resource')
            }
        } catch (error) {
            console.error('Error deleting resource:', error)
            toast.error('Failed to delete resource')
        }
    }, [])

    const handleEditResource = useCallback((resource: Resource) => {
        setSelectedResource(resource)
        setIsEditDialogOpen(true)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
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
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Resource
                        </Button>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search resources..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="under-review">Under Review</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="research-findings">Research</SelectItem>
                                <SelectItem value="concept-notes">Concept Notes</SelectItem>
                                <SelectItem value="program-briefs">Program Briefs</SelectItem>
                                <SelectItem value="publications">Publications</SelectItem>
                                <SelectItem value="reports">Reports</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Partner</TableHead>
                                    <TableHead>Upload Date</TableHead>
                                    <TableHead>Downloads</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={`loading-${index}`}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredResources.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="h-8 w-8 text-gray-400" />
                                                <p className="text-gray-500">No resources found</p>
                                                <p className="text-sm text-gray-400">
                                                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                                        ? 'Try adjusting your filters'
                                                        : 'Upload your first resource to get started'
                                                    }
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                            <AnimatePresence>
                                                {filteredResources.map((resource, index) => (
                                                    <motion.tr
                                                        key={resource.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.2, delay: index * 0.02 }}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                {getFileIcon(resource.fileFormat)}
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="font-medium text-gray-900 truncate">
                                                                        {resource.title}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 truncate">
                                                                        {formatFileSize(resource.fileSize)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="capitalize">
                                                                {resource.type.replace('-', ' ')}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`capitalize ${getStatusColor(resource.status)}`}
                                                            >
                                                                {resource.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Building className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm">{resource.partner?.name || 'Unknown Partner'}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm">
                                                                    {new Date(resource.uploadDate).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Download className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm">{resource.downloadCount}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem
                                                                        onClick={() => window.open(resource.fileUrl, '_blank')}
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleEditResource(resource)}
                                                                    >
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteResource(resource.id)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>

                    {/* Pagination */}
                    {!loading && filteredResources.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 py-4">
                            <div className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Resource Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Resource</DialogTitle>
                        <DialogDescription>
                            Update the resource information and metadata
                        </DialogDescription>
                    </DialogHeader>
                    {selectedResource && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input 
                                    id="title" 
                                    defaultValue={selectedResource.title}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                    id="description" 
                                    defaultValue={selectedResource.description}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select defaultValue={selectedResource.status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="under-review">Under Review</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="accessLevel">Access Level</Label>
                                    <Select defaultValue={selectedResource.accessLevel}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="internal">Internal</SelectItem>
                                            <SelectItem value="restricted">Restricted</SelectItem>
                                            <SelectItem value="confidential">Confidential</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            toast.success('Resource updated successfully')
                            setIsEditDialogOpen(false)
                        }}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}

// Resource Upload Section Component
export function AdminResourcesUploadSection() {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [partners, setPartners] = useState<any[]>([])
    const [resourceForm, setResourceForm] = useState<Partial<CreateResourceRequest>>({
        title: '',
        description: '',
        type: 'reports',
        status: 'draft',
        accessLevel: 'internal',
        partnerId: '',
        author: '',
        keywords: []
    })

    // Use static partners data
    useEffect(() => {
        // Set static partners data
        setPartners([
            { id: 'partner-1', name: 'UNICEF Ghana', category: 'International NGO', region: 'Greater Accra' },
            { id: 'partner-2', name: 'WHO Ghana', category: 'International Organization', region: 'Greater Accra' },
            { id: 'partner-3', name: 'Ghana Health Service', category: 'Government Agency', region: 'National' },
            { id: 'partner-4', name: 'Plan International', category: 'International NGO', region: 'Northern Region' },
            { id: 'partner-5', name: 'World Vision Ghana', category: 'International NGO', region: 'Ashanti Region' },
            { id: 'partner-6', name: 'Ministry of Health', category: 'Government Ministry', region: 'National' },
            { id: 'partner-7', name: 'USAID Ghana', category: 'Bilateral Agency', region: 'Greater Accra' },
            { id: 'partner-8', name: 'Save the Children Ghana', category: 'International NGO', region: 'Upper East Region' }
        ])
    }, [])

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files)
            setSelectedFiles(files)
        }
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setSelectedFiles(files)
        }
    }, [])

    const handleUpload = useCallback(async () => {
        if (!selectedFiles.length || !resourceForm.title || !resourceForm.partnerId) {
            toast.error('Please select files, provide a title, and select a partner')
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            // Upload each file
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i]

                // Update progress for current file
                const fileProgress = Math.floor((i / selectedFiles.length) * 80) // 80% for file processing
                setUploadProgress(fileProgress)

                // Create the resource request
                const createRequest: CreateResourceRequest = {
                    title: selectedFiles.length > 1 ? `${resourceForm.title} - ${file.name}` : resourceForm.title!,
                    description: resourceForm.description,
                    type: resourceForm.type!,
                    file: file,
                    partnerId: resourceForm.partnerId!,
                    projectId: resourceForm.projectId,
                    tags: resourceForm.tags || [],
                    status: resourceForm.status!,
                    accessLevel: resourceForm.accessLevel!,
                    publicationDate: undefined,
                    author: resourceForm.author,
                    keywords: resourceForm.keywords || []
                }

                // Call the server action to create the resource
                const result = await createResource(createRequest)

                if (!result.success) {
                    throw new Error(result.message)
                }

                // Update progress
                const completedProgress = Math.floor(((i + 1) / selectedFiles.length) * 90)
                setUploadProgress(completedProgress)
            }

            // Final progress update
            setUploadProgress(100)

            // Show success message
            const fileText = selectedFiles.length === 1 ? 'Resource' : `${selectedFiles.length} resources`
            toast.success(`${fileText} uploaded successfully!`)

            // Reset form and files
            setSelectedFiles([])
            setResourceForm({
                title: '',
                description: '',
                type: 'reports',
                status: 'draft',
                accessLevel: 'internal',
                partnerId: '',
                author: '',
                keywords: []
            })

            // Trigger refresh of the resources list by dispatching a custom event
            window.dispatchEvent(new CustomEvent('resourcesUpdated'))

        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to upload resource')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }, [selectedFiles, resourceForm])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
        >
            {/* Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CloudUpload className="h-5 w-5" />
                        Upload Resources
                    </CardTitle>
                    <CardDescription>
                        Upload and manage resource files with metadata
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-1">
                            <TabsTrigger value="upload">File Upload</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upload" className="space-y-6">
                            {/* File Upload Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    dragActive 
                                        ? 'border-blue-400 bg-blue-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className={`p-4 rounded-full ${
                                        dragActive ? 'bg-blue-100' : 'bg-gray-50'
                                    }`}>
                                        <CloudUpload className={`h-8 w-8 ${
                                            dragActive ? 'text-blue-500' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">
                                            Drop files here or click to browse
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Supports PDF, DOC, XLS, PPT, images, and videos up to 50MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.avi,.mov"
                                    />
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <FilePlus className="h-4 w-4 mr-2" />
                                        Browse Files
                                    </Button>
                                </div>
                            </div>

                            {/* Selected Files */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Selected Files</h4>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(file.name.split('.').pop()?.toUpperCase() as FileFormat)}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedFiles(files => files.filter((_, i) => i !== index))
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Progress */}
                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="w-full" />
                                </div>
                            )}

                            {/* Resource Form */}
                            <div className="space-y-4">
                                <Separator />
                                <h4 className="font-medium text-gray-900">Resource Information</h4>

                                <div className='space-y-2'>
                                    <Label htmlFor="upload-title">Title *</Label>
                                    <Input
                                        id="upload-title"
                                        placeholder="Enter resource title"
                                        value={resourceForm.title}
                                        onChange={(e) => setResourceForm(prev => ({ ...prev, title: e.target.value }))}
                                        className={!resourceForm.title ? 'border-red-300 focus:border-red-500' : ''}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor="upload-description">Description</Label>
                                    <Textarea
                                        id="upload-description"
                                        placeholder="Describe the resource content..."
                                        rows={3}
                                        value={resourceForm.description}
                                        onChange={(e) => setResourceForm(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className='space-y-2'>
                                        <Label htmlFor="upload-type">Type</Label>
                                        <Select 
                                            value={resourceForm.type} 
                                            onValueChange={(value) => setResourceForm(prev => ({ ...prev, type: value as ResourceType }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="research-findings">Research Findings</SelectItem>
                                                <SelectItem value="concept-notes">Concept Notes</SelectItem>
                                                <SelectItem value="program-briefs">Program Briefs</SelectItem>
                                                <SelectItem value="publications">Publications</SelectItem>
                                                <SelectItem value="reports">Reports</SelectItem>
                                                <SelectItem value="presentations">Presentations</SelectItem>
                                                <SelectItem value="videos">Videos</SelectItem>
                                                <SelectItem value="datasets">Datasets</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor="upload-status">Status</Label>
                                        <Select 
                                            value={resourceForm.status} 
                                            onValueChange={(value) => setResourceForm(prev => ({ ...prev, status: value as ResourceStatus }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="under-review">Under Review</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className='space-y-2'>
                                        <Label htmlFor="upload-access">Access Level</Label>
                                        <Select
                                            value={resourceForm.accessLevel}
                                            onValueChange={(value) => setResourceForm(prev => ({ ...prev, accessLevel: value as AccessLevel }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select access level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="internal">Internal</SelectItem>
                                                <SelectItem value="restricted">Restricted</SelectItem>
                                                <SelectItem value="confidential">Confidential</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor="upload-partner">Partner *</Label>
                                        <Select
                                            value={resourceForm.partnerId}
                                            onValueChange={(value) => setResourceForm(prev => ({ ...prev, partnerId: value }))}
                                        >
                                            <SelectTrigger className={!resourceForm.partnerId ? 'border-red-300 focus:border-red-500' : ''}>
                                                <SelectValue placeholder="Select partner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {partners.length > 0 ? (
                                                    partners.map((partner) => (
                                                        <SelectItem key={partner.id} value={partner.id}>
                                                            {partner.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem disabled value="loading">Loading partners...</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor="upload-author">Author (Optional)</Label>
                                    <Input
                                        id="upload-author"
                                        placeholder="Enter author name"
                                        value={resourceForm.author || ''}
                                        onChange={(e) => setResourceForm(prev => ({ ...prev, author: e.target.value }))}
                                    />
                                </div>

                                <Button 
                                    onClick={handleUpload}
                                    disabled={isUploading || selectedFiles.length === 0 || !resourceForm.title || !resourceForm.partnerId}
                                    className="w-full"
                                >
                                    {isUploading ? (
                                        <>
                                            <Activity className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Resource
                                        </>
                                    )}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Upload Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">This Month</span>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="font-medium">47 uploads</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Storage Used</span>
                            <span className="font-medium">12.4 GB</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Avg. File Size</span>
                            <span className="font-medium">4.2 MB</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Resources</span>
                            <span className="font-bold text-lg">1,247</span>
                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </motion.div>
    )
}
