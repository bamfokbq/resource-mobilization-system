'use client'

import React, { Suspense } from 'react'

import StatsSection from '@/components/analytics/StatsSection'
import GhanaMap from '@/components/survey_data/dashboard/GhanaMap'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DashboardSkeleton } from '@/components/ui/loading-skeleton'
import { TrendingUp, BarChart3, Map } from 'lucide-react'
import { motion } from 'motion/react'

export default function SurveyDataPage() {
  return (
    <motion.div 
      className="space-y-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Survey Data Analytics</h1>
              <p className="text-blue-100 text-lg mt-1">
                Comprehensive insights into health survey data and regional patterns
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full translate-y-32 -translate-x-32"></div>
      </motion.div>

      {/* Stats Section with Enhanced Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl text-gray-800">Key Statistics</CardTitle>
            </div>
            <CardDescription>
              Real-time overview of survey data and health metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DashboardSkeleton />}>
              <StatsSection />
            </Suspense>
          </CardContent>
        </Card>
      </motion.div>



      {/* Interactive Map Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-green-600" />
              <CardTitle className="text-xl text-gray-800">Regional Analytics Dashboard</CardTitle>
            </div>
            <CardDescription>
              Interactive map visualization with detailed regional statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense 
              fallback={
                <div className="h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-200 rounded-full animate-spin border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500 text-lg">Loading Interactive Map...</p>
                  </div>
                </div>
              }
            >
              <GhanaMap />
            </Suspense>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
