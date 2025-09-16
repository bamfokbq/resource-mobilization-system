import ActivityByRegion from '@/components/survey_data/overview/ActivityByRegion'
import ContinuumOfCare from '@/components/survey_data/overview/ContinuumOfCare'
import DiseasesArea from '@/components/survey_data/overview/DiseasesArea'
import React from 'react'

export default function SurverOverviewPage() {
  return (
    <section>
      <ActivityByRegion />
      <DiseasesArea />
      <ContinuumOfCare />
    </section>
  )
}
