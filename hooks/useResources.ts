import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { fetchResources, deleteResource } from '@/actions/resources'
import { Resource } from '@/types/resources'
import { triggerResourcesUpdated, triggerResourceDeleted } from '@/utils/events'

interface UseResourcesProps {
    searchTerm?: string
    statusFilter?: string
    typeFilter?: string
    currentPage?: number
    pageSize?: number
}

export function useResources({
    searchTerm = '',
    statusFilter = 'all',
    typeFilter = 'all',
    currentPage = 1,
    pageSize = 25
}: UseResourcesProps = {}) {
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

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
    }, [searchTerm, statusFilter, typeFilter, currentPage, pageSize, refreshTrigger])

    const handleDeleteResource = useCallback(async (resourceId: string) => {
        try {
            const result = await deleteResource(resourceId)

            if (result.success) {
                toast.success('Resource deleted successfully')
                setRefreshTrigger(prev => prev + 1)
                // Trigger resource list updates
                triggerResourcesUpdated()
                // Trigger stats refresh for deletion
                triggerResourceDeleted()
            } else {
                toast.error(result.message || 'Failed to delete resource')
            }
        } catch (error) {
            console.error('Error deleting resource:', error)
            toast.error('Failed to delete resource')
        }
    }, [])

    const refreshResources = useCallback(() => {
        setRefreshTrigger(prev => prev + 1)
    }, [])

    useEffect(() => {
        loadResources()
    }, [loadResources])

    // Listen for resource updates
    useEffect(() => {
        const handleResourcesUpdated = () => {
            refreshResources()
        }

        window.addEventListener('resourcesUpdated', handleResourcesUpdated)
        return () => {
            window.removeEventListener('resourcesUpdated', handleResourcesUpdated)
        }
    }, [refreshResources])

    return {
        resources,
        loading,
        totalPages,
        handleDeleteResource,
        refreshResources,
        loadResources
    }
}
