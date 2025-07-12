import { auth } from '@/auth';
import { Suspense } from 'react';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard';
import { DashboardLoading } from '@/components/dashboard/DashboardData';

/**
 * Real-time Dashboard Demo Page
 * 
 * This page demonstrates advanced React Query features:
 * - Real-time data synchronization
 * - Optimistic updates
 * - Auto-refresh capabilities
 * - Mutation status tracking
 * - Cache management
 */
export default async function RealTimeDashboardPage() {
  // Get authenticated user session
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">You need to be logged in to view the real-time dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Real-time Dashboard Demo
            </h1>
            <p className="text-gray-600">
              Experience React Query's powerful features: real-time updates, optimistic mutations, 
              and intelligent caching.
            </p>
          </div>
          
          <Suspense fallback={<DashboardLoading />}>
            <RealTimeDashboard userId={session.user.id} />
          </Suspense>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
}
