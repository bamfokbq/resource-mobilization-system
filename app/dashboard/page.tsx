import { auth } from '@/auth';
import { Suspense } from 'react';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardData, { DashboardLoading } from '@/components/dashboard/DashboardData';

export default async function UserDashboardPage() {
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
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <DashboardHeader userName={session.user.name || undefined} />

        {/* Dashboard Content with Loading */}
        <Suspense fallback={<DashboardLoading />}>
          <DashboardData userId={session.user.id} />
        </Suspense>
      </div>
    </DashboardErrorBoundary>
  );
}
