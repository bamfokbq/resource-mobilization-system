import React from 'react'
import { TrendingUp, TrendingDown, Users, FileText, Clock, Activity } from 'lucide-react'
import { AdminKPIs } from '@/actions/adminAnalytics'

interface AdminKPICardsProps {
  kpis?: AdminKPIs
}

interface KPICardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: string
  suffix?: string
  prefix?: string
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color, suffix = '', prefix = '' }) => {
  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
  const changeBg = isPositive ? 'bg-green-100' : 'bg-red-100'

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeBg} ${changeColor}`}>
          {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
      </div>
      
      <div className="mt-4 flex items-center text-xs text-gray-500">
        <span>vs last month</span>
      </div>
    </div>
  )
}

const AdminKPICards: React.FC<AdminKPICardsProps> = ({ kpis }) => {
  // Handle undefined or loading state
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4">
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const kpiData = [
    {
      title: 'Total Users',
      value: kpis.totalUsers || 0,
      change: kpis.userGrowthRate || 0,
      icon: <Users size={20} className="text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Completed Surveys',
      value: kpis.totalSurveys || 0,
      change: kpis.surveyGrowthRate || 0,
      icon: <FileText size={20} className="text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Completion Rate',
      value: kpis.completionRate || 0,
      change: 5.2, // This could be calculated from historical data
      icon: <Activity size={20} className="text-purple-600" />,
      color: 'bg-purple-100',
      suffix: '%'
    },
    {
      title: 'Active Users',
      value: kpis.activeUsers || 0,
      change: 8.1, // This could be calculated from historical data
      icon: <Activity size={20} className="text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Avg. Completion Time',
      value: kpis.avgTimeToComplete || 0,
      change: -3.5, // Negative is good for time metrics
      icon: <Clock size={20} className="text-indigo-600" />,
      color: 'bg-indigo-100',
      suffix: ' min'
    },
    {
      title: 'Drafts in Progress',
      value: kpis.totalDrafts || 0,
      change: 12.3,
      icon: <FileText size={20} className="text-yellow-600" />,
      color: 'bg-yellow-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          color={kpi.color}
          suffix={kpi.suffix}
        />
      ))}
    </div>
  )
}

export default AdminKPICards
