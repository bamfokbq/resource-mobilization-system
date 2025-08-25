import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'
import { UsersIcon } from 'lucide-react'

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
          <div className="space-y-8">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <UsersIcon className="w-6 h-6" />
                      </div>
                      <div>
                          <h1 className='text-4xl font-bold mb-2'>Activities By Partnership Type</h1>
                          <p className='text-blue-100 text-lg'>
                              Comprehensive analysis of partner organizations and their contributions to NCD activities across different sectors and implementation models.
                          </p>
                      </div>
                  </div>
              </div>

              {/* Chart Section */}
              <div className='bg-white rounded-2xl p-4'>
                  <GeneralChart
                      data={partnersData}
                      layout="horizontal"
                      title="Distribution of Activities by Partner Organizations"
                  />
              </div>
      </div>
    </section>
  )
}
