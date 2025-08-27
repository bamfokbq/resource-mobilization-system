"use client";

import React, { useState, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UsersIcon, FilterIcon, TargetIcon, TrendingUpIcon, AlertCircleIcon, Download, Image } from "lucide-react"
import ExportService from '@/lib/exportService'

// Mock data for target group activities (Total: 45 activities)
// Part of overall 640 activities target across all components
const targetGroupActivities = [
  {
    id: 1,
    targetGroup: "PLWDs (Persons Living with Disabilities)",
    type: "Priority Population",
    activities: 2,
    focusArea: "Mental Health",
    coverage: 45,
    regions: ["Greater Accra", "Ashanti"],
    priority: "high",
    equityScore: 3.2
  },
  {
    id: 2,
    targetGroup: "Children (0-17)",
    type: "Age-based",
    activities: 3,
    focusArea: "Preventive Care",
    coverage: 78,
    regions: ["Greater Accra", "Central", "Western"],
    priority: "high",
    equityScore: 4.1
  },
  {
    id: 3,
    targetGroup: "Adolescents (10-19)",
    type: "Age-based",
    activities: 3,
    focusArea: "Mental Health",
    coverage: 62,
    regions: ["Ashanti", "Eastern", "Volta"],
    priority: "medium",
    equityScore: 3.8
  },
  {
    id: 4,
    targetGroup: "Health Workers",
    type: "Professional",
    activities: 4,
    focusArea: "Capacity Building",
    coverage: 89,
    regions: ["Greater Accra", "Ashanti", "Northern", "Upper East"],
    priority: "medium",
    equityScore: 4.5
  },
  {
    id: 5,
    targetGroup: "Elderly (65+)",
    type: "Age-based",
    activities: 5,
    focusArea: "Chronic Disease Management",
    coverage: 72,
    regions: ["Greater Accra", "Ashanti", "Western", "Central", "Eastern"],
    priority: "high",
    equityScore: 4.2
  },
  {
    id: 6,
    targetGroup: "Women of Reproductive Age",
    type: "Gender-based",
    activities: 5,
    focusArea: "Reproductive Health",
    coverage: 83,
    regions: ["Greater Accra", "Central", "Volta", "Western"],
    priority: "high",
    equityScore: 4.3
  },
  {
    id: 7,
    targetGroup: "Rural Communities",
    type: "Geographic",
    activities: 3,
    focusArea: "Primary Healthcare",
    coverage: 55,
    regions: ["Northern", "Upper East", "Upper West", "Volta"],
    priority: "high",
    equityScore: 3.1
  },
  {
    id: 8,
    targetGroup: "Urban Poor",
    type: "Socioeconomic",
    activities: 3,
    focusArea: "Basic Healthcare",
    coverage: 48,
    regions: ["Greater Accra", "Ashanti", "Western"],
    priority: "high",
    equityScore: 2.9
  },
  {
    id: 9,
    targetGroup: "General Population",
    type: "Universal",
    activities: 8,
    focusArea: "Health Promotion",
    coverage: 85,
    regions: ["Greater Accra", "Ashanti", "Western", "Central", "Eastern", "Northern"],
    priority: "medium",
    equityScore: 4.0
  },
  {
    id: 10,
    targetGroup: "High-Risk Groups",
    type: "Risk-based",
    activities: 3,
    focusArea: "Disease Prevention",
    coverage: 67,
    regions: ["Greater Accra", "Ashanti", "Central"],
    priority: "high",
    equityScore: 3.7
  },
  {
    id: 11,
    targetGroup: "Pregnant Women",
    type: "Gender-based",
    activities: 3,
    focusArea: "Maternal Health",
    coverage: 91,
    regions: ["Greater Accra", "Ashanti", "Central", "Western"],
    priority: "high",
    equityScore: 4.4
  },
  {
    id: 12,
    targetGroup: "Men (18-64)",
    type: "Gender-based",
    activities: 2,
    focusArea: "Occupational Health",
    coverage: 34,
    regions: ["Greater Accra", "Ashanti"],
    priority: "medium",
    equityScore: 2.8
  },
  {
    id: 13,
    targetGroup: "Indigenous Communities",
    type: "Cultural",
    activities: 2,
    focusArea: "Traditional Medicine Integration",
    coverage: 28,
    regions: ["Northern", "Upper West", "Volta"],
    priority: "high",
    equityScore: 2.5
  },
  {
    id: 14,
    targetGroup: "Migrants and Refugees",
    type: "Vulnerable Population",
    activities: 1,
    focusArea: "Emergency Healthcare",
    coverage: 22,
    regions: ["Greater Accra", "Western"],
    priority: "high",
    equityScore: 2.1
  }
]

// Define target group types for filtering
const targetGroupTypes = [
  "Priority Population",
  "Age-based",
  "Gender-based",
  "Geographic",
  "Socioeconomic",
  "Professional",
  "Risk-based",
  "Universal",
  "Cultural",
  "Vulnerable Population"
]

// Define focus areas
const focusAreas = [
  "Mental Health",
  "Preventive Care",
  "Chronic Disease Management",
  "Capacity Building",
  "Reproductive Health",
  "Primary Healthcare",
  "Basic Healthcare",
  "Health Promotion",
  "Disease Prevention",
  "Maternal Health",
  "Occupational Health",
  "Traditional Medicine Integration",
  "Emergency Healthcare"
]

