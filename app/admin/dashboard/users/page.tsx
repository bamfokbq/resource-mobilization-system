import { auth } from '@/auth'
import { AddNewUserModal } from '@/components/features/AddNewUserModal'
import SearchTable from '@/components/shared/SearchTable'
import SearchTableSkeletion from '@/components/skeletons/SearchTableSkeletion'
import AdminUsersTable from '@/components/tables/AdminUsersTable'
import { Suspense } from 'react'
import { RiUserLine, RiUserAddLine } from 'react-icons/ri'

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

            {/* Search and Table Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <RiUserLine className="text-purple-500 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
                </div>

                <Suspense fallback={<SearchTableSkeletion />}>
                    <SearchTable />
                </Suspense>

                <AdminUsersTable />
            </div>
        </div>
    )
}
