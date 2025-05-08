import FundingSource from '@/components/survey_data/background/FundingSource'
import NumberOfProjects from '@/components/survey_data/background/NumberOfProjects'
import Sectors from '@/components/survey_data/background/Sectors'
import StakeholderDetails from '@/components/survey_data/background/StakeholderDetails'
import StakeholdersPerRegion from '@/components/survey_data/background/StakeholdersPerRegion'
import React from 'react'

const NUMBER_OF_PROJECTS_DATA = [
  {
    "Year": 2020,
    "Number of Projects": 28
  },
  {
    "Year": 2021,
    "Number of Projects": 17
  },
  {
    "Year": 2022,
    "Number of Projects": 24
  },
  {
    "Year": 2023,
    "Number of Projects": 20
  },
  {
    "Year": 2024,
    "Number of Projects": 10
  }
]

export default function SurveyBackgroundPage() {
  return (
    <>
      <StakeholdersPerRegion />
      <Sectors />
      <NumberOfProjects data={NUMBER_OF_PROJECTS_DATA} title="Number of Projects by Year" />
      <FundingSource />
      <StakeholderDetails />
    </>
  )
}
