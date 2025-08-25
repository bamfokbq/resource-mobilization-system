"use client";

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UsersIcon, FilterIcon, HeartIcon, AlertTriangleIcon, TrendingUpIcon, UserIcon, Users2Icon, SparklesIcon } from "lucide-react"

// Mock data for gender-focused activities
const genderActivitiesData = [
  // Male-targeted activities
  { id: 1, genderTarget: "Male", activity: "Men's Health Screening", disease: "Hypertension", region: "Greater Accra", activities: 4, isGenderSensitive: true, equityScore: 85 },
  { id: 2, genderTarget: "Male", activity: "Prostate Cancer Awareness", disease: "Cancer", region: "Ashanti", activities: 3, isGenderSensitive: true, equityScore: 90 },
  { id: 3, genderTarget: "Male", activity: "Male Mental Health Support", disease: "Mental Health", region: "Northern", activities: 2, isGenderSensitive: true, equityScore: 88 },
  { id: 4, genderTarget: "Male", activity: "Occupational Health for Men", disease: "Hypertension", region: "Western", activities: 3, isGenderSensitive: false, equityScore: 75 },
  { id: 5, genderTarget: "Male", activity: "Diabetes Prevention for Men", disease: "Diabetes", region: "Eastern", activities: 3, isGenderSensitive: true, equityScore: 82 },

  // Female-targeted activities
  { id: 6, genderTarget: "Female", activity: "Women's Health Education", disease: "Hypertension", region: "Greater Accra", activities: 7, isGenderSensitive: true, equityScore: 92 },
  { id: 7, genderTarget: "Female", activity: "Cervical Cancer Screening", disease: "Cancer", region: "Ashanti", activities: 6, isGenderSensitive: true, equityScore: 95 },
  { id: 8, genderTarget: "Female", activity: "Maternal Mental Health", disease: "Mental Health", region: "Northern", activities: 5, isGenderSensitive: true, equityScore: 88 },
  { id: 9, genderTarget: "Female", activity: "Breast Cancer Support", disease: "Cancer", region: "Western", activities: 5, isGenderSensitive: true, equityScore: 93 },
  { id: 10, genderTarget: "Female", activity: "Women's Diabetes Care", disease: "Diabetes", region: "Central", activities: 6, isGenderSensitive: true, equityScore: 87 },
  { id: 11, genderTarget: "Female", activity: "Postpartum Health Services", disease: "Hypertension", region: "Volta", activities: 4, isGenderSensitive: true, equityScore: 90 },

  // All genders activities
  { id: 12, genderTarget: "All", activity: "Community Health Education", disease: "Hypertension", region: "Greater Accra", activities: 11, isGenderSensitive: false, equityScore: 70 },
  { id: 13, genderTarget: "All", activity: "General Health Screening", disease: "Diabetes", region: "Ashanti", activities: 8, isGenderSensitive: false, equityScore: 72 },
  { id: 14, genderTarget: "All", activity: "Family Health Programs", disease: "Mental Health", region: "Northern", activities: 7, isGenderSensitive: true, equityScore: 85 },
  { id: 15, genderTarget: "All", activity: "Workplace Wellness", disease: "Hypertension", region: "Western", activities: 6, isGenderSensitive: false, equityScore: 68 },
  { id: 16, genderTarget: "All", activity: "Youth Health Initiative", disease: "Mental Health", region: "Eastern", activities: 7, isGenderSensitive: true, equityScore: 80 },
  { id: 17, genderTarget: "All", activity: "Elder Care Program", disease: "Diabetes", region: "Central", activities: 5, isGenderSensitive: false, equityScore: 74 },
  { id: 18, genderTarget: "All", activity: "Community Cancer Awareness", disease: "Cancer", region: "Upper East", activities: 5, isGenderSensitive: false, equityScore: 71 },
  { id: 19, genderTarget: "All", activity: "School Health Program", disease: "Hypertension", region: "Bono", activities: 3, isGenderSensitive: true, equityScore: 78 }
]

