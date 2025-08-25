'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileCheck, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadTestProps {
  onUploadSuccess?: (resourceId: string) => void
}

export function FileUploadTest({ onUploadSuccess }: FileUploadTestProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'reports',
    status: 'draft',
    accessLevel: 'internal',
    partnerId: 'partner-1',
    author: '',
    keywords: '',
    tags: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: file.name.split('.')[0].replace(/[-_]/g, ' ')
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !formData.title) {
      toast.error('Please select a file and enter a title')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', selectedFile)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('accessLevel', formData.accessLevel)
      formDataToSend.append('partnerId', formData.partnerId)
      formDataToSend.append('author', formData.author)
      formDataToSend.append('keywords', formData.keywords)
      formDataToSend.append('tags', formData.tags)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 200)

      const response = await fetch('/api/resources', {
        method: 'POST',
        body: formDataToSend
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (result.success) {
        toast.success('Resource uploaded successfully!')
        onUploadSuccess?.(result.resourceId)
        
        // Reset form
        setSelectedFile(null)
        setFormData({
          title: '',
          description: '',
          type: 'reports',
          status: 'draft',
          accessLevel: 'internal',
          partnerId: 'partner-1',
          author: '',
          keywords: '',
          tags: ''
        })
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Test File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <Label htmlFor="file-upload">File *</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
              disabled={isUploading}
            />
            {selectedFile && (
              <div className="mt-2 p-2 bg-green-50 rounded flex items-center gap-2 text-sm text-green-700">
                <FileCheck className="h-4 w-4" />
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter resource title"
              disabled={isUploading}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the resource..."
              rows={3}
              disabled={isUploading}
            />
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Access Level */}
          <div>
            <Label htmlFor="access-level">Access Level</Label>
            <Select 
              value={formData.accessLevel} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, accessLevel: value }))}
              disabled={isUploading}
            >
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

          {/* Author */}
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author name"
              disabled={isUploading}
            />
          </div>

          {/* Keywords and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
                disabled={isUploading}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isUploading || !selectedFile || !formData.title}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Resource'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
