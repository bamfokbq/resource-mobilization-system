'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { UnifiedFilterBar } from '@/components/shared/UnifiedFilterBar'
import { AddEditActivityModal } from '@/components/shared/AddEditActivityModal'
import { Activity } from '@/types/activities'
import { ExportService, FIELD_MAPPINGS } from '@/lib/exportService'
import { useUrlFilters, applyFilters } from '@/hooks/useUrlFilters'
import GeneralChart from '@/components/chart_and_graphics/GeneralChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  BarChart3Icon, 
  TableIcon, 
  EyeIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  TrendingUpIcon, 
  HeartHandshakeIcon,
  Activity as ActivityIcon,
  Users,
  Building,
  BarChart,
  Download
} from 'lucide-react'
import { toast } from 'sonner'
import { auth } from '@/auth'

// Disease activity data with detailed information
const diseaseActivities = [
    {
        disease: "Hypertension",
        totalActivities: 24,
        activities: [
            { 
              id: "1", 
              name: "Community Blood Pressure Screening", 
              region: "Greater Accra", 
              implementer: "Ghana Health Service", 
              status: "ongoing", 
              timeline: "2023-2025", 
              coverage: "85%", 
              partners: ["WHO", "Local Clinics"],
              startDate: "2023-01-15",
              endDate: "2025-12-31",
              ageGroup: "18-49",
              targetPopulation: "Adults with high blood pressure risk",
              description: "Community-based blood pressure screening and monitoring program",
              expectedOutcomes: "Reduce undiagnosed hypertension by 30%"
            },
            { 
              id: "2", 
              name: "Hypertension Management Training", 
              region: "Ashanti", 
              implementer: "Kumasi Medical Center", 
              status: "completed", 
              timeline: "2022-2023", 
              coverage: "92%", 
              partners: ["USAID", "Medical Schools"],
              startDate: "2022-06-01",
              endDate: "2023-05-31",
              ageGroup: "All Ages",
              targetPopulation: "Healthcare workers",
              description: "Training program for healthcare workers on hypertension management",
              expectedOutcomes: "Improve treatment protocols and patient outcomes"
            },
            { 
              id: "3", 
              name: "Mobile Health Monitoring", 
              region: "Western", 
              implementer: "Regional Health Directorate", 
              status: "ongoing", 
              timeline: "2023-2024", 
              coverage: "67%", 
              partners: ["Gates Foundation"],
              startDate: "2023-03-01",
              endDate: "2024-12-31",
              ageGroup: "50-69",
              targetPopulation: "Rural elderly population",
              description: "Mobile health units providing monitoring services",
              expectedOutcomes: "Increase access to monitoring in rural areas"
            },
            { 
              id: "4", 
              name: "Community Health Worker Program", 
              region: "Northern", 
              implementer: "Local NGOs", 
              status: "ongoing", 
              timeline: "2023-2025", 
              coverage: "78%", 
              partners: ["WHO", "Community Groups"],
              startDate: "2023-01-01",
              endDate: "2025-12-31",
              ageGroup: "All Ages",
              targetPopulation: "Rural communities",
              description: "Training and deploying community health workers",
              expectedOutcomes: "Improve community-level health awareness"
            }
        ]
    },
    {
        disease: "Diabetes",
        totalActivities: 18,
        activities: [
            { 
              id: "6", 
              name: "Diabetes Prevention Program", 
              region: "Greater Accra", 
              implementer: "Private Clinics", 
              status: "ongoing", 
              timeline: "2023-2025", 
              coverage: "73%", 
              partners: ["Pharma Companies", "WHO"],
              startDate: "2023-02-01",
              endDate: "2025-12-31",
              ageGroup: "18-49",
              targetPopulation: "Pre-diabetic adults",
              description: "Prevention program targeting high-risk individuals",
              expectedOutcomes: "Reduce diabetes incidence by 25%"
            },
            { 
              id: "7", 
              name: "Glucose Monitoring Initiative", 
              region: "Central", 
              implementer: "Regional NGOs", 
              status: "ongoing", 
              timeline: "2023-2024", 
              coverage: "81%", 
              partners: ["Local Government"],
              startDate: "2023-04-01",
              endDate: "2024-12-31",
              ageGroup: "50-69",
              targetPopulation: "Diabetic patients",
              description: "Regular glucose monitoring and management",
              expectedOutcomes: "Improve glycemic control in patients"
            }
        ]
    },
    {
        disease: "Cardiovascular Disease",
        totalActivities: 45,
        activities: [
            { 
              id: "10", 
              name: "Heart Health Awareness", 
              region: "Ashanti", 
              implementer: "Medical Centers", 
              status: "ongoing", 
              timeline: "2023-2024", 
              coverage: "77%", 
              partners: ["Cardiologist Society"],
              startDate: "2023-01-15",
              endDate: "2024-12-31",
              ageGroup: "18-49",
              targetPopulation: "Working adults",
              description: "Awareness campaign on cardiovascular health",
              expectedOutcomes: "Increase awareness and early detection"
            }
        ]
    },
    {
        disease: "Cancer",
        totalActivities: 34,
        activities: [
            { 
              id: "13", 
              name: "Breast Cancer Screening", 
              region: "Greater Accra", 
              implementer: "Cancer Centers", 
              status: "ongoing", 
              timeline: "2023-2025", 
              coverage: "69%", 
              partners: ["Cancer Society", "WHO"],
              startDate: "2023-01-01",
              endDate: "2025-12-31",
              ageGroup: "50-69",
              targetPopulation: "Women aged 40-70",
              description: "Regular breast cancer screening program",
              expectedOutcomes: "Early detection and improved survival rates"
            }
        ]
    }
]



