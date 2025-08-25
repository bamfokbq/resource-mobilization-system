import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'

const settingsData = [
  { name: "Community Centers", value: 145 },
  { name: "Healthcare Facilities", value: 123 },
  { name: "Schools", value: 89 },
  { name: "Workplaces", value: 67 },
  { name: "Religious Centers", value: 45 },
  { name: "Home-Based", value: 56 },
  { name: "Mobile/Outreach", value: 78 },
  { name: "Online/Digital", value: 34 },
  { name: "Markets/Public Spaces", value: 28 }
]

export default function Settings() {
  return (
    <section className='mb-8' id='settings'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities by Settings</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart 
          data={settingsData} 
          layout="vertical" 
          title="Distribution of Activities by Implementation Settings"
        />
      </div>
    </section>
  )
}
