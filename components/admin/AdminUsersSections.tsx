import { Suspense } from 'react'
import { auth } from '@/auth'
import { getAllUsers, getUserStats } from '@/actions/users'
import RealAdminUsersTable from '@/components/tables/RealAdminUsersTable'

// Simulate network delay for demonstration purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function AdminUserStatsSection() {
    await delay(200) // High priority
    const userStats = await getUserStats()
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Total Users</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats?.totalUsers || 0}</div>
                <div className="text-xs text-gray-500 mt-1">All registered users</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Active Users</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats?.activeUsers || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Users with activity</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Admins</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats?.adminUsers || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Administrative users</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <div className="w-6 h-6 bg-orange-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">New This Month</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats?.recentUsers || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Recent registrations</div>
            </div>
        </div>
    )
}

export async function AdminUsersTableSection() {
    await delay(500) // Lower priority
    return <RealAdminUsersTable />
}