export default function TargetGroups() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  
  // Refs for PNG export
  const tableRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return targetGroupActivities.filter(item => {
      const typeMatch = selectedType === "all" || item.type === selectedType
      const focusMatch = selectedFocusArea === "all" || item.focusArea === selectedFocusArea
      const priorityMatch = selectedPriority === "all" || item.priority === selectedPriority
      return typeMatch && focusMatch && priorityMatch
    })
  }, [selectedType, selectedFocusArea, selectedPriority])

  // Calculate equity analysis metrics
  const equityMetrics = useMemo(() => {
    const priorityGroups = filteredData.filter(item => item.priority === "high")
    const lowCoverageGroups = filteredData.filter(item => item.coverage < 50)
    const lowEquityGroups = filteredData.filter(item => item.equityScore < 3.0)

    return {
      totalGroups: filteredData.length,
      priorityGroups: priorityGroups.length,
      lowCoverage: lowCoverageGroups.length,
      lowEquity: lowEquityGroups.length,
      avgCoverage: Math.round(filteredData.reduce((sum, item) => sum + item.coverage, 0) / filteredData.length),
      avgEquityScore: (filteredData.reduce((sum, item) => sum + item.equityScore, 0) / filteredData.length).toFixed(1)
    }
  }, [filteredData])

  const getCoverageBadgeColor = (coverage: number) => {
    if (coverage >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (coverage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (coverage >= 40) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  // PNG Export functions
  const exportTableAsPNG = async () => {
    if (tableRef.current) {
      try {
        await ExportService.exportTableAsPNG(tableRef.current, {
          filename: 'target_groups_table',
          title: 'Target Groups Activities Table'
        })
      } catch (error) {
        console.error('Table PNG export error:', error)
      }
    }
  }

  const exportSummaryAsPNG = async () => {
    if (summaryRef.current) {
      try {
        await ExportService.exportChartAsImage(summaryRef.current, {
          filename: 'target_groups_summary',
          title: 'Target Groups Summary Analytics'
        })
      } catch (error) {
        console.error('Summary PNG export error:', error)
      }
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEquityScoreColor = (score: number) => {
    if (score >= 4.0) return "text-green-600 font-semibold"
    if (score >= 3.0) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const getHeatMapColor = (coverage: number, activities: number) => {
    // Combine coverage and activity count for heat map intensity
    const intensity = (coverage / 100) * Math.min(activities / 50, 1)
    if (intensity >= 0.8) return "bg-green-200 border-green-300"
    if (intensity >= 0.6) return "bg-yellow-200 border-yellow-300"
    if (intensity >= 0.4) return "bg-orange-200 border-orange-300"
    return "bg-red-200 border-red-300"
  }

  return (
    <section className='mb-8' id='target-groups'>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Activities by Target Groups</h1>
              <p className='text-blue-100 text-lg'>
                Comprehensive analysis of healthcare activities by target populations with equity analysis
                to ensure priority and vulnerable populations are effectively reached and served.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FilterIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Filter Options</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Target Group Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {targetGroupTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Focus Area
                </label>
                <Select value={selectedFocusArea} onValueChange={setSelectedFocusArea}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Focus Areas</SelectItem>
                    {focusAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  Priority Level
                </label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-red-300 transition-colors">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority Levels</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equity Analysis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{equityMetrics.totalGroups}</div>
                  <div className="text-blue-100 mt-1 font-medium">Target Groups</div>
                  <div className="text-xs text-blue-200 mt-2">Total groups tracked</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TargetIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{equityMetrics.priorityGroups}</div>
                  <div className="text-orange-100 mt-1 font-medium">High Priority</div>
                  <div className="text-xs text-orange-200 mt-2">Groups needing attention</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertCircleIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{equityMetrics.avgCoverage}%</div>
                  <div className="text-green-100 mt-1 font-medium">Avg Coverage</div>
                  <div className="text-xs text-green-200 mt-2">Across all groups</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{equityMetrics.avgEquityScore}</div>
                  <div className="text-purple-100 mt-1 font-medium">Equity Score</div>
                  <div className="text-xs text-purple-200 mt-2">Out of 5.0</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heat Map Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TargetIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Target Groups Heat Map</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[700px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Target Group</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">No. of Activities</TableHead>
                    <TableHead className="font-semibold">Focus Area</TableHead>
                    <TableHead className="font-semibold">Coverage</TableHead>
                    <TableHead className="font-semibold">Regions</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="font-semibold">Equity Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className={`hover:bg-gray-50 ${getHeatMapColor(item.coverage, item.activities)} border-l-4`}>
                      <TableCell className="font-medium">{item.targetGroup}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-lg">{item.activities}</TableCell>
                      <TableCell className="text-sm text-gray-600">{item.focusArea}</TableCell>
                      <TableCell>
                        <Badge className={getCoverageBadgeColor(item.coverage)}>
                          {item.coverage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {item.regions.length} regions
                        <div className="text-xs text-gray-400 mt-1">
                          {item.regions.slice(0, 2).join(", ")}
                          {item.regions.length > 2 && ` +${item.regions.length - 2} more`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadgeColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className={getEquityScoreColor(item.equityScore)}>
                        {item.equityScore}/5.0
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Equity Analysis Insights */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircleIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Equity Analysis Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircleIcon className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Low Coverage Groups</h3>
                </div>
                <div className="text-2xl font-bold text-red-700 mb-2">{equityMetrics.lowCoverage}</div>
                <p className="text-sm text-red-600">Groups with less than 50% coverage requiring immediate attention</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUpIcon className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Equity Gaps</h3>
                </div>
                <div className="text-2xl font-bold text-yellow-700 mb-2">{equityMetrics.lowEquity}</div>
                <p className="text-sm text-yellow-600">Groups with equity scores below 3.0 needing targeted interventions</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <UsersIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Priority Populations</h3>
                </div>
                <div className="text-2xl font-bold text-blue-700 mb-2">{Math.round((equityMetrics.priorityGroups / equityMetrics.totalGroups) * 100)}%</div>
                <p className="text-sm text-blue-600">Percentage of target groups classified as high priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
