import React from 'react'
import AdminTitle from '@/components/shared/AdminTitle'
import DisplayAdminProfile from '@/components/features/DisplayAdminProfile'

export default function AdminDashboardProfilePage() {
    return (
        <div className='flex flex-row md:flex-col gap-3 md:gap-6'>
            <div className='flex items-center justify-between'>
                <AdminTitle title="Profile" />
            </div>
            <div>
                <DisplayAdminProfile />
            </div>
        </div>
    )
}
