import React, { Suspense } from 'react'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import Link from 'next/link'
import { ArrowLeft, Download, Filter, TrendingUp, BarChart3, Users, Activity } from 'lucide-react'
import {
    AdminAnalyticsKPISection,
    AdminChartsSection,
    AdminEngagementSection
} from '@/components/admin/AdminAnalyticsSections'

// Individual section skeletons
function AnalyticsKPISkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function AnalyticsChartsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function EngagementSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-200 rounded"></div>
                    <div className="h-80 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default async function AdminAnalyticsPage() {
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUp size={24} />
                        <h3 className="font-semibold">Performance</h3>
                    </div>
                    <div className="text-2xl font-bold mb-1">Real-time</div>
                    <div className="text-blue-100 text-sm">System Analytics</div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <BarChart3 size={24} />
                        <h3 className="font-semibold">Data Insights</h3>
                    </div>
                    <div className="text-2xl font-bold mb-1">Advanced</div>
                    <div className="text-purple-100 text-sm">Business Intelligence</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <Users size={24} />
                        <h3 className="font-semibold">User Analytics</h3>
                    </div>
                    <div className="text-2xl font-bold mb-1">Comprehensive</div>
                    <div className="text-emerald-100 text-sm">Engagement Tracking</div>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity size={24} />
                        <h3 className="font-semibold">System Health</h3>
                    </div>
                    <div className="text-2xl font-bold mb-1">Monitoring</div>
                    <div className="text-orange-100 text-sm">Performance Metrics</div>
                </div>
            </div>

            {/* KPI Cards with Streaming */}
            <Suspense fallback={<AnalyticsKPISkeleton />}>
                <AdminAnalyticsKPISection />
            </Suspense>

            {/* Charts Section with Streaming */}
            <Suspense fallback={<AnalyticsChartsSkeleton />}>
                <AdminChartsSection />
            </Suspense>

            {/* User Engagement Section with Streaming */}
            <Suspense fallback={<EngagementSkeleton />}>
                <AdminEngagementSection />
            </Suspense>
        </div>
    )
}
