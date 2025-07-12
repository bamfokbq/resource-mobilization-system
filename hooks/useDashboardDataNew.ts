'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '@/lib/dashboard/types';

// Legacy support for the old dashboard data structure
interface LegacyDashboardData {
  stats: any | null;
  recentActivity: Array<{
    _id: string;
    organisationName: string;
    projectName: string;
    region: string;
    submissionDate: string;
    status: string;
    createdBy: string;
  }>;
  timestamp: string;
}

interface UseDashboardDataOptions {
  refreshInterval?: number;
  includeActivity?: boolean;
}

// Legacy hook for backwards compatibility
export function useDashboardData(
  initialData: LegacyDashboardData,
  options: UseDashboardDataOptions = {}
) {
  const { refreshInterval = 300000, includeActivity = true } = options; // 5 minutes default
  
  const [data, setData] = useState<LegacyDashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/dashboard?includeActivity=${includeActivity}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newData = await response.json();
      setData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [includeActivity]);

  const forceRefresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/dashboard?includeActivity=${includeActivity}&t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newData = await response.json();
      setData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to force refresh dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [includeActivity]);

  // Set up automatic refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshData, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    forceRefresh,
  };
}

// New hooks for React Query support (when available)
export function useDashboardDataQuery(
  userId: string, 
  options: { enabled?: boolean; staleTime?: number } = {}
) {
  // For now, this is a placeholder for future React Query integration
  // When @tanstack/react-query is available, this would use useQuery
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/dashboard?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, options.enabled]);

  useEffect(() => {
    if (userId && options.enabled !== false) {
      fetchData();
    }
  }, [fetchData, userId, options.enabled]);

  return { data, isLoading, error, refetch: fetchData };
}
