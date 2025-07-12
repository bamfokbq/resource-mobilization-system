import { Suspense } from 'react';
import { fetchDashboardData } from '@/lib/dashboard/dashboardService';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardStats from '@/components/dashboard/DashboardStats';

interface DashboardDataProps {
  userId: string;
}

export default async function DashboardData({ userId }: DashboardDataProps) {
  const dashboardData = await fetchDashboardData(userId);
  
  return (
    <>
      {/* Enhanced Stats Cards */}
      <DashboardStats metrics={dashboardData.metrics} />
      
      {/* Dashboard Content */}
      <DashboardContent data={dashboardData} />
    </>
  );
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
