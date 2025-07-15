import { Suspense } from 'react'
// import { getAdminAnalytics, getSystemPerformanceMetrics } from '@/actions/adminAnalytics'
// import { getAllSurveys } from '@/actions/surveyActions'
// import ErrorStatesSection from '@/components/dashboard/ErrorStatesSection'
import {
    AdminHeaderSection,
    AdminKPISection,
    AdminRegionsSection,
    AdminActivitySection
} from '@/components/admin/AdminDashboardSections'


// Individual section skeletons
function HeaderSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
        </div>
    )
}

function KPISkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-6 w-6 bg-gray-200 rounded"></div>
                            <div className="h-5 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function RegionsSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    )
}

function ActivitySkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default async function AdminDashboardPage() {
    // Safe data fetching with proper error handling
    // const [analyticsResult, performanceResult, surveysResult] = await Promise.allSettled([
    //     getAdminAnalytics().catch(error => {
    //         console.error('Analytics fetch failed:', error)
    //         return { success: false, error: error.message || 'Failed to fetch analytics data' }
    //     }),
    //     getSystemPerformanceMetrics().catch(error => {
    //         console.error('Performance metrics fetch failed:', error)
    //         return { success: false, error: error.message || 'Failed to fetch performance data' }
    //     }),
    //     getAllSurveys().catch(error => {
    //         console.error('Surveys fetch failed:', error)
    //         return { success: false, error: error.message || 'Failed to fetch surveys data' }
    //     }),
    // ])

    // Extract results from Promise.allSettled
    // const analyticsData = analyticsResult.status === 'fulfilled'
    //     ? analyticsResult.value
    //     : { success: false, error: 'Connection failed' }

    // const performanceData = performanceResult.status === 'fulfilled'
    //     ? performanceResult.value
    //     : { success: false, error: 'Connection failed' }

    // const surveysData = surveysResult.status === 'fulfilled'
    //     ? surveysResult.value
    //     : { success: false, error: 'Connection failed' }

    return (
        <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen overflow-x-hidden">
            <Suspense fallback={<HeaderSkeleton />}>
                <AdminHeaderSection />
            </Suspense>

            <Suspense fallback={<KPISkeleton />}>
                <AdminKPISection />
            </Suspense>

            <Suspense fallback={<RegionsSkeleton />}>
                <AdminRegionsSection />
            </Suspense>

            <Suspense fallback={<ActivitySkeleton />}>
                <AdminActivitySection />
            </Suspense>

            {/* <ErrorStatesSection
                analyticsResult={analyticsData}
                performanceResult={performanceData}
                dashboardStatsResult={{ success: true }}
                surveysResult={surveysData}
            /> */}
        </div>
    )
}