export default function DiseasesWithFilters() {
    const [isMounted, setIsMounted] = useState(false)
    const [drillDownDisease, setDrillDownDisease] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const [chartRef, setChartRef] = useState<HTMLDivElement | null>(null)
    
    // Get user session to check permissions
    const [userRole, setUserRole] = useState<string | null>(null)

    const { filters, updateFilter, clearAllFilters } = useUrlFilters()

    useEffect(() => {
        setIsMounted(true)
        // In a real app, you'd get this from your auth context
        // For now, we'll assume the user has admin rights for demo
        setUserRole('Admin')
    }, [])

    // Flatten all activities for filtering
    const allActivities = useMemo(() => {
        return diseaseActivities.flatMap(disease =>
            disease.activities.map(activity => ({
                ...activity,
                disease: disease.disease
            }))
        )
    }, [])

    // Apply URL filters to activities
    const filteredActivities = useMemo(() => {
        if (!filters) return allActivities

        return applyFilters(allActivities, filters, {
            disease: 'disease',
            status: 'status',
            ageGroup: 'ageGroup',
            implementer: 'implementer'
        })
    }, [allActivities, filters])

    // Get chart data based on filtered activities
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

    // Filter options for the filter bar
    const filterOptions = useMemo(() => ({
        regions: [], // Removed region filter
        organizations: [], // Removed organization filter
        diseases: [...new Set(allActivities.map(a => a.disease))],
        statuses: [...new Set(allActivities.map(a => a.status))],
        ageGroups: [...new Set(allActivities.map(a => a.ageGroup))],
        implementers: [...new Set(allActivities.map(a => a.implementer))]
    }), [allActivities])

    const handleBarClick = (data: any) => {
        updateFilter('disease', data.name)
        setDrillDownDisease(data.name)
    }

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
            // In a real app, this would make an API call
            console.log('Saving activity:', activityData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            toast.success(
                selectedActivity ? 'Activity updated successfully!' : 'Activity created successfully!',
                {
                    description: `${activityData.name} has been saved.`
                }
            )
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
                filename: 'ncd_activities',
                title: 'NCD Activities Report',
                customFields: {
                    'Total Activities': filteredActivities.length.toString(),
                    'Filters Applied': Object.entries(filters).filter(([k, v]) => v && v !== 'all').length.toString()
                }
            })
        } catch (error) {
            console.error('Export error:', error)
        }
    }

    const handleExportPDF = async () => {
        try {
            const exportData = ExportService.formatDataForExport(
                filteredActivities,
                FIELD_MAPPINGS.activities
            )
            
            await ExportService.exportToPDF(exportData, {
                filename: 'ncd_activities',
                title: 'NCD Activities Report',
                subtitle: 'Disease Activity Analysis'
            })
        } catch (error) {
            console.error('Export error:', error)
        }
    }

    const handleDownloadVisualization = async () => {
        if (chartRef) {
            try {
                await ExportService.exportChartAsImage(chartRef, {
                    filename: 'ncd_activities_chart',
                    title: 'NCD Activities Distribution'
                })
            } catch (error) {
                console.error('Chart export error:', error)
            }
        }
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'planned':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
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

    if (!isMounted) {
        return (
            <div className="p-6 space-y-6">
                <div className="bg-white rounded-2xl p-6 border shadow-sm">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Unified Filter Bar */}
            <UnifiedFilterBar
                options={filterOptions}
                showAddButton={userRole === 'Admin'}
                showExportButtons={true}
                showVisualizationDownload={true}
                onAddClick={handleAddActivity}
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                onDownloadVisualization={handleDownloadVisualization}
                title="Disease Activity Filters"
            />

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold">{filteredActivities.length}</div>
                                <div className="text-blue-100 mt-1 font-medium">Total Activities</div>
                                <div className="text-xs text-blue-200 mt-2">Across all diseases</div>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <ActivityIcon className="h-8 w-8" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold">
                                    {filteredActivities.filter(a => a.status === 'ongoing').length}
                                </div>
                                <div className="text-green-100 mt-1 font-medium">Ongoing</div>
                                <div className="text-xs text-green-200 mt-2">Active programs</div>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <TrendingUpIcon className="h-8 w-8" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold">
                                    {[...new Set(filteredActivities.map(a => a.region))].length}
                                </div>
                                <div className="text-purple-100 mt-1 font-medium">Regions</div>
                                <div className="text-xs text-purple-200 mt-2">Geographic coverage</div>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <MapPinIcon className="h-8 w-8" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold">
                                    {[...new Set(filteredActivities.map(a => a.implementer))].length}
                                </div>
                                <div className="text-orange-100 mt-1 font-medium">Partners</div>
                                <div className="text-xs text-orange-200 mt-2">Implementation partners</div>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Building className="h-8 w-8" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="chart" className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <TabsList className="grid w-full lg:w-auto grid-cols-2">
                        <TabsTrigger value="chart" className="flex items-center gap-2">
                            <BarChart3Icon className="w-4 h-4" />
                            Chart View
                        </TabsTrigger>
                        <TabsTrigger value="table" className="flex items-center gap-2">
                            <TableIcon className="w-4 h-4" />
                            Table View
                        </TabsTrigger>
                    </TabsList>

                    {filteredChartData.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        >
                            Clear Filters ({Object.keys(filters).filter(k => filters[k] && filters[k] !== 'all').length})
                        </Button>
                    )}
                </div>

                {/* Chart Tab */}
                <TabsContent value="chart">
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
                        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <BarChart3Icon className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-xl">Disease Activity Distribution</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div ref={setChartRef}>
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
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TableIcon className="w-5 h-5 text-indigo-600" />
                                Activity Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold">Activity</TableHead>
                                            <TableHead className="font-semibold">Disease</TableHead>
                                            <TableHead className="font-semibold">Region</TableHead>
                                            <TableHead className="font-semibold">Implementer</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Coverage</TableHead>
                                            <TableHead className="font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredActivities.map((activity) => (
                                            <TableRow key={activity.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">
                                                    <div className="max-w-xs">
                                                        <div className="font-semibold text-gray-900">{activity.name}</div>
                                                        <div className="text-sm text-gray-500 truncate">{activity.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">
                                                        {activity.disease}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">{activity.region}</TableCell>
                                                <TableCell className="text-sm text-gray-600">{activity.implementer}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getStatusBadgeColor(activity.status)}>
                                                        {activity.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {activity.coverage && (
                                                        <Badge variant="outline" className={getCoverageBadgeColor(activity.coverage)}>
                                                            {activity.coverage}
                                                        </Badge>
                                                    )}
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
                                                                    <DialogTitle>{activity.name}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <strong>Disease:</strong> {activity.disease}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Region:</strong> {activity.region}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Implementer:</strong> {activity.implementer}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Status:</strong> {activity.status}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Coverage:</strong> {activity.coverage}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Age Group:</strong> {activity.ageGroup}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <strong>Description:</strong>
                                                                        <p className="mt-1">{activity.description}</p>
                                                                    </div>
                                                                    <div>
                                                                        <strong>Expected Outcomes:</strong>
                                                                        <p className="mt-1">{activity.expectedOutcomes}</p>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        
                                                        {userRole === 'Admin' && (
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => handleEditActivity(activity)}
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
                </TabsContent>
            </Tabs>

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
        </div>
    )
}
