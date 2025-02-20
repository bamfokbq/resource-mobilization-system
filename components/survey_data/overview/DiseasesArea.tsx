import React from 'react'
import VerticalBarchart from '@/components/chart_and_graphics/VerticalBarchart'
import { ACTIVITIES_BY_REGION_DATA } from '@/constant'

export default function DiseasesArea() {
  return (
    <section className='mb-8' id='diseases'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activity by Diseases Area</h1>
      <div className='min-h-[90vh] bg-white rounded-2xl'>
        <VerticalBarchart data={ACTIVITIES_BY_REGION_DATA} name='Activities by Diseases Area' />
      </div>
    </section>
  )
}