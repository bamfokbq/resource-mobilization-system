import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import { DashboardStats } from '@/types/dashboard'
import Link from 'next/link'
import { Suspense } from 'react'
import { RiUserAddLine } from 'react-icons/ri'

interface AdminDashboardHeaderProps {
    dashboardStats: DashboardStats | null | undefined
}

export default function AdminDashboardHeader({ dashboardStats }: AdminDashboardHeaderProps) {
    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Management Dashboard
                    </h1>
                    {dashboardStats && (
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                                    {dashboardStats.totalSurveys} Total Surveys
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                                    {dashboardStats.totalUsers} Active Users
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                                    {dashboardStats.completionRate}% Success Rate
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4 flex-shrink-0">
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-10 w-32 md:w-48"></div>}>
                        <DateRangeSelector />
                    </Suspense>
                    <Link
                        href="/admin/users"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center text-sm md:text-base"
                    >
                        <RiUserAddLine size={16} className="md:w-5 md:h-5" />
                        <span className="whitespace-nowrap">Manage Users</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
