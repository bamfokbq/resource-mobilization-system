import React, { Suspense } from 'react'
import Link from 'next/link'
import AdminStatsCard from '@/components/dashboard/AdminStatsCard'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import SurveyListTable from '@/components/tables/SurveyListTable'
import { ADMIN_STATS } from '@/constant'
import { RiDashboardLine, RiUserAddLine, RiBarChartLine, RiSettings2Line } from 'react-icons/ri'
import { MdOutlinePoll } from 'react-icons/md'

const adminStatColors = ['blue', 'green', 'purple', 'orange'] as const;

const adminStatTrends = [
    { value: 12, isPositive: true },
    { value: 8, isPositive: true },
    { value: 3, isPositive: false },
    { value: 15, isPositive: true }
];

export default function AdminDashboardPage() {
    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white rounded-xl p-6 shadow-lg gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Comprehensive system analytics and management</p>
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

            {/* Enhanced Stats Cards */}
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

            {/* Charts and Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <RiBarChartLine className="text-blue-500 text-2xl" />
                        <h2 className="text-xl font-bold text-gray-800">Survey Analytics</h2>
                    </div>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Chart visualization coming soon</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <RiDashboardLine className="text-green-500 text-2xl" />
                        <h2 className="text-xl font-bold text-gray-800">User Activity</h2>
                    </div>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Activity visualization coming soon</p>
                    </div>
                </div>
            </div>

            {/* Survey Management Table */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <MdOutlinePoll className="text-purple-500 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
                </div>
                <SurveyListTable />
            </div>
        </div>
    )
}
