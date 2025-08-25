import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const reachData = [
  { name: "Local (District level)", value: 178 },
  { name: "Regional", value: 145 },
  { name: "National", value: 89 },
  { name: "Community-based", value: 134 },
  { name: "Urban areas", value: 112 },
  { name: "Rural areas", value: 156 },
  { name: "Peri-urban", value: 67 },
  { name: "Remote areas", value: 34 }
]

export default function Reach() {
  return (
    <section className='mb-8' id='reach'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Geographic Reach</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={reachData} 
          layout="vertical" 
          title="Distribution of Activities by Geographic Coverage"
        />
      </div>
    </section>
  )
}
