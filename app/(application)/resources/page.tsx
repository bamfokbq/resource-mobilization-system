import ResourceHeader from '@/components/resources/ResourceHeader'
import ResourcesGrid from '@/components/resources/ResourcesGrid'
import ResourcesPagination from '@/components/resources/ResourcesPagination'
import ResourcesSearchAndFilter from '@/components/resources/ResourcesSearchAndFilter'
import React from 'react'

export default function ResourcesPage() {
  return (
    <section className='max-w-[1700px] mx-auto min-h-screen'>
      <ResourceHeader />
      <ResourcesSearchAndFilter />
      <ResourcesGrid />
      <ResourcesPagination />
    </section>
  )
}
