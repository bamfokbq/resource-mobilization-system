"use client";

import React, { useMemo } from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from 'motion/react'
import { Building2Icon, BarChart3Icon, TrendingUpIcon } from "lucide-react"
import { useSectorData } from '@/hooks/useSurveyData'

export default function Sectors() {
  const { data: sectorData, isLoading, error } = useSectorData()

  const computedData = useMemo(() => {
    if (!sectorData || sectorData.length === 0) {
      return {
        totalOrganizations: 0,
        topSector: null,
        sectorData: [],
        sectorChartData: []
      }
    }

    const totalOrganizations = sectorData.reduce((sum, item) => sum + (item.Count || 0), 0)
    const topSector = sectorData[0] || null
    const sectorChartData = sectorData.map(item => ({
      name: item.Sector,
      value: item.Count
    }))

    return {
      totalOrganizations,
      topSector,
      sectorData,
      sectorChartData
    }
  }, [sectorData])

  if (isLoading) {
    return (
      <motion.section 
        className='mb-8' 
        id='sectors'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6">
          <div className="h-8 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="h-4 bg-white/20 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
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

  if (error || !sectorData) {
    return (
      <motion.section 
        className='mb-8' 
        id='sectors'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-center py-8">
          <p className="text-red-500">Error loading sector data: {error}</p>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section 
      className='mb-8' 
      id='sectors'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2'>Organizational Sectors</h1>
            <p className='text-blue-100 text-sm sm:text-base lg:text-lg'>
              Distribution and analysis of organizations by sector type involved in NCD activities
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Total Organizations</span>
            </div>
            <div className="text-2xl font-bold">{computedData.totalOrganizations}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3Icon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Leading Sector</span>
            </div>
            <div className="text-lg font-bold">{computedData.topSector?.Sector || 'N/A'}</div>
            <div className="text-blue-200 text-sm">{computedData.topSector?.Count || 0} organizations</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Building2Icon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Sector Types</span>
            </div>
            <div className="text-2xl font-bold">{computedData.sectorData.length}</div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Distribution of Organizations by Sector</CardTitle>
              <CardDescription className="text-purple-100">
                Comprehensive breakdown of organizational participation across different sectors
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Chart Section */}
            <motion.div 
              className="xl:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GeneralChart data={computedData.sectorChartData} layout="vertical" title="" />
            </motion.div>
            
            {/* Sector Summary */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-4 border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Sectors</h3>
                <div className="space-y-3">
                  {computedData.sectorData.slice(0, 5).map((sector, index) => (
                    <div key={sector.Sector} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-purple-500' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-green-500' :
                          index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {sector.Sector}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {sector.Count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border">
                <h4 className="font-semibold text-gray-800 mb-2">Sector Insights</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Local NGOs dominate with {computedData.topSector ? ((computedData.topSector.Count / Math.max(computedData.totalOrganizations, 1)) * 100).toFixed(1) : 0}% share</li>
                  <li>• {computedData.sectorData.filter(s => s.Count >= 10).length} sectors have 10+ organizations</li>
                  <li>• Strong civil society engagement across all levels</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
