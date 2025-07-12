import { getAdminAnalytics } from '@/actions/adminAnalytics'
import AdminCharts from '@/components/dashboard/AdminCharts'
import AdminKPICards from '@/components/dashboard/AdminKPICards'
import { UserEngagementCharts } from '@/components/dashboard/UserEngagementCharts'

// Simulate network delay for demonstration purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function AdminAnalyticsKPISection() {
    await delay(200) // High priority
    const [analyticsResult] = await Promise.all([
        getAdminAnalytics()
    ])
    
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    return <AdminKPICards kpis={analyticsData?.kpis} />
}

export async function AdminChartsSection() {
    await delay(400) // Medium priority
    const analyticsResult = await getAdminAnalytics()
    
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    if (!analyticsData?.systemMetrics) {
        return <div>No system metrics available</div>
    }
    
    return <AdminCharts systemMetrics={analyticsData.systemMetrics} />
}

export async function AdminEngagementSection() {
    await delay(600) // Lower priority
    const analyticsResult = await getAdminAnalytics()
    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    
    if (!analyticsData?.userEngagement) {
        return <div>No user engagement data available</div>
    }
    
    return <UserEngagementCharts userEngagement={analyticsData.userEngagement} />
}
