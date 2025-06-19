import React, { Suspense } from 'react'
import Link from 'next/link'
import AdminStatsCard from '@/components/dashboard/AdminStatsCard'
import AdminKPICards from '@/components/dashboard/AdminKPICards'
import AdminCharts from '@/components/dashboard/AdminCharts'
import UserEngagementCharts from '@/components/dashboard/UserEngagementCharts'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import SurveyListTable from '@/components/tables/SurveyListTable'
import { ADMIN_STATS } from '@/constant'
import { getAdminAnalytics, getSystemPerformanceMetrics } from '@/actions/adminAnalytics'
import { getUserStats } from '@/actions/users'
import { RiDashboardLine, RiUserAddLine, RiBarChartLine, RiSettings2Line } from 'react-icons/ri'
import { MdOutlinePoll } from 'react-icons/md'
import { Database, Zap, Activity, AlertCircle } from 'lucide-react'

const adminStatColors = ['blue', 'green', 'purple', 'orange'] as const;

const adminStatTrends = [
    { value: 12, isPositive: true },
    { value: 8, isPositive: true },
    { value: 3, isPositive: false },
    { value: 15, isPositive: true }
];

export default async function AdminDashboardPage() {
    // Fetch all analytics data
    const [analyticsResult, performanceResult, userStatsResult] = await Promise.all([
        getAdminAnalytics(),
        getSystemPerformanceMetrics(),
        getUserStats()
    ])

    const analyticsData = analyticsResult.success ? analyticsResult.data : null
    const performanceData = performanceResult.success ? performanceResult.data : null

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white rounded-xl p-6 shadow-lg gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Comprehensive system analytics and management KPIs</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-10 w-48"></div>}>
                        <DateRangeSelector />
                    </Suspense>
                    <Link
                        href="/admin/dashboard/users"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
                    >
                        <RiUserAddLine size={20} />
                        Manage Users
                    </Link>
                </div>
            </div>

            {/* System Performance Cards */}
            {performanceData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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
                    </div>
                </div>
            )}

            {/* Management KPIs */}
            {analyticsData?.kpis && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
                        <p className="text-gray-600">Essential metrics for system management and decision making</p>
                    </div>
                    <AdminKPICards kpis={analyticsData.kpis} />
                </div>
            )}

            {/* Enhanced Stats Cards (Original) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ADMIN_STATS.map((stat, index) => (
                    <AdminStatsCard
                        key={stat.id}
                        title={stat.name}
                        value={stat.amount}
                        icon={<stat.icon size={24} />}
                        color={adminStatColors[index]}
                        trend={adminStatTrends[index]}
                    />
                ))}
            </div>

            {/* System Analytics Charts */}
            {analyticsData?.systemMetrics && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
                        <p className="text-gray-600">Comprehensive analysis of user activity, surveys, and system performance</p>
                    </div>
                    <AdminCharts systemMetrics={analyticsData.systemMetrics} />
                </div>
            )}

            {/* User Engagement Analytics */}
            {analyticsData?.userEngagement && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">User Engagement Analytics</h2>
                        <p className="text-gray-600">Deep insights into user behavior, retention, and feature adoption</p>
                    </div>
                    <UserEngagementCharts userEngagement={analyticsData.userEngagement} />
                </div>
            )}

            {/* Survey Management Table */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <MdOutlinePoll className="text-purple-500 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
                </div>
                <SurveyListTable />
            </div>

            {/* Error States */}
            {!analyticsResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-red-500" size={24} />
                        <h3 className="text-lg font-semibold text-red-700">Analytics Error</h3>
                    </div>
                    <p className="text-red-600">{analyticsResult.message}</p>
                </div>
            )}
        </div>
    )
}
