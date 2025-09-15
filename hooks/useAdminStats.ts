import { useState, useEffect } from 'react'
import { getAdminStatsWithFallback } from '@/actions'

export interface AdminStat {
  id: number
  name: string
  amount: number
}

export interface AdminStatsData {
  stats: AdminStat[]
  lastUpdated: string
}

export interface UseAdminStatsReturn {
  stats: AdminStat[]
  isLoading: boolean
  error: string | null
  lastUpdated: string
  refetch: () => Promise<void>
}

export function useAdminStats(): UseAdminStatsReturn {
  const [stats, setStats] = useState<AdminStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getAdminStatsWithFallback()
      
      if (result.success && result.data) {
        setStats(result.data.stats)
        setLastUpdated(result.data.lastUpdated)
      } else {
        setError(result.message || 'Failed to fetch admin stats')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching admin stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchStats
  }
}
