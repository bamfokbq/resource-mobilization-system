import AdminTitle from '@/components/shared/AdminTitle'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import React from 'react'

export default function AdminDashboardPage() {
    return (
        <section>
            <div className='flex gap-10 items-center'>
                <AdminTitle title='Analytics' />
                <DateRangeSelector />
            </div>
        </section>
    )
}
