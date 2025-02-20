import VerticalBarchart from '@/components/chart_and_graphics/VerticalBarchart'
import { CONTINUUM_OF_CARE_DATA } from '@/constant';
import React from 'react'

export default function ContinuumOfCare() {
  return (
    <section className='mb-8' id='continuum-of-care'>
          <h1 className='text-3xl text-navy-blue font-medium'>Activity By Continuum of Care</h1>
      <div className='min-h-[90vh] bg-white rounded-2xl'>
        <VerticalBarchart data={CONTINUUM_OF_CARE_DATA} name='Activity by Continuum of Care' />
      </div>
    </section>
  )
}
