import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const ageGroupsData = [
  { name: "All Ages", value: 156 },
  { name: "18-30 years", value: 89 },
  { name: "31-50 years", value: 134 },
  { name: "51-65 years", value: 112 },
  { name: "65+ years", value: 78 },
  { name: "Children (0-12)", value: 34 },
  { name: "Adolescents (13-17)", value: 45 },
  { name: "Pregnant Women", value: 28 }
]

export default function AgeGroups() {
  return (
    <section className='mb-8' id='age-groups'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Age Groups</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={ageGroupsData} 
          layout="horizontal" 
          title="Distribution of Activities by Age Demographics"
        />
      </div>
    </section>
  )
}
