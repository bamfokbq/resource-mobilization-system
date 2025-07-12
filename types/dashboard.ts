export interface DashboardStats {
    totalSurveys: number
    totalUsers: number
    completionRate: number
    totalDrafts: number
    topRegions: Array<{ region: string; count: number }>
    topSectors: Array<{ sector: string; count: number }>
    monthlyTrends: Array<{
        month: string
        surveys: number
        drafts: number
    }>
}

export interface AdminAnalyticsData {
    kpis?: any
    systemMetrics?: any
}

export interface ErrorResult {
    success: boolean
    message?: string
}

export interface ActivityData {
    id: string
    type: string
    user: string
    surveyTitle: string
    timestamp: Date
    status: string
}
