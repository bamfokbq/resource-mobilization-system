'use client'

import React from 'react'
import dynamic from 'next/dynamic'

export default function ActivityByRegion() {
  const ActivitiesByRegionMapComponent = React.useMemo(() => {
    return dynamic(
      () => import('../chart_and_graphics/ActivitiesByRegionMap'),
      {
        loading: () => <p>Loading Map...</p>,
        ssr: false
      }
    );
  }, []);

  return (
    <section className='mb-8' id='by-region'>
      <h1 className='text-3xl text-navy-blue font-medium'>Activities By Region</h1>

      <div className='h-[100dvh] bg-white rounded-2xl overflow-hidden'>
        <ActivitiesByRegionMapComponent />
      </div>
    </section>
  )
}
