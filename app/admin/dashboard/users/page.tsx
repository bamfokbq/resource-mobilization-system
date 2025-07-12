import { auth } from '@/auth'
import {
    AdminUsersTableSection
} from '@/components/admin/AdminUsersSections'
import { AddNewUserModal } from '@/components/features/AddNewUserModal'
import { Suspense } from 'react'
import { RiUserLine } from 'react-icons/ri'

// Individual section skeletons
function UserStatsSkeleton() {
    return (
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
    )
}

function UsersTableSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
            <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

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
            <Suspense fallback={<UsersTableSkeleton />}>
                <AdminUsersTableSection />
            </Suspense>
        </div>
    )
}
