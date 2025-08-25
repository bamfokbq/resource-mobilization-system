"use client";

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BuildingIcon, FilterIcon, EyeIcon, UsersIcon, MapPinIcon, HeartIcon } from "lucide-react"

// Mock data for organizations
const organizationsData = [
  {
    id: 1,
    name: "Ghana Health Service",
    type: "Government",
    activities: 89,
    regionsCovered: ["Greater Accra", "Ashanti", "Western", "Central", "Eastern", "Northern"],
    diseaseFocus: ["Hypertension", "Diabetes", "Mental Health"],
    fundingSource: "Government Budget",
    portfolio: [
      { activity: "Community Health Education", region: "Greater Accra", disease: "Hypertension" },
      { activity: "Blood Pressure Screening", region: "Ashanti", disease: "Hypertension" },
      { activity: "Diabetes Prevention Program", region: "Western", disease: "Diabetes" },
      { activity: "Mental Health Training", region: "Northern", disease: "Mental Health" }
    ]
  },
  {
    id: 2,
    name: "WHO Ghana",
    type: "NGO",
    activities: 67,
    regionsCovered: ["Greater Accra", "Ashanti", "Central"],
    diseaseFocus: ["Hypertension", "Cancer", "Stroke"],
    fundingSource: "International Donors",
    portfolio: [
      { activity: "Cancer Screening Initiative", region: "Greater Accra", disease: "Cancer" },
      { activity: "Stroke Prevention Campaign", region: "Ashanti", disease: "Stroke" },
      { activity: "Hypertension Management", region: "Central", disease: "Hypertension" }
    ]
  },
  {
    id: 3,
    name: "Korle Bu Teaching Hospital",
    type: "Academic",
    activities: 78,
    regionsCovered: ["Greater Accra", "Central"],
    diseaseFocus: ["Cardiovascular Disease", "Cancer", "Diabetes"],
    fundingSource: "Government + Research Grants",
    portfolio: [
      { activity: "Cardiovascular Surgery Program", region: "Greater Accra", disease: "Cardiovascular Disease" },
      { activity: "Cancer Treatment Center", region: "Greater Accra", disease: "Cancer" },
      { activity: "Diabetes Research Study", region: "Central", disease: "Diabetes" }
    ]
  },
  {
    id: 4,
    name: "Christian Health Association",
    type: "CSO",
    activities: 56,
    regionsCovered: ["Northern", "Upper East", "Upper West", "Volta"],
    diseaseFocus: ["Mental Health", "Hypertension", "Diabetes"],
    fundingSource: "Faith-Based Donors",
    portfolio: [
      { activity: "Rural Mental Health Program", region: "Northern", disease: "Mental Health" },
      { activity: "Community Health Outreach", region: "Upper East", disease: "Hypertension" },
      { activity: "Diabetes Support Groups", region: "Volta", disease: "Diabetes" }
    ]
  },
  {
    id: 5,
    name: "Ghana Cancer Society",
    type: "NGO",
    activities: 34,
    regionsCovered: ["Greater Accra", "Ashanti", "Central", "Western"],
    diseaseFocus: ["Breast Cancer", "Cervical Cancer", "Prostate Cancer"],
    fundingSource: "International NGOs + Donations",
    portfolio: [
      { activity: "Breast Cancer Screening", region: "Greater Accra", disease: "Breast Cancer" },
      { activity: "Cervical Cancer Prevention", region: "Ashanti", disease: "Cervical Cancer" },
      { activity: "Prostate Cancer Awareness", region: "Western", disease: "Prostate Cancer" }
    ]
  },
  {
    id: 6,
    name: "Ministry of Health",
    type: "Government",
    activities: 134,
    regionsCovered: ["All 16 Regions"],
    diseaseFocus: ["All NCDs", "Policy Development"],
    fundingSource: "Government Budget + World Bank",
    portfolio: [
      { activity: "National NCD Strategy", region: "All Regions", disease: "All NCDs" },
      { activity: "Health System Strengthening", region: "All Regions", disease: "All NCDs" },
      { activity: "Capacity Building Program", region: "All Regions", disease: "All NCDs" }
    ]
  },
  {
    id: 7,
    name: "University of Ghana Medical School",
    type: "Academic",
    activities: 28,
    regionsCovered: ["Greater Accra", "Eastern"],
    diseaseFocus: ["Research", "Medical Education"],
    fundingSource: "Research Grants + Tuition",
    portfolio: [
      { activity: "NCD Research Program", region: "Greater Accra", disease: "Research" },
      { activity: "Medical Student Training", region: "Greater Accra", disease: "Medical Education" },
      { activity: "Community Health Research", region: "Eastern", disease: "Research" }
    ]
  },
  {
    id: 8,
    name: "Ghana Red Cross Society",
    type: "CSO",
    activities: 45,
    regionsCovered: ["Greater Accra", "Ashanti", "Northern", "Volta", "Central"],
    diseaseFocus: ["Emergency Care", "Community Health"],
    fundingSource: "International Red Cross + Donations",
    portfolio: [
      { activity: "Emergency Response Training", region: "Greater Accra", disease: "Emergency Care" },
      { activity: "First Aid Training", region: "Ashanti", disease: "Emergency Care" },
      { activity: "Community Health Education", region: "Northern", disease: "Community Health" }
    ]
  },
  {
    id: 9,
    name: "Pfizer Ghana",
    type: "Government",
    activities: 23,
    regionsCovered: ["Greater Accra", "Ashanti"],
    diseaseFocus: ["Access to Medicines", "Cancer"],
    fundingSource: "Corporate CSR",
    portfolio: [
      { activity: "Medicine Access Program", region: "Greater Accra", disease: "Access to Medicines" },
      { activity: "Cancer Drug Donation", region: "Ashanti", disease: "Cancer" }
    ]
  },
  {
    id: 10,
    name: "Mental Health Authority",
    type: "Government",
    activities: 41,
    regionsCovered: ["Greater Accra", "Ashanti", "Northern", "Savannah"],
    diseaseFocus: ["Mental Health", "Substance Abuse"],
    fundingSource: "Government + WHO",
    portfolio: [
      { activity: "Mental Health Services", region: "Greater Accra", disease: "Mental Health" },
      { activity: "Community Mental Health", region: "Ashanti", disease: "Mental Health" },
      { activity: "Substance Abuse Treatment", region: "Northern", disease: "Substance Abuse" }
    ]
  }
]

