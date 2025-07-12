'use client';

import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { DashboardData } from '@/lib/dashboard/types';

// Client-side API call for dashboard data
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
  gcTime?: number; // Updated from cacheTime in v5
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}

/**
 * React Query hook for dashboard data with caching and automatic refetching
 */
export function useDashboardData(
  userId: string, 
  options: UseDashboardDataOptions = {}
): UseQueryResult<DashboardData, Error> {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus = false,
    refetchInterval = undefined
  } = options;

  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => fetchDashboardDataClient(userId),
    enabled: enabled && !!userId,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchInterval,
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for invalidating dashboard data (useful after survey submission)
 */
export function useInvalidateDashboard() {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  };
}

/**
 * Hook for prefetching dashboard data (useful for performance optimization)
 */
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

/**
 * Hook for manually refetching dashboard data
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return (userId: string) => {
    return queryClient.refetchQueries({
      queryKey: ['dashboard', userId],
      type: 'active'
    });
  };
}

/**
 * Hook for optimistic updates (useful for immediate UI updates)
 */
export function useOptimisticDashboardUpdate() {
  const queryClient = useQueryClient();

  return (userId: string, updater: (oldData: DashboardData | undefined) => DashboardData) => {
    queryClient.setQueryData(['dashboard', userId], updater);
  };
}
