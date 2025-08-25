"use client";

import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDownIcon, AlertTriangleIcon, BarChart3Icon, TableIcon, FilterIcon } from "lucide-react"

// Mock data for care continuum activities
const careContinuumActivities = [
    {
        id: 1,
        activity: "Community Health Education",
        stage: "Prevention",
        region: "Greater Accra",
        partner: "Ghana Health Service",
        targetGroup: "General Population",
        diseases: ["Hypertension", "Diabetes"],
        coverage: 85,
        status: "ongoing"
    },
    {
        id: 2,
        activity: "Blood Pressure Screening",
        stage: "Screening",
        region: "Ashanti",
        partner: "WHO",
        targetGroup: "Adults 40+",
        diseases: ["Hypertension"],
        coverage: 78,
        status: "ongoing"
    },
    {
        id: 3,
        activity: "Diabetes Management Program",
        stage: "Treatment",
        region: "Western",
        partner: "Regional Health Directorate",
        targetGroup: "Diabetic Patients",
        diseases: ["Diabetes"],
        coverage: 92,
        status: "completed"
    },
    {
        id: 4,
        activity: "Cancer Screening Initiative",
        stage: "Screening",
        region: "Central",
        partner: "Cancer Society",
        targetGroup: "Women 30-65",
        diseases: ["Breast Cancer", "Cervical Cancer"],
        coverage: 65,
        status: "ongoing"
    },
    {
        id: 5,
        activity: "Cardiovascular Surgery",
        stage: "Treatment",
        region: "Greater Accra",
        partner: "Korle Bu Teaching Hospital",
        targetGroup: "CVD Patients",
        diseases: ["Cardiovascular Disease"],
        coverage: 45,
        status: "ongoing"
    },
    {
        id: 6,
        activity: "Mental Health Counseling",
        stage: "Treatment",
        region: "Northern",
        partner: "Mental Health Authority",
        targetGroup: "All Ages",
        diseases: ["Mental Health"],
        coverage: 38,
        status: "ongoing"
    },
    {
        id: 7,
        activity: "Stroke Rehabilitation",
        stage: "Palliative Care",
        region: "Eastern",
        partner: "Rehabilitation Centers",
        targetGroup: "Stroke Survivors",
        diseases: ["Stroke"],
        coverage: 56,
        status: "ongoing"
    },
    {
        id: 8,
        activity: "Insulin Access Program",
        stage: "Treatment",
        region: "Volta",
        partner: "Pharma Companies",
        targetGroup: "Type 1 Diabetics",
        diseases: ["Diabetes"],
        coverage: 71,
        status: "ongoing"
    },
    {
        id: 9,
        activity: "Hypertension Prevention Campaign",
        stage: "Prevention",
        region: "Upper East",
        partner: "Local NGOs",
        targetGroup: "Youth",
        diseases: ["Hypertension"],
        coverage: 89,
        status: "completed"
    },
    {
        id: 10,
        activity: "Palliative Care Training",
        stage: "Palliative Care",
        region: "Bono",
        partner: "Hospice Foundation",
        targetGroup: "Healthcare Workers",
        diseases: ["Cancer", "Chronic Kidney Disease"],
        coverage: 34,
        status: "ongoing"
    },
    {
        id: 11,
        activity: "Early Cancer Detection",
        stage: "Diagnosis",
        region: "Greater Accra",
        partner: "Cancer Centers",
        targetGroup: "High Risk Groups",
        diseases: ["Cancer"],
        coverage: 58,
        status: "ongoing"
    },
    {
        id: 12,
        activity: "COPD Management",
        stage: "Treatment",
        region: "Ashanti",
        partner: "Respiratory Clinics",
        targetGroup: "COPD Patients",
        diseases: ["COPD"],
        coverage: 67,
        status: "ongoing"
    },
    {
        id: 13,
        activity: "Diabetes Prevention Workshop",
        stage: "Prevention",
        region: "Western North",
        partner: "Community Health Workers",
        targetGroup: "Pre-diabetic Adults",
        diseases: ["Diabetes"],
        coverage: 73,
        status: "ongoing"
    },
    {
        id: 14,
        activity: "Cervical Cancer Screening",
        stage: "Screening",
        region: "Oti",
        partner: "Women's Health Initiative",
        targetGroup: "Women 25-65",
        diseases: ["Cervical Cancer"],
        coverage: 42,
        status: "ongoing"
    },
    {
        id: 15,
        activity: "Mental Health First Aid",
        stage: "Treatment",
        region: "Savannah",
        partner: "Mental Health NGO",
        targetGroup: "Community Leaders",
        diseases: ["Mental Health"],
        coverage: 59,
        status: "completed"
    },
    {
        id: 16,
        activity: "Hypertension Monitoring",
        stage: "Diagnosis",
        region: "North East",
        partner: "Mobile Health Units",
        targetGroup: "Rural Communities",
        diseases: ["Hypertension"],
        coverage: 48,
        status: "ongoing"
    },
    {
        id: 17,
        activity: "Kidney Disease Support",
        stage: "Palliative Care",
        region: "Upper West",
        partner: "Kidney Foundation",
        targetGroup: "CKD Patients",
        diseases: ["Chronic Kidney Disease"],
        coverage: 35,
        status: "ongoing"
    },
    {
        id: 18,
        activity: "Cancer Awareness Campaign",
        stage: "Prevention",
        region: "Bono East",
        partner: "Cancer Society",
        targetGroup: "General Population",
        diseases: ["Cancer"],
        coverage: 82,
        status: "completed"
    },
    {
        id: 19,
        activity: "Stroke Prevention Education",
        stage: "Prevention",
        region: "Ahafo",
        partner: "Stroke Foundation",
        targetGroup: "Adults 50+",
        diseases: ["Stroke"],
        coverage: 67,
        status: "ongoing"
    }
]

