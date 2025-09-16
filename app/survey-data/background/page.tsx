"use client";

import FundingSource from '@/components/survey_data/background/FundingSource'
import NumberOfProjects from '@/components/survey_data/background/NumberOfProjects'
import Sectors from '@/components/survey_data/background/Sectors'
import StakeholderDetails from '@/components/survey_data/background/StakeholderDetails'
import StakeholdersPerRegion from '@/components/survey_data/background/StakeholdersPerRegion'
import React from 'react'
import { motion } from 'motion/react'
import { useProjectTimelineData } from '@/hooks/useSurveyData'

export default function SurveyBackgroundPage() {
  const { data: projectTimelineData, isLoading, error } = useProjectTimelineData()

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  if (error || !projectTimelineData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading background data: {error}</p>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-6 lg:space-y-8 min-h-screen px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <StakeholdersPerRegion />
      <Sectors />
      <NumberOfProjects 
        title="Number of Projects by Year"
        description="Tracking the evolution of NCD-related projects and initiatives over time"
      />
      <FundingSource />
      <StakeholderDetails />
    </motion.div>
  )
}
