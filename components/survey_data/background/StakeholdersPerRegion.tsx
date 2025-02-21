import React from 'react'
import StakeholdersTable from '@/components/tables/StakeholdersTable'
import RegionalSectorMap from '@/components/chart_and_graphics/RegionalSectorMap'
import { REGIONAL_SECTOR_DATA } from '@/constant'

export default function StakeholdersPerRegion() {
  return (
    <section className='mb-8' id='stakeholders-per-region'>
      <h1 className='text-3xl text-navy-blue font-medium mb-6'>
        Stakeholders Per Region
      </h1>
      <div className='min-h-[90vh] p-3 bg-white rounded-2xl'>
        <div className='grid grid-cols-2 gap-8 h-full'>
          <div className='relative overflow-hidden w-full h-[90vh]'>
            <RegionalSectorMap regionalData={REGIONAL_SECTOR_DATA} />
          </div>
          <div className='h-[90vh]'>
            <StakeholdersTable />
          </div>
        </div>
      </div>
    </section>
  )
}
