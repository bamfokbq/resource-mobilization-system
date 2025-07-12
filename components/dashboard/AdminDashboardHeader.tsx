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
        <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-gray-100">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 lg:gap-6">
                {/* Header and Stats Section */}
                <div className="min-w-0 flex-1 space-y-3 lg:space-y-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                            Management Dashboard
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1 hidden sm:block">
                            Monitor and manage your platform analytics
                        </p>
                    </div>

                    {dashboardStats && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                                <div className="min-w-0">
                                    <span className="text-xs sm:text-sm text-gray-600 block">Total Surveys</span>
                                    <span className="text-sm sm:text-base md:text-lg font-semibold text-green-700 block">
                                        {dashboardStats.totalSurveys}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <div className="min-w-0">
                                    <span className="text-xs sm:text-sm text-gray-600 block">Active Users</span>
                                    <span className="text-sm sm:text-base md:text-lg font-semibold text-blue-700 block">
                                        {dashboardStats.totalUsers}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                                <div className="min-w-0">
                                    <span className="text-xs sm:text-sm text-gray-600 block">Success Rate</span>
                                    <span className="text-sm sm:text-base md:text-lg font-semibold text-purple-700 block">
                                        {dashboardStats.completionRate}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto xl:w-full 2xl:w-auto xl:max-w-sm 2xl:max-w-none">
                    <div className="w-full sm:w-auto xl:w-full 2xl:w-auto">
                        <Suspense fallback={
                            <div className="animate-pulse bg-gray-200 rounded-lg h-10 sm:h-11 md:h-12 w-full sm:w-40 md:w-48 lg:w-52"></div>
                        }>
                            <DateRangeSelector />
                        </Suspense>
                    </div>

                    <Link
                        href="/admin/users"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 sm:gap-3 justify-center text-sm sm:text-base font-medium w-full sm:w-auto xl:w-full 2xl:w-auto min-w-fit"
                    >
                        <RiUserAddLine className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="whitespace-nowrap">Manage Users</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
