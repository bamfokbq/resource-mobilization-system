import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import RefreshButton from '@/components/shared/RefreshButton'
import SurveyHistoryList from '@/components/tables/SurveyHistoryList'
import SurveyTableSkeleton from '@/components/skeletons/SurveyTableSkeleton'
import { getUserSurveys } from '@/actions/surveyActions'
import { auth } from '@/auth'
import Link from 'next/link'
import { Suspense } from 'react'
import { RiAddLine, RiHistoryLine } from 'react-icons/ri'

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

  // Fetch user's surveys data on the server
  const surveysResult = await getUserSurveys(session.user.id)

// If there's an error fetching data, we still render the page
// The component will handle the error state

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Survey Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all your surveys in one place</p>
        </div>
        <Link
          href="/dashboard/surveys/form"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <RiAddLine size={20} />
          Start New Survey
        </Link>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <RiHistoryLine className="text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Survey History</h2>
              <p className="text-gray-500 text-sm">View and manage your survey submissions</p>
            </div>
          </div>          <div className="flex items-center gap-4">
            <Suspense fallback={
              <div className="bg-gray-100 animate-pulse rounded-lg h-10 w-48"></div>
            }>
              <DateRangeSelector />
            </Suspense>
            <RefreshButton />
          </div></div>
      </div> 
      <Suspense fallback={<SurveyTableSkeleton />}>
        <SurveyHistoryList initialData={surveysResult} />
      </Suspense>
    </div>
  )
}


