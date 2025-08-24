import ResourcesGrid from '@/components/resources/ResourcesGrid'
import ResourcesPagination from '@/components/resources/ResourcesPagination'
import ResourcesSearchAndFilter from '@/components/resources/ResourcesSearchAndFilter'
import React from 'react'

export default function ResourcesPage() {
  return (
    <section>
      <ResourcesSearchAndFilter />
      <ResourcesGrid />
      <ResourcesPagination />
    </section>
  )
}
