import { useState, useCallback, useEffect } from 'react'
import { getResourceStats } from '@/actions/resources'

interface ResourceStats {
    totalResources: number
    totalDownloads: number
    totalStorageUsed: number
    recentUploads: number
    pendingReviews: number
}

export function useResourceStats() {
    const [stats, setStats] = useState<ResourceStats>({
        totalResources: 0,
        totalDownloads: 0,
        totalStorageUsed: 0,
        recentUploads: 0,
        pendingReviews: 0
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadStats = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const statsData = await getResourceStats()
            setStats(statsData)
        } catch (err) {
            console.error('Error loading resource stats:', err)
            setError('Failed to load statistics')
            // Set fallback stats
            setStats({
                totalResources: 0,
                totalDownloads: 0,
                totalStorageUsed: 0,
                recentUploads: 0,
                pendingReviews: 0
            })
        } finally {
            setLoading(false)
        }
    }, [])

    const refreshStats = useCallback(() => {
        loadStats()
    }, [loadStats])

    useEffect(() => {
        loadStats()
    }, [loadStats])

    // Listen for resource updates to refresh stats
    useEffect(() => {
        const handleResourcesUpdated = () => {
            refreshStats()
        }

        window.addEventListener('resourcesUpdated', handleResourcesUpdated)
        return () => {
            window.removeEventListener('resourcesUpdated', handleResourcesUpdated)
        }
    }, [refreshStats])

    return {
        stats,
        loading,
        error,
        refreshStats
    }
}
