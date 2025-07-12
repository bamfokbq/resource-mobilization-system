import { getAdminAnalytics, getSystemPerformanceMetrics } from '@/actions/adminAnalytics'
import { getDashboardStats, getRecentSurveyActivity } from '@/actions/dashboardStats'
import { getUserStats } from '@/actions/users'
import { getAllSurveys } from '@/actions/surveyActions'
import AdminDashboardHeader from '@/components/dashboard/AdminDashboardHeader'
import AdminDashboardKPICards from '@/components/dashboard/AdminDashboardKPICards'
import TopRegionsAndSectors from '@/components/dashboard/TopRegionsAndSectors'
import MonthlyTrendsChart from '@/components/dashboard/MonthlyTrendsChart'
import SurveyManagementSection from '@/components/dashboard/SurveyManagementSection'
import ErrorStatesSection from '@/components/dashboard/ErrorStatesSection'
import TechnicalAnalyticsSection from '@/components/dashboard/TechnicalAnalyticsSection'
import RecentSurveyActivity from '@/components/dashboard/RecentSurveyActivity'

export default async function AdminDashboardPage() {
    // Fetch all analytics data
    const [analyticsResult, performanceResult, userStatsResult, dashboardStatsResult, surveysResult, recentActivityResult] = await Promise.all([
        getAdminAnalytics(),
        getSystemPerformanceMetrics(),
        getUserStats(),
        getDashboardStats(),
        getAllSurveys(),
        getRecentSurveyActivity(5)
    ])

    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    const performanceData = performanceResult.success ? performanceResult.data : null
    const userStats = userStatsResult
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    const surveysData = surveysResult.success ? surveysResult.data : []
    const recentActivity = recentActivityResult.success ? recentActivityResult.data : []

    return (
        <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen overflow-x-hidden">
            {/* Enhanced Header with Real-time Status */}
            <AdminDashboardHeader dashboardStats={dashboardStats} />

            {/* Real-time Dashboard KPIs */}
            <AdminDashboardKPICards dashboardStats={dashboardStats} />

            {/* Regional & Sector Insights */}
            {dashboardStats && (
                <TopRegionsAndSectors dashboardStats={dashboardStats} />
            )}

            {/* Recent Survey Activity */}
            <RecentSurveyActivity activities={recentActivity || []} />

            {/* Monthly Trends Chart */}
            {dashboardStats?.monthlyTrends && (
                <MonthlyTrendsChart monthlyTrends={dashboardStats.monthlyTrends} />
            )}

            {/* Technical Analytics */}
            <TechnicalAnalyticsSection systemMetrics={analyticsData?.systemMetrics || null} />

            {/* Survey Management Table */}
            <SurveyManagementSection />

            {/* Error States */}
            <ErrorStatesSection
                analyticsResult={analyticsResult}
                performanceResult={performanceResult}
                dashboardStatsResult={dashboardStatsResult}
                surveysResult={surveysResult}
            />
        </div>
    )
}
