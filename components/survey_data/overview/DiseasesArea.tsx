import ActivitiesByDieseaseArea from '@/components/chart_and_graphics/ActivitiesByDiseaseArea'
import React from 'react'

export default function DiseasesArea() {
  return (
    <section className='mb-8' id='diseases'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activity by Diseases Area</h1>
      <div className='min-h-[90vh] bg-white rounded-2xl'>
        <ActivitiesByDieseaseArea />
      </div>
    </section>
  )
}