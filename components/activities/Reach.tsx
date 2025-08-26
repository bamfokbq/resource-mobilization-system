"use client";

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ComponentActionBar } from '@/components/shared/ComponentActionBar'
import { AddEditActivityModal } from '@/components/shared/AddEditActivityModal'
import { ExportService, FIELD_MAPPINGS } from '@/lib/exportService'
import { useSurveyDataFilters } from '@/components/providers/SurveyDataFilterProvider'
import { applyFilters } from '@/hooks/useUrlFilters'
import { Activity } from '@/types/activities'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { UsersIcon, FilterIcon, TrendingUpIcon, MapPinIcon, TargetIcon, BuildingIcon, GlobeIcon, ActivityIcon, EyeIcon, BarChart3Icon, TableIcon } from "lucide-react"
import { toast } from 'sonner'

// Mock data for reach activities
const reachActivitiesData = [
  // Greater Accra
  { id: 1, activity: "Hypertension Awareness Campaign", estimatedReach: 125000, region: "Greater Accra", implementer: "Ghana Health Service", diseaseType: "Hypertension", interventionType: "Health Education" },
  { id: 2, activity: "Diabetes Screening Program", estimatedReach: 85000, region: "Greater Accra", implementer: "WHO Ghana", diseaseType: "Diabetes", interventionType: "Screening" },
  { id: 3, activity: "Mental Health Support Groups", estimatedReach: 45000, region: "Greater Accra", implementer: "Mental Health Authority", diseaseType: "Mental Health", interventionType: "Treatment" },
  { id: 4, activity: "Cancer Prevention Education", estimatedReach: 67000, region: "Greater Accra", implementer: "Ghana Cancer Society", diseaseType: "Cancer", interventionType: "Prevention" },

  // Ashanti
  { id: 5, activity: "Community Blood Pressure Checks", estimatedReach: 98000, region: "Ashanti", implementer: "Ghana Health Service", diseaseType: "Hypertension", interventionType: "Screening" },
  { id: 6, activity: "Diabetes Management Training", estimatedReach: 56000, region: "Ashanti", implementer: "Korle Bu Teaching Hospital", diseaseType: "Diabetes", interventionType: "Treatment" },
  { id: 7, activity: "Youth Mental Health Program", estimatedReach: 78000, region: "Ashanti", implementer: "Christian Health Association", diseaseType: "Mental Health", interventionType: "Prevention" },
  { id: 8, activity: "Breast Cancer Screening", estimatedReach: 42000, region: "Ashanti", implementer: "Ghana Cancer Society", diseaseType: "Cancer", interventionType: "Screening" },

  // Northern
  { id: 9, activity: "Rural Hypertension Outreach", estimatedReach: 34000, region: "Northern", implementer: "WHO Ghana", diseaseType: "Hypertension", interventionType: "Health Education" },
  { id: 10, activity: "Diabetes Prevention Workshop", estimatedReach: 28000, region: "Northern", implementer: "Ghana Health Service", diseaseType: "Diabetes", interventionType: "Prevention" },
  { id: 11, activity: "Community Mental Health", estimatedReach: 23000, region: "Northern", implementer: "Mental Health Authority", diseaseType: "Mental Health", interventionType: "Treatment" },
  { id: 12, activity: "Cancer Awareness Drive", estimatedReach: 19000, region: "Northern", implementer: "Ghana Red Cross", diseaseType: "Cancer", interventionType: "Health Education" },

  // Western
  { id: 13, activity: "Workplace Health Screening", estimatedReach: 67000, region: "Western", implementer: "Private Sector Partners", diseaseType: "Hypertension", interventionType: "Screening" },
  { id: 14, activity: "School Diabetes Education", estimatedReach: 89000, region: "Western", implementer: "Ghana Education Service", diseaseType: "Diabetes", interventionType: "Health Education" },
  { id: 15, activity: "Women's Mental Health", estimatedReach: 45000, region: "Western", implementer: "Christian Health Association", diseaseType: "Mental Health", interventionType: "Treatment" },
  { id: 16, activity: "Cervical Cancer Campaign", estimatedReach: 52000, region: "Western", implementer: "Ghana Cancer Society", diseaseType: "Cancer", interventionType: "Prevention" },

  // Eastern
  { id: 17, activity: "Market Health Education", estimatedReach: 56000, region: "Eastern", implementer: "Ghana Health Service", diseaseType: "Hypertension", interventionType: "Health Education" },
  { id: 18, activity: "Family Diabetes Support", estimatedReach: 43000, region: "Eastern", implementer: "WHO Ghana", diseaseType: "Diabetes", interventionType: "Treatment" },
  { id: 19, activity: "Elder Mental Health Care", estimatedReach: 32000, region: "Eastern", implementer: "Mental Health Authority", diseaseType: "Mental Health", interventionType: "Treatment" },
  { id: 20, activity: "Prostate Cancer Screening", estimatedReach: 38000, region: "Eastern", implementer: "Korle Bu Teaching Hospital", diseaseType: "Cancer", interventionType: "Screening" },

  // Central
  { id: 21, activity: "Faith-Based Health Program", estimatedReach: 72000, region: "Central", implementer: "Christian Health Association", diseaseType: "Hypertension", interventionType: "Health Education" },
  { id: 22, activity: "Mobile Diabetes Clinic", estimatedReach: 35000, region: "Central", implementer: "Ghana Health Service", diseaseType: "Diabetes", interventionType: "Screening" },
  { id: 23, activity: "Student Mental Wellness", estimatedReach: 28000, region: "Central", implementer: "Ghana Education Service", diseaseType: "Mental Health", interventionType: "Prevention" },
  { id: 24, activity: "Community Cancer Support", estimatedReach: 24000, region: "Central", implementer: "Ghana Cancer Society", diseaseType: "Cancer", interventionType: "Treatment" }
]

