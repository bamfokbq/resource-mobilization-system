import {
    AdminSurveysStatsSection,
    AdminSurveysTableSection
} from '@/components/admin/AdminSurveysSections'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import RefreshButton from '@/components/shared/RefreshButton'
import { Suspense } from 'react'
import { MdAdminPanelSettings } from 'react-icons/md'
import { RiHistoryLine } from 'react-icons/ri'

// Individual section skeletons
function SurveyStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-6 w-6 bg-gray-200 rounded"></div>
                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function SurveyTableSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/7"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/9"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default async function AdminSurveysPage() {
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
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <DateRangeSelector />
                        <RefreshButton />
                    </div>
                </div>
            </div>

            {/* Survey Stats with Streaming */}
            <Suspense fallback={<SurveyStatsSkeleton />}>
                <AdminSurveysStatsSection />
            </Suspense>

            {/* Survey Table with Streaming */}
            <Suspense fallback={<SurveyTableSkeleton />}>
                <AdminSurveysTableSection />
            </Suspense>
        </div>
    )
}
