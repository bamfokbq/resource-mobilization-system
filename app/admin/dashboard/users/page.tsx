import { auth } from '@/auth'
import UserStatsOverview from '@/components/dashboard/UserStatsOverview'
import { AddNewUserModal } from '@/components/features/AddNewUserModal'
import RealAdminUsersTable from '@/components/tables/RealAdminUsersTable'
import { Suspense } from 'react'
import { RiUserLine } from 'react-icons/ri'

export default async function AdminDashboardUserPage() {
    const session = await auth();
    const role = session?.user?.role;

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white rounded-xl p-6 shadow-lg gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <RiUserLine className="text-blue-500" />
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-2">Manage and monitor all system users</p>
                </div>
                {role && role === 'Admin' && (
                    <div className="flex gap-4">
                        <AddNewUserModal />
                    </div>
                )}
            </div>

            {/* Statistics Overview */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            }>
                {/* <UserStatsOverview /> */}
            </Suspense>

            {/* Users Table Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <RiUserLine className="text-purple-500 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
                </div>

                <RealAdminUsersTable />
            </div>
        </div>
    )
}
