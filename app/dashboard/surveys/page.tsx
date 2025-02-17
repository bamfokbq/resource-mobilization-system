import AdminTitle from '@/components/shared/AdminTitle'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import SurveyHistoryList from '@/components/tables/SurveyHistoryList'
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
          <Link
            href="/dashboard/surveys/form"
            className="bg-navy-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Survey
          </Link>
        </div>
      </div>
      <SurveyHistoryList />
    </section>
  )
}


