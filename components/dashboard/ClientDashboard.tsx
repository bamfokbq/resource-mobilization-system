'use client';

import React from 'react';
import { useDashboardData, useInvalidateDashboard } from '@/hooks/useDashboardData';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import DashboardContent from './DashboardContent';
import DashboardErrorFallback from './DashboardErrorFallback';
import { DashboardLoading } from './DashboardData';

interface ClientDashboardProps {
  userId: string;
  userName?: string;
}

export default function ClientDashboard({ userId, userName }: ClientDashboardProps) {
  // Use React Query to fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch
  } = useDashboardData(userId, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Hook to invalidate cache (useful for manual refresh)
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
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <DashboardHeader userName={userName} />
        <DashboardLoading />
      </div>
    );
  }

  // Handle no data state
  if (!dashboardData) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <DashboardHeader userName={userName} />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  // Render dashboard with data
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header with refresh functionality */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <DashboardHeader userName={userName} />
        </div>
        <button
          onClick={() => {
            invalidateDashboard(userId);
            refetch();
          }}
          className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Refresh dashboard data"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <DashboardStats metrics={dashboardData.metrics} />
      
      {/* Dashboard Content */}
      <DashboardContent data={dashboardData} />
    </div>
  );
}