// Gender targets, diseases, and regions
const genderTargets = ["Male", "Female", "All"]
const diseases = ["Hypertension", "Diabetes", "Mental Health", "Cancer"]
const regions = ["Greater Accra", "Ashanti", "Northern", "Western", "Eastern", "Central", "Volta", "Upper East", "Bono"]

export default function Gender() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedDisease, setSelectedDisease] = useState<string>("all")
  const [selectedGenderTarget, setSelectedGenderTarget] = useState<string>("all")

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = genderActivitiesData
    if (selectedRegion !== "all") {
      data = data.filter(item => item.region === selectedRegion)
    }
    if (selectedDisease !== "all") {
      data = data.filter(item => item.disease === selectedDisease)
    }
    if (selectedGenderTarget !== "all") {
      data = data.filter(item => item.genderTarget === selectedGenderTarget)
    }
    return data
  }, [selectedRegion, selectedDisease, selectedGenderTarget])

  // Prepare bar chart data - aggregate by gender target
  const chartData = useMemo(() => {
    const aggregated: Record<string, Record<string, number>> = {}

    genderTargets.forEach(gender => {
      aggregated[gender] = {
        Hypertension: 0,
        Diabetes: 0,
        "Mental Health": 0,
        Cancer: 0
      }
    })

    filteredData.forEach(item => {
      if (aggregated[item.genderTarget]) {
        aggregated[item.genderTarget][item.disease] += item.activities
      }
    })

    return genderTargets.map(gender => ({
      genderTarget: gender,
      ...aggregated[gender],
      total: Object.values(aggregated[gender]).reduce((sum, val) => sum + val, 0)
    }))
  }, [filteredData])

  // Calculate gender equity analysis
  const equityAnalysis = useMemo(() => {
    const maleActivities = filteredData.filter(item => item.genderTarget === "Male")
    const femaleActivities = filteredData.filter(item => item.genderTarget === "Female")
    const allActivities = filteredData.filter(item => item.genderTarget === "All")

    const maleTotal = maleActivities.reduce((sum, item) => sum + item.activities, 0)
    const femaleTotal = femaleActivities.reduce((sum, item) => sum + item.activities, 0)
    const allTotal = allActivities.reduce((sum, item) => sum + item.activities, 0)

    const totalActivities = maleTotal + femaleTotal + allTotal
    const genderSensitiveCount = filteredData.filter(item => item.isGenderSensitive).length
    const avgEquityScore = filteredData.reduce((sum, item) => sum + item.equityScore, 0) / filteredData.length

    // Calculate gender gap (difference between male and female targeted activities)
    const genderGap = Math.abs(femaleTotal - maleTotal)
    const genderGapPercentage = totalActivities > 0 ? ((genderGap / totalActivities) * 100).toFixed(1) : '0'

    return {
      maleTotal,
      femaleTotal,
      allTotal,
      totalActivities,
      genderSensitiveCount,
      avgEquityScore: Math.round(avgEquityScore),
      genderGap,
      genderGapPercentage,
      femalePercentage: totalActivities > 0 ? ((femaleTotal / totalActivities) * 100).toFixed(1) : '0',
      malePercentage: totalActivities > 0 ? ((maleTotal / totalActivities) * 100).toFixed(1) : '0'
    }
  }, [filteredData])

  // Identify gender-sensitive interventions
  const genderSensitiveInterventions = useMemo(() => {
    return filteredData
      .filter(item => item.isGenderSensitive)
      .sort((a, b) => b.equityScore - a.equityScore)
  }, [filteredData])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return {
      totalActivities: equityAnalysis.totalActivities,
      genderSensitivePercentage: filteredData.length > 0 ?
        ((equityAnalysis.genderSensitiveCount / filteredData.length) * 100).toFixed(1) : '0',
      avgEquityScore: equityAnalysis.avgEquityScore,
      genderBalance: equityAnalysis.genderGapPercentage
    }
  }, [equityAnalysis, filteredData])

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "Male": return <UserIcon className="w-4 h-4" />
      case "Female": return <HeartIcon className="w-4 h-4" />
      case "All": return <Users2Icon className="w-4 h-4" />
      default: return <UsersIcon className="w-4 h-4" />
    }
  }

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "Male": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Female": return "bg-pink-100 text-pink-800 border-pink-200"
      case "All": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEquityScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <section className='mb-8' id='gender'>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users2Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Activities by Gender Focus</h1>
              <p className='text-blue-100 text-lg'>
                Comprehensive gender analysis of NCD activities targeting Male, Female, and All populations.
                Supporting gender-responsive planning and programming through equity analysis and gender-sensitive interventions.
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
              <CardTitle className="text-xl">Filter Gender Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  Gender Target
                </label>
                <Select value={selectedGenderTarget} onValueChange={setSelectedGenderTarget}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                    <SelectValue placeholder="Select gender target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Gender Targets</SelectItem>
                    {genderTargets.map(target => (
                      <SelectItem key={target} value={target}>{target}</SelectItem>
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
                  <div className="text-xs text-blue-200 mt-2">Across all genders</div>
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
                  <div className="text-3xl font-bold">{summaryStats.genderSensitivePercentage}%</div>
                  <div className="text-purple-100 mt-1 font-medium">Gender-Sensitive</div>
                  <div className="text-xs text-purple-200 mt-2">Interventions</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.avgEquityScore}</div>
                  <div className="text-green-100 mt-1 font-medium">Equity Score</div>
                  <div className="text-xs text-green-200 mt-2">Average rating</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.genderBalance}%</div>
                  <div className="text-orange-100 mt-1 font-medium">Gender Gap</div>
                  <div className="text-xs text-orange-200 mt-2">Balance indicator</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gender Distribution Bar Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Activities by Gender Target and Disease</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="genderTarget"
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

        {/* Gender Equity Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <HeartIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Gender Equity Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Male-Targeted</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{equityAnalysis.maleTotal}</div>
                    <div className="text-sm text-blue-500">{equityAnalysis.malePercentage}% of total</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold text-pink-800">Female-Targeted</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-600">{equityAnalysis.femaleTotal}</div>
                    <div className="text-sm text-pink-500">{equityAnalysis.femalePercentage}% of total</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users2Icon className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">All Genders</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{equityAnalysis.allTotal}</div>
                    <div className="text-sm text-purple-500">Inclusive programs</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangleIcon className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Gender Gap Analysis</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Gap between male and female targeted activities: <span className="font-bold text-orange-600">{equityAnalysis.genderGap} activities ({equityAnalysis.genderGapPercentage}%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Gender-Sensitive Spotlight</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Activity</TableHead>
                      <TableHead className="font-semibold">Target</TableHead>
                      <TableHead className="font-semibold">Equity Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {genderSensitiveInterventions.slice(0, 8).map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-sm">
                          <div>{item.activity}</div>
                          <div className="text-xs text-gray-500">{item.region}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getGenderIcon(item.genderTarget)}
                            <Badge className={getGenderColor(item.genderTarget)} variant="outline">
                              {item.genderTarget}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getEquityScoreColor(item.equityScore)}>
                            {item.equityScore}
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

        {/* Complete Gender Activities Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Complete Gender Activities Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Activity</TableHead>
                    <TableHead className="font-semibold">Gender Target</TableHead>
                    <TableHead className="font-semibold">Disease</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Activities</TableHead>
                    <TableHead className="font-semibold">Gender-Sensitive</TableHead>
                    <TableHead className="font-semibold">Equity Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.activity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getGenderIcon(item.genderTarget)}
                          <Badge className={getGenderColor(item.genderTarget)}>
                            {item.genderTarget}
                          </Badge>
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
                        {item.isGenderSensitive ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <SparklesIcon className="w-3 h-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEquityScoreColor(item.equityScore)}>
                          {item.equityScore}
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
