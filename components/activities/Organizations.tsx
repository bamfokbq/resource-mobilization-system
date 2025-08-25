import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const organizationsData = [
  { name: "Local NGOs", value: 134 },
  { name: "Government Agencies", value: 89 },
  { name: "International NGOs", value: 67 },
  { name: "Healthcare Facilities", value: 78 },
  { name: "Community Organizations", value: 56 },
  { name: "Private Sector", value: 34 },
  { name: "Academic Institutions", value: 28 },
  { name: "Faith-Based Organizations", value: 23 },
  { name: "Patient Organizations", value: 19 }
]

export default function Organizations() {
  return (
    <section className='mb-8' id='organizations'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Organization Type</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={organizationsData} 
          layout="vertical" 
          title="Distribution of Activities by Organization Type"
        />
      </div>
    </section>
  )
}
