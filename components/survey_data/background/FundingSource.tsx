"use client";

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from 'motion/react'
import { WalletIcon, DollarSignIcon, TrendingUpIcon, PieChartIcon } from "lucide-react"
import { FUNDING_DATA, TOTAL_FUNDING, TOP_FUNDING_SOURCE } from '@/data/survey-mock-data'

export default function FundingSource() {
  return (
    <motion.section 
      className='mb-8' 
      id='funding'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <WalletIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2'>Funding Sources</h1>
            <p className='text-blue-100 text-sm sm:text-base lg:text-lg'>
              Financial support and investment sources for NCD prevention and management activities
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSignIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Total Funding</span>
            </div>
            <div className="text-2xl font-bold">${(TOTAL_FUNDING / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Top Contributor</span>
            </div>
            <div className="text-lg font-bold">{TOP_FUNDING_SOURCE.source.split(' ')[0]}</div>
            <div className="text-blue-200 text-sm">{TOP_FUNDING_SOURCE.percentage}% of total</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <PieChartIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Funding Sources</span>
            </div>
            <div className="text-2xl font-bold">{FUNDING_DATA.length}</div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSignIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Funding Distribution Analysis</CardTitle>
              <CardDescription className="text-green-100">
                Breakdown of financial support sources and their contributions to NCD activities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Funding List */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Major Funding Sources</h3>
              {FUNDING_DATA.map((funding, index) => (
                <motion.div
                  key={funding.source}
                  className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + (index * 0.1) }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-yellow-500' :
                        index === 4 ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-800">{funding.source}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {funding.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        ${(funding.amount / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-500">{funding.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-yellow-500' :
                        index === 4 ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${funding.percentage}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Summary & Insights */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Funding Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">International Funding</span>
                    <span className="text-lg font-bold text-green-600">
                      {FUNDING_DATA.filter(f => f.type === 'International').reduce((sum, f) => sum + f.percentage, 0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Government Funding</span>
                    <span className="text-lg font-bold text-blue-600">
                      {FUNDING_DATA.filter(f => f.type === 'Government').reduce((sum, f) => sum + f.percentage, 0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Private & Foundation</span>
                    <span className="text-lg font-bold text-purple-600">
                      {FUNDING_DATA.filter(f => ['Private', 'Foundation'].includes(f.type)).reduce((sum, f) => sum + f.percentage, 0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border">
                <h4 className="font-semibold text-gray-800 mb-3">Key Insights</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• International organizations provide majority funding (63%)</li>
                  <li>• Strong government commitment with 25% local funding</li>
                  <li>• Diversified funding portfolio reduces dependency risk</li>
                  <li>• Private sector engagement shows growing interest</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border">
                <h4 className="font-semibold text-gray-800 mb-3">Total Investment Impact</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">${(TOTAL_FUNDING / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-gray-600 mt-1">Supporting NCD prevention & management</div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-2 rounded">
                      <div className="font-semibold text-gray-800">Avg per Source</div>
                      <div className="text-blue-600">${((TOTAL_FUNDING / FUNDING_DATA.length) / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <div className="font-semibold text-gray-800">Coverage</div>
                      <div className="text-green-600">Nationwide</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
