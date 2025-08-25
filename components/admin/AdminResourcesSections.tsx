'use client'

import { useState, useCallback, useMemo } from 'react'
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

// Mock data for demonstration
const mockResources: Resource[] = Array.from({ length: 15 }, (_, i) => ({
    id: `resource-${i + 1}`,
    title: `Resource Document ${i + 1}`,
    description: `This is a comprehensive resource document covering important topics for development programs and policy implementation.`,
    type: ['research-findings', 'concept-notes', 'program-briefs', 'publications', 'reports'][i % 5] as ResourceType,
    fileFormat: ['PDF', 'DOC', 'DOCX', 'XLS', 'PPT'][i % 5] as FileFormat,
    fileSize: Math.floor(Math.random() * 15000000) + 500000,
    fileName: `resource-document-${i + 1}.pdf`,
    fileUrl: `/api/resources/${i + 1}/download`,
    thumbnailUrl: i % 3 === 0 ? `/api/resources/${i + 1}/thumbnail` : undefined,
    status: ['published', 'draft', 'under-review', 'archived'][i % 4] as ResourceStatus,
    accessLevel: ['public', 'internal', 'restricted', 'confidential'][i % 4] as AccessLevel,
    uploadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    partnerId: `partner-${(i % 5) + 1}`,
    partner: {
        id: `partner-${(i % 5) + 1}`,
        name: ['UNICEF Ghana', 'WHO Ghana', 'Ghana Health Service', 'Plan International', 'World Vision'][i % 5],
        category: 'International NGO',
        region: 'Greater Accra'
    },
    projectId: `project-${(i % 3) + 1}`,
    project: {
        id: `project-${(i % 3) + 1}`,
        name: ['Health System Strengthening', 'Education Reform', 'Community Development'][i % 3],
        description: 'Project description',
        startDate: '2023-01-01',
        status: 'active',
        partnerId: `partner-${(i % 5) + 1}`
    },
    tags: [
        { id: `tag-${i % 8 + 1}`, name: ['health', 'education', 'policy', 'research', 'community', 'development', 'children', 'technology'][i % 8], color: '#3B82F6' }
    ],
    downloadCount: Math.floor(Math.random() * 500) + 10,
    viewCount: Math.floor(Math.random() * 1500) + 50,
    isFavorited: Math.random() > 0.7,
    rating: Math.random() > 0.4 ? Math.floor(Math.random() * 5) + 1 : undefined,
    author: ['Dr. John Smith', 'Prof. Sarah Johnson', 'Maria Garcia', 'David Chen'][i % 4],
    version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
    language: 'English',
    keywords: ['development', 'policy', 'implementation']
}))

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
    const stats = useMemo(() => [
        {
            title: 'Total Resources',
            value: '1,247',
            change: '+12%',
            changeType: 'positive' as const,
            icon: FileText,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Total Downloads',
            value: '45,892',
            change: '+23%',
            changeType: 'positive' as const,
            icon: Download,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Storage Used',
            value: '124.5 GB',
            change: '+8%',
            changeType: 'positive' as const,
            icon: Database,
            color: 'text-purple-600 bg-purple-50'
        },
        {
            title: 'Pending Reviews',
            value: '23',
            change: '-5%',
            changeType: 'negative' as const,
            icon: Clock,
            color: 'text-orange-600 bg-orange-50'
        }
    ], [])

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
    const [resources] = useState<Resource[]>(mockResources)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                resource.author?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || resource.status === statusFilter
            const matchesType = typeFilter === 'all' || resource.type === typeFilter
            
            return matchesSearch && matchesStatus && matchesType
        })
    }, [resources, searchTerm, statusFilter, typeFilter])

    const handleDeleteResource = useCallback((resourceId: string) => {
        toast.success('Resource deleted successfully')
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
                                                    <span className="text-sm">{resource.partner.name}</span>
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
                            </TableBody>
                        </Table>
                    </ScrollArea>
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
    const [resourceForm, setResourceForm] = useState<Partial<CreateResourceRequest>>({
        title: '',
        description: '',
        type: 'reports',
        status: 'draft',
        accessLevel: 'internal',
        partnerId: '',
        keywords: []
    })

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

    const simulateUpload = useCallback(async () => {
        setIsUploading(true)
        setUploadProgress(0)

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 200))
            setUploadProgress(i)
        }

        toast.success('Resource uploaded successfully!')
        setIsUploading(false)
        setUploadProgress(0)
        setSelectedFiles([])
        setResourceForm({
            title: '',
            description: '',
            type: 'reports',
            status: 'draft',
            accessLevel: 'internal',
            partnerId: '',
            keywords: []
        })
    }, [])

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
                                    <label htmlFor="file-upload">
                                        <Button variant="outline" className="cursor-pointer">
                                            <FilePlus className="h-4 w-4 mr-2" />
                                            Browse Files
                                        </Button>
                                    </label>
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
                                
                                <div>
                                    <Label htmlFor="upload-title">Title *</Label>
                                    <Input
                                        id="upload-title"
                                        placeholder="Enter resource title"
                                        value={resourceForm.title}
                                        onChange={(e) => setResourceForm(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                <div>
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
                                    <div>
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

                                    <div>
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

                                <div>
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

                                <Button 
                                    onClick={simulateUpload}
                                    disabled={isUploading || selectedFiles.length === 0 || !resourceForm.title}
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
            <Card>
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
            </Card>
        </motion.div>
    )
}
