"use client";

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UsersIcon, FilterIcon, AlertTriangleIcon, TrendingUpIcon, BabyIcon, GraduationCapIcon, UserIcon, UserCheckIcon, UserXIcon } from "lucide-react"

// Mock data for age group activities across diseases and regions
const ageGroupActivitiesData = [
  // Greater Accra
  { id: 1, ageGroup: "Under 5", disease: "Hypertension", region: "Greater Accra", activities: 2, priority: "low" },
  { id: 2, ageGroup: "Under 5", disease: "Diabetes", region: "Greater Accra", activities: 1, priority: "critical" },
  { id: 3, ageGroup: "Under 5", disease: "Mental Health", region: "Greater Accra", activities: 8, priority: "adequate" },
  { id: 4, ageGroup: "Under 5", disease: "Cancer", region: "Greater Accra", activities: 3, priority: "low" },

  { id: 5, ageGroup: "5-17", disease: "Hypertension", region: "Greater Accra", activities: 12, priority: "adequate" },
  { id: 6, ageGroup: "5-17", disease: "Diabetes", region: "Greater Accra", activities: 8, priority: "moderate" },
  { id: 7, ageGroup: "5-17", disease: "Mental Health", region: "Greater Accra", activities: 15, priority: "good" },
  { id: 8, ageGroup: "5-17", disease: "Cancer", region: "Greater Accra", activities: 4, priority: "low" },

  { id: 9, ageGroup: "18-49", disease: "Hypertension", region: "Greater Accra", activities: 34, priority: "good" },
  { id: 10, ageGroup: "18-49", disease: "Diabetes", region: "Greater Accra", activities: 28, priority: "good" },
  { id: 11, ageGroup: "18-49", disease: "Mental Health", region: "Greater Accra", activities: 22, priority: "good" },
  { id: 12, ageGroup: "18-49", disease: "Cancer", region: "Greater Accra", activities: 18, priority: "adequate" },

  { id: 13, ageGroup: "50-69", disease: "Hypertension", region: "Greater Accra", activities: 42, priority: "excellent" },
  { id: 14, ageGroup: "50-69", disease: "Diabetes", region: "Greater Accra", activities: 38, priority: "excellent" },
  { id: 15, ageGroup: "50-69", disease: "Mental Health", region: "Greater Accra", activities: 16, priority: "adequate" },
  { id: 16, ageGroup: "50-69", disease: "Cancer", region: "Greater Accra", activities: 25, priority: "good" },

  { id: 17, ageGroup: "70+", disease: "Hypertension", region: "Greater Accra", activities: 18, priority: "adequate" },
  { id: 18, ageGroup: "70+", disease: "Diabetes", region: "Greater Accra", activities: 15, priority: "adequate" },
  { id: 19, ageGroup: "70+", disease: "Mental Health", region: "Greater Accra", activities: 6, priority: "critical" },
  { id: 20, ageGroup: "70+", disease: "Cancer", region: "Greater Accra", activities: 12, priority: "moderate" },

  // Ashanti
  { id: 21, ageGroup: "Under 5", disease: "Hypertension", region: "Ashanti", activities: 1, priority: "critical" },
  { id: 22, ageGroup: "Under 5", disease: "Diabetes", region: "Ashanti", activities: 0, priority: "critical" },
  { id: 23, ageGroup: "Under 5", disease: "Mental Health", region: "Ashanti", activities: 5, priority: "moderate" },
  { id: 24, ageGroup: "Under 5", disease: "Cancer", region: "Ashanti", activities: 2, priority: "low" },

  { id: 25, ageGroup: "5-17", disease: "Hypertension", region: "Ashanti", activities: 8, priority: "moderate" },
  { id: 26, ageGroup: "5-17", disease: "Diabetes", region: "Ashanti", activities: 6, priority: "moderate" },
  { id: 27, ageGroup: "5-17", disease: "Mental Health", region: "Ashanti", activities: 12, priority: "adequate" },
  { id: 28, ageGroup: "5-17", disease: "Cancer", region: "Ashanti", activities: 3, priority: "low" },

  { id: 29, ageGroup: "18-49", disease: "Hypertension", region: "Ashanti", activities: 28, priority: "good" },
  { id: 30, ageGroup: "18-49", disease: "Diabetes", region: "Ashanti", activities: 22, priority: "adequate" },
  { id: 31, ageGroup: "18-49", disease: "Mental Health", region: "Ashanti", activities: 18, priority: "adequate" },
  { id: 32, ageGroup: "18-49", disease: "Cancer", region: "Ashanti", activities: 14, priority: "adequate" },

  { id: 33, ageGroup: "50-69", disease: "Hypertension", region: "Ashanti", activities: 32, priority: "good" },
  { id: 34, ageGroup: "50-69", disease: "Diabetes", region: "Ashanti", activities: 28, priority: "good" },
  { id: 35, ageGroup: "50-69", disease: "Mental Health", region: "Ashanti", activities: 12, priority: "moderate" },
  { id: 36, ageGroup: "50-69", disease: "Cancer", region: "Ashanti", activities: 18, priority: "adequate" },

  { id: 37, ageGroup: "70+", disease: "Hypertension", region: "Ashanti", activities: 14, priority: "moderate" },
  { id: 38, ageGroup: "70+", disease: "Diabetes", region: "Ashanti", activities: 12, priority: "moderate" },
  { id: 39, ageGroup: "70+", disease: "Mental Health", region: "Ashanti", activities: 4, priority: "critical" },
  { id: 40, ageGroup: "70+", disease: "Cancer", region: "Ashanti", activities: 8, priority: "low" },

  // Northern
  { id: 41, ageGroup: "Under 5", disease: "Hypertension", region: "Northern", activities: 0, priority: "critical" },
  { id: 42, ageGroup: "Under 5", disease: "Diabetes", region: "Northern", activities: 0, priority: "critical" },
  { id: 43, ageGroup: "Under 5", disease: "Mental Health", region: "Northern", activities: 3, priority: "low" },
  { id: 44, ageGroup: "Under 5", disease: "Cancer", region: "Northern", activities: 1, priority: "critical" },

  { id: 45, ageGroup: "5-17", disease: "Hypertension", region: "Northern", activities: 4, priority: "low" },
  { id: 46, ageGroup: "5-17", disease: "Diabetes", region: "Northern", activities: 3, priority: "low" },
  { id: 47, ageGroup: "5-17", disease: "Mental Health", region: "Northern", activities: 8, priority: "moderate" },
  { id: 48, ageGroup: "5-17", disease: "Cancer", region: "Northern", activities: 2, priority: "critical" },

  { id: 49, ageGroup: "18-49", disease: "Hypertension", region: "Northern", activities: 16, priority: "adequate" },
  { id: 50, ageGroup: "18-49", disease: "Diabetes", region: "Northern", activities: 12, priority: "moderate" },
  { id: 51, ageGroup: "18-49", disease: "Mental Health", region: "Northern", activities: 14, priority: "adequate" },
  { id: 52, ageGroup: "18-49", disease: "Cancer", region: "Northern", activities: 8, priority: "low" },

  { id: 53, ageGroup: "50-69", disease: "Hypertension", region: "Northern", activities: 18, priority: "adequate" },
  { id: 54, ageGroup: "50-69", disease: "Diabetes", region: "Northern", activities: 15, priority: "adequate" },
  { id: 55, ageGroup: "50-69", disease: "Mental Health", region: "Northern", activities: 8, priority: "low" },
  { id: 56, ageGroup: "50-69", disease: "Cancer", region: "Northern", activities: 6, priority: "low" },

  { id: 57, ageGroup: "70+", disease: "Hypertension", region: "Northern", activities: 6, priority: "low" },
  { id: 58, ageGroup: "70+", disease: "Diabetes", region: "Northern", activities: 4, priority: "critical" },
  { id: 59, ageGroup: "70+", disease: "Mental Health", region: "Northern", activities: 2, priority: "critical" },
  { id: 60, ageGroup: "70+", disease: "Cancer", region: "Northern", activities: 3, priority: "critical" }
]

