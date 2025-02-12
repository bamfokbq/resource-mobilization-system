import React, { Suspense } from 'react'
import AdminTitle from '@/components/shared/AdminTitle'
import SearchTable from '@/components/shared/SearchTable'
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa6'
import SearchTableSkeletion from '@/components/skeletons/SearchTableSkeletion'
import AdminUsersTable from '@/components/tables/AdminUsersTable'
import AdminUsersTableCopy from '@/components/tables/AdminUsersTableCopy'

export default function AdminDashboardUserPage() {
    return (
        <div className='flex flex-row md:flex-col gap-3 md:gap-6'>
            <div className='flex items-center justify-between'>
                <AdminTitle title="User's List" />
                <Button className='bg-navy-blue hover:bg-blue-600 cursor-pointer'>
                    <FaPlus />
                    <span>Add New User</span>
                </Button>
            </div>

            <div className='flex md:flex-col gap-8'>
                <Suspense fallback={<SearchTableSkeletion />}>
                    <SearchTable />
                </Suspense>
                {/* <AdminUsersTable /> */}
                <AdminUsersTableCopy />
            </div>
        </div>
    )
}
