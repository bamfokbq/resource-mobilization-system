"use client";

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { MapPinIcon, FilterIcon, BuildingIcon, HomeIcon, SchoolIcon, HospitalIcon, UsersIcon, BriefcaseIcon, HeartHandshakeIcon } from "lucide-react"

// Mock data for settings activities
const settingsActivitiesData = [
  // Community
  { id: 1, setting: "Community", activities: 11, typeOfService: "Health Education", implementingPartner: "Ghana Health Service", region: "Greater Accra" },
  { id: 2, setting: "Community", activities: 7, typeOfService: "Screening Programs", implementingPartner: "WHO Ghana", region: "Ashanti" },
  { id: 3, setting: "Community", activities: 5, typeOfService: "Awareness Campaigns", implementingPartner: "Ghana Red Cross", region: "Northern" },
  { id: 4, setting: "Community", activities: 6, typeOfService: "Support Groups", implementingPartner: "Christian Health Association", region: "Western" },

  // CHPS (Community-based Health Planning and Services)
  { id: 5, setting: "CHPS", activities: 9, typeOfService: "Primary Care", implementingPartner: "Ghana Health Service", region: "Greater Accra" },
  { id: 6, setting: "CHPS", activities: 7, typeOfService: "Health Promotion", implementingPartner: "Ministry of Health", region: "Ashanti" },
  { id: 7, setting: "CHPS", activities: 4, typeOfService: "Disease Prevention", implementingPartner: "Ghana Health Service", region: "Northern" },
  { id: 8, setting: "CHPS", activities: 6, typeOfService: "Community Outreach", implementingPartner: "WHO Ghana", region: "Eastern" },

  // Health Centre
  { id: 9, setting: "Health Centre", activities: 12, typeOfService: "Clinical Care", implementingPartner: "Ghana Health Service", region: "Greater Accra" },
  { id: 10, setting: "Health Centre", activities: 10, typeOfService: "Diagnostic Services", implementingPartner: "Ministry of Health", region: "Ashanti" },
  { id: 11, setting: "Health Centre", activities: 7, typeOfService: "Treatment Programs", implementingPartner: "Ghana Health Service", region: "Western" },
  { id: 12, setting: "Health Centre", activities: 8, typeOfService: "Preventive Care", implementingPartner: "WHO Ghana", region: "Central" },

  // District Hospital
  { id: 13, setting: "District Hospital", activities: 7, typeOfService: "Specialized Care", implementingPartner: "Ministry of Health", region: "Greater Accra" },
  { id: 14, setting: "District Hospital", activities: 6, typeOfService: "Surgery", implementingPartner: "Ghana Health Service", region: "Ashanti" },
  { id: 15, setting: "District Hospital", activities: 3, typeOfService: "Emergency Care", implementingPartner: "Ghana Red Cross", region: "Northern" },
  { id: 16, setting: "District Hospital", activities: 5, typeOfService: "Inpatient Services", implementingPartner: "Ministry of Health", region: "Eastern" },

  // Tertiary Facility
  { id: 17, setting: "Tertiary Facility", activities: 5, typeOfService: "Advanced Treatment", implementingPartner: "Korle Bu Teaching Hospital", region: "Greater Accra" },
  { id: 18, setting: "Tertiary Facility", activities: 3, typeOfService: "Research", implementingPartner: "University of Ghana Medical School", region: "Greater Accra" },
  { id: 19, setting: "Tertiary Facility", activities: 3, typeOfService: "Specialist Care", implementingPartner: "Komfo Anokye Teaching Hospital", region: "Ashanti" },
  { id: 20, setting: "Tertiary Facility", activities: 2, typeOfService: "Medical Education", implementingPartner: "KNUST Medical School", region: "Ashanti" },

  // Schools
  { id: 21, setting: "Schools", activities: 18, typeOfService: "Health Education", implementingPartner: "Ghana Education Service", region: "Greater Accra" },
  { id: 22, setting: "Schools", activities: 14, typeOfService: "Screening Programs", implementingPartner: "Ghana Health Service", region: "Ashanti" },
  { id: 23, setting: "Schools", activities: 12, typeOfService: "Nutrition Programs", implementingPartner: "UNICEF Ghana", region: "Northern" },
  { id: 24, setting: "Schools", activities: 13, typeOfService: "Mental Health Support", implementingPartner: "Mental Health Authority", region: "Western" },

  // Workplaces
  { id: 25, setting: "Workplaces", activities: 7, typeOfService: "Occupational Health", implementingPartner: "Ministry of Employment", region: "Greater Accra" },
  { id: 26, setting: "Workplaces", activities: 7, typeOfService: "Wellness Programs", implementingPartner: "Private Sector Partners", region: "Ashanti" },
  { id: 27, setting: "Workplaces", activities: 5, typeOfService: "Health Screenings", implementingPartner: "Ghana Health Service", region: "Western" },
  { id: 28, setting: "Workplaces", activities: 3, typeOfService: "Stress Management", implementingPartner: "Mental Health Authority", region: "Central" }
]

// Settings and filter options
const settings = ["Community", "CHPS", "Health Centre", "District Hospital", "Tertiary Facility", "Schools", "Workplaces"]
const regions = ["Greater Accra", "Ashanti", "Northern", "Western", "Eastern", "Central"]
const serviceTypes = ["Health Education", "Screening Programs", "Clinical Care", "Primary Care", "Specialized Care", "Occupational Health"]

// Colors for pie chart
const COLORS = [
  '#3b82f6', // Blue - Community
  '#10b981', // Green - CHPS
  '#f59e0b', // Amber - Health Centre
  '#ef4444', // Red - District Hospital
  '#8b5cf6', // Purple - Tertiary Facility
  '#06b6d4', // Cyan - Schools
  '#f97316'  // Orange - Workplaces
]

