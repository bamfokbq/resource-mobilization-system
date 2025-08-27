'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BarChart3Icon, TableIcon, FilterIcon, EyeIcon, CalendarIcon, MapPinIcon, UsersIcon, TrendingUpIcon, HeartHandshakeIcon, Download, Image } from 'lucide-react'
import ExportService from '@/lib/exportService'

// Disease activity data with detailed information
const diseaseActivities = [
    {
        disease: "Hypertension",
        totalActivities: 24,
        activities: [
            { id: 1, name: "Community Blood Pressure Screening", region: "Greater Accra", implementer: "Ghana Health Service", status: "ongoing", timeline: "2023-2025", coverage: "85%", partners: ["WHO", "Local Clinics"] },
            { id: 2, name: "Hypertension Management Training", region: "Ashanti", implementer: "Kumasi Medical Center", status: "completed", timeline: "2022-2023", coverage: "92%", partners: ["USAID", "Medical Schools"] },
            { id: 3, name: "Mobile Health Monitoring", region: "Western", implementer: "Regional Health Directorate", status: "ongoing", timeline: "2023-2024", coverage: "67%", partners: ["Gates Foundation"] },
            { id: 4, name: "Community Health Worker Program", region: "Northern", implementer: "Local NGOs", status: "ongoing", timeline: "2023-2025", coverage: "78%", partners: ["WHO", "Community Groups"] },
            { id: 5, name: "Digital Health Records", region: "Eastern", implementer: "Private Clinics", status: "completed", timeline: "2022-2023", coverage: "95%", partners: ["Tech Companies"] }
        ]
    },
    {
        disease: "Diabetes",
        totalActivities: 18,
        activities: [
            { id: 6, name: "Diabetes Prevention Program", region: "Greater Accra", implementer: "Private Clinics", status: "ongoing", timeline: "2023-2025", coverage: "73%", partners: ["Pharma Companies", "WHO"] },
            { id: 7, name: "Glucose Monitoring Initiative", region: "Central", implementer: "Regional NGOs", status: "ongoing", timeline: "2023-2024", coverage: "81%", partners: ["Local Government"] },
            { id: 8, name: "Nutrition Education Program", region: "Volta", implementer: "Community Groups", status: "completed", timeline: "2022-2023", coverage: "88%", partners: ["UNICEF"] },
            { id: 9, name: "Insulin Access Program", region: "Brong Ahafo", implementer: "Faith-based Organizations", status: "ongoing", timeline: "2023-2025", coverage: "65%", partners: ["International NGOs"] }
        ]
    },
    {
        disease: "Cardiovascular Disease",
        totalActivities: 45,
        activities: [
            { id: 10, name: "Heart Health Awareness", region: "Ashanti", implementer: "Medical Centers", status: "ongoing", timeline: "2023-2024", coverage: "77%", partners: ["Cardiologist Society"] },
            { id: 11, name: "Cardiac Rehabilitation", region: "Greater Accra", implementer: "Specialized Clinics", status: "ongoing", timeline: "2023-2025", coverage: "82%", partners: ["International Heart Foundation"] },
            { id: 12, name: "Lifestyle Modification Program", region: "Western", implementer: "Community Health Centers", status: "completed", timeline: "2022-2023", coverage: "91%", partners: ["WHO"] }
        ]
    },
    {
        disease: "Cancer",
        totalActivities: 34,
        activities: [
            { id: 13, name: "Breast Cancer Screening", region: "Greater Accra", implementer: "Cancer Centers", status: "ongoing", timeline: "2023-2025", coverage: "69%", partners: ["Cancer Society", "WHO"] },
            { id: 14, name: "Cervical Cancer Prevention", region: "Central", implementer: "Women's Health Clinics", status: "ongoing", timeline: "2023-2024", coverage: "74%", partners: ["UNFPA"] },
            { id: 15, name: "Cancer Awareness Campaign", region: "Northern", implementer: "Local NGOs", status: "completed", timeline: "2022-2023", coverage: "86%", partners: ["Media Houses"] }
        ]
    },
    {
        disease: "Mental Health",
        totalActivities: 12,
        activities: [
            { id: 10, name: "Mental Health First Aid Training", region: "Greater Accra", implementer: "Mental Health Authority", status: "ongoing", timeline: "2023-2024", coverage: "65%", partners: ["WHO", "Universities"] },
            { id: 11, name: "Community Mental Health Program", region: "Ashanti", implementer: "Regional Hospitals", status: "completed", timeline: "2022-2023", coverage: "88%", partners: ["NGOs", "Religious Groups"] },
            { id: 12, name: "Youth Mental Health Support", region: "Western", implementer: "Youth Organizations", status: "ongoing", timeline: "2023-2025", coverage: "55%", partners: ["UNICEF", "Schools"] }
        ]
    },
    {
        disease: "Cancer",
        totalActivities: 9,
        activities: [
            { id: 13, name: "Cancer Screening Program", region: "Greater Accra", implementer: "Cancer Treatment Centers", status: "ongoing", timeline: "2023-2025", coverage: "45%", partners: ["International NGOs", "Medical Schools"] },
            { id: 14, name: "Breast Cancer Awareness", region: "Ashanti", implementer: "Women's Groups", status: "completed", timeline: "2022-2023", coverage: "72%", partners: ["Pink Ribbon", "Health Ministry"] }
        ]
    },
    {
        disease: "Stroke",
        totalActivities: 8,
        activities: [
            { id: 15, name: "Stroke Prevention Education", region: "Greater Accra", implementer: "Neurological Centers", status: "ongoing", timeline: "2023-2024", coverage: "38%", partners: ["Medical Associations", "Hospitals"] },
            { id: 16, name: "Emergency Stroke Response", region: "Ashanti", implementer: "Emergency Services", status: "ongoing", timeline: "2023-2025", coverage: "82%", partners: ["Ambulance Services", "Hospitals"] }
        ]
    },
    {
        disease: "Kidney Disease",
        totalActivities: 6,
        activities: [
            { id: 17, name: "Kidney Health Screening", region: "Greater Accra", implementer: "Dialysis Centers", status: "ongoing", timeline: "2023-2024", coverage: "35%", partners: ["Kidney Foundation", "Medical Schools"] },
            { id: 18, name: "Chronic Kidney Disease Management", region: "Western", implementer: "Regional Hospitals", status: "ongoing", timeline: "2023-2025", coverage: "48%", partners: ["International Partners"] }
        ]
    },
    {
        disease: "Heart Disease",
        totalActivities: 5,
        activities: [
            { id: 19, name: "Cardiac Rehabilitation Program", region: "Greater Accra", implementer: "Cardiac Centers", status: "ongoing", timeline: "2023-2024", coverage: "42%", partners: ["Heart Foundation", "Cardiologists"] },
            { id: 20, name: "Heart Health Education", region: "Ashanti", implementer: "Community Health Workers", status: "completed", timeline: "2022-2023", coverage: "76%", partners: ["Local NGOs"] }
        ]
    },
    {
        disease: "Respiratory Disease",
        totalActivities: 4,
        activities: [
            { id: 21, name: "Asthma Management Program", region: "Greater Accra", implementer: "Respiratory Clinics", status: "ongoing", timeline: "2023-2024", coverage: "33%", partners: ["Pharmaceutical Companies"] },
            { id: 22, name: "COPD Awareness Campaign", region: "Northern", implementer: "Health Education Teams", status: "ongoing", timeline: "2023-2025", coverage: "67%", partners: ["WHO", "Local Groups"] }
        ]
    },
    {
        disease: "Liver Disease",
        totalActivities: 3,
        activities: [
            { id: 23, name: "Hepatitis Screening Program", region: "Greater Accra", implementer: "Liver Clinics", status: "ongoing", timeline: "2023-2024", coverage: "28%", partners: ["Medical Research Centers"] },
            { id: 24, name: "Liver Health Education", region: "Ashanti", implementer: "Community Volunteers", status: "completed", timeline: "2022-2023", coverage: "54%", partners: ["Health Ministry"] }
        ]
    },
    {
        disease: "Nutrition Disorders",
        totalActivities: 9,
        activities: [
            { id: 25, name: "Malnutrition Prevention Program", region: "Northern", implementer: "Nutrition Centers", status: "ongoing", timeline: "2023-2025", coverage: "71%", partners: ["UNICEF", "WFP", "Local NGOs"] },
            { id: 26, name: "Obesity Management Initiative", region: "Greater Accra", implementer: "Fitness Centers", status: "ongoing", timeline: "2023-2024", coverage: "29%", partners: ["Private Gyms", "Nutritionists"] },
            { id: 27, name: "School Nutrition Program", region: "Western", implementer: "Education Directorate", status: "completed", timeline: "2022-2023", coverage: "89%", partners: ["School Feeding Program", "Parent Associations"] }
        ]
    },
    {
        disease: "Stroke",
        totalActivities: 23,
        activities: [
            { id: 19, name: "Stroke Prevention Campaign", region: "Western", implementer: "Neurological Centers", status: "ongoing", timeline: "2023-2024", coverage: "68%", partners: ["Stroke Foundation"] },
            { id: 20, name: "Emergency Response Training", region: "Central", implementer: "Emergency Services", status: "completed", timeline: "2022-2023", coverage: "94%", partners: ["Red Cross"] }
        ]
    },
    {
        disease: "Asthma",
        totalActivities: 19,
        activities: [
            { id: 21, name: "Asthma Management Program", region: "Greater Accra", implementer: "Respiratory Clinics", status: "ongoing", timeline: "2023-2025", coverage: "76%", partners: ["Lung Association"] },
            { id: 22, name: "Air Quality Monitoring", region: "Ashanti", implementer: "Environmental Agencies", status: "ongoing", timeline: "2023-2024", coverage: "85%", partners: ["EPA"] }
        ]
    },
    {
        disease: "Chronic Kidney Disease",
        totalActivities: 15,
        activities: [
            { id: 23, name: "Kidney Health Screening", region: "Northern", implementer: "Nephrology Centers", status: "ongoing", timeline: "2023-2024", coverage: "72%", partners: ["Kidney Foundation"] },
            { id: 24, name: "Dialysis Access Program", region: "Upper East", implementer: "Regional Hospitals", status: "completed", timeline: "2022-2023", coverage: "89%", partners: ["International Donors"] }
        ]
    },
    {
        disease: "COPD",
        totalActivities: 12,
        activities: [
            { id: 25, name: "COPD Awareness Program", region: "Volta", implementer: "Pulmonary Clinics", status: "ongoing", timeline: "2023-2024", coverage: "64%", partners: ["Respiratory Society"] }
        ]
    },
    {
        disease: "Other NCDs",
        totalActivities: 25,
        activities: [
            { id: 26, name: "Multi-NCD Prevention", region: "Brong Ahafo", implementer: "Regional Health Directorate", status: "ongoing", timeline: "2023-2025", coverage: "70%", partners: ["WHO", "Multiple Partners"] },
            { id: 27, name: "NCD Risk Factor Surveillance", region: "Upper West", implementer: "Research Institutions", status: "completed", timeline: "2022-2023", coverage: "93%", partners: ["Universities"] }
        ]
    }
]

