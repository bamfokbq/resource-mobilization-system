import ResourceHeader from '@/components/resources/ResourceHeader'
import ResourcesGrid from '@/components/resources/ResourcesGrid'
import ResourcesPagination from '@/components/resources/ResourcesPagination'
import ResourcesSearchAndFilter from '@/components/resources/ResourcesSearchAndFilter'
import React from 'react'

export default function ResourcesPage() {
  return (
    <section className='container mx-auto px-4 min-h-screen'>
      <ResourceHeader />
      <ResourcesSearchAndFilter />
      <ResourcesGrid />
      <ResourcesPagination />
    </section>
  )
}
