"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BuildingIcon, DollarSignIcon, FilterIcon, HeartHandshakeIcon, MapPinIcon, TrendingUpIcon, UsersIcon, WrenchIcon } from "lucide-react";
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data for partners
const partnersData = [
    // International Organizations
    {
        id: 1,
        name: "World Health Organization (WHO)",
        logo: "🏛️",
        activities: 45,
        diseaseFocus: "All NCDs",
        region: "National",
        role: "Technical Assistance",
        type: "implementation",
        category: "International Organization",
        description: "Global health leadership and technical support"
    },
    {
        id: 2,
        name: "United Nations Development Programme",
        logo: "🌍",
        activities: 28,
        diseaseFocus: "Health Systems",
        region: "National",
        role: "Funding",
        type: "funding",
        category: "International Organization",
        description: "Development funding and capacity building"
    },
    {
        id: 3,
        name: "World Bank Group",
        logo: "🏦",
        activities: 22,
        diseaseFocus: "Health Infrastructure",
        region: "National",
        role: "Funding",
        type: "funding",
        category: "International Organization",
        description: "Healthcare infrastructure financing"
    },

    // Government Partners
    {
        id: 4,
        name: "Ghana Health Service",
        logo: "🏥",
        activities: 89,
        diseaseFocus: "All NCDs",
        region: "National",
        role: "Implementation",
        type: "implementation",
        category: "Government",
        description: "Primary healthcare service delivery"
    },
    {
        id: 5,
        name: "Ministry of Health",
        logo: "🏛️",
        activities: 67,
        diseaseFocus: "Policy & Regulation",
        region: "National",
        role: "Implementation",
        type: "implementation",
        category: "Government",
        description: "Health policy development and oversight"
    },
    {
        id: 6,
        name: "Mental Health Authority",
        logo: "🧠",
        activities: 34,
        diseaseFocus: "Mental Health",
        region: "National",
        role: "Implementation",
        type: "implementation",
        category: "Government",
        description: "Mental health services coordination"
    },

    // Academic Partners
    {
        id: 7,
        name: "University of Ghana Medical School",
        logo: "🎓",
        activities: 56,
        diseaseFocus: "Research & Training",
        region: "Greater Accra",
        role: "Technical Assistance",
        type: "implementation",
        category: "Academic",
        description: "Medical research and professional training"
    },
    {
        id: 8,
        name: "Kwame Nkrumah University of Science",
        logo: "🏫",
        activities: 42,
        diseaseFocus: "Public Health",
        region: "Ashanti",
        role: "Technical Assistance",
        type: "implementation",
        category: "Academic",
        description: "Public health research and education"
    },

    // Healthcare Institutions
    {
        id: 9,
        name: "Korle Bu Teaching Hospital",
        logo: "🏥",
        activities: 78,
        diseaseFocus: "Specialist Care",
        region: "Greater Accra",
        role: "Implementation",
        type: "implementation",
        category: "Healthcare Institution",
        description: "Tertiary healthcare and specialist services"
    },
    {
        id: 10,
        name: "Komfo Anokye Teaching Hospital",
        logo: "🏥",
        activities: 65,
        diseaseFocus: "Cardiovascular",
        region: "Ashanti",
        role: "Implementation",
        type: "implementation",
        category: "Healthcare Institution",
        description: "Cardiovascular and emergency care"
    },

    // NGOs and Civil Society
    {
        id: 11,
        name: "Christian Health Association of Ghana",
        logo: "⛪",
        activities: 92,
        diseaseFocus: "Community Health",
        region: "Multi-Regional",
        role: "Implementation",
        type: "implementation",
        category: "NGO",
        description: "Faith-based community health services"
    },
    {
        id: 12,
        name: "Ghana Cancer Society",
        logo: "🎗️",
        activities: 47,
        diseaseFocus: "Cancer",
        region: "National",
        role: "Implementation",
        type: "implementation",
        category: "NGO",
        description: "Cancer prevention and support services"
    },
    {
        id: 13,
        name: "Diabetes Association of Ghana",
        logo: "💙",
        activities: 38,
        diseaseFocus: "Diabetes",
        region: "National",
        role: "Implementation",
        type: "implementation",
        category: "NGO",
        description: "Diabetes education and patient support"
    },

    // Private Sector
    {
        id: 14,
        name: "Unilever Ghana Foundation",
        logo: "🏢",
        activities: 25,
        diseaseFocus: "Health Education",
        region: "Multi-Regional",
        role: "Funding",
        type: "funding",
        category: "Private Sector",
        description: "Corporate social responsibility health programs"
    },
    {
        id: 15,
        name: "MTN Ghana Foundation",
        logo: "📱",
        activities: 18,
        diseaseFocus: "Digital Health",
        region: "National",
        role: "Funding",
        type: "funding",
        category: "Private Sector",
        description: "Technology-enabled health solutions"
    },

    // Donor Organizations
    {
        id: 16,
        name: "USAID Ghana",
        logo: "🇺🇸",
        activities: 35,
        diseaseFocus: "Health Systems",
        region: "National",
        role: "Funding",
        type: "funding",
        category: "Donor",
        description: "US government development assistance"
    },
    {
        id: 17,
        name: "UK Aid Direct",
        logo: "🇬🇧",
        activities: 29,
        diseaseFocus: "Community Health",
        region: "Northern",
        role: "Funding",
        type: "funding",
        category: "Donor",
        description: "UK government international development"
    },
    {
        id: 18,
        name: "Gates Foundation",
        logo: "🔬",
        activities: 31,
        diseaseFocus: "Innovation",
        region: "National",
        role: "Funding",
        type: "funding",
        category: "Donor",
        description: "Global health innovation and research"
    }
]

