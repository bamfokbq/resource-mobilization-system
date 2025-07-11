import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import RefreshButton from '@/components/shared/RefreshButton'
import SurveyTableSkeleton from '@/components/skeletons/SurveyTableSkeleton'
import { getAllSurveys } from '@/actions/surveyActions'
import { Suspense } from 'react'
import { RiHistoryLine, RiFileList2Line, RiUserLine, RiCalendarLine } from 'react-icons/ri'
import { MdAdminPanelSettings } from 'react-icons/md'
import AdminSurveyList from '@/components/tables/AdminSurveyList'


export default async function AdminSurveysPage() {
  // Fetch all surveys data on the server (admin can see all surveys)
  const surveysResult = await getAllSurveys()

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MdAdminPanelSettings className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Survey Management
            </h1>
          </div>
          <p className="text-gray-600 mt-2">Monitor and manage all user surveys across the platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-600">
              <RiFileList2Line size={20} />
              <span className="font-semibold">
                {surveysResult.success ? surveysResult.count || 0 : 0} Surveys
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex items-center gap-3">
            <RiHistoryLine className="text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">All Survey Submissions</h2>
              <p className="text-gray-500 text-sm">View and manage all user survey submissions</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <RiUserLine className="text-green-600" size={16} />
              <span className="text-green-800 font-medium text-sm">Admin View</span>
            </div>
            
            <Suspense fallback={
              <div className="bg-gray-100 animate-pulse rounded-lg h-10 w-48"></div>
            }>
              <DateRangeSelector />
            </Suspense>
            
            <RefreshButton />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-3">
              <RiFileList2Line className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Surveys</h3>
              <p className="text-2xl font-bold text-blue-600">
                {surveysResult.success ? surveysResult.count || 0 : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-3">
              <RiUserLine className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active Users</h3>
              <p className="text-2xl font-bold text-green-600">
                {surveysResult.success && surveysResult.data ? 
                  new Set(surveysResult.data.map((survey: any) => survey.userId)).size : 0
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-full p-3">
              <RiCalendarLine className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">This Month</h3>
              <p className="text-2xl font-bold text-purple-600">
                {surveysResult.success && surveysResult.data ? 
                  surveysResult.data.filter((survey: any) => {
                    const surveyDate = new Date(survey.createdAt);
                    const now = new Date();
                    return surveyDate.getMonth() === now.getMonth() && 
                           surveyDate.getFullYear() === now.getFullYear();
                  }).length : 0
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Survey List */}
      <div className="bg-white rounded-xl shadow-lg">
        <Suspense fallback={<SurveyTableSkeleton />}>
          <AdminSurveyList initialData={surveysResult} />
        </Suspense>
      </div>
    </div>
  )
}
