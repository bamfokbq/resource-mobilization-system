import { Activity, TrendingUp, Users } from 'lucide-react'
import { MdOutlinePoll } from 'react-icons/md'
import { DashboardStats } from '@/types/dashboard'

interface AdminDashboardKPICardsProps {
    dashboardStats: DashboardStats | null | undefined
}

export default function AdminDashboardKPICards({ dashboardStats }: AdminDashboardKPICardsProps) {
    return (
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
    )
}
