import Link from 'next/link'
import { Suspense } from 'react'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import { RiUserAddLine } from 'react-icons/ri'


export default function AdminDashboardHeader() {
    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200/50 backdrop-blur-sm">
            {/* Main container with improved spacing and alignment */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* Header Section - Enhanced typography and spacing */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                            Management Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base ml-4 font-medium">
                        Monitor and manage your platform analytics
                    </p>
                </div>

                {/* Action Controls Section - Better organization and spacing */}
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-3 items-stretch sm:items-center">

                    {/* Date Range Selector with improved styling */}
                    <div className="order-2 sm:order-1">
                        <Suspense fallback={
                            <div className="animate-pulse bg-gray-100 rounded-xl h-11 w-full sm:w-48 border border-gray-200"></div>
                        }>
                            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-0.5">
                                <DateRangeSelector />
                            </div>
                        </Suspense>
                    </div>

                    {/* Manage Users Button with enhanced design */}
                    <Link
                        href="/admin/dashboard/users"
                        className="order-1 sm:order-2 group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 min-w-fit"
                    >
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <RiUserAddLine className="w-5 h-5 relative z-10" />
                        <span className="relative z-10 whitespace-nowrap">Manage Users</span>
                    </Link>
                </div>
            </div>

            {/* Optional: Quick stats or breadcrumb could go here */}
            <div className="mt-6 pt-6 border-t border-gray-100 hidden lg:block">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>System Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
