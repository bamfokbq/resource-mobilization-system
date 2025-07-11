"use client"

import { useState, useEffect, useCallback } from 'react'
import { DashboardStats } from '@/actions/dashboardStats'

interface DashboardData {
  stats: DashboardStats | null
  recentActivity: Array<{
    _id: string;
    organisationName: string;
    projectName: string;
    region: string;
    submissionDate: string;
    status: string;
    createdBy: string;
  }>
  timestamp: string
}

interface UseDashboardDataOptions {
  refreshInterval?: number
  includeActivity?: boolean
}

export function useDashboardData(
  initialData: DashboardData,
  options: UseDashboardDataOptions = {}
) {
  const { refreshInterval = 300000, includeActivity = true } = options // 5 minutes default
  
  const [data, setData] = useState<DashboardData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/dashboard?includeActivity=${includeActivity}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const newData = await response.json()
      setData(newData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh data')
    } finally {
      setIsLoading(false)
    }
  }, [includeActivity])

  const forceRefresh = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'refresh' })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const newData = await response.json()
      setData(newData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to force refresh dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Set up automatic refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(refreshData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshData, refreshInterval])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh: refreshData,
    forceRefresh
  }
}