// Filter options
const regions = ["Greater Accra", "Ashanti", "Northern", "Western", "Eastern", "Central"]
const diseaseTypes = ["Hypertension", "Diabetes", "Mental Health", "Cancer"]
const interventionTypes = ["Health Education", "Screening", "Prevention", "Treatment"]

// Colors for charts
const DISEASE_COLORS = {
  "Hypertension": "#3b82f6",
  "Diabetes": "#10b981",
  "Mental Health": "#f59e0b",
  "Cancer": "#ef4444"
}

const INTERVENTION_COLORS = {
  "Health Education": "#8b5cf6",
  "Screening": "#06b6d4",
  "Prevention": "#84cc16",
  "Treatment": "#f97316"
}

export default function Reach() {
  const [isMounted, setIsMounted] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [chartRef, setChartRef] = useState<HTMLDivElement | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  const { globalFilters } = useSurveyDataFilters()

  useEffect(() => {
    setIsMounted(true)
    setUserRole('Admin') // For demo purposes
  }, [])

  // Transform data to match Activity interface
  const allActivities = useMemo(() => {
    return reachActivitiesData.map(item => ({
      id: item.id.toString(),
      name: item.activity,
      description: `Reach activity targeting ${item.diseaseType} through ${item.interventionType}`,
      disease: item.diseaseType,
      region: item.region,
      implementer: item.implementer,
      targetPopulation: `Estimated reach: ${item.estimatedReach.toLocaleString()}`,
      ageGroup: 'All Ages', // Default value
      status: 'ongoing', // Default value
      startDate: '2023-01-01', // Default values
      endDate: '2024-12-31',
      level: item.interventionType,
      expectedOutcomes: `Reach ${item.estimatedReach.toLocaleString()} people`,
      timeline: '2023-2024'
    }))
  }, [])

  // Apply global filters to activities
  const filteredActivities = useMemo(() => {
    if (!globalFilters) return allActivities

    return applyFilters(allActivities, globalFilters, {
      region: 'region',
      organization: 'implementer',
      disease: 'disease'
    })
  }, [allActivities, globalFilters])

  // Filter data based on current filters (for chart compatibility)
  const filteredData = useMemo(() => {
    return reachActivitiesData.filter(item => {
      const matchingActivity = filteredActivities.find(activity => 
        activity.id === item.id.toString()
      )
      return !!matchingActivity
    })
  }, [filteredActivities])

  // Calculate regional reach data
  const regionalReachData = useMemo(() => {
    const regionTotals: Record<string, number> = {}

    regions.forEach(region => {
      regionTotals[region] = 0
    })

    filteredData.forEach(item => {
      regionTotals[item.region] += item.estimatedReach
    })

    return regions.map(region => ({
      region,
      reach: regionTotals[region],
      formattedReach: (regionTotals[region] / 1000).toFixed(0) + "K"
    })).sort((a, b) => b.reach - a.reach)
  }, [filteredData])

  // Calculate disease type reach data
  const diseaseReachData = useMemo(() => {
    const diseaseTotals: Record<string, number> = {}

    diseaseTypes.forEach(disease => {
      diseaseTotals[disease] = 0
    })

    filteredData.forEach(item => {
      diseaseTotals[item.diseaseType] += item.estimatedReach
    })

    return diseaseTypes.map(disease => ({
      name: disease,
      value: diseaseTotals[disease],
      color: DISEASE_COLORS[disease as keyof typeof DISEASE_COLORS]
    })).filter(item => item.value > 0)
  }, [filteredData])

  // Calculate intervention type reach data
  const interventionReachData = useMemo(() => {
    const interventionTotals: Record<string, number> = {}

    interventionTypes.forEach(intervention => {
      interventionTotals[intervention] = 0
    })

    filteredData.forEach(item => {
      interventionTotals[item.interventionType] += item.estimatedReach
    })

    return interventionTypes.map(intervention => ({
      name: intervention,
      value: interventionTotals[intervention],
      color: INTERVENTION_COLORS[intervention as keyof typeof INTERVENTION_COLORS]
    })).filter(item => item.value > 0)
  }, [filteredData])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalReach = filteredData.reduce((sum, item) => sum + item.estimatedReach, 0)
    const uniqueImplementers = new Set(filteredData.map(item => item.implementer)).size
    const avgReachPerActivity = filteredData.length > 0 ? Math.round(totalReach / filteredData.length) : 0
    const activeRegions = new Set(filteredData.filter(item => item.estimatedReach > 0).map(item => item.region)).size

    return {
      totalReach,
      totalActivities: filteredData.length,
      uniqueImplementers,
      avgReachPerActivity,
      activeRegions
    }
  }, [filteredData])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toLocaleString()
  }

  const getDiseaseColor = (disease: string) => {
    switch (disease) {
      case "Hypertension": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Diabetes": return "bg-green-100 text-green-800 border-green-200"
      case "Mental Health": return "bg-amber-100 text-amber-800 border-amber-200"
      case "Cancer": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getInterventionColor = (intervention: string) => {
    switch (intervention) {
      case "Health Education": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Screening": return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "Prevention": return "bg-lime-100 text-lime-800 border-lime-200"
      case "Treatment": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Handler functions for the proposed features
  const handleAddActivity = () => {
    setSelectedActivity(null)
    setIsAddModalOpen(true)
  }

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsEditModalOpen(true)
  }

  const handleSaveActivity = async (activityData: Activity) => {
    try {
      console.log('Saving activity:', activityData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(
        selectedActivity ? 'Activity updated successfully!' : 'Activity created successfully!',
        { description: `${activityData.name} has been saved.` }
      )
      setIsAddModalOpen(false)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error saving activity:', error)
      throw error
    }
  }

  const handleExportExcel = async () => {
    try {
      const exportData = ExportService.formatDataForExport(
        filteredActivities,
        FIELD_MAPPINGS.activities
      )
      await ExportService.exportToExcel(exportData, {
        filename: 'reach_activities',
        title: 'Reach Activities Report',
        customFields: {
          'Total Activities': filteredActivities.length.toString(),
          'Total Estimated Reach': summaryStats.totalReach.toLocaleString(),
          'Global Filters Applied': Object.entries(globalFilters).filter(([k, v]) => v && v !== 'all').length.toString()
        }
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    }
  }

  const handleExportPDF = async () => {
    try {
      const exportData = ExportService.formatDataForExport(
        filteredActivities,
        FIELD_MAPPINGS.activities
      )
      await ExportService.exportToPDF(exportData, {
        filename: 'reach_activities',
        title: 'Reach Activities Report',
        subtitle: 'Activity Reach Analysis'
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    }
  }

  const handleDownloadVisualization = async () => {
    if (chartRef) {
      try {
        await ExportService.exportChartAsImage(chartRef, {
          filename: 'reach_activities_chart',
          title: 'Reach Activities Distribution'
        })
      } catch (error) {
        console.error('Chart export error:', error)
        toast.error('Chart export failed. Please try again.')
      }
    }
  }

  // No longer need local filter options - using global filters from context

  if (!isMounted) {
    return <div>Loading...</div>
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">Population Reached: {formatNumber(data.value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <section className='mb-8' id='reach'>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TargetIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Population Reach Analysis</h1>
              <p className='text-blue-100 text-lg'>
                Comprehensive analysis of total population reached through NCD activities at national and regional levels,
                segmented by disease type and intervention approach for impact assessment and strategic planning.
              </p>
            </div>
          </div>
        </div>

        {/* Component Actions */}
        <ComponentActionBar
          title="Population Reach Actions"
          showAddButton={userRole === 'Admin'}
          showExportButtons={true}
          showVisualizationDownload={true}
          onAddClick={handleAddActivity}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onDownloadVisualization={handleDownloadVisualization}
        />


        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{formatNumber(summaryStats.totalReach)}</div>
                  <div className="text-blue-100 mt-1 font-medium">Total Reach</div>
                  <div className="text-xs text-blue-200 mt-2">Population reached</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.totalActivities}</div>
                  <div className="text-green-100 mt-1 font-medium">Activities</div>
                  <div className="text-xs text-green-200 mt-2">Total interventions</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ActivityIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.activeRegions}</div>
                  <div className="text-purple-100 mt-1 font-medium">Regions</div>
                  <div className="text-xs text-purple-200 mt-2">With activities</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.uniqueImplementers}</div>
                  <div className="text-orange-100 mt-1 font-medium">Implementers</div>
                  <div className="text-xs text-orange-200 mt-2">Organizations</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BuildingIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{formatNumber(summaryStats.avgReachPerActivity)}</div>
                  <div className="text-cyan-100 mt-1 font-medium">Avg Reach</div>
                  <div className="text-xs text-cyan-200 mt-2">Per activity</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Reach Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Population Reach by Region</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80" ref={setChartRef}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalReachData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="region"
                      className="text-sm font-medium"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      className="text-sm font-medium"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatNumber(value), "Population Reached"]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="reach" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Disease Type Reach Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <GlobeIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Reach by Disease Type</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseReachData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatNumber(value || 0)}`}
                      labelLine={false}
                    >
                      {diseaseReachData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry: any) => (
                        <span style={{ color: entry.color }}>
                          {value}: {formatNumber(entry.payload.value)}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Intervention Type Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TargetIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Population Reach by Intervention Type</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interventionReachData} layout="horizontal" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    type="number"
                    className="text-sm font-medium"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    className="text-sm font-medium"
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatNumber(value), "Population Reached"]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {interventionReachData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activities Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Activity Reach Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Activity</TableHead>
                    <TableHead className="font-semibold">Estimated Reach</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Implementer</TableHead>
                    <TableHead className="font-semibold">Disease Type</TableHead>
                    <TableHead className="font-semibold">Intervention Type</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData
                    .sort((a, b) => b.estimatedReach - a.estimatedReach)
                    .map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.activity}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg font-bold text-blue-600">
                            {formatNumber(item.estimatedReach)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{item.region}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{item.implementer}</TableCell>
                        <TableCell>
                          <Badge className={getDiseaseColor(item.diseaseType)}>
                            {item.diseaseType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getInterventionColor(item.interventionType)}>
                            {item.interventionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <EyeIcon className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{item.activity}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><strong>Estimated Reach:</strong> {item.estimatedReach.toLocaleString()}</div>
                                    <div><strong>Region:</strong> {item.region}</div>
                                    <div><strong>Implementer:</strong> {item.implementer}</div>
                                    <div><strong>Disease Type:</strong> {item.diseaseType}</div>
                                    <div><strong>Intervention Type:</strong> {item.interventionType}</div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {userRole === 'Admin' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const activity = allActivities.find(a => a.id === item.id.toString())
                                  if (activity) handleEditActivity(activity)
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Activity Modal */}
      <AddEditActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveActivity}
        mode="add"
      />

      {/* Edit Activity Modal */}
      <AddEditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveActivity}
        activity={selectedActivity}
        mode="edit"
      />
    </section>
  )
}
