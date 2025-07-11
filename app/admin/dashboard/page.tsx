import { getAdminAnalytics, getSystemPerformanceMetrics } from '@/actions/adminAnalytics'
import { getDashboardStats, getRecentSurveyActivity } from '@/actions/dashboardStats'
import { getUserStats } from '@/actions/users'
import { getAllSurveys } from '@/actions/surveyActions'
import AdminCharts from '@/components/dashboard/AdminCharts'
import BusinessIntelligence from '@/components/dashboard/BusinessIntelligence'
import ManagementSummary from '@/components/dashboard/ManagementSummary'
import OperationalDashboard from '@/components/dashboard/OperationalDashboard'
import RecentSurveyActivity from '@/components/dashboard/RecentSurveyActivity'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import SurveyListTable from '@/components/tables/SurveyListTable'
import { Activity, AlertCircle, Database, TrendingUp, Users, Zap, BarChart3, Briefcase, Settings } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { MdOutlinePoll } from 'react-icons/md'
import { RiBarChartLine, RiSettings2Line, RiUserAddLine } from 'react-icons/ri'
import { FaProjectDiagram } from 'react-icons/fa'

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
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Enhanced Header with Real-time Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Management Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">Executive insights and comprehensive system analytics</p>
                        {dashboardStats && (
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">
                                        {dashboardStats.totalSurveys} Total Surveys
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">
                                        {dashboardStats.totalUsers} Active Users
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">
                                        {dashboardStats.completionRate}% Success Rate
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-10 w-48"></div>}>
                            <DateRangeSelector />
                        </Suspense>
                        <Link
                            href="/admin/users"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
                        >
                            <RiUserAddLine size={20} />
                            Manage Users
                        </Link>
                    </div>
                </div>
            </div>

            {/* Real-time Dashboard KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-100">
                            <MdOutlinePoll size={20} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Total
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Total Surveys</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalSurveys || 0}</p>
                    <p className="text-xs text-gray-500 mt-2">Completed submissions</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-yellow-100">
                            <Activity size={20} className="text-yellow-600" />
                        </div>
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                            Drafts
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Active Drafts</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalDrafts || 0}</p>
                    <p className="text-xs text-gray-500 mt-2">Work in progress</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-100">
                            <Users size={20} className="text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Users
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalUsers || 0}</p>
                    <p className="text-xs text-gray-500 mt-2">Registered accounts</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-100">
                            <TrendingUp size={20} className="text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            Rate
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Completion Rate</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats?.completionRate || 0}%</p>
                    <p className="text-xs text-gray-500 mt-2">Success percentage</p>
                </div>
            </div>

            {/* Regional & Sector Insights */}
            {dashboardStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Regions</h3>
                        <div className="space-y-3">
                            {dashboardStats.topRegions.map((region, index) => (
                                <div key={region.region} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{region.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(region.count / dashboardStats.totalSurveys) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-600">{region.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sectors</h3>
                        <div className="space-y-3">
                            {dashboardStats.topSectors.map((sector, index) => (
                                <div key={sector.sector} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{sector.sector}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${(sector.count / dashboardStats.totalSurveys) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-600">{sector.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Trends Chart */}
            {dashboardStats?.monthlyTrends && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Trends</h3>
                    <div className="grid grid-cols-6 gap-4">
                        {dashboardStats.monthlyTrends.map((month, index) => (
                            <div key={index} className="text-center">
                                <div className="mb-2">
                                    <div className="w-full bg-gray-200 rounded-full h-24 flex flex-col justify-end relative">
                                        <div
                                            className="bg-blue-600 rounded-b-full"
                                            style={{
                                                height: `${Math.max((month.surveys / Math.max(...dashboardStats.monthlyTrends.map(m => m.surveys), 1)) * 100, 5)}%`
                                            }}
                                        ></div>
                                        <div
                                            className="bg-yellow-500 rounded-b-full absolute bottom-0 w-full opacity-70"
                                            style={{
                                                height: `${Math.max((month.drafts / Math.max(...dashboardStats.monthlyTrends.map(m => m.drafts), 1)) * 50, 3)}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-600 font-medium">{month.month}</div>
                                <div className="text-xs text-blue-600">{month.surveys} surveys</div>
                                <div className="text-xs text-yellow-600">{month.drafts} drafts</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Management Executive Summary */}
            {/* {analyticsData?.kpis && analyticsData?.systemMetrics && (
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
            )} */}

            {/* Business Intelligence */}
            {/* {analyticsData?.systemMetrics && (
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
            )} */}

            {/* Operational Dashboard */}
            {/* {analyticsData?.kpis && analyticsData?.systemMetrics && (
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
            )} */}

            {/* System Performance Cards */}
            {/* {performanceData && (
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
            )} */}

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


            {/* Recent Survey Activity */}
            <RecentSurveyActivity activities={recentActivity || []} />

            {/* Survey Management Table */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                            <FaProjectDiagram className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Survey List
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Browse and manage available surveys
                            </p>
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

            {!dashboardStatsResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-orange-600" size={24} />
                        <h3 className="text-lg font-semibold text-orange-700">Dashboard Stats Error</h3>
                    </div>
                    <p className="text-orange-700">{dashboardStatsResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">Dashboard statistics are temporarily unavailable.</p>
                </div>
            )}

            {!surveysResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-purple-600" size={24} />
                        <h3 className="text-lg font-semibold text-purple-700">Survey Data Error</h3>
                    </div>
                    <p className="text-purple-700">{surveysResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">Unable to load survey data at this time.</p>
                </div>
            )}
        </div>
    )
}
