import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const targetGroupsData = [
  { name: "General Population", value: 145 },
  { name: "Adults (18-64)", value: 89 },
  { name: "Elderly (65+)", value: 67 },
  { name: "Women", value: 56 },
  { name: "Children & Adolescents", value: 34 },
  { name: "High-Risk Groups", value: 45 },
  { name: "Healthcare Workers", value: 28 },
  { name: "Rural Communities", value: 41 },
  { name: "Urban Poor", value: 32 }
]

export default function TargetGroups() {
  return (
    <section className='mb-8' id='target-groups'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Target Groups</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={targetGroupsData} 
          layout="horizontal" 
          title="Distribution of Activities by Target Population"
        />
      </div>
    </section>
  )
}
