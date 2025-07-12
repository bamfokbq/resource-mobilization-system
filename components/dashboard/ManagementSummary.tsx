"use client"

import React from 'react'
import { TrendingUp, TrendingDown, Users, FileText, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminKPIs, SystemMetrics } from '@/actions/adminAnalytics'

interface ManagementSummaryProps {
  kpis: AdminKPIs
  systemMetrics: SystemMetrics
}

const ManagementSummary: React.FC<ManagementSummaryProps> = ({ kpis, systemMetrics }) => {
  // Calculate executive insights
  const totalEngagement = systemMetrics.dailyActiveUsers.reduce((sum, day) => sum + day.users, 0)
  const avgDailyUsers = totalEngagement / systemMetrics.dailyActiveUsers.length
  
  const projectEfficiency = kpis.completionRate >= 70 ? 'High' : kpis.completionRate >= 50 ? 'Medium' : 'Low'
  const userGrowthTrend = kpis.userGrowthRate > 0 ? 'Positive' : 'Negative'
  
  // Calculate ROI indicators
  const productivityIndex = Math.round((kpis.totalSurveys / kpis.totalUsers) * 100)
  const systemUtilization = Math.round((kpis.activeUsers / kpis.totalUsers) * 100)
  
  // Risk assessment
  const criticalIssues = []
  if (kpis.completionRate < 50) criticalIssues.push('Low completion rate')
  if (kpis.userGrowthRate < 0) criticalIssues.push('Declining user growth')
  if (systemUtilization < 30) criticalIssues.push('Poor user engagement')

  return (
    <div className="space-y-6">
      {/* Executive Summary Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Target className="text-yellow-400" size={32} />
            Executive Summary
          </CardTitle>
          <p className="text-blue-100">NCD Navigator Platform - Management Dashboard</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{kpis.totalSurveys}</div>
              <div className="text-sm text-blue-200">Total Projects Completed</div>
              <div className="text-xs text-blue-300 mt-1">
                {kpis.surveyGrowthRate > 0 ? '+' : ''}{kpis.surveyGrowthRate}% from last month
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{systemUtilization}%</div>
              <div className="text-sm text-blue-200">Platform Utilization</div>
              <div className="text-xs text-blue-300 mt-1">{kpis.activeUsers} of {kpis.totalUsers} users active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{kpis.completionRate}%</div>
              <div className="text-sm text-blue-200">Project Success Rate</div>
              <div className="text-xs text-blue-300 mt-1">{projectEfficiency} efficiency rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              {kpis.surveyGrowthRate >= 0 ? (
                <TrendingUp className="text-green-500" size={20} />
              ) : (
                <TrendingDown className="text-red-500" size={20} />
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Project Delivery</h3>
            <p className="text-2xl font-bold text-gray-900">{kpis.totalSurveys}</p>
            <p className="text-xs text-gray-500 mt-2">Projects successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="text-blue-600" size={24} />
              </div>
              {kpis.userGrowthRate >= 0 ? (
                <TrendingUp className="text-green-500" size={20} />
              ) : (
                <TrendingDown className="text-red-500" size={20} />
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Team Engagement</h3>
            <p className="text-2xl font-bold text-gray-900">{systemUtilization}%</p>
            <p className="text-xs text-gray-500 mt-2">Active team members</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Target className="text-purple-600" size={24} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                productivityIndex >= 100 ? 'bg-green-100 text-green-800' : 
                productivityIndex >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {productivityIndex >= 100 ? 'Excellent' : productivityIndex >= 50 ? 'Good' : 'Needs Attention'}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Team Productivity</h3>
            <p className="text-2xl font-bold text-gray-900">{productivityIndex}</p>
            <p className="text-xs text-gray-500 mt-2">Projects per team member</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <Clock className="text-orange-600" size={24} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                kpis.avgTimeToComplete <= 30 ? 'bg-green-100 text-green-800' : 
                kpis.avgTimeToComplete <= 60 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {kpis.avgTimeToComplete <= 30 ? 'Fast' : kpis.avgTimeToComplete <= 60 ? 'Moderate' : 'Slow'}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Delivery Speed</h3>
            <p className="text-2xl font-bold text-gray-900">{kpis.avgTimeToComplete}m</p>
            <p className="text-xs text-gray-500 mt-2">Average completion time</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              Business Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">NCD Projects Initiated</span>
                <span className="text-lg font-bold text-green-700">{kpis.totalSurveys}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Healthcare Organizations Engaged</span>
                <span className="text-lg font-bold text-blue-700">{kpis.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Regional Coverage</span>
                <span className="text-lg font-bold text-purple-700">{systemMetrics.regionDistribution.length} regions</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Healthcare Sectors</span>
                <span className="text-lg font-bold text-orange-700">{systemMetrics.sectorAnalysis.length} sectors</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className={`${criticalIssues.length > 0 ? 'text-red-600' : 'text-green-600'}`} size={20} />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {criticalIssues.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm font-medium text-red-600 mb-3">Issues Requiring Attention:</div>
                {criticalIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-sm text-red-700">{issue}</span>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800 mb-1">Recommended Actions:</div>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Review current project management processes</li>
                    <li>• Implement user engagement initiatives</li>
                    <li>• Analyze completion barriers and bottlenecks</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
                <div className="text-lg font-semibold text-green-700 mb-2">All Systems Operational</div>
                <div className="text-sm text-green-600">No critical issues detected</div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-700">
                    Platform is performing well with strong user engagement and project completion rates.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      {/* <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Growth & Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{kpis.userGrowthRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">User Growth Rate</div>
              <div className="text-xs text-gray-500 mt-1">Month-over-month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{kpis.surveyGrowthRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Project Growth Rate</div>
              <div className="text-xs text-gray-500 mt-1">Month-over-month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{avgDailyUsers.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Avg Daily Active Users</div>
              <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{kpis.totalDrafts}</div>
              <div className="text-sm text-gray-600">Projects in Progress</div>
              <div className="text-xs text-gray-500 mt-1">Current pipeline</div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

export default ManagementSummary
