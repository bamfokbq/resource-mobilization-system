"use client";

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from 'motion/react'
import { UsersIcon, ContactIcon } from "lucide-react"
import { useStakeholderDetails } from '@/hooks/useSurveyData'

export default function StakeholderDetails() {
  const { data: stakeholderData, isLoading, error } = useStakeholderDetails()

  const computedData = useMemo(() => {
    if (!stakeholderData || stakeholderData.length === 0) {
      return {
        totalStakeholders: 0,
        organizationTypes: 0,
        activeProjects: 0,
        regionalCoverage: 0
      }
    }

    // Count unique organizations (not individual submissions)
    const uniqueOrganizations = new Set(stakeholderData.map(s => s.name)).size
    const organizationTypes = new Set(stakeholderData.map(s => s.type)).size
    const totalSubmissions = stakeholderData.length // Each record is now 1 submission
    const regionalCoverage = new Set(stakeholderData.map(s => s.region)).size

    return {
      totalStakeholders: uniqueOrganizations,
      organizationTypes,
      activeProjects: totalSubmissions, // Now represents total submissions
      regionalCoverage
    }
  }, [stakeholderData])

  if (isLoading) {
    return (
      <motion.section 
        className='mb-8' 
        id='stakeholder-info'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6">
          <div className="h-8 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="h-4 bg-white/20 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/10 rounded-lg p-4 h-20 animate-pulse"></div>
            ))}
          </div>
        </div>
        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          <div className="h-64 bg-gray-200 animate-pulse"></div>
        </Card>
      </motion.section>
    )
  }

  if (error || !stakeholderData) {
    return (
      <motion.section 
        className='mb-8' 
        id='stakeholder-info'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="text-center py-8">
          <p className="text-red-500">Error loading stakeholder data: {error}</p>
        </div>
      </motion.section>
    )
  }
  return (
    <motion.section 
      className='mb-8' 
      id='stakeholder-info'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ContactIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2'>Organization Submissions</h1>
            <p className='text-blue-100 text-sm sm:text-base lg:text-lg'>
              Individual organization submissions and participation in NCD activities
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <UsersIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Unique Organizations</span>
            </div>
            <div className="text-2xl font-bold">{computedData.totalStakeholders}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <ContactIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Organization Types</span>
            </div>
            <div className="text-2xl font-bold">{computedData.organizationTypes}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <UsersIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Total Submissions</span>
            </div>
            <div className="text-2xl font-bold">{computedData.activeProjects}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <ContactIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Regional Coverage</span>
            </div>
            <div className="text-2xl font-bold">{computedData.regionalCoverage}</div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Organization Submissions Directory</CardTitle>
              <CardDescription className="text-teal-100">
                Individual organization submissions and participation tracking for NCD initiatives
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-teal-100 rounded-full mx-auto flex items-center justify-center">
                  <UsersIcon className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Organization Submissions Database</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  This section tracks individual organization submissions and participation in 
                  Non-Communicable Disease (NCD) prevention, management, and research activities across Ghana.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600">Complete contact details for all registered stakeholders</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">Activity Profiles</h4>
                    <p className="text-sm text-gray-600">Detailed breakdown of organizational activities and focus areas</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">Partnership Networks</h4>
                    <p className="text-sm text-gray-600">Collaboration patterns and partnership frameworks</p>
                  </div>
                </div>
                <div className="pt-6">
                  <Badge variant="outline" className="px-4 py-2">
                    Directory will be populated with actual stakeholder data
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
