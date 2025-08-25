/**
 * Custom hook to trigger resource stats refresh from anywhere in the app
 * Use this for new resource insertions and deletions
 */

import { useCallback } from 'react'
import { triggerNewResourceAdded, triggerResourceDeleted } from '@/utils/events'

export function useResourceStatsRefresh() {
    const refreshResourceStats = useCallback(() => {
        triggerNewResourceAdded()
    }, [])

    const refreshStatsAfterDeletion = useCallback(() => {
        triggerResourceDeleted()
    }, [])

    return {
        refreshResourceStats, // For new resource additions
        refreshStatsAfterDeletion // For resource deletions
    }
}

/**
 * Helper function that can be called after new resource creation
 * Use this only when a new resource is actually added/inserted
 */
export function notifyNewResourceAdded() {
    triggerNewResourceAdded()
}

/**
 * Helper function that can be called after resource deletion
 * Use this when a resource is actually deleted
 */
export function notifyResourceDeleted() {
    triggerResourceDeleted()
}
