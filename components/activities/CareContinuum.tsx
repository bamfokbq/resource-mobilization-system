import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const careContinuumData = [
  { name: "Prevention", value: 156 },
  { name: "Early Detection/Screening", value: 89 },
  { name: "Treatment", value: 134 },
  { name: "Management/Care", value: 112 },
  { name: "Rehabilitation", value: 45 },
  { name: "Palliative Care", value: 23 }
]

export default function CareContinuum() {
  return (
    <section className='mb-8' id='care-continuum'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Care Continuum</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={careContinuumData} 
          layout="vertical" 
          title="Distribution of Activities Across Care Continuum"
        />
      </div>
    </section>
  )
}
