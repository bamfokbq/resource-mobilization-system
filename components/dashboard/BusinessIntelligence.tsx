"use client"

import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Target, TrendingUp, Building, MapPin } from 'lucide-react'
import { SystemMetrics } from '@/actions/adminAnalytics'

interface BusinessIntelligenceProps {
  systemMetrics: SystemMetrics
}

const BusinessIntelligence: React.FC<BusinessIntelligenceProps> = ({ systemMetrics }) => {
  // Process data for business insights
  const sectorROI = systemMetrics.sectorAnalysis.map(sector => ({
    ...sector,
    roi: (sector.completion / 100) * 120, // Mock ROI calculation
    investment: sector.count * 15000, // Mock investment per project
    returns: sector.count * 15000 * (sector.completion / 100) * 1.2
  }))

  const regionalValue = systemMetrics.regionDistribution.map(region => ({
    ...region,
    value: region.surveys * 18000, // Mock value per survey
    potential: region.users * 25000, // Mock potential value
    penetration: (region.surveys / region.users) * 100
  }))

  const quarterlyGrowth = [
    { quarter: 'Q1 2024', projects: 45, revenue: 810000, users: 120 },
    { quarter: 'Q2 2024', projects: 62, revenue: 1116000, users: 185 },
    { quarter: 'Q3 2024', projects: 78, revenue: 1404000, users: 240 },
    { quarter: 'Q4 2024', projects: systemMetrics.regionDistribution.reduce((sum, r) => sum + r.surveys, 0), revenue: systemMetrics.regionDistribution.reduce((sum, r) => sum + r.surveys, 0) * 18000, users: systemMetrics.regionDistribution.reduce((sum, r) => sum + r.users, 0) }
  ]

  const ncdImpactMetrics = systemMetrics.ncdFocusAreas.map(ncd => ({
    ...ncd,
    impact: ncd.count * 2500, // Mock impact metric (people reached)
    costSavings: ncd.count * 85000, // Mock healthcare cost savings
    priority: ncd.percentage > 30 ? 'High' : ncd.percentage > 15 ? 'Medium' : 'Low'
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500">
                <DollarSign className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-green-600 mb-1">Platform Value</h3>
            <p className="text-2xl font-bold text-green-900">
              ${(quarterlyGrowth[quarterlyGrowth.length - 1].revenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-green-700 mt-2">Total project value</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500">
                <Users className="text-white" size={24} />
              </div>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-blue-600 mb-1">Healthcare Impact</h3>
            <p className="text-2xl font-bold text-blue-900">
              {ncdImpactMetrics.reduce((sum, ncd) => sum + ncd.impact, 0).toLocaleString()}
            </p>
            <p className="text-xs text-blue-700 mt-2">People reached</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500">
                <Target className="text-white" size={24} />
              </div>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-purple-600 mb-1">Cost Savings</h3>
            <p className="text-2xl font-bold text-purple-900">
              ${(ncdImpactMetrics.reduce((sum, ncd) => sum + ncd.costSavings, 0) / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-purple-700 mt-2">Healthcare savings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-500">
                <Building className="text-white" size={24} />
              </div>
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-orange-600 mb-1">Market Penetration</h3>
            <p className="text-2xl font-bold text-orange-900">
              {Math.round(regionalValue.reduce((sum, r) => sum + r.penetration, 0) / regionalValue.length)}%
            </p>
            <p className="text-xs text-orange-700 mt-2">Average penetration</p>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Performance Trends */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={24} />
            Quarterly Performance Trends
          </CardTitle>
          <p className="text-gray-600">Growth trajectory and revenue performance</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={quarterlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="projects" fill="#3B82F6" name="Projects" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={3} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sector Analysis & Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector ROI Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building className="text-purple-600" size={20} />
              Sector ROI Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">Return on investment by healthcare sector</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorROI} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="sector" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="roi" fill="#8B5CF6" name="ROI %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Market Value */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="text-green-600" size={20} />
              Regional Market Value
            </CardTitle>
            <p className="text-sm text-gray-600">Market penetration and value by region</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalValue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#10B981" name="Current Value ($)" />
                <Bar dataKey="potential" fill="#3B82F6" name="Potential Value ($)" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* NCD Impact Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NCD Focus Areas Impact */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="text-red-600" size={20} />
              NCD Impact Distribution
            </CardTitle>
            <p className="text-sm text-gray-600">Healthcare impact by disease focus area</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ncdImpactMetrics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${Number(value).toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="impact"
                >
                  {ncdImpactMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Strategic Insights */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Strategic Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🎯 Top Performing Sector</h4>
                <p className="text-sm text-blue-800">
                  {sectorROI.reduce((prev, current) => (prev.roi > current.roi) ? prev : current).sector} 
                  ({sectorROI.reduce((prev, current) => (prev.roi > current.roi) ? prev : current).roi.toFixed(1)}% ROI)
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💰 Revenue Opportunity</h4>
                <p className="text-sm text-green-800">
                  ${(regionalValue.reduce((sum, r) => sum + (r.potential - r.value), 0) / 1000000).toFixed(1)}M 
                  untapped market potential across regions
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">🏥 Healthcare Impact</h4>
                <p className="text-sm text-purple-800">
                  Highest impact: {ncdImpactMetrics.reduce((prev, current) => (prev.impact > current.impact) ? prev : current).area}
                  ({ncdImpactMetrics.reduce((prev, current) => (prev.impact > current.impact) ? prev : current).impact.toLocaleString()} people)
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">📈 Growth Projection</h4>
                <p className="text-sm text-orange-800">
                  Based on current trends, expect {Math.round((quarterlyGrowth[quarterlyGrowth.length - 1].projects - quarterlyGrowth[quarterlyGrowth.length - 2].projects) * 1.2)} 
                  additional projects next quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BusinessIntelligence
