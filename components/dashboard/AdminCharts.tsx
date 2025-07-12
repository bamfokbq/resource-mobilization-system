"use client"

import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { SystemMetrics } from '@/actions/adminAnalytics'

interface AdminChartsProps {
  systemMetrics: SystemMetrics
}

// Color palette for consistent theming
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  indigo: '#6366F1',
  pink: '#EC4899',
  teal: '#14B8A6'
}

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.purple, COLORS.indigo, COLORS.pink]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const AdminCharts: React.FC<AdminChartsProps> = ({ systemMetrics }) => {
  return (
    <div className="space-y-8">
      {/* User Activity and Survey Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Active Users</h3>
            <p className="text-sm text-gray-600">User engagement over the last 30 days</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={systemMetrics.dailyActiveUsers}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#userGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Survey Submission Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Survey Submission Trends</h3>
            <p className="text-sm text-gray-600">Daily submissions and drafts</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemMetrics.surveySubmissionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="submitted"
                stroke={COLORS.secondary}
                strokeWidth={2}
                dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
                name="Submitted"
              />
              <Line
                type="monotone"
                dataKey="drafts"
                stroke={COLORS.accent}
                strokeWidth={2}
                dot={{ fill: COLORS.accent, strokeWidth: 2, r: 4 }}
                name="Drafts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Distribution and Sector Analysis */}
      <div className="grid grid-cols-1">
        {/* Regional Distribution */}
        {/* <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Regional Distribution</h3>
            <p className="text-sm text-gray-600">Users and surveys by region</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={systemMetrics.regionDistribution} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 12 }} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="users" fill={COLORS.primary} name="Users" />
              <Bar dataKey="surveys" fill={COLORS.secondary} name="Surveys" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* Sector Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sector Analysis</h3>
            <p className="text-sm text-gray-600">Survey completion by sector</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={systemMetrics.sectorAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="sector" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill={COLORS.primary} name="Total Surveys" />
              <Bar dataKey="completion" fill={COLORS.secondary} name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NCD Focus Areas and User Registration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NCD Focus Areas */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">NCD Focus Areas</h3>
            <p className="text-sm text-gray-600">Distribution of targeted NCDs</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={systemMetrics.ncdFocusAreas}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ area, percentage }) => `${area}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {systemMetrics.ncdFocusAreas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Registration Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Registration Trends</h3>
            <p className="text-sm text-gray-600">New user signups over time</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={systemMetrics.userRegistrationTrend}>
              <defs>
                <linearGradient id="registrationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="registrations"
                stroke={COLORS.purple}
                fillOpacity={1}
                fill="url(#registrationGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminCharts
