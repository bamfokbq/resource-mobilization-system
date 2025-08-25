import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const diseasesData = [
  { name: "Hypertension", value: 89 },
  { name: "Diabetes", value: 67 },
  { name: "Cardiovascular Disease", value: 45 },
  { name: "Cancer", value: 34 },
  { name: "Mental Health", value: 28 },
  { name: "Stroke", value: 23 },
  { name: "Asthma", value: 19 },
  { name: "Chronic Kidney Disease", value: 15 },
  { name: "COPD", value: 12 },
  { name: "Other NCDs", value: 25 }
]

export default function Diseases() {
  return (
    <section className='mb-8' id='diseases'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Disease Focus</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={diseasesData} 
          layout="horizontal" 
          title="Distribution of Activities by Disease Type"
        />
      </div>
    </section>
  )
}
