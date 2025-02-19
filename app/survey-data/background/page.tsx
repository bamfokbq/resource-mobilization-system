import FundingSource from '@/components/survey_data/background/FundingSource'
import NumberOfProjects from '@/components/survey_data/background/NumberOfProjects'
import Sectors from '@/components/survey_data/background/Sectors'
import StakeholderDetails from '@/components/survey_data/background/StakeholderDetails'
import StakeholdersPerRegion from '@/components/survey_data/background/StakeholdersPerRegion'
import React from 'react'

export default function SurveyBackgroundPage() {
  return (
    <>
      <StakeholdersPerRegion />
      <Sectors />
      <NumberOfProjects />
      <FundingSource />
      <StakeholderDetails />
    </>
  )
}
