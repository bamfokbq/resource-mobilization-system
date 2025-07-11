"use client";

import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Clock, TrendingUp, Users, Activity } from 'lucide-react'
import { UserEngagementMetrics } from '@/actions/adminAnalytics'

interface UserEngagementChartsProps {
  userEngagement: UserEngagementMetrics
}

const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  indigo: '#6366F1'
}

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.purple, COLORS.indigo, COLORS.danger]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('Rate') || entry.dataKey.includes('Time') ? (entry.dataKey.includes('Time') ? ' min' : '%') : ''}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const MetricCard: React.FC<{
  title: string
  value: number
  unit: string
  icon: React.ReactNode
  color: string
  description: string
}> = ({ title, value, unit, icon, color, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900">
          {value}{unit}
        </p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
)

export const UserEngagementCharts: React.FC<UserEngagementChartsProps> = ({ userEngagement }) => {
  return (
    <div className="space-y-8">
      {/* Engagement Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Session Time"
          value={userEngagement.averageSessionTime}
          unit=" min"
          icon={<Clock size={20} className="text-blue-600" />}
          color="bg-blue-100"
          description="Average time users spend per session"
        />
        <MetricCard
          title="Step Completion"
          value={Math.round(userEngagement.surveyCompletionByStep.reduce((acc, step) => acc + (100 - step.dropoffRate), 0) / userEngagement.surveyCompletionByStep.length)}
          unit="%"
          icon={<Activity size={20} className="text-green-600" />}
          color="bg-green-100"
          description="Average completion rate across all steps"
        />
        <MetricCard
          title="User Retention"
          value={userEngagement.userRetention[0]?.retained || 0}
          unit="%"
          icon={<Users size={20} className="text-purple-600" />}
          color="bg-purple-100"
          description="Week 1 user retention rate"
        />
        <MetricCard
          title="Feature Usage"
          value={Math.round(userEngagement.featureUsage.reduce((acc, feature) => acc + feature.usage, 0) / userEngagement.featureUsage.length)}
          unit="%"
          icon={<TrendingUp size={20} className="text-orange-600" />}
          color="bg-orange-100"
          description="Average feature adoption rate"
        />
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Survey Step Analysis</h3>
            <p className="text-sm text-gray-600">Dropoff rates and average time per step</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userEngagement.surveyCompletionByStep}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="step" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="dropoffRate" fill={COLORS.danger} name="Dropoff Rate %" />
              <Bar dataKey="avgTime" fill={COLORS.primary} name="Avg Time (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Retention Analysis</h3>
            <p className="text-sm text-gray-600">Retention vs churn over time periods</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userEngagement.userRetention}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="retained"
                stroke={COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 5 }}
                name="Retained %"
              />
              <Line
                type="monotone"
                dataKey="churned"
                stroke={COLORS.danger}
                strokeWidth={3}
                dot={{ fill: COLORS.danger, strokeWidth: 2, r: 5 }}
                name="Churned %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Usage Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Usage Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Feature Usage Distribution</h3>
            <p className="text-sm text-gray-600">How users engage with different features</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userEngagement.featureUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ feature, usage }) => `${feature}: ${usage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="usage"
              >
                {userEngagement.featureUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Usage Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Feature Usage Trends</h3>
            <p className="text-sm text-gray-600">Usage trends and growth rates</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userEngagement.featureUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="feature" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="usage" fill={COLORS.primary} name="Current Usage %" />
              <Bar dataKey="trend" fill={COLORS.secondary} name="Growth Trend %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Key Engagement Insights</h3>
          <p className="text-sm text-gray-600">Important findings from user behavi








            or analysis</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📊 Survey Completion</h4>
            <p className="text-sm text-blue-700">
              {userEngagement.surveyCompletionByStep[0]?.step} has the highest dropoff rate at {userEngagement.surveyCompletionByStep[0]?.dropoffRate}%
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">🎯 User Retention</h4>
            <p className="text-sm text-green-700">
              {userEngagement.userRetention[0]?.retained}% of users remain active after their first week
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">⚡ Feature Adoption</h4>
            <p className="text-sm text-purple-700">
              Most popular feature: {userEngagement.featureUsage.reduce((prev, current) => 
                prev.usage > current.usage ? prev : current
              ).feature}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