// Age groups and other filter options
const ageGroups = ["Under 5", "5-17", "18-49", "50-69", "70+"]
const diseases = ["Hypertension", "Diabetes", "Mental Health", "Cancer"]
const regions = ["Greater Accra", "Ashanti", "Northern"]

export default function AgeGroups() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedDisease, setSelectedDisease] = useState<string>("all")

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = ageGroupActivitiesData
    if (selectedRegion !== "all") {
      data = data.filter(item => item.region === selectedRegion)
    }
    if (selectedDisease !== "all") {
      data = data.filter(item => item.disease === selectedDisease)
    }
    return data
  }, [selectedRegion, selectedDisease])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalActivities = filteredData.reduce((sum, item) => sum + item.activities, 0)
    const criticalGroups = filteredData.filter(item => item.priority === "critical").length
    const underTargetedGroups = filteredData.filter(item => item.priority === "critical" || item.priority === "low").length

    return {
      totalActivities,
      criticalGroups,
      underTargetedGroups,
      avgActivitiesPerGroup: Math.round(totalActivities / ageGroups.length)
    }
  }, [filteredData])

  // Prepare chart data - aggregate by age group
  const chartData = useMemo(() => {
    const aggregated: any = {}

    ageGroups.forEach(ageGroup => {
      aggregated[ageGroup] = {
        ageGroup,
        Hypertension: 0,
        Diabetes: 0,
        "Mental Health": 0,
        Cancer: 0
      }
    })

    filteredData.forEach(item => {
      if (aggregated[item.ageGroup]) {
        aggregated[item.ageGroup][item.disease] += item.activities
      }
    })

    return Object.values(aggregated)
  }, [filteredData])

  // Identify under-targeted groups (critical and low priority)
  const underTargetedData = useMemo(() => {
    return filteredData.filter(item => item.priority === "critical" || item.priority === "low")
      .sort((a, b) => {
        if (a.priority === "critical" && b.priority !== "critical") return -1
        if (b.priority === "critical" && a.priority !== "critical") return 1
        return a.activities - b.activities
      })
  }, [filteredData])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "low": return "bg-orange-100 text-orange-800 border-orange-200"
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "adequate": return "bg-blue-100 text-blue-800 border-blue-200"
      case "good": return "bg-green-100 text-green-800 border-green-200"
      case "excellent": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAgeGroupIcon = (ageGroup: string) => {
    switch (ageGroup) {
      case "Under 5": return <BabyIcon className="w-4 h-4" />
      case "5-17": return <GraduationCapIcon className="w-4 h-4" />
      case "18-49": return <UserIcon className="w-4 h-4" />
      case "50-69": return <UserCheckIcon className="w-4 h-4" />
      case "70+": return <UserXIcon className="w-4 h-4" />
      default: return <UsersIcon className="w-4 h-4" />
    }
  }

  return (
    <section className='mb-8' id='age-groups'>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Activities by Age Groups</h1>
              <p className='text-blue-100 text-lg'>
                Comprehensive analysis of NCD activities segmented by age brackets (Under 5, 5-17, 18-49, 50-69, 70+),
                highlighting under-targeted age groups and ensuring equitable health interventions across all demographics.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FilterIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Filter Age Group Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Region
                </label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Disease Focus
                </label>
                <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Select disease" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Diseases</SelectItem>
                    {diseases.map(disease => (
                      <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.totalActivities}</div>
                  <div className="text-blue-100 mt-1 font-medium">Total Activities</div>
                  <div className="text-xs text-blue-200 mt-2">Across all age groups</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.criticalGroups}</div>
                  <div className="text-red-100 mt-1 font-medium">Critical Gaps</div>
                  <div className="text-xs text-red-200 mt-2">Urgently need attention</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.underTargetedGroups}</div>
                  <div className="text-orange-100 mt-1 font-medium">Under-Targeted</div>
                  <div className="text-xs text-orange-200 mt-2">Groups needing more focus</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UserXIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.avgActivitiesPerGroup}</div>
                  <div className="text-purple-100 mt-1 font-medium">Avg Per Age Group</div>
                  <div className="text-xs text-purple-200 mt-2">Activities distribution</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age Group vs Disease Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Age Group vs Disease Activity Matrix</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="ageGroup"
                    className="text-sm font-medium"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-sm font-medium"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Hypertension" fill="#3b82f6" name="Hypertension" />
                  <Bar dataKey="Diabetes" fill="#10b981" name="Diabetes" />
                  <Bar dataKey="Mental Health" fill="#f59e0b" name="Mental Health" />
                  <Bar dataKey="Cancer" fill="#ef4444" name="Cancer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Under-Targeted Groups Alert */}
        <Card className="border-0 shadow-lg border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangleIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Under-Targeted Age Groups (Priority Alert)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Age Group</TableHead>
                    <TableHead className="font-semibold">Disease</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Activities</TableHead>
                    <TableHead className="font-semibold">Priority Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {underTargetedData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getAgeGroupIcon(item.ageGroup)}
                          {item.ageGroup}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.disease}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{item.region}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${item.activities === 0 ? 'bg-red-100 text-red-800' :
                          item.activities <= 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.activities}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Age Group Matrix Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Complete Age Group Activity Matrix</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Age Group</TableHead>
                    <TableHead className="font-semibold">Disease</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Activities</TableHead>
                    <TableHead className="font-semibold">Coverage Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getAgeGroupIcon(item.ageGroup)}
                          {item.ageGroup}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.disease}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{item.region}</TableCell>
                      <TableCell className="text-center font-semibold text-lg">{item.activities}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
