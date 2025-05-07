import React from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart';

const sectorData = [
  { "Sector": "Local NGO", "Count": 74 },
  { "Sector": "International NGO", "Count": 17 },
  { "Sector": "Ghana Government", "Count": 16 },
  { "Sector": "Civil Society Organization", "Count": 16 },
  { "Sector": "Private", "Count": 8 },
  { "Sector": "Patient Organization", "Count": 3 },
  { "Sector": "Foundation", "Count": 3 },
  { "Sector": "Foreign Government", "Count": 3 },
  { "Sector": "Faith-based Organization", "Count": 2 },
  { "Sector": "Academia / Research", "Count": 2 },
  { "Sector": "Multilateral", "Count": 1 }
];

const chartData = sectorData.map(item => ({
  name: item.Sector,
  value: item.Count
}));

export default function Sectors() {
  return (
      <section className='mb-8' id='sectors'>
          <h1 className='text-3xl text-navy-blue font-medium'>Sectors</h1>
      <div className='bg-white rounded-2xl p-4'>
        <GeneralChart data={chartData} layout="vertical" title="Distribution of Organizations by Sector" />
      </div>
      </section>
  )
}
