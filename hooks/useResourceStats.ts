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
    const [loading, setLoading] = useState(true) // Start with loading true
    const [error, setError] = useState<string | null>(null)

    const loadStats = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const statsData = await getResourceStats()
            setStats(statsData)
        } catch (err) {
            setError('Failed to load statistics')
            // Set fallback stats on error
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

        // No automatic polling - only refresh on explicit events
    }, [loadStats])

    // Listen for new resource additions and deletions
    useEffect(() => {
        const handleNewResourceAdded = () => {
            refreshStats()
        }

        const handleResourceDeleted = () => {
            refreshStats()
        }

        window.addEventListener('newResourceAdded', handleNewResourceAdded)
        window.addEventListener('resourceDeleted', handleResourceDeleted)

        return () => {
            window.removeEventListener('newResourceAdded', handleNewResourceAdded)
            window.removeEventListener('resourceDeleted', handleResourceDeleted)
        }
    }, [refreshStats])

    return {
        stats,
        loading,
        error,
        refreshStats
    }
}
