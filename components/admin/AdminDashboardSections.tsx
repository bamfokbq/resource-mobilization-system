import { getAdminAnalytics } from '@/actions/adminAnalytics'
import { getDashboardStats, getRecentSurveyActivity } from '@/actions/dashboardStats'
import AdminDashboardHeader from '@/components/dashboard/AdminDashboardHeader'
import AdminDashboardKPICards from '@/components/dashboard/AdminDashboardKPICards'
import MonthlyTrendsChart from '@/components/dashboard/MonthlyTrendsChart'
import RecentSurveyActivity from '@/components/dashboard/RecentSurveyActivity'
import SurveyManagementSection from '@/components/dashboard/SurveyManagementSection'
import TechnicalAnalyticsSection from '@/components/dashboard/TechnicalAnalyticsSection'
import TopRegionsAndSectors from '@/components/dashboard/TopRegionsAndSectors'

// Simulate network delay for demonstration purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function AdminHeaderSection() {
    await delay(100) // Highest priority - loads first
    const dashboardStatsResult = await getDashboardStats()
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    
    return <AdminDashboardHeader dashboardStats={dashboardStats} />
}

export async function AdminKPISection() {
    await delay(200) // High priority
    const dashboardStatsResult = await getDashboardStats()
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    
    return <AdminDashboardKPICards dashboardStats={dashboardStats} />
}

export async function AdminRegionsSection() {
    await delay(400) // Medium priority
    const dashboardStatsResult = await getDashboardStats()
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    
    return dashboardStats ? (
        <TopRegionsAndSectors dashboardStats={dashboardStats} />
    ) : null
}

export async function AdminActivitySection() {
    await delay(300) // Medium-high priority
    const recentActivityResult = await getRecentSurveyActivity(5)
    const recentActivity = recentActivityResult.success ? recentActivityResult.data : []
    
    return <RecentSurveyActivity activities={recentActivity || []} />
}

export async function AdminTrendsSection() {
    await delay(500) // Medium priority
    const dashboardStatsResult = await getDashboardStats()
    const dashboardStats = dashboardStatsResult.success ? dashboardStatsResult.data : null
    
    return dashboardStats?.monthlyTrends ? (
        <MonthlyTrendsChart monthlyTrends={dashboardStats.monthlyTrends} />
    ) : null
}

export async function AdminTechnicalSection() {
    await delay(600) // Lower priority
    const analyticsResult = await getAdminAnalytics()
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    return <TechnicalAnalyticsSection systemMetrics={analyticsData?.systemMetrics || null} />
}

export async function AdminSurveyManagementSection() {
    await delay(700) // Lower priority
    return <SurveyManagementSection />
}
