import AdminTitle from '@/components/shared/AdminTitle'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { FaPlus } from 'react-icons/fa6'

export default function SurveysPage() {
  return (
    <section className='flex flex-col gap-6'>
      <div className='flex gap-10 items-center justify-between'>
        <AdminTitle title='Surveys' />
        <div className='flex gap-10 items-center'>
          <Suspense fallback={<div>LOADING</div>}>
            <DateRangeSelector />
          </Suspense>
          <Link href="/dashboard/surveys/form">
            <Button className='bg-navy-blue hover:bg-blue-600 cursor-pointer'>
              <FaPlus />
              <span>Add New User</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}


