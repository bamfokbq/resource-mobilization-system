import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { createResource } from '@/actions/resources'
import { CreateResourceRequest } from '@/types/resources'
import { triggerNewResourceAdded, triggerResourcesUpdated } from '@/utils/events'

export function useResourceUpload() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false)
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

    const handleFileSelect = useCallback((files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files)
            setSelectedFiles(prev => [...prev, ...fileArray])
        }
    }, [])

    const removeFile = useCallback((index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
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
        handleFileSelect(e.dataTransfer.files)
    }, [handleFileSelect])

    const updateForm = useCallback(<K extends keyof CreateResourceRequest>(
        field: K,
        value: CreateResourceRequest[K]
    ) => {
        setResourceForm(prev => ({ ...prev, [field]: value }))
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

                // Trigger stats refresh immediately after each successful upload (new resource added)
                triggerNewResourceAdded()
                // Also trigger resource list updates for other components
                triggerResourcesUpdated()

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
            resetForm()

            // Final trigger for stats refresh after all uploads complete
            triggerNewResourceAdded()
            // Also trigger resource list updates for other components
            triggerResourcesUpdated()

        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to upload resource')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }, [selectedFiles, resourceForm])

    const resetForm = useCallback(() => {
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
        setUploadProgress(0)
    }, [])

    return {
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
    }
}