export default function Settings() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedServiceType, setSelectedServiceType] = useState<string>("all")

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = settingsActivitiesData
    if (selectedRegion !== "all") {
      data = data.filter(item => item.region === selectedRegion)
    }
    if (selectedServiceType !== "all") {
      data = data.filter(item => item.typeOfService === selectedServiceType)
    }
    return data
  }, [selectedRegion, selectedServiceType])

  // Prepare pie chart data - aggregate by setting
  const pieChartData = useMemo(() => {
    const aggregated: Record<string, number> = {}

    settings.forEach(setting => {
      aggregated[setting] = 0
    })

    filteredData.forEach(item => {
      aggregated[item.setting] += item.activities
    })

    const totalActivities: number = Object.values(aggregated).reduce((sum: number, val: number) => sum + val, 0)

    return settings.map((setting, index) => ({
      name: setting,
      value: aggregated[setting],
      percentage: totalActivities > 0 ? ((aggregated[setting] / totalActivities) * 100).toFixed(1) : '0',
      color: COLORS[index]
    })).filter(item => item.value > 0)
  }, [filteredData])  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalActivities = filteredData.reduce((sum, item) => sum + item.activities, 0)
    const uniquePartners = new Set(filteredData.map(item => item.implementingPartner)).size
    const activeSettings = new Set(filteredData.map(item => item.setting)).size

    return {
      totalActivities,
      uniquePartners,
      activeSettings,
      avgActivitiesPerSetting: Math.round(totalActivities / activeSettings)
    }
  }, [filteredData])

  // Aggregate data for table display
  const tableData = useMemo(() => {
    const aggregated: any = {}

    filteredData.forEach(item => {
      const key = `${item.setting}-${item.typeOfService}-${item.implementingPartner}`
      if (!aggregated[key]) {
        aggregated[key] = {
          setting: item.setting,
          activities: 0,
          typeOfService: item.typeOfService,
          implementingPartner: item.implementingPartner,
          regions: new Set()
        }
      }
      aggregated[key].activities += item.activities
      aggregated[key].regions.add(item.region)
    })

    return Object.values(aggregated).map((item: any) => ({
      ...item,
      regionCount: item.regions.size,
      regions: Array.from(item.regions).join(", ")
    })).sort((a: any, b: any) => b.activities - a.activities)
  }, [filteredData])

  const getSettingIcon = (setting: string) => {
    switch (setting) {
      case "Community": return <UsersIcon className="w-4 h-4" />
      case "CHPS": return <HomeIcon className="w-4 h-4" />
      case "Health Centre": return <HeartHandshakeIcon className="w-4 h-4" />
      case "District Hospital": return <HospitalIcon className="w-4 h-4" />
      case "Tertiary Facility": return <BuildingIcon className="w-4 h-4" />
      case "Schools": return <SchoolIcon className="w-4 h-4" />
      case "Workplaces": return <BriefcaseIcon className="w-4 h-4" />
      default: return <MapPinIcon className="w-4 h-4" />
    }
  }

  const getSettingColor = (setting: string) => {
    switch (setting) {
      case "Community": return "bg-blue-100 text-blue-800 border-blue-200"
      case "CHPS": return "bg-green-100 text-green-800 border-green-200"
      case "Health Centre": return "bg-amber-100 text-amber-800 border-amber-200"
      case "District Hospital": return "bg-red-100 text-red-800 border-red-200"
      case "Tertiary Facility": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Schools": return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "Workplaces": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">Activities: {data.value}</p>
          <p className="text-green-600">Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <section className='mb-8' id='settings'>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPinIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Activities by Settings</h1>
              <p className='text-blue-100 text-lg'>
                Comprehensive analysis of NCD activities across different implementation settings including
                Community, CHPS, Health Centres, District Hospitals, Tertiary Facilities, Schools, and Workplaces.
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
              <CardTitle className="text-xl">Filter Settings Analysis</CardTitle>
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
                  Service Type
                </label>
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Service Types</SelectItem>
                    {serviceTypes.map(serviceType => (
                      <SelectItem key={serviceType} value={serviceType}>{serviceType}</SelectItem>
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
                  <div className="text-xs text-blue-200 mt-2">Across all settings</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.activeSettings}</div>
                  <div className="text-green-100 mt-1 font-medium">Active Settings</div>
                  <div className="text-xs text-green-200 mt-2">Implementation locations</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BuildingIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.uniquePartners}</div>
                  <div className="text-purple-100 mt-1 font-medium">Partners</div>
                  <div className="text-xs text-purple-200 mt-2">Implementing organizations</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.avgActivitiesPerSetting}</div>
                  <div className="text-orange-100 mt-1 font-medium">Avg Per Setting</div>
                  <div className="text-xs text-orange-200 mt-2">Activities distribution</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <HospitalIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Activity Distribution by Settings (%)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color }}>
                        {value} ({entry.payload.percentage}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Settings Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <HospitalIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Settings Activity Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Setting</TableHead>
                    <TableHead className="font-semibold">No. of Activities</TableHead>
                    <TableHead className="font-semibold">Type of Service</TableHead>
                    <TableHead className="font-semibold">Implementing Partner</TableHead>
                    <TableHead className="font-semibold">Regions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item: any, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getSettingIcon(item.setting)}
                          <Badge className={getSettingColor(item.setting)}>
                            {item.setting}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-lg">{item.activities}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.typeOfService}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{item.implementingPartner}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3" />
                          <span className="font-medium">{item.regionCount}</span>
                          <span>region{item.regionCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="text-xs mt-1 max-w-48 truncate" title={item.regions}>
                          {item.regions}
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
    </section>
  )
}
