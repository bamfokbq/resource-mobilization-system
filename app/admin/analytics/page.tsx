import React, { Suspense } from 'react'
import { getAdminAnalytics, getSystemPerformanceMetrics } from '@/actions/adminAnalytics'
import AdminCharts from '@/components/dashboard/AdminCharts'
import UserEngagementCharts from '@/components/dashboard/UserEngagementCharts'
import AdminKPICards from '@/components/dashboard/AdminKPICards'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import Link from 'next/link'
import { ArrowLeft, Download, Filter, TrendingUp, BarChart3, Users, Activity } from 'lucide-react'

export default async function AdminAnalyticsPage() {
    // Fetch analytics data
    const [analyticsResult, performanceResult] = await Promise.all([
        getAdminAnalytics(),
        getSystemPerformanceMetrics()
    ])

    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    const performanceData = performanceResult.success ? performanceResult.data : null

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin/dashboard" 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Advanced Analytics
                            </h1>
                            <p className="text-gray-600 mt-2">Comprehensive data insights and performance metrics</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-10 w-48"></div>}>
                            <DateRangeSelector />
                        </Suspense>
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                            <Download size={20} />
                            Export Report
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2">
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Analytics Overview Cards */}
            {analyticsData?.kpis && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <TrendingUp className="text-blue-600" size={24} />
                            Performance Overview
                        </h2>
                        <p className="text-gray-600">Key performance indicators and growth metrics</p>
                    </div>
                    <AdminKPICards kpis={analyticsData.kpis} />
                </div>
            )}

            {/* System Metrics Charts */}
            {analyticsData?.systemMetrics && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <BarChart3 className="text-purple-600" size={24} />
                            System Analytics
                        </h2>
                        <p className="text-gray-600">Detailed system performance and usage trends</p>
                    </div>
                    <AdminCharts systemMetrics={analyticsData.systemMetrics} />
                </div>
            )}

            {/* User Engagement Analysis */}
            {analyticsData?.userEngagement && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Users className="text-green-600" size={24} />
                            User Engagement Analysis
                        </h2>
                        <p className="text-gray-600">In-depth user behavior and engagement patterns</p>
                    </div>
                    <UserEngagementCharts userEngagement={analyticsData.userEngagement} />
                </div>
            )}

            {/* Additional Analytics Sections */}
            {performanceData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* System Health */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="text-green-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-800">System Health</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Uptime</span>
                                <span className="font-semibold text-green-600">{performanceData.uptime}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Response Time</span>
                                <span className="font-semibold text-blue-600">{performanceData.responseTime}ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Error Rate</span>
                                <span className="font-semibold text-orange-600">{performanceData.errorRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Database Size</span>
                                <span className="font-semibold text-purple-600">{performanceData.databaseSize}</span>
                            </div>
                        </div>
                    </div>

                    {/* Data Insights */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="text-blue-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-800">Data Insights</h3>
                        </div>
                        {analyticsData?.kpis && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Completion Rate</span>
                                    <span className="font-semibold text-green-600">{analyticsData.kpis.completionRate}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Avg. Time to Complete</span>
                                    <span className="font-semibold text-blue-600">{analyticsData.kpis.avgTimeToComplete}min</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">User Growth Rate</span>
                                    <span className="font-semibold text-purple-600">+{analyticsData.kpis.userGrowthRate}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Survey Growth Rate</span>
                                    <span className="font-semibold text-orange-600">+{analyticsData.kpis.surveyGrowthRate}%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="text-purple-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
                        </div>
                        {analyticsData?.kpis && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{analyticsData.kpis.totalUsers}</div>
                                    <div className="text-sm text-gray-600">Total Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{analyticsData.kpis.totalSurveys}</div>
                                    <div className="text-sm text-gray-600">Completed Surveys</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{analyticsData.kpis.activeUsers}</div>
                                    <div className="text-sm text-gray-600">Active Users</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error States */}
            {!analyticsResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-red-500" size={24} />
                        <h3 className="text-lg font-semibold text-red-700">Analytics Error</h3>
                    </div>
                    <p className="text-red-600">{analyticsResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">Please check your database connection and try refreshing the page.</p>
                </div>
            )}
        </div>
    )
}
