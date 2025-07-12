'use client';

import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { DashboardData } from '@/lib/dashboard/types';

// This would be the client-side version that calls an API endpoint
async function fetchDashboardDataClient(userId: string): Promise<DashboardData> {
  const response = await fetch(`/api/dashboard?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}

interface UseDashboardDataOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
}

export function useDashboardData(
  userId: string, 
  options: UseDashboardDataOptions = {}
): UseQueryResult<DashboardData, Error> {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false
  } = options;

  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => fetchDashboardDataClient(userId),
    enabled: enabled && !!userId,
    staleTime,
    cacheTime,
    refetchOnWindowFocus,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for invalidating dashboard data (useful after survey submission)
export function useInvalidateDashboard() {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries(['dashboard', userId]);
    } else {
      queryClient.invalidateQueries(['dashboard']);
    }
  };
}

// Hook for prefetching dashboard data
export function usePrefetchDashboard() {
  const queryClient = useQueryClient();

  return (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['dashboard', userId],
      queryFn: () => fetchDashboardDataClient(userId),
      staleTime: 5 * 60 * 1000,
    });
  };
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
