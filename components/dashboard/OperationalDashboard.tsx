"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, Clock, TrendingDown, TrendingUp, Users, FileText, Target, Activity } from 'lucide-react'
import { AdminKPIs, SystemMetrics } from '@/actions/adminAnalytics'

interface OperationalDashboardProps {
  kpis: AdminKPIs
  systemMetrics: SystemMetrics
  performanceData?: {
    databaseSize: string
    responseTime: number
    uptime: number
    errorRate: number
  }
}

const OperationalDashboard: React.FC<OperationalDashboardProps> = ({ 
  kpis, 
  systemMetrics, 
  performanceData 
}) => {
  // Calculate operational metrics
  const activeDraftsRatio = kpis.totalDrafts / (kpis.totalSurveys + kpis.totalDrafts) * 100
  const userEngagementScore = (kpis.activeUsers / kpis.totalUsers) * 100
  const projectVelocity = kpis.totalSurveys / 30 // surveys per day (last 30 days)
  
  // System health indicators
  const uptime = performanceData?.uptime || 0
  const systemHealth = {
    status: uptime > 99 ? 'Excellent' : uptime > 95 ? 'Good' : 'Needs Attention',
    color: uptime > 99 ? 'green' : uptime > 95 ? 'yellow' : 'red'
  }

  // Operational alerts
  const alerts = []
  if (kpis.completionRate < 60) alerts.push({ type: 'warning', message: 'Low completion rate detected', metric: `${kpis.completionRate}%` })
  if (userEngagementScore < 40) alerts.push({ type: 'warning', message: 'Low user engagement', metric: `${userEngagementScore.toFixed(1)}%` })
  if ((performanceData?.errorRate || 0) > 5) alerts.push({ type: 'error', message: 'High error rate', metric: `${performanceData?.errorRate || 0}%` })
  if (activeDraftsRatio > 70) alerts.push({ type: 'info', message: 'High draft backlog', metric: `${activeDraftsRatio.toFixed(1)}%` })

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Activity className="text-green-400" size={32} />
            Operational Status
          </CardTitle>
          <p className="text-gray-300">Real-time system health and performance monitoring</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                systemHealth.color === 'green' ? 'text-green-400' : 
                systemHealth.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {performanceData?.uptime}%
              </div>
              <div className="text-sm text-gray-300">System Uptime</div>
              <div className="text-xs text-gray-400 mt-1">{systemHealth.status}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{performanceData?.responseTime}ms</div>
              <div className="text-sm text-gray-300">Response Time</div>
              <div className="text-xs text-gray-400 mt-1">Average API latency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{kpis.activeUsers}</div>
              <div className="text-sm text-gray-300">Active Users</div>
              <div className="text-xs text-gray-400 mt-1">Currently online</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{performanceData?.databaseSize}</div>
              <div className="text-sm text-gray-300">Database Size</div>
              <div className="text-xs text-gray-400 mt-1">Storage utilization</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Alerts */}
      {alerts.length > 0 && (
        <Card className="border-0 shadow-lg border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="text-yellow-600" size={20} />
              Operational Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.type === 'error' ? 'bg-red-50 border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <AlertTriangle className={`mt-0.5 ${
                    alert.type === 'error' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} size={16} />
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${
                      alert.type === 'error' ? 'text-red-800' :
                      alert.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {alert.message}
                    </span>
                    <span className={`ml-2 text-sm ${
                      alert.type === 'error' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      ({alert.metric})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Operational Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                projectVelocity >= 3 ? 'bg-green-100 text-green-800' : 
                projectVelocity >= 1 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {projectVelocity >= 3 ? 'High' : projectVelocity >= 1 ? 'Medium' : 'Low'}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Project Velocity</h3>
            <p className="text-2xl font-bold text-gray-900">{projectVelocity.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-2">Projects/day</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                kpis.completionRate >= 80 ? 'bg-green-100 text-green-800' : 
                kpis.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {kpis.completionRate >= 80 ? 'Excellent' : kpis.completionRate >= 60 ? 'Good' : 'Poor'}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Success Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{kpis.completionRate}%</p>
            <p className="text-xs text-gray-500 mt-2">Completion rate</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Users className="text-purple-600" size={24} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                userEngagementScore >= 70 ? 'bg-green-100 text-green-800' : 
                userEngagementScore >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {userEngagementScore >= 70 ? 'High' : userEngagementScore >= 40 ? 'Medium' : 'Low'}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">User Engagement</h3>
            <p className="text-2xl font-bold text-gray-900">{userEngagementScore.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-2">Active users ratio</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <Clock className="text-orange-600" size={24} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                activeDraftsRatio <= 30 ? 'bg-green-100 text-green-800' : 
                activeDraftsRatio <= 50 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {activeDraftsRatio <= 30 ? 'Low' : activeDraftsRatio <= 50 ? 'Medium' : 'High'}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Draft Backlog</h3>
            <p className="text-2xl font-bold text-gray-900">{activeDraftsRatio.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-2">Pending completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="text-blue-600" size={20} />
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Database Capacity</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{performanceData?.databaseSize}</span>
                  <div className="text-xs text-gray-500">Used storage</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Projects</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{kpis.totalDrafts}</span>
                  <div className="text-xs text-gray-500">In progress</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">User Load</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{userEngagementScore.toFixed(1)}%</span>
                  <div className="text-xs text-gray-500">Platform utilization</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">System Reliability</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-lg font-bold text-green-700">{performanceData?.uptime}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Response Performance</span>
                <div className="flex items-center gap-2">
                  <Activity className="text-blue-500" size={16} />
                  <span className="text-lg font-bold text-blue-700">{performanceData?.responseTime}ms</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Quality Score</span>
                <div className="flex items-center gap-2">
                  <Target className="text-purple-500" size={16} />
                  <span className="text-lg font-bold text-purple-700">{kpis.completionRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="text-green-600" size={20} />
            System Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
              <div className="text-lg font-bold text-green-700">Operational</div>
              <div className="text-sm text-green-600">All systems running</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="text-blue-500 mx-auto mb-2" size={32} />
              <div className="text-lg font-bold text-blue-700">{kpis.totalUsers}</div>
              <div className="text-sm text-blue-600">Total users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="text-purple-500 mx-auto mb-2" size={32} />
              <div className="text-lg font-bold text-purple-700">{kpis.totalSurveys}</div>
              <div className="text-sm text-purple-600">Completed projects</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="text-orange-500 mx-auto mb-2" size={32} />
              <div className="text-lg font-bold text-orange-700">{kpis.surveyGrowthRate.toFixed(1)}%</div>
              <div className="text-sm text-orange-600">Growth rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OperationalDashboard
