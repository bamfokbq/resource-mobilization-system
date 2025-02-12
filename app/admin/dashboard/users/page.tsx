import React from 'react'
import AdminTitle from '@/components/shared/AdminTitle'
import SearchTable from '@/components/shared/SearchTable'
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa6'

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

            <div>
                <SearchTable />
                <h1>USER TABLES</h1>
            </div>
        </div>
    )
}
