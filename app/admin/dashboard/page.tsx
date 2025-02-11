import AdminTitle from '@/components/shared/AdminTitle'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import React from 'react'

export default function AdminDashboardPage() {
    return (
        <section className='flex flex-col gap-6'>
            <div className='flex gap-10 items-center'>
                <AdminTitle title='Analytics' />
                <DateRangeSelector />
            </div>
            <div className='h-[400px] bg-green-600 w-full flex gap-4'>
                <div className='bg-amber-500 h-full flex-1'></div>
                <div className='bg-teal-500 h-full flex-1'></div>
            </div>
        </section>
    )
}
