'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    Upload,
    CloudUpload,
    X,
    File,
    FileText,
    FileSpreadsheet,
    Presentation,
    Video,
    Image
} from 'lucide-react'
import { useResourceUpload } from '@/hooks/useResourceUpload'
import { usePartners } from '@/hooks/usePartners'
import { FileFormat } from '@/types/resources'

// Helper function to get file icon
const getFileIcon = (format: string) => {
    const ext = format.toLowerCase()
    switch (ext) {
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

export function ResourceUploadSection() {
    const {
        selectedFiles,
        isUploading,
        uploadProgress,
        dragActive,
        resourceForm,
        handleFileSelect,
        removeFile,
        handleDrag,
        handleDrop,
        updateForm,
        handleUpload,
        resetForm
    } = useResourceUpload()

    const { partners, loading: partnersLoading } = usePartners()

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Resources
                </CardTitle>
                <CardDescription>
                    Upload and organize new resources for your organization
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${dragActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-lg font-medium text-gray-900 mb-2">
                        Drop files here or click to browse
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                        Supports PDF, DOC, XLS, PPT, images, and videos
                    </div>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.avi,.mov"
                    />
                    <label htmlFor="file-upload">
                        <Button variant="outline" asChild>
                            <span>Browse Files</span>
                        </Button>
                    </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                    <div>
                        <Label className="text-base font-medium">Selected Files</Label>
                        <div className="mt-2 space-y-2">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        {getFileIcon(file.name.split('.').pop() || '')}
                                        <div>
                                            <div className="font-medium text-sm">{file.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        disabled={isUploading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resource Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={resourceForm.title || ''}
                            onChange={(e) => updateForm('title', e.target.value)}
                            placeholder="Enter resource title"
                            disabled={isUploading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="partner">Partner *</Label>
                        <Select
                            value={resourceForm.partnerId || ''}
                            onValueChange={(value) => updateForm('partnerId', value)}
                            disabled={isUploading || partnersLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={partnersLoading ? "Loading partners..." : "Select partner"} />
                            </SelectTrigger>
                            <SelectContent>
                                {partners.map((partner) => (
                                    <SelectItem key={partner.id} value={partner.id}>
                                        {partner.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={resourceForm.type || 'reports'}
                            onValueChange={(value) => updateForm('type', value as any)}
                            disabled={isUploading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="reports">Reports</SelectItem>
                                <SelectItem value="guidelines">Guidelines</SelectItem>
                                <SelectItem value="tools">Tools</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={resourceForm.status || 'draft'}
                            onValueChange={(value) => updateForm('status', value as any)}
                            disabled={isUploading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={resourceForm.description || ''}
                        onChange={(e) => updateForm('description', e.target.value)}
                        placeholder="Enter resource description"
                        rows={3}
                        disabled={isUploading}
                    />
                </div>

                <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                        id="author"
                        value={resourceForm.author || ''}
                        onChange={(e) => updateForm('author', e.target.value)}
                        placeholder="Enter author name"
                        disabled={isUploading}
                    />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Upload Progress</Label>
                            <span className="text-sm font-medium">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={resetForm}
                        disabled={isUploading}
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={isUploading || selectedFiles.length === 0 || !resourceForm.title || !resourceForm.partnerId}
                    >
                        {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
