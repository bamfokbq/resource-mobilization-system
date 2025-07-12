'use client';

import { Suspense } from 'react';
import { fetchDashboardData } from '@/lib/dashboard/dashboardService';
import { useDashboardData, useInvalidateDashboard } from '@/hooks/useDashboardData';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardErrorFallback from '@/components/dashboard/DashboardErrorFallback';

interface DashboardDataProps {
  userId: string;
  enableReactQuery?: boolean;
}

// Server-side version (original)
async function ServerDashboardData({ userId }: { userId: string }) {
  const dashboardData = await fetchDashboardData(userId);
  
  return (
    <>
      <DashboardStats metrics={dashboardData.metrics} />
      <DashboardContent data={dashboardData} />
    </>
  );
}

// Client-side version with React Query
function ClientDashboardData({ userId }: { userId: string }) {
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useDashboardData(userId, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const invalidateDashboard = useInvalidateDashboard();

  // Handle error state
  if (isError) {
    return (
      <DashboardErrorFallback 
        error={error || new Error('Unknown error')}
        resetErrorBoundary={() => {
          invalidateDashboard(userId);
          refetch();
        }}
      />
    );
  }

  // Handle loading state
  if (isLoading) {
    return <DashboardLoading />;
  }

  // Handle no data state
  if (!dashboardData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">No dashboard data available.</p>
      </div>
    );
  }

  // Render dashboard with data
  return (
    <div className="space-y-8">
      {/* Real-time indicator */}
      {isFetching && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 text-sm">Updating dashboard data...</span>
          </div>
          <button
            onClick={() => {
              invalidateDashboard(userId);
              refetch();
            }}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Force Refresh
          </button>
        </div>
      )}

      {/* Enhanced Stats Cards */}
      <DashboardStats metrics={dashboardData.metrics} />
      
      {/* Dashboard Content */}
      <DashboardContent data={dashboardData} />
    </div>
  );
}

// Main component that decides which version to use
export default function DashboardData({ userId, enableReactQuery = false }: DashboardDataProps) {
  if (enableReactQuery) {
    return <ClientDashboardData userId={userId} />;
  } else {
    return (
      <Suspense fallback={<DashboardLoading />}>
        <ServerDashboardData userId={userId} />
      </Suspense>
    );
  }
}

export function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl p-6 shadow-lg h-32">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Regional Insights Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-36 mb-6"></div>
          <div className="h-48 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Active Surveys Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
