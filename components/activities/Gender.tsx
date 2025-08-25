import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const genderData = [
  { name: "Mixed/All Genders", value: 189 },
  { name: "Women Only", value: 134 },
  { name: "Men Only", value: 89 },
  { name: "Gender-Specific Programs", value: 67 },
  { name: "LGBTQ+ Inclusive", value: 23 }
]

export default function Gender() {
  return (
    <section className='mb-8' id='gender'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Gender Focus</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={genderData} 
          layout="horizontal" 
          title="Distribution of Activities by Gender Demographics"
        />
      </div>
    </section>
  )
}
