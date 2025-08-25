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
import React from 'react'

export default function ActivityOverviewPage() {
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
