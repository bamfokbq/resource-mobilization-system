import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import RefreshButton from '@/components/shared/RefreshButton'
import SurveyHistoryList from '@/components/tables/SurveyHistoryList'
import SurveyTableSkeleton from '@/components/skeletons/SurveyTableSkeleton'
import { getUserSurveys, getSurveyAnalytics } from '@/actions/surveyActions'
import { auth } from '@/auth'
import Link from 'next/link'
import { Suspense } from 'react'
import { RiAddLine, RiHistoryLine, RiBarChartLine, RiPieChartLine } from 'react-icons/ri'
import { TrendingUp, Activity, Users, CheckCircle } from 'lucide-react'

// Async component for Survey Statistics Cards - Fastest loading
async function SurveyStatsSection({ userId }: { userId: string }) {
  const [surveysResult, analyticsResult] = await Promise.all([
    getUserSurveys(userId),
    getSurveyAnalytics(userId)
  ]);

  const surveys = surveysResult.success ? surveysResult.data || [] : [];
  const analytics = analyticsResult.success ? analyticsResult.data : null;

  const totalSurveys = surveys.length;
  const completedSurveys = surveys.filter((survey: any) => survey.status === 'submitted').length;
  const completionRate = totalSurveys > 0 ? Math.round((completedSurveys / totalSurveys) * 100) : 0;
  const recentSurveys = surveys.filter((survey: any) => {
    const surveyDate = new Date(survey.submissionDate || survey.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return surveyDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <RiBarChartLine className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            Total
          </span>
        </div>
        <h3 className="text-sm font-medium text-blue-700 mb-2">Total Mappings</h3>
        <p className="text-3xl font-bold text-blue-900">{totalSurveys}</p>
        <p className="text-xs text-blue-600 mt-2">All your mappings</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-500 rounded-xl shadow-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Complete
          </span>
        </div>
        <h3 className="text-sm font-medium text-green-700 mb-2">Completed</h3>
        <p className="text-3xl font-bold text-green-900">{completedSurveys}</p>
        <p className="text-xs text-green-600 mt-2">Successfully submitted</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            Rate
          </span>
        </div>
        <h3 className="text-sm font-medium text-purple-700 mb-2">Completion Rate</h3>
        <p className="text-3xl font-bold text-purple-900">{completionRate}%</p>
        <p className="text-xs text-purple-600 mt-2">Success percentage</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            Recent
          </span>
        </div>
        <h3 className="text-sm font-medium text-orange-700 mb-2">Recent Activity</h3>
        <p className="text-3xl font-bold text-orange-900">{recentSurveys}</p>
        <p className="text-xs text-orange-600 mt-2">Last 30 days</p>
      </div>
    </div>
  );
}

// Async component for Survey Controls - Medium loading
async function SurveyControlsSection({ userId }: { userId: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <RiHistoryLine className="text-blue-500" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Mapping History</h2>
            <p className="text-gray-500 text-sm">View and manage your mapping submissions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Suspense fallback={
            <div className="bg-gray-100 animate-pulse rounded-lg h-10 w-48"></div>
          }>
            <DateRangeSelector />
          </Suspense>
          <RefreshButton />
        </div>
      </div>
    </div>
  );
}

// Async component for Survey History List - Slower loading
async function SurveyHistorySection({ userId }: { userId: string }) {
  const surveysResult = await getUserSurveys(userId);

  return <SurveyHistoryList initialData={surveysResult} />;
}

export default async function SurveysPage() {
  // Get authenticated user session
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">You need to be logged in to view your surveys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header - Loads immediately */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mapping Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all your mappings in one place</p>
        </div>
        <Link
          href="/dashboard/surveys/form"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <RiAddLine size={20} />
          Start New Mapping
        </Link>
      </div>

      {/* Survey Statistics Cards - Stream in first (fastest) */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      }>
        <SurveyStatsSection userId={session.user.id} />
      </Suspense>

      {/* Survey Controls Section - Stream in second */}
      <Suspense fallback={
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div>
                  <div className="w-32 h-5 bg-gray-200 rounded mb-1"></div>
                  <div className="w-48 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-48 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      }>
        <SurveyControlsSection userId={session.user.id} />
      </Suspense>

      {/* Survey History List - Stream in last (slowest) */}
      <Suspense fallback={<SurveyTableSkeleton />}>
        <SurveyHistorySection userId={session.user.id} />
      </Suspense>
    </div>
  )
}