// Define care continuum stages
const careStages = ["Prevention", "Screening", "Diagnosis", "Treatment", "Palliative Care"]

// Define diseases for gap analysis
const diseases = ["Hypertension", "Diabetes", "Cancer", "Cardiovascular Disease", "Mental Health", "Stroke", "COPD", "Chronic Kidney Disease"]

// Define regions
const regions = [
    "Greater Accra",
    "Ashanti",
    "Western",
    "Western North",
    "Central",
    "Eastern",
    "Volta",
    "Oti",
    "Northern",
    "Savannah",
    "North East",
    "Upper East",
    "Upper West",
    "Bono",
    "Bono East",
    "Ahafo"
]

// Define gap analysis types
interface GapAnalysis {
    type: string;
    description: string;
    severity: "high" | "medium" | "low";
    recommendations: string;
}

export default function CareContinuum() {
    const [selectedRegion, setSelectedRegion] = useState<string>("all")
    const [selectedDisease, setSelectedDisease] = useState<string>("all")

    // Calculate stacked bar chart data
    const stackedChartData = useMemo(() => {
        const filteredActivities = careContinuumActivities.filter(activity => {
            const regionMatch = selectedRegion === "all" || activity.region === selectedRegion
            const diseaseMatch = selectedDisease === "all" || activity.diseases.includes(selectedDisease)
            return regionMatch && diseaseMatch
        })

        return regions.map(region => {
            const regionActivities = filteredActivities.filter(activity => activity.region === region)
            const data: any = { region }

            careStages.forEach(stage => {
                data[stage] = regionActivities.filter(activity => activity.stage === stage).length
            })

            return data
        })
    }, [selectedRegion, selectedDisease])

    // Calculate summary table data
    const summaryTableData = useMemo(() => {
        return careContinuumActivities.filter(activity => {
            const regionMatch = selectedRegion === "all" || activity.region === selectedRegion
            const diseaseMatch = selectedDisease === "all" || activity.diseases.includes(selectedDisease)
            return regionMatch && diseaseMatch
        })
    }, [selectedRegion, selectedDisease])

    // Calculate gap analysis
    const gapAnalysis = useMemo(() => {
        const gaps: GapAnalysis[] = []

        // Analyze gaps by disease and stage
        diseases.forEach(disease => {
            careStages.forEach(stage => {
                const activitiesInStage = careContinuumActivities.filter(activity =>
                    activity.diseases.includes(disease) && activity.stage === stage
                )

                if (activitiesInStage.length === 0) {
                    gaps.push({
                        type: "Disease-Stage Gap",
                        description: `No ${stage.toLowerCase()} activities for ${disease}`,
                        severity: "high",
                        recommendations: `Develop ${stage.toLowerCase()} programs for ${disease}`
                    })
                } else if (activitiesInStage.length < 2) {
                    gaps.push({
                        type: "Limited Coverage",
                        description: `Limited ${stage.toLowerCase()} activities for ${disease} (${activitiesInStage.length} activity)`,
                        severity: "medium",
                        recommendations: `Scale up ${stage.toLowerCase()} programs for ${disease}`
                    })
                }
            })
        })

        // Analyze gaps by region
        regions.forEach(region => {
            careStages.forEach(stage => {
                const activitiesInRegion = careContinuumActivities.filter(activity =>
                    activity.region === region && activity.stage === stage
                )

                if (activitiesInRegion.length === 0) {
                    gaps.push({
                        type: "Regional Gap",
                        description: `No ${stage.toLowerCase()} activities in ${region}`,
                        severity: "high",
                        recommendations: `Establish ${stage.toLowerCase()} services in ${region}`
                    })
                }
            })
        })

        return gaps.slice(0, 8) // Limit to top 8 gaps
    }, [])

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high": return "bg-red-100 text-red-800 border-red-200"
            case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "ongoing": return "bg-blue-100 text-blue-800 border-blue-200"
            case "completed": return "bg-green-100 text-green-800 border-green-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getCoverageBadgeColor = (coverage: number) => {
        if (coverage >= 80) return "bg-green-100 text-green-800 border-green-200"
        if (coverage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
        return "bg-red-100 text-red-800 border-red-200"
    }

  return (
    <section className='mb-8' id='care-continuum'>
          <div className="space-y-8">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <BarChart3Icon className="w-6 h-6" />
                      </div>
                      <div>
                          <h1 className='text-4xl font-bold mb-2'>Activities by Care Continuum</h1>
                          <p className='text-blue-100 text-lg'>
                              Comprehensive analysis of healthcare activities across the continuum of care, from prevention to palliative care,
                              highlighting gaps and opportunities for improved NCD management across all 16 regions of Ghana.
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

              {/* Stacked Bar Chart */}
              <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <BarChart3Icon className="w-5 h-5" />
                          </div>
                          <CardTitle className="text-xl">Distribution of Activities Across Care Continuum</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="p-6">
                      <div className="h-[600px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                  data={stackedChartData}
                                  margin={{
                                      top: 20,
                                      right: 30,
                                      left: 20,
                                      bottom: 80,
                                  }}
                              >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis
                                      dataKey="region"
                                      angle={-45}
                                      textAnchor="end"
                                      height={120}
                                      tick={{ fontSize: 11 }}
                                      interval={0}
                                  />
                                  <YAxis stroke="#6b7280" />
                                  <Tooltip
                                      content={({ active, payload, label }) => {
                                          if (!active || !payload?.length) return null;

                                          return (
                                              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100">
                                                  <p className="text-gray-800 font-semibold mb-2">{label}</p>
                                                  <div className="space-y-1">
                                                      {payload.map((entry, index) => (
                                                          <div key={index} className="flex items-center gap-2 text-sm">
                                                              <div
                                                                  className="w-3 h-3 rounded-full"
                                                                  style={{ backgroundColor: entry.color }}
                                                              />
                                                              <span className="text-gray-600">{entry.dataKey}:</span>
                                                              <span className="font-semibold">{entry.value} activities</span>
                                                          </div>
                                                      ))}
                                                  </div>
                                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                                      <span className="text-sm text-gray-500">
                                                          Total: {payload.reduce((sum, entry) => sum + (entry.value as number), 0)} activities
                                                      </span>
                                                  </div>
                                              </div>
                                          );
                                      }}
                                  />
                                  <Legend />
                                  <Bar dataKey="Prevention" stackId="a" fill="#10B981" name="Prevention" />
                                  <Bar dataKey="Screening" stackId="a" fill="#3B82F6" name="Screening" />
                                  <Bar dataKey="Diagnosis" stackId="a" fill="#8B5CF6" name="Diagnosis" />
                                  <Bar dataKey="Treatment" stackId="a" fill="#F59E0B" name="Treatment" />
                                  <Bar dataKey="Palliative Care" stackId="a" fill="#EF4444" name="Palliative Care" />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Summary Table */}
                  <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                  <TableIcon className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-xl">Activity Summary</CardTitle>
                          </div>
                      </CardHeader>
                      <CardContent className="p-0">
                          <div className="max-h-[600px] overflow-y-auto">
                              <Table>
                                  <TableHeader>
                                      <TableRow className="bg-gray-50">
                                          <TableHead className="font-semibold">Activity</TableHead>
                                          <TableHead className="font-semibold">Stage</TableHead>
                                          <TableHead className="font-semibold">Region</TableHead>
                                          <TableHead className="font-semibold">Partner</TableHead>
                                          <TableHead className="font-semibold">Target Group</TableHead>
                                          <TableHead className="font-semibold">Coverage</TableHead>
                                          <TableHead className="font-semibold">Status</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {summaryTableData.map((activity) => (
                                          <TableRow key={activity.id} className="hover:bg-gray-50">
                                              <TableCell className="font-medium">{activity.activity}</TableCell>
                                              <TableCell>
                                                  <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-800">
                                                      {activity.stage}
                                                  </Badge>
                                              </TableCell>
                                              <TableCell className="text-sm text-gray-600">{activity.region}</TableCell>
                                              <TableCell className="text-sm text-gray-600">{activity.partner}</TableCell>
                                              <TableCell className="text-sm text-gray-600">{activity.targetGroup}</TableCell>
                                              <TableCell>
                                                  <Badge className={getCoverageBadgeColor(activity.coverage)}>
                                                      {activity.coverage}%
                                                  </Badge>
                                              </TableCell>
                                              <TableCell>
                                                  <Badge className={getStatusBadgeColor(activity.status)}>
                                                      {activity.status}
                                                  </Badge>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </div>
                      </CardContent>
                  </Card>

                  {/* Gap Analysis */}
                  <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                  <AlertTriangleIcon className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-xl">Care Continuum Gaps</CardTitle>
                          </div>
                      </CardHeader>
                      <CardContent className="p-6">
                          <div className="space-y-4 max-h-[600px] overflow-y-auto">
                              {gapAnalysis.length === 0 ? (
                                  <div className="text-center py-8">
                                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                          <TrendingDownIcon className="w-8 h-8 text-green-600" />
                                      </div>
                                      <p className="text-gray-600">No significant gaps identified in the current filter view.</p>
                                  </div>
                              ) : (
                                  gapAnalysis.map((gap, index) => (
                                      <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-orange-400">
                                          <div className="flex items-start justify-between mb-3">
                                              <div className="flex items-center gap-2">
                                                  <Badge className={getSeverityColor(gap.severity)}>
                                                      {gap.severity} priority
                                                  </Badge>
                                                  <span className="text-sm font-medium text-gray-600">{gap.type}</span>
                                              </div>
                                          </div>
                                          <div className="space-y-2">
                                              <p className="font-semibold text-gray-800">{gap.description}</p>
                                              <p className="text-sm text-gray-600">
                                                  <span className="font-medium">Recommendation:</span> {gap.recommendations}
                                              </p>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </CardContent>
                  </Card>
              </div>
      </div>
    </section>
  )
}
