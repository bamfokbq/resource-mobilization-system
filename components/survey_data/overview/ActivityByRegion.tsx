'use client'

import React, { useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapIcon, TableIcon, BarChart3Icon, FilterIcon, TrendingUpIcon, UsersIcon, TargetIcon, Download, Image } from 'lucide-react'
import ExportService from '@/lib/exportService'
import { REGIONAL_ACTIVITY_DATA } from '@/data/survey-mock-data'

// Regional activity data
const regionalData = REGIONAL_ACTIVITY_DATA;

export default function ActivityByRegion() {
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('activities')
  const chartRef = useRef<HTMLDivElement>(null)

// Legacy data removed - now using REGIONAL_ACTIVITY_DATA
/*
const legacyData = [
  {
    region: "Greater Accra",
    activities: 31,
    keyPrograms: ["Hypertension Management", "Diabetes Prevention", "Cancer Screening"],
    keyImplementers: ["Ghana Health Service", "Local NGOs", "Private Clinics"],
    populationReached: 2500000,
    yearData: {
      2020: 45,
      2021: 38,
      2022: 42,
      2023: 44
    },
    partners: ["WHO", "USAID", "Local Government"]
  },
  {
    region: "Ashanti",
    activities: 17,
    keyPrograms: ["Mental Health", "Cardiovascular Disease", "Stroke Prevention"],
    keyImplementers: ["Kumasi Medical Center", "Regional NGOs", "Community Groups"],
    populationReached: 1800000,
    yearData: {
      2020: 25,
      2021: 22,
      2022: 21,
      2023: 22
    },
    partners: ["Gates Foundation", "Local NGOs"]
  },
  {
    region: "Western",
    activities: 89,
    keyPrograms: ["Diabetes Care", "Hypertension", "Community Health"],
    keyImplementers: ["Regional Health Directorate", "Faith-based Organizations"],
    populationReached: 950000,
    yearData: {
      2020: 20,
      2021: 24,
      2022: 23,
      2023: 22
    },
    partners: ["EU Health Initiative", "World Bank"]
  },
  {
    region: "Eastern",
    activities: 35,
    keyPrograms: ["Rural Health", "Chronic Disease Management"],
    keyImplementers: ["District Health Centers", "Mobile Clinics"],
    populationReached: 720000,
    yearData: {
      2020: 8,
      2021: 9,
      2022: 9,
      2023: 9
    },
    partners: ["UNICEF", "Local Partners"]
  },
  {
    region: "Central",
    activities: 37,
    keyPrograms: ["Maternal Health", "NCD Prevention"],
    keyImplementers: ["Central Regional Hospital", "Community Health Workers"],
    populationReached: 680000,
    yearData: {
      2020: 9,
      2021: 9,
      2022: 10,
      2023: 9
    },
    partners: ["UNFPA", "Government"]
  },
  {
    region: "Volta",
    activities: 25,
    keyPrograms: ["Border Health", "Disease Surveillance"],
    keyImplementers: ["Border Health Posts", "NGO Partners"],
    populationReached: 450000,
    yearData: {
      2020: 6,
      2021: 6,
      2022: 7,
      2023: 6
    },
    partners: ["Border Health Initiative"]
  },
  {
    region: "Northern",
    activities: 16,
    keyPrograms: ["Community Health Education", "Nutrition Programs", "Basic Healthcare"],
    keyImplementers: ["Northern Regional Health", "International NGOs", "Faith-based Organizations"],
    populationReached: 1200000,
    yearData: {
      2020: 32,
      2021: 28,
      2022: 15,
      2023: 14
    },
    partners: ["UNICEF", "World Vision", "Local Chiefs"]
  },
  {
    region: "Western",
    activities: 7,
    keyPrograms: ["Occupational Health", "Environmental Health", "Rural Clinics"],
    keyImplementers: ["Mining Health Services", "Rural Health Networks", "Community Volunteers"],
    populationReached: 850000,
    yearData: {
      2020: 12,
      2021: 8,
      2022: 8,
      2023: 7
    },
    partners: ["Mining Companies", "Environmental Groups", "District Assembly"]
  },
  {
    region: "Eastern",
    activities: 7,
    keyPrograms: ["School Health", "Maternal Health", "Community Outreach"],
    keyImplementers: ["Eastern Regional Hospital", "School Health Teams", "Women's Groups"],
    populationReached: 900000,
    yearData: {
      2020: 14,
      2021: 11,
      2022: 7,
      2023: 5
    },
    partners: ["Education Ministry", "Women's Organizations", "Youth Groups"]
  },
  {
    region: "Central",
    activities: 5,
    keyPrograms: ["Coastal Health", "Fishing Community Health", "Traditional Medicine"],
    keyImplementers: ["Coastal Health Units", "Fishermen Associations", "Traditional Healers"],
    populationReached: 650000,
    yearData: {
      2020: 8,
      2021: 7,
      2022: 5,
      2023: 5
    },
    partners: ["Fishing Cooperatives", "Traditional Councils", "Coastal NGOs"]
  },
  {
    region: "Upper East",
    activities: 6,
    keyPrograms: ["Border Health", "Nutrition Support", "Emergency Care"],
    keyImplementers: ["Border Health Services", "Nutrition Centers", "Emergency Response Teams"],
    populationReached: 400000,
    yearData: {
      2020: 12,
      2021: 10,
      2022: 8,
      2023: 5
    },
    partners: ["UNHCR", "Border Security", "International Relief"]
  },
  {
    region: "Upper West",
    activities: 6,
    keyPrograms: ["Rural Health Access", "Agricultural Health", "Water Sanitation"],
    keyImplementers: ["Rural Health Posts", "Agricultural Extension", "Water Committees"],
    populationReached: 350000,
    yearData: {
      2020: 10,
      2021: 8,
      2022: 7,
      2023: 6
    },
    partners: ["Agricultural Ministry", "Water Organizations", "Rural Development"]
  },
  {
    region: "Volta",
    activities: 5,
    keyPrograms: ["River Health", "Cultural Health", "Youth Programs"],
    keyImplementers: ["River Communities", "Cultural Groups", "Youth Organizations"],
    populationReached: 500000,
    yearData: {
      2020: 8,
      2021: 7,
      2022: 5,
      2023: 7
    },
    partners: ["Cultural Associations", "River Committees", "Youth Leaders"]
  }
]
*/

// The actual function starts here, properly formatted:
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedPartner, setSelectedPartner] = useState<string>("all")
  const [selectedProgram, setSelectedProgram] = useState<string>("all")
  
  // Refs for PNG export
  const mapRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const ActivitiesByRegionMapComponent = useMemo(() => {
    return dynamic(
      () => import('@/components/chart_and_graphics/ActivitiesByRegionMap'),
      {
        loading: () => <p>Loading Map...</p>,
        ssr: false
      }
    );
  }, []);

  // Get unique filter options
  const years = ["2020", "2021", "2022", "2023"]
  const allPartners = [...new Set(regionalData.flatMap(region => region.partners))]
  const allPrograms = [...new Set(regionalData.flatMap(region => region.keyPrograms))]

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return regionalData.filter(region => {
      const yearMatch = selectedYear === "all" || true // Year filtering would need more complex logic
      const partnerMatch = selectedPartner === "all" || region.partners.includes(selectedPartner)
      const programMatch = selectedProgram === "all" || region.keyPrograms.includes(selectedProgram)

      return yearMatch && partnerMatch && programMatch
    }).map(region => {
      let activities = region.activities;

      if (selectedYear !== "all" && selectedYear in region.yearData) {
        activities = region.yearData[selectedYear as "2020" | "2021" | "2022" | "2023"];
      }

      return {
        ...region,
        activities
      };
    })
  }, [selectedYear, selectedPartner, selectedProgram])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  // PNG Export functions
  const exportMapAsPNG = async () => {
    if (mapRef.current) {
      try {
        await ExportService.exportChartAsImage(mapRef.current, {
          filename: 'regional_activities_map',
          title: 'Activities By Region - Map View'
        })
      } catch (error) {
        console.error('Map PNG export error:', error)
      }
    }
  }

  const exportTableAsPNG = async () => {
    if (tableRef.current) {
      try {
        await ExportService.exportTableAsPNG(tableRef.current, {
          filename: 'regional_activities_table',
          title: 'Activities By Region - Table View'
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
          filename: 'regional_activities_summary',
          title: 'Activities By Region - Summary Statistics'
        })
      } catch (error) {
        console.error('Summary PNG export error:', error)
      }
    }
  }

  return (
    <section className='mb-8' id='regional-activities'>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MapIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Activities By Region</h1>
              <p className='text-blue-100 text-lg'>
                Interactive overview showing geographic distribution of NCD activities to identify gaps, overlaps, and under-served regions.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Controls */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FilterIcon className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-800">Filter Options</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Year
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Partner
                </label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Partners</SelectItem>
                    {allPartners.map(partner => (
                      <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  Program Focus
                </label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {allPrograms.map(program => (
                      <SelectItem key={program} value={program}>{program}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl h-14">
            <TabsTrigger
              value="map"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-navy-blue transition-all duration-200 rounded-lg"
            >
              <MapIcon className="w-4 h-4" />
              Interactive Map
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-navy-blue transition-all duration-200 rounded-lg"
            >
              <TableIcon className="w-4 h-4" />
              Data Table
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-navy-blue transition-all duration-200 rounded-lg"
            >
              <BarChart3Icon className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Interactive Map Tab */}
          <TabsContent value="map" className="mt-6">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <MapIcon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">Interactive Regional Map</CardTitle>
                  </div>
                  <Button
                    onClick={exportMapAsPNG}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PNG
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={mapRef} className='h-[100vh] bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden'>
                  <ActivitiesByRegionMapComponent />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="text-xs font-medium text-gray-600 mb-1">Total Activities</div>
                    <div className="text-2xl font-bold text-navy-blue">
                      {filteredData.reduce((sum, region) => sum + region.activities, 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Data Table Tab */}
          <TabsContent value="table" className="mt-6">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <TableIcon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">Regional Activity Summary</CardTitle>
                  </div>
                  <Button
                    onClick={exportTableAsPNG}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Export PNG
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div ref={tableRef} className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-bold text-gray-800 bg-gray-50">Region</th>
                        <th className="text-left p-4 font-bold text-gray-800 bg-gray-50">Activities</th>
                        <th className="text-left p-4 font-bold text-gray-800 bg-gray-50">Key Programs</th>
                        <th className="text-left p-4 font-bold text-gray-800 bg-gray-50">Implementers</th>
                        <th className="text-left p-4 font-bold text-gray-800 bg-gray-50">Population</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData
                        .sort((a, b) => b.activities - a.activities)
                        .map((region, index) => (
                          <tr key={region.region} className={`border-b hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-navy-blue">{region.region}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant="secondary"
                                className={`${region.activities > 50
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : region.activities > 25
                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                                  } font-bold px-3 py-1`}
                              >
                                {region.activities}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {region.keyPrograms.slice(0, 2).map(program => (
                                  <Badge key={program} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                    {program}
                                  </Badge>
                                ))}
                                {region.keyPrograms.length > 2 && (
                                  <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                                    +{region.keyPrograms.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm font-medium text-gray-700">
                                {region.keyImplementers.slice(0, 2).join(", ")}
                                {region.keyImplementers.length > 2 && (
                                  <span className="text-gray-500 font-normal"> +{region.keyImplementers.length - 2} more</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <UsersIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-bold text-gray-800">{formatNumber(region.populationReached)}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Summary Statistics Tab */}
          <TabsContent value="summary" className="mt-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <BarChart3Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">Summary Analytics</CardTitle>
                  </div>
                  <Button
                    onClick={exportSummaryAsPNG}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PNG
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div ref={summaryRef} className="space-y-6">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">
                          {filteredData.reduce((sum, region) => sum + region.activities, 0)}
                        </div>
                        <div className="text-blue-100 mt-1 font-medium">Total Activities</div>
                        <div className="text-xs text-blue-200 mt-2">
                          Across all filtered regions
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <TargetIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transform hover:scale-105 transition-transform duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">
                          {filteredData.length}
                        </div>
                        <div className="text-emerald-100 mt-1 font-medium">Regions Covered</div>
                        <div className="text-xs text-emerald-200 mt-2">
                          Out of 16 total regions
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <MapIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">
                          {formatNumber(filteredData.reduce((sum, region) => sum + region.populationReached, 0))}
                        </div>
                        <div className="text-purple-100 mt-1 font-medium">Population Reached</div>
                        <div className="text-xs text-purple-200 mt-2">
                          Total beneficiaries
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <UsersIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white transform hover:scale-105 transition-transform duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">
                          {filteredData.length > 0 ? Math.round(filteredData.reduce((sum, region) => sum + region.activities, 0) / filteredData.length) : 0}
                        </div>
                        <div className="text-orange-100 mt-1 font-medium">Avg Activities/Region</div>
                        <div className="text-xs text-orange-200 mt-2">
                          Mean distribution
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <TrendingUpIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <TrendingUpIcon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-xl">Top Performing Regions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {filteredData
                        .sort((a, b) => b.activities - a.activities)
                        .slice(0, 5)
                        .map((region, index) => (
                          <div key={region.region} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-colors duration-200">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                                    'bg-gradient-to-br from-blue-400 to-blue-500'
                                } text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg`}>
                                {index + 1}
                              </div>
                              <div>
                                <span className="font-bold text-gray-800">{region.region}</span>
                                <div className="text-xs text-gray-500">
                                  {formatNumber(region.populationReached)} people reached
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 border-blue-200 font-bold px-3 py-1"
                            >
                              {region.activities} activities
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <BarChart3Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-xl">Coverage Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-green-800">High Coverage</div>
                            <div className="text-sm text-green-600 mt-1">
                              50+ activities per region
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-green-700">
                            {filteredData.filter(r => r.activities > 50).length}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-yellow-800">Medium Coverage</div>
                            <div className="text-sm text-yellow-600 mt-1">
                              25-50 activities per region
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-yellow-700">
                            {filteredData.filter(r => r.activities >= 25 && r.activities <= 50).length}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-red-800">Low Coverage</div>
                            <div className="text-sm text-red-600 mt-1">
                              &lt;25 activities per region
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-red-700">
                            {filteredData.filter(r => r.activities < 25).length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
