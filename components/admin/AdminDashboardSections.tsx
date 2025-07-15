import { getDashboardStats, getRecentSurveyActivity } from '@/actions/dashboardStats'
import AdminDashboardHeader from '@/components/dashboard/AdminDashboardHeader'
import AdminDashboardKPICards from '@/components/dashboard/AdminDashboardKPICards'
import RecentSurveyActivity from '@/components/dashboard/RecentSurveyActivity'
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
