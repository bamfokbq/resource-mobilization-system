import AdminTitle from '@/components/shared/AdminTitle'
import DateRangeSelector from '@/components/shared/DateRangeSelector'
import React from 'react'

export default function AdminDashboardPage() {
    return (
        <section>
            <div>
                <AdminTitle title='Analytics' />
                <DateRangeSelector />
            </div>
        </section>
    )
}
