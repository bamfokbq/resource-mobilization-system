import React, { Suspense } from 'react'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import OrganisationSelector from '@/components/shared/OrganisationSelector'
import RegionSelector from '@/components/shared/RegionSelector'
import FilterSection from '@/components/shared/FilterSection'
import StatsSection from '@/components/analytics/StatsSection'
import GhanaMap from '@/components/survey_data/dashboard/GhanaMap'

export default function SurveyDataPage() {
  return (
    <section className='relative'>
      <h1 className='text-3xl text-navy-blue font-medium'>Analytics</h1>
      {/* DATA ANALYTICS */}
      <div className='flex flex-col gap-2 mt-4'>
        <StatsSection />
        <Suspense fallback={<div>Loading...</div>}>
          <FilterSection>
            <DateRangeSelector />
            <OrganisationSelector />
            <RegionSelector />
          </FilterSection>
        </Suspense>
      </div>

      {/* DASHBOARD */}
      <GhanaMap />
    </section>
  )
}
