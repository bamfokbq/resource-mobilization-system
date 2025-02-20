"use client"

import React from 'react'
import dynamic from 'next/dynamic';
import YearlyStatisticBarchart from '@/components/chart_and_graphics/YearlyStatisticBarchart';

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
];

export default function GhanaMap() {
  const LandingPageMapComponent = React.useMemo(() => {
    return dynamic(
      () => import('./ActivitiesByRegionMap'),
      {
        loading: () => <p>Loading Map...</p>,
        ssr: false
      }
    );
  }, []);

  return (
    <section className='my-8'>
      <div className='min-h-[90vh] overflow-hidden flex gap-5 bg-white rounded-2xl'>
        <div className='flex-1'>
          <LandingPageMapComponent />
        </div>
        <div className='flex-1 h-full p-6 bg-gray-50 overflow-y-auto'>
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-medium text-gray-800'>Analytics Overview</h2>
              <p className='text-sm text-gray-500'>Statistical data visualization</p>
            </div>

            <YearlyStatisticBarchart />
          </div>
        </div>
      </div>
    </section>
  )
}
