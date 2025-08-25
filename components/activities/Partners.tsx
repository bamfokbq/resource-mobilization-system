import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const partnersData = [
  { name: "Government Partners", value: 145 },
  { name: "International Organizations", value: 89 },
  { name: "Local NGOs", value: 134 },
  { name: "Healthcare Institutions", value: 112 },
  { name: "Academic Partners", value: 67 },
  { name: "Private Sector", value: 56 },
  { name: "Community Groups", value: 78 },
  { name: "Donor Organizations", value: 45 },
  { name: "Faith-Based Partners", value: 34 },
  { name: "Patient Organizations", value: 28 }
]

export default function Partners() {
  return (
    <section className='mb-8' id='partners'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Partnership Type</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={partnersData} 
          layout="horizontal" 
          title="Distribution of Activities by Partner Organizations"
        />
      </div>
    </section>
  )
}
