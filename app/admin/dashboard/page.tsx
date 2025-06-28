import { getAdminAnalytics, getSystemPerformanceMetrics } from '@/actions/adminAnalytics'
import { getUserStats } from '@/actions/users'
import AdminCharts from '@/components/dashboard/AdminCharts'
import BusinessIntelligence from '@/components/dashboard/BusinessIntelligence'
import ManagementSummary from '@/components/dashboard/ManagementSummary'
import OperationalDashboard from '@/components/dashboard/OperationalDashboard'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import SurveyListTable from '@/components/tables/SurveyListTable'
import { Activity, AlertCircle, Database, TrendingUp, Users, Zap, BarChart3, Briefcase, Settings } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { MdOutlinePoll } from 'react-icons/md'
import { RiBarChartLine, RiSettings2Line, RiUserAddLine } from 'react-icons/ri'

export default async function AdminDashboardPage() {
    // Fetch all analytics data
    const [analyticsResult, performanceResult, userStatsResult] = await Promise.all([
        getAdminAnalytics(),
        getSystemPerformanceMetrics(),
        getUserStats()
    ])

    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    const performanceData = performanceResult.success ? performanceResult.data : null
    const userStats = userStatsResult

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white rounded-xl p-6 shadow-lg gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Management Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Executive insights and comprehensive system analytics</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-10 w-48"></div>}>
                        <DateRangeSelector />
                    </Suspense>
                    {/* <Link
                        href="/admin/dashboard/analytics"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
                    >
                        <BarChart3 size={20} />
                        Detailed Analytics
                    </Link> */}
                    <Link
                        href="/admin/users"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
                    >
                        <RiUserAddLine size={20} />
                        Manage Users
                    </Link>
                </div>
            </div>

            {/* Management Executive Summary */}
            {analyticsData?.kpis && analyticsData?.systemMetrics && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Briefcase className="text-blue-600" size={24} />
                            Executive Summary
                        </h2>
                        <p className="text-gray-600">High-level business performance and strategic insights</p>
                    </div>
                    <ManagementSummary kpis={analyticsData.kpis} systemMetrics={analyticsData.systemMetrics} />
                </div>
            )}

            {/* Business Intelligence */}
            {analyticsData?.systemMetrics && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <TrendingUp className="text-green-600" size={24} />
                            Business Intelligence
                        </h2>
                        <p className="text-gray-600">Financial metrics, ROI analysis, and market insights</p>
                    </div>
                    <BusinessIntelligence systemMetrics={analyticsData.systemMetrics} />
                </div>
            )}

            {/* Operational Dashboard */}
            {analyticsData?.kpis && analyticsData?.systemMetrics && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Settings className="text-purple-600" size={24} />
                            Operational Insights
                        </h2>
                        <p className="text-gray-600">System performance, resource utilization, and operational metrics</p>
                    </div>
                    <OperationalDashboard
                        kpis={analyticsData.kpis}
                        systemMetrics={analyticsData.systemMetrics}
                        performanceData={performanceData || undefined}
                    />
                </div>
            )}

            {/* System Performance Cards */}
            {performanceData && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Database className="text-blue-600" size={24} />
                            System Performance
                        </h2>
                        <p className="text-gray-600">Real-time system health and performance indicators</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-blue-100">
                                    <Database size={20} className="text-blue-600" />
                                </div>
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    System
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600">Database Size</h3>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.databaseSize}</p>
                            <p className="text-xs text-gray-500 mt-2">Total storage used</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-green-100">
                                    <Zap size={20} className="text-green-600" />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    Performance
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600">Response Time</h3>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.responseTime}ms</p>
                            <p className="text-xs text-gray-500 mt-2">Average API response</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-purple-100">
                                    <Activity size={20} className="text-purple-600" />
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                    Uptime
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600">System Uptime</h3>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.uptime}%</p>
                            <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-orange-100">
                                    <AlertCircle size={20} className="text-orange-600" />
                                </div>
                                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                    Errors
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600">Error Rate</h3>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.errorRate}%</p>
                            <p className="text-xs text-gray-500 mt-2">24h average</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Technical Analytics */}
            {analyticsData?.systemMetrics && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <RiBarChartLine className="text-purple-600" size={24} />
                            Technical Analytics
                        </h2>
                        <p className="text-gray-600">Detailed system performance and usage trends</p>
                    </div>
                    <AdminCharts systemMetrics={analyticsData.systemMetrics} />
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <RiSettings2Line className="text-orange-600" size={24} />
                        Management Tools
                    </h2>
                    <p className="text-gray-600">Administrative functions and management utilities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                        <Users className="text-blue-600" size={20} />
                        <div>
                            <h3 className="font-medium text-gray-900">User Management</h3>
                            <p className="text-sm text-gray-600">Manage system users</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/surveys"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                    >
                        <MdOutlinePoll className="text-green-600" size={20} />
                        <div>
                            <h3 className="font-medium text-gray-900">Project Control</h3>
                            <p className="text-sm text-gray-600">Manage projects</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/dashboard/analytics"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                    >
                        <RiBarChartLine className="text-purple-600" size={20} />
                        <div>
                            <h3 className="font-medium text-gray-900">Advanced Analytics</h3>
                            <p className="text-sm text-gray-600">Detailed reports</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                    >
                        <RiSettings2Line className="text-orange-600" size={20} />
                        <div>
                            <h3 className="font-medium text-gray-900">System Settings</h3>
                            <p className="text-sm text-gray-600">Configure platform</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Survey Management Table */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <MdOutlinePoll className="text-purple-500 text-2xl" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>
                            <p className="text-gray-600">Monitor and manage project submissions</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/surveys"
                        className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
                    >
                        View All <TrendingUp size={16} />
                    </Link>
                </div>
                <Suspense fallback={
                    <div className="space-y-4 animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                }>
                    <SurveyListTable />
                </Suspense>
            </div>

            {/* Error States */}
            {!analyticsResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-red-500" size={24} />
                        <h3 className="text-lg font-semibold text-red-700">Analytics Error</h3>
                    </div>
                    <p className="text-red-600">{analyticsResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">Please check your database connection and try again.</p>
                </div>
            )}

            {!performanceResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-yellow-600" size={24} />
                        <h3 className="text-lg font-semibold text-yellow-700">Performance Metrics Error</h3>
                    </div>
                    <p className="text-yellow-700">{performanceResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">System performance data is temporarily unavailable.</p>
                </div>
            )}
        </div>
    )
}
