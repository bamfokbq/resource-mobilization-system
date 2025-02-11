import AdminTitle from '@/components/shared/AdminTitle'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import SurveyListTable from '@/components/tables/SurveyListTable'
import { ADMIN_STATS } from '@/constant'
import React from 'react'

export default function AdminDashboardPage() {
    return (
        <section className='flex flex-col gap-6'>
            <div className='flex gap-10 items-center'>
                <AdminTitle title='Analytics' />
                <DateRangeSelector />
            </div>
            <div className='min-h-[300px] w-full flex flex-col lg:flex-row gap-8'>
                <div className='min-h-[300px] flex-1 grid gap-4 grid-cols-1 sm:grid-cols-2'>
                    {ADMIN_STATS.map((stat) => <div className='bg-white flex flex-col justify-between gap-4 rounded-lg px-4 py-6' key={stat.id}>
                        <div className="flex items-center gap-2">
                            <stat.icon className="w-5 h-5 text-navy-blue" />
                            <p className='text-gray-800 font-light'>{stat.name}</p>
                        </div>
                        <h1 className='text-4xl text-navy-blue'>{stat.amount}</h1>
                    </div>)}
                </div>
                <div className='min-h-[300px] flex-1 flex flex-col sm:flex-row gap-4'>
                    <div className='bg-white flex-1 rounded-lg'></div>
                    <div className='bg-white flex-1 rounded-lg'></div>
                </div>
            </div>

            <div>
                <SurveyListTable />
            </div>
        </section>
    )
}