// Organization types for filtering
const organizationTypes = ["Government", "NGO", "CSO", "Academic"]

export default function Organizations() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null)

  // Filter organizations based on type
  const filteredOrganizations = useMemo(() => {
    if (selectedType === "all") return organizationsData
    return organizationsData.filter(org => org.type === selectedType)
  }, [selectedType])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return {
      totalOrganizations: filteredOrganizations.length,
      totalActivities: filteredOrganizations.reduce((sum, org) => sum + org.activities, 0),
      avgActivitiesPerOrg: Math.round(filteredOrganizations.reduce((sum, org) => sum + org.activities, 0) / filteredOrganizations.length)
    }
  }, [filteredOrganizations])

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Government": return "bg-blue-100 text-blue-800 border-blue-200"
      case "NGO": return "bg-green-100 text-green-800 border-green-200"
      case "CSO": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Academic": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <section className='mb-8' id='organizations'>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BuildingIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Activities by Organizations</h1>
              <p className='text-blue-100 text-lg'>
                Comprehensive directory of organizations involved in NCD activities, facilitating collaboration,
                partnership development, and preventing duplication of efforts across Ghana.
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
              <CardTitle className="text-xl">Filter Organizations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-2 min-w-[300px]">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Organization Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {organizationTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.totalOrganizations}</div>
                  <div className="text-blue-100 mt-1 font-medium">Organizations</div>
                  <div className="text-xs text-blue-200 mt-2">Active in NCD activities</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BuildingIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.totalActivities}</div>
                  <div className="text-green-100 mt-1 font-medium">Total Activities</div>
                  <div className="text-xs text-green-200 mt-2">Across all organizations</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{summaryStats.avgActivitiesPerOrg}</div>
                  <div className="text-purple-100 mt-1 font-medium">Avg Activities</div>
                  <div className="text-xs text-purple-200 mt-2">Per organization</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BuildingIcon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Organizations Directory</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[700px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Organization</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">No. of Activities</TableHead>
                    <TableHead className="font-semibold">Regions Covered</TableHead>
                    <TableHead className="font-semibold">Disease Focus</TableHead>
                    <TableHead className="font-semibold">Funding Source</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.map((org) => (
                    <TableRow key={org.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeBadgeColor(org.type)}>
                          {org.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-lg">{org.activities}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{org.regionsCovered.length}</span>
                          <span className="text-sm text-gray-500">regions</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {org.regionsCovered.slice(0, 2).join(", ")}
                          {org.regionsCovered.length > 2 && ` +${org.regionsCovered.length - 2} more`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {org.diseaseFocus.slice(0, 2).map((disease, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                              {disease}
                            </Badge>
                          ))}
                          {org.diseaseFocus.length > 2 && (
                            <div className="text-xs text-gray-500">+{org.diseaseFocus.length - 2} more</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{org.fundingSource}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrganization(org)}
                              className="flex items-center gap-1"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View Portfolio
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-indigo-900">
                                {org.name} - Activity Portfolio
                              </DialogTitle>
                            </DialogHeader>

                            {selectedOrganization && (
                              <div className="space-y-6">
                                {/* Organization Overview */}
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Organization Type</h3>
                                    <Badge className={getTypeBadgeColor(selectedOrganization.type)}>
                                      {selectedOrganization.type}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Regions and Disease Focus */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Regions Covered</h3>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedOrganization.regionsCovered.map((region: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {region}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Disease Focus Areas</h3>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedOrganization.diseaseFocus.map((disease: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {disease}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Activity Portfolio */}
                                <div>
                                  <h3 className="font-semibold text-gray-800 mb-4">Activity Portfolio</h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Activity</TableHead>
                                        <TableHead>Region</TableHead>
                                        <TableHead>Disease Focus</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrganization.portfolio.map((activity: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell className="font-medium">{activity.activity}</TableCell>
                                          <TableCell>{activity.region}</TableCell>
                                          <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                              {activity.disease}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
