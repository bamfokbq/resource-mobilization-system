import React from 'react'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import OrganisationSelector from '@/components/shared/OrganisationSelector'
import RegionSelector from '@/components/shared/RegionSelector'
import FilterSection from '@/components/shared/FilterSection'

export default function SurveyDataPage() {
  return (
    <section>
      <h1 className='text-3xl text-navy-blue font-medium'>Analytics</h1>
      <FilterSection>
        <DateRangeSelector />
        <RegionSelector />
        <OrganisationSelector />
      </FilterSection>
    </section>
  )
}