// Filter options
const regions = ["National", "Greater Accra", "Ashanti", "Northern", "Western", "Eastern", "Central", "Multi-Regional"]
const diseaseAreas = ["All NCDs", "Cardiovascular", "Diabetes", "Cancer", "Mental Health", "Health Systems", "Community Health", "Public Health", "Digital Health", "Innovation", "Research & Training", "Policy & Regulation", "Health Education", "Health Infrastructure", "Specialist Care"]
const categories = ["International Organization", "Government", "Academic", "Healthcare Institution", "NGO", "Private Sector", "Donor"]

export default function Partners() {
    const [selectedPartnerType, setSelectedPartnerType] = useState<string>("all")
    const [selectedRegion, setSelectedRegion] = useState<string>("all")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    // Filter data based on selections
    const filteredPartners = useMemo(() => {
        let data = partnersData
        if (selectedPartnerType !== "all") {
            data = data.filter(partner => partner.type === selectedPartnerType)
        }
        if (selectedRegion !== "all") {
            data = data.filter(partner => partner.region === selectedRegion || partner.region === "National" || partner.region === "Multi-Regional")
        }
        if (selectedCategory !== "all") {
            data = data.filter(partner => partner.category === selectedCategory)
        }
        return data
    }, [selectedPartnerType, selectedRegion, selectedCategory])

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const totalPartners = filteredPartners.length
        const totalActivities = filteredPartners.reduce((sum, partner) => sum + partner.activities, 0)
        const fundingPartners = filteredPartners.filter(p => p.type === "funding").length
        const implementationPartners = filteredPartners.filter(p => p.type === "implementation").length
        const avgActivitiesPerPartner = totalPartners > 0 ? Math.round(totalActivities / totalPartners) : 0

        return {
            totalPartners,
            totalActivities,
            fundingPartners,
            implementationPartners,
            avgActivitiesPerPartner
        }
    }, [filteredPartners])

    // Calculate partner type distribution
    const partnerTypeData = useMemo(() => {
        const typeDistribution = filteredPartners.reduce((acc, partner) => {
            acc[partner.type] = (acc[partner.type] || 0) + partner.activities
            return acc
        }, {} as Record<string, number>)

        return [
            { name: "Funding Partners", value: typeDistribution.funding || 0, color: "#3b82f6" },
            { name: "Implementation Partners", value: typeDistribution.implementation || 0, color: "#10b981" }
        ].filter(item => item.value > 0)
    }, [filteredPartners])

    // Calculate category distribution
    const categoryData = useMemo(() => {
        const categoryDistribution = filteredPartners.reduce((acc, partner) => {
            acc[partner.category] = (acc[partner.category] || 0) + partner.activities
            return acc
        }, {} as Record<string, number>)

        const colors = ["#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316", "#ec4899"]

        return Object.entries(categoryDistribution).map(([category, value], index) => ({
            name: category,
            value,
            color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value)
    }, [filteredPartners])

    const formatNumber = (num: number) => {
        return num.toLocaleString()
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "Funding": return "bg-blue-100 text-blue-800 border-blue-200"
            case "Implementation": return "bg-green-100 text-green-800 border-green-200"
            case "Technical Assistance": return "bg-purple-100 text-purple-800 border-purple-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "funding": return "bg-blue-100 text-blue-800 border-blue-200"
            case "implementation": return "bg-green-100 text-green-800 border-green-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "International Organization": return "🌍"
            case "Government": return "🏛️"
            case "Academic": return "🎓"
            case "Healthcare Institution": return "🏥"
            case "NGO": return "🤝"
            case "Private Sector": return "🏢"
            case "Donor": return "💰"
            default: return "🏢"
        }
    }

  return (
    <section className='mb-8' id='partners'>
          <div className="space-y-8">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <HeartHandshakeIcon className="w-6 h-6" />
                      </div>
                      <div>
                          <h1 className='text-4xl font-bold mb-2'>Partnership Network Analysis</h1>
                          <p className='text-blue-100 text-lg'>
                              Comprehensive overview of partner organizations, their roles, activities, and contributions to NCD initiatives.
                              Promotes transparency, synergy, and coordination across the healthcare ecosystem.
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
                          <CardTitle className="text-xl">Filter Partnership Analysis</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                  Partner Type
                              </label>
                              <Select value={selectedPartnerType} onValueChange={setSelectedPartnerType}>
                                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                      <SelectValue placeholder="Select partner type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="all">All Partner Types</SelectItem>
                                      <SelectItem value="funding">Funding Partners</SelectItem>
                                      <SelectItem value="implementation">Implementation Partners</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                  Region
                              </label>
                              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
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
                                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                  Organization Type
                              </label>
                              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                                      <SelectValue placeholder="Select organization type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="all">All Organization Types</SelectItem>
                                      {categories.map(category => (
                                          <SelectItem key={category} value={category}>{category}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <div className="text-3xl font-bold">{summaryStats.totalPartners}</div>
                                  <div className="text-blue-100 mt-1 font-medium">Total Partners</div>
                                  <div className="text-xs text-blue-200 mt-2">Active organizations</div>
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
                                  <div className="text-green-100 mt-1 font-medium">Total Activities</div>
                                  <div className="text-xs text-green-200 mt-2">Across all partners</div>
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
                                  <div className="text-3xl font-bold">{summaryStats.fundingPartners}</div>
                                  <div className="text-purple-100 mt-1 font-medium">Funding Partners</div>
                                  <div className="text-xs text-purple-200 mt-2">Financial support</div>
                              </div>
                              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                  <DollarSignIcon className="w-6 h-6" />
                              </div>
                          </div>
                      </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <div className="text-3xl font-bold">{summaryStats.implementationPartners}</div>
                                  <div className="text-orange-100 mt-1 font-medium">Implementation</div>
                                  <div className="text-xs text-orange-200 mt-2">Service delivery</div>
                              </div>
                              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                  <WrenchIcon className="w-6 h-6" />
                              </div>
                          </div>
                      </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <div className="text-3xl font-bold">{summaryStats.avgActivitiesPerPartner}</div>
                                  <div className="text-cyan-100 mt-1 font-medium">Avg Activities</div>
                                  <div className="text-xs text-cyan-200 mt-2">Per partner</div>
                              </div>
                              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                  <BuildingIcon className="w-6 h-6" />
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Partner Type Distribution */}
                  <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                  <HeartHandshakeIcon className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-xl">Activities by Partner Type</CardTitle>
                          </div>
                      </CardHeader>
                      <CardContent className="p-6">
                          <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                      <Pie
                                          data={partnerTypeData}
                                          cx="50%"
                                          cy="50%"
                                          outerRadius={100}
                                          fill="#8884d8"
                                          dataKey="value"
                                          label={({ name, value }) => `${name}: ${formatNumber(value || 0)}`}
                                          labelLine={false}
                                      >
                                          {partnerTypeData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                      </Pie>
                                      <Tooltip />
                                  </PieChart>
                              </ResponsiveContainer>
                          </div>
                      </CardContent>
                  </Card>

                  {/* Organization Category Distribution */}
                  <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                  <BuildingIcon className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-xl">Activities by Organization Type</CardTitle>
                          </div>
                      </CardHeader>
                      <CardContent className="p-6">
                          <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                      <XAxis
                                          dataKey="name"
                                          className="text-sm font-medium"
                                          tick={{ fontSize: 10 }}
                                          angle={-45}
                                          textAnchor="end"
                                          height={80}
                                      />
                                      <YAxis
                                          className="text-sm font-medium"
                                          tick={{ fontSize: 12 }}
                                      />
                                      <Tooltip
                                          formatter={(value: any) => [formatNumber(value), "Activities"]}
                                          labelStyle={{ color: '#374151' }}
                                          contentStyle={{
                                              backgroundColor: 'white',
                                              border: '1px solid #e2e8f0',
                                              borderRadius: '8px',
                                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                          }}
                                      />
                                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                          {categoryData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                      </Bar>
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </CardContent>
                  </Card>
              </div>

              {/* Partners Table */}
              <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <UsersIcon className="w-4 h-4 text-indigo-600" />
                          </div>
                          <CardTitle className="text-xl">Partner Organization Details</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="p-0">
                      <div className="max-h-[600px] overflow-y-auto">
                          <Table>
                              <TableHeader>
                                  <TableRow className="bg-gray-50">
                                      <TableHead className="font-semibold">Partner</TableHead>
                                      <TableHead className="font-semibold text-center">No. of Activities</TableHead>
                                      <TableHead className="font-semibold">Disease Focus</TableHead>
                                      <TableHead className="font-semibold">Region</TableHead>
                                      <TableHead className="font-semibold">Role</TableHead>
                                      <TableHead className="font-semibold">Type</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {filteredPartners
                                      .sort((a, b) => b.activities - a.activities)
                                      .map((partner) => (
                                          <TableRow key={partner.id} className="hover:bg-gray-50">
                                              <TableCell className="font-medium">
                                                  <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                                          {partner.logo}
                                                      </div>
                                                      <div>
                                                          <div className="font-semibold text-gray-900">{partner.name}</div>
                                                          <div className="text-xs text-gray-500 flex items-center gap-1">
                                                              {getCategoryIcon(partner.category)}
                                                              {partner.description}
                                                          </div>
                                                      </div>
                                                  </div>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                  <span className="text-2xl font-bold text-blue-600">
                                                      {partner.activities}
                                                  </span>
                                              </TableCell>
                                              <TableCell>
                                                  <span className="font-medium text-gray-700">{partner.diseaseFocus}</span>
                                              </TableCell>
                                              <TableCell>
                                                  <div className="flex items-center gap-1">
                                                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                                                      <span className="font-medium">{partner.region}</span>
                                                  </div>
                                              </TableCell>
                                              <TableCell>
                                                  <Badge className={getRoleColor(partner.role)}>
                                                      {partner.role}
                                                  </Badge>
                                              </TableCell>
                                              <TableCell>
                                                  <Badge className={getTypeColor(partner.type)}>
                                                      {partner.type === "funding" ? "Funding" : "Implementation"}
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
