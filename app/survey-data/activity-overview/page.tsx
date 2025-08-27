import ActivityByRegion from '@/components/activities/ActivityByRegion'
import Diseases from '@/components/activities/Diseases'
import CareContinuum from '@/components/activities/CareContinuum'
import TargetGroups from '@/components/activities/TargetGroups'
import Organizations from '@/components/activities/Organizations'
import AgeGroups from '@/components/activities/AgeGroups'
import Settings from '@/components/activities/Settings'
import Gender from '@/components/activities/Gender'
import Reach from '@/components/activities/Reach'
import Partners from '@/components/activities/Partners'
import React, { Suspense } from 'react'

// Loading component for Suspense fallback
function ActivityOverviewLoading() {
  return (
    <div className="space-y-8 p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Component that contains all the activity components
function ActivityOverviewContent() {
  return (
    <>
      <ActivityByRegion />
      <Diseases />
      <CareContinuum />
      <TargetGroups />
      <Organizations />
      <AgeGroups />
      <Settings />
      <Gender />
      <Reach />
      <Partners />
    </>
  )
}

export default function ActivityOverviewPage() {
  return (
    <Suspense fallback={<ActivityOverviewLoading />}>
      <ActivityOverviewContent />
    </Suspense>
  )
}