const diseasesData = diseaseActivities.map(disease => ({
    name: disease.disease,
    value: disease.totalActivities
}))

// Get all unique regions, implementers, and statuses for filters
const allRegions = [...new Set(diseaseActivities.flatMap(d => d.activities.map(a => a.region)))]
const allImplementers = [...new Set(diseaseActivities.flatMap(d => d.activities.map(a => a.implementer)))]
const allStatuses = [...new Set(diseaseActivities.flatMap(d => d.activities.map(a => a.status)))]

export default function Diseases() {
    const [isMounted, setIsMounted] = useState(false)
    const [selectedDisease, setSelectedDisease] = useState<string>('all')
    const [selectedRegion, setSelectedRegion] = useState<string>('all')
    const [selectedImplementer, setSelectedImplementer] = useState<string>('all')
    const [selectedStatus, setSelectedStatus] = useState<string>('all')
    const [drillDownDisease, setDrillDownDisease] = useState<string | null>(null)
    
    // Refs for PNG export
    const chartRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Filter activities based on selected filters
    const filteredActivities = useMemo(() => {
        let activities = diseaseActivities.flatMap(disease =>
            disease.activities.map(activity => ({
                ...activity,
                disease: disease.disease
            }))
        )

        if (selectedDisease !== 'all') {
            activities = activities.filter(activity => activity.disease === selectedDisease)
        }
        if (selectedRegion !== 'all') {
            activities = activities.filter(activity => activity.region === selectedRegion)
        }
        if (selectedImplementer !== 'all') {
            activities = activities.filter(activity => activity.implementer === selectedImplementer)
        }
        if (selectedStatus !== 'all') {
            activities = activities.filter(activity => activity.status === selectedStatus)
        }

        return activities
    }, [selectedDisease, selectedRegion, selectedImplementer, selectedStatus])

    // Get chart data based on filters
    const filteredChartData = useMemo(() => {
        const diseaseCount = filteredActivities.reduce((acc, activity) => {
            acc[activity.disease] = (acc[activity.disease] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        return Object.entries(diseaseCount).map(([disease, count]) => ({
            name: disease,
            value: count
        })).sort((a, b) => b.value - a.value)
    }, [filteredActivities])

    const handleBarClick = (data: any) => {
        setSelectedDisease(data.name)
    }

    const resetFilters = () => {
        setSelectedDisease('all')
        setSelectedRegion('all')
        setSelectedImplementer('all')
        setSelectedStatus('all')
    }

    // PNG Export functions
    const exportChartAsPNG = async () => {
        if (chartRef.current) {
            try {
                await ExportService.exportChartAsImage(chartRef.current, {
                    filename: `diseases_chart_${selectedDisease}_${selectedRegion}`,
                    title: `Disease Activities Chart - ${selectedDisease} - ${selectedRegion}`
                })
            } catch (error) {
                console.error('Chart PNG export error:', error)
            }
        }
    }

    const exportTableAsPNG = async () => {
        if (tableRef.current) {
            try {
                await ExportService.exportTableAsPNG(tableRef.current, {
                    filename: `diseases_table_${selectedDisease}_${selectedRegion}`,
                    title: `Disease Activities Table - ${selectedDisease} - ${selectedRegion}`
                })
            } catch (error) {
                console.error('Table PNG export error:', error)
            }
        }
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getCoverageBadgeColor = (coverage: string) => {
        const percent = parseInt(coverage)
        if (percent >= 80) return 'bg-green-100 text-green-800 border-green-200'
        if (percent >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        return 'bg-red-100 text-red-800 border-red-200'
    }

    const DrillDownDetails = ({ disease }: { disease: string }) => {
        const diseaseData = diseaseActivities.find(d => d.disease === disease)
        if (!diseaseData) return null

        const avgCoverage = diseaseData.activities.reduce((sum, activity) =>
            sum + parseInt(activity.coverage), 0) / diseaseData.activities.length

        const ongoingCount = diseaseData.activities.filter(a => a.status === 'ongoing').length
        const completedCount = diseaseData.activities.filter(a => a.status === 'completed').length

        return (
            <div className="space-y-6">
                {/* Disease Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{diseaseData.totalActivities}</div>
                                    <div className="text-blue-100 text-sm">Total Activities</div>
                                </div>
                                <BarChart3Icon className="w-8 h-8 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{ongoingCount}</div>
                                    <div className="text-green-100 text-sm">Ongoing</div>
                                </div>
                                <TrendingUpIcon className="w-8 h-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{completedCount}</div>
                                    <div className="text-purple-100 text-sm">Completed</div>
                                </div>
                                <UsersIcon className="w-8 h-8 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{avgCoverage.toFixed(1)}%</div>
                                    <div className="text-orange-100 text-sm">Avg Coverage</div>
                                </div>
                                <MapPinIcon className="w-8 h-8 text-orange-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Activities Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            Activity Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {diseaseData.activities.map((activity, index) => (
                                <div key={`drill-${index}-${activity.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <MapPinIcon className="w-4 h-4" />
                                                {activity.region}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="w-4 h-4" />
                                                {activity.timeline}
                                            </span>
                                            <span>{activity.implementer}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getCoverageBadgeColor(activity.coverage)}>
                                            {activity.coverage}
                                        </Badge>
                                        <Badge className={getStatusBadgeColor(activity.status)}>
                                            {activity.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Partners Network */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UsersIcon className="w-5 h-5" />
                            Partners Network
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {[...new Set(diseaseData.activities.flatMap(a => a.partners))].map(partner => (
                                <Badge key={partner} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                    {partner}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <section className='mb-8' id='diseases'>
          <div className="space-y-8">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <HeartHandshakeIcon className="w-6 h-6" />
                      </div>
                      <div>
                          <h1 className='text-4xl font-bold mb-2'>Activities by Disease Focus</h1>
                          <p className='text-blue-100 text-lg'>
                              Comprehensive disease-specific activity tracking and analysis to support targeted intervention planning, resource allocation, and health outcome monitoring across all NCD categories.
                          </p>
                      </div>
                  </div>
              </div>

              {!isMounted ? (
                  <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 border shadow-sm">
                          <div className="animate-pulse space-y-4">
                              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                              <div className="h-64 bg-gray-200 rounded"></div>
                          </div>
                      </div>
                  </div>
              ) : (
                  <Tabs defaultValue="chart" className="space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-2">
                              <TabsTrigger value="chart" className="flex items-center gap-2">
                                  <BarChart3Icon className="w-4 h-4" />
                                  Chart View
                              </TabsTrigger>
                              <TabsTrigger value="table" className="flex items-center gap-2">
                                  <TableIcon className="w-4 h-4" />
                                  Table View
                              </TabsTrigger>
                          </TabsList>

                          {/* Filters */}
                          <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-2">
                                  <FilterIcon className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                              </div>

                              <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                                  <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select Disease" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="all">All Diseases</SelectItem>
                                      {diseaseActivities.map((disease, index) => (
                                          <SelectItem key={`disease-${index}-${disease.disease}`} value={disease.disease}>
                                              {disease.disease}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>

                              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                  <SelectTrigger className="w-[140px]">
                                      <SelectValue placeholder="Region" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="all">All Regions</SelectItem>
                                      {allRegions.map((region, index) => (
                                          <SelectItem key={`region-${index}-${region}`} value={region}>
                                              {region}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>

                              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                  <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="all">All Status</SelectItem>
                                      {allStatuses.map((status, index) => (
                                          <SelectItem key={`status-${index}-${status}`} value={status}>
                                              {status.charAt(0).toUpperCase() + status.slice(1)}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>

                              <Button variant="outline" size="sm" onClick={resetFilters}>
                                  Reset
                              </Button>
                          </div>
                      </div>

                      {/* Chart Tab */}
                      <TabsContent value="chart">
                          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
                              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                  <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                              <BarChart3Icon className="w-5 h-5" />
                                          </div>
                                          <CardTitle className="text-xl">Disease Activity Distribution</CardTitle>
                                      </div>
                                      <Button
                                          onClick={exportChartAsPNG}
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
                                  <div ref={chartRef}>
                                      <GeneralChart 
                                              data={filteredChartData}
                                              layout="horizontal" 
                                              title=""
                                              height={500}
                                              onBarClick={handleBarClick}
                                              barGradient={{
                                                  startColor: '#4F46E5',
                                                  endColor: '#818CF8'
                                              }}
                                          />
                                  </div>
                              </CardContent>
                          </Card>
                      </TabsContent>

                      {/* Table Tab */}
                      <TabsContent value="table">
                          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
                              <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                                  <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                              <TableIcon className="w-5 h-5" />
                                          </div>
                                          <CardTitle className="text-xl">Disease Activities Overview</CardTitle>
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
                                  <div ref={tableRef} className="rounded-lg border">
                                      <Table>
                                          <TableHeader>
                                              <TableRow className="bg-gray-50">
                                                  <TableHead className="font-bold text-gray-800">Disease</TableHead>
                                                  <TableHead className="font-bold text-gray-800">Activity Name</TableHead>
                                                  <TableHead className="font-bold text-gray-800">Region</TableHead>
                                                  <TableHead className="font-bold text-gray-800">Implementer</TableHead>
                                                  <TableHead className="font-bold text-gray-800">Status</TableHead>
                                                  <TableHead className="font-bold text-gray-800">Coverage</TableHead>
                                                  <TableHead className="font-bold text-gray-800">Actions</TableHead>
                                              </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                              {filteredActivities.map((activity, index) => (
                                                  <TableRow key={`activity-${index}-${activity.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                                                      <TableCell className="font-medium">
                                                          <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700">
                                                              {activity.disease}
                                                          </Badge>
                                                      </TableCell>
                                                      <TableCell>{activity.name}</TableCell>
                                                      <TableCell>
                                                          <div className="flex items-center gap-1">
                                                              <MapPinIcon className="w-4 h-4 text-gray-400" />
                                                              {activity.region}
                                                          </div>
                                                      </TableCell>
                                                      <TableCell className="text-sm text-gray-600">{activity.implementer}</TableCell>
                                                      <TableCell>
                                                          <Badge className={getStatusBadgeColor(activity.status)}>
                                                              {activity.status}
                                                          </Badge>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Badge className={getCoverageBadgeColor(activity.coverage)}>
                                                              {activity.coverage}
                                                          </Badge>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Dialog>
                                                              <DialogTrigger asChild>
                                                                  <Button
                                                                      variant="outline"
                                                                      size="sm"
                                                                      onClick={() => setDrillDownDisease(activity.disease)}
                                                                      className="flex items-center gap-1"
                                                                  >
                                                                      <EyeIcon className="w-4 h-4" />
                                                                      View
                                                                  </Button>
                                                              </DialogTrigger>
                                                              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                                                  <DialogHeader>
                                                                      <DialogTitle className="text-2xl font-bold text-indigo-900">
                                                                          {activity.disease} - Detailed Overview
                                                                      </DialogTitle>
                                                                  </DialogHeader>
                                                                  {drillDownDisease && <DrillDownDetails disease={drillDownDisease} />}
                                                              </DialogContent>
                                                          </Dialog>
                                                      </TableCell>
                                                  </TableRow>
                                              ))}
                                          </TableBody>
                                      </Table>
                                  </div>

                                  {filteredActivities.length === 0 && (
                                      <div className="text-center py-8 text-gray-500">
                                          No activities found matching the current filters.
                                      </div>
                                  )}
                              </CardContent>
                          </Card>
                      </TabsContent>
                  </Tabs>
              )}
      </div>
    </section>
  )
}
