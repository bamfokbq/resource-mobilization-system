import { auth } from '@/auth';
import { Suspense } from 'react';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import { DashboardLoading } from '@/components/dashboard/DashboardData';

/**
 * Client-side Dashboard Page using React Query
 * 
 * This is an alternative implementation that demonstrates:
 * - Client-side data fetching with React Query
 * - Automatic caching and background refetching
 * - Optimistic updates and cache invalidation
 * - Real-time data synchronization
 */
export default async function ClientDashboardPage() {
  // Get authenticated user session
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <Suspense fallback={<DashboardLoading />}>
        <ClientDashboard 
          userId={session.user.id} 
          userName={session.user.name || undefined}
        />
      </Suspense>
    </DashboardErrorBoundary>
  );
}
