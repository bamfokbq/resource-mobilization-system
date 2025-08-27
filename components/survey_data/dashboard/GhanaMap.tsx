"use client"

import React from 'react'
import dynamic from 'next/dynamic';
import YearlyStatisticBarchart from '@/components/chart_and_graphics/YearlyStatisticBarchart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';
import { 
  MapPin, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Globe,
  Loader2
} from 'lucide-react';
import { DASHBOARD_STATS } from '@/data/survey-mock-data';

export default function GhanaMap() {
  const LandingPageMapComponent = React.useMemo(() => {
    return dynamic(
      () => import('./ActivitiesByRegionMap'),
      {
        loading: () => (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <Globe className="w-6 h-6 text-green-500 absolute top-3 left-1/2 transform -translate-x-1/2" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Loading Interactive Map</h3>
                <p className="text-sm text-gray-500">Preparing regional data visualization...</p>
              </div>
            </div>
          </div>
        ),
        ssr: false
      }
    );
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-fit">
      {/* Interactive Map Section */}
      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full shadow-xl border-0 bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Ghana Regional Map</CardTitle>
                <CardDescription className="text-blue-100">
                  Interactive visualization of health activities by region
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[400px] sm:h-[500px] lg:h-[600px]">
            <LandingPageMapComponent />
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Panel */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Quick Stats */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg">Regional Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{DASHBOARD_STATS.totalRegions}</div>
                <div className="text-xs text-blue-700">Regions</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{DASHBOARD_STATS.totalActivities}</div>
                <div className="text-xs text-green-700">Activities</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{DASHBOARD_STATS.totalOrganizations}</div>
                <div className="text-xs text-purple-700">Organizations</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{DASHBOARD_STATS.totalParticipants}</div>
                <div className="text-xs text-orange-700">Participants</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Analytics Overview</CardTitle>
            </div>
            <CardDescription>
              Detailed statistical analysis and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="statistics" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="statistics" className="text-xs">Statistics</TabsTrigger>
                <TabsTrigger value="trends" className="text-xs">Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="statistics" className="mt-4">
                <div className="space-y-4">
                  <YearlyStatisticBarchart />
                  
                  {/* Additional Statistics */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Data Completeness</span>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        94.2%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "94.2%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="mt-4">
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">Trend analysis coming soon</p>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Monthly Growth</p>
                        <p className="text-xs text-blue-700">Survey submissions</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">+23%</div>
                        <div className="flex items-center text-xs text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          vs last month
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-900">Regional Coverage</p>
                        <p className="text-xs text-green-700">Active regions</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">10/10</div>
                        <div className="text-xs text-green-600">100% coverage</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
