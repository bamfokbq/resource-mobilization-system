import { getAdminAnalytics } from '@/actions/adminAnalytics'
import { getDashboardStats, getRecentSurveyActivity } from '@/actions/dashboardStats'
import AdminDashboardHeader from '@/components/dashboard/AdminDashboardHeader'
import AdminDashboardKPICards from '@/components/dashboard/AdminDashboardKPICards'
import MonthlyTrendsChart from '@/components/dashboard/MonthlyTrendsChart'
import RecentSurveyActivity from '@/components/dashboard/RecentSurveyActivity'
import SurveyManagementSection from '@/components/dashboard/SurveyManagementSection'
import TechnicalAnalyticsSection from '@/components/dashboard/TechnicalAnalyticsSection'
import TopRegionsAndSectors from '@/components/dashboard/TopRegionsAndSectors'


export async function AdminHeaderSection() {
    return <AdminDashboardHeader />
}

export async function AdminKPISection() {
    const dashboardStatsResult = await getDashboardStats()
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    
    return <AdminDashboardKPICards dashboardStats={dashboardStats} />
}

export async function AdminRegionsSection() {
    const dashboardStatsResult = await getDashboardStats()
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    
    return dashboardStats ? (
        <TopRegionsAndSectors dashboardStats={dashboardStats} />
    ) : null
}

export async function AdminActivitySection() {
    const recentActivityResult = await getRecentSurveyActivity(5)
    const recentActivity = recentActivityResult.success ? recentActivityResult.data : []
    
    return <RecentSurveyActivity activities={recentActivity || []} />
}

export async function AdminTrendsSection() {
    const dashboardStatsResult = await getDashboardStats()
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    
    return dashboardStats?.monthlyTrends ? (
        <MonthlyTrendsChart monthlyTrends={dashboardStats.monthlyTrends} />
    ) : null
}

export async function AdminTechnicalSection() {
    const analyticsResult = await getAdminAnalytics()
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    return <TechnicalAnalyticsSection systemMetrics={analyticsData?.systemMetrics || null} />
}

export async function AdminSurveyManagementSection() {
    return <SurveyManagementSection />
}
