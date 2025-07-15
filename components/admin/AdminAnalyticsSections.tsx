import { getAdminAnalytics } from '@/actions/adminAnalytics'
import AdminCharts from '@/components/dashboard/AdminCharts'
import AdminKPICards from '@/components/dashboard/AdminKPICards'
import { UserEngagementCharts } from '@/components/dashboard/UserEngagementCharts'

export async function AdminAnalyticsKPISection() {
    const [analyticsResult] = await Promise.all([
        getAdminAnalytics()
    ])
    
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    return <AdminKPICards kpis={analyticsData?.kpis} />
}

export async function AdminChartsSection() {
    const analyticsResult = await getAdminAnalytics()
    
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    if (!analyticsData?.systemMetrics) {
        return <div>No system metrics available</div>
    }
    
    return <AdminCharts systemMetrics={analyticsData.systemMetrics} />
}

export async function AdminEngagementSection() {
    const analyticsResult = await getAdminAnalytics()
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    if (!analyticsData?.userEngagement) {
        return <div>No user engagement data available</div>
    }
    
    return <UserEngagementCharts userEngagement={analyticsData.userEngagement} />
}
