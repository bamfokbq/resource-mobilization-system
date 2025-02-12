import { AddNewUserModal } from '@/components/features/AddNewUserModal'
import AdminTitle from '@/components/shared/AdminTitle'
import SearchTable from '@/components/shared/SearchTable'
import SearchTableSkeletion from '@/components/skeletons/SearchTableSkeletion'
import AdminUsersTable from '@/components/tables/AdminUsersTable'
import { Suspense } from 'react'


export default function AdminDashboardUserPage() {
    return (
        <div className='flex flex-row md:flex-col gap-3 md:gap-6'>
            <div className='flex items-center justify-between'>
                <AdminTitle title="User's List" />
                <AddNewUserModal />
            </div>

            <div className='flex md:flex-col gap-8'>
                <Suspense fallback={<SearchTableSkeletion />}>
                    <SearchTable />
                </Suspense>
                <AdminUsersTable />
            </div>
        </div>
    )
}
