"use client";

import FundingSource from '@/components/survey_data/background/FundingSource'
import NumberOfProjects from '@/components/survey_data/background/NumberOfProjects'
import Sectors from '@/components/survey_data/background/Sectors'
import StakeholderDetails from '@/components/survey_data/background/StakeholderDetails'
import StakeholdersPerRegion from '@/components/survey_data/background/StakeholdersPerRegion'
import React from 'react'
import { motion } from 'motion/react'
import { PROJECT_TIMELINE_DATA } from '@/data/survey-mock-data'

export default function SurveyBackgroundPage() {
  return (
    <motion.div 
      className="space-y-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <StakeholdersPerRegion />
      <Sectors />
      <NumberOfProjects 
        data={PROJECT_TIMELINE_DATA} 
        title="Number of Projects by Year"
        description="Tracking the evolution of NCD-related projects and initiatives over time"
      />
      <FundingSource />
      <StakeholderDetails />
    </motion.div>
  )
}
