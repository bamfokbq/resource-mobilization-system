"use client";
import React, { useState, useCallback, FC, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'motion/react';
import { BarChart3Icon, TrendingUpIcon, CalendarIcon, SortAscIcon } from "lucide-react";
import { useProjectTimelineData } from '@/hooks/useSurveyData';

interface NumberOfProjectsChartProps {
  title?: string;
  description?: string;
  options?: { barColor?: string; grid?: boolean };
}

const NumberOfProjects: FC<NumberOfProjectsChartProps> = ({ title, description, options }) => {
  const { data: projectData, isLoading, error } = useProjectTimelineData()
  const [chartData, setChartData] = useState<{ Year: number; "Number of Projects": number }[]>([]);

  const computedData = useMemo(() => {
    if (!projectData || projectData.length === 0) {
      return {
        data: [],
        totalValue: 0,
        average: 0,
        maxYear: { Year: 0, "Number of Projects": 0 },
        minYear: { Year: 0, "Number of Projects": 0 }
      }
    }

    const totalValue = projectData.reduce((sum, item) => sum + (item["Number of Projects"] || 0), 0)
    const average = totalValue / projectData.length
    const maxYear = projectData.reduce((max, item) => (item["Number of Projects"] || 0) > (max["Number of Projects"] || 0) ? item : max)
    const minYear = projectData.reduce((min, item) => (item["Number of Projects"] || 0) < (min["Number of Projects"] || 0) ? item : min)

    return {
      data: projectData,
      totalValue,
      average,
      maxYear,
      minYear
    }
  }, [projectData])

  // Update chartData when computedData changes
  useEffect(() => {
    setChartData(computedData.data)
  }, [computedData.data])

  const handleSort = useCallback(() => {
    setChartData([...chartData].sort((a, b) => b["Number of Projects"] - a["Number of Projects"]));
  }, [chartData]);

  const handleReset = useCallback(() => {
    setChartData([...computedData.data].sort((a, b) => a.Year - b.Year));
  }, [computedData.data]);

  if (isLoading) {
    return (
      <motion.section 
        id="projects" 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6">
          <div className="h-8 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="h-4 bg-white/20 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/10 rounded-lg p-4 h-20 animate-pulse"></div>
            ))}
          </div>
        </div>
        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          <div className="h-96 bg-gray-200 animate-pulse"></div>
        </Card>
      </motion.section>
    )
  }

  if (error || !projectData) {
    return (
      <motion.section 
        id="projects" 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center py-8">
          <p className="text-red-500">Error loading project data: {error}</p>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section 
      id="projects" 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2'>{title || "Project Timeline Analysis"}</h1>
            <p className='text-blue-100 text-sm sm:text-base lg:text-lg'>
              {description || "Yearly distribution of NCD-related projects and initiatives"}
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Total Projects</span>
            </div>
            <div className="text-2xl font-bold">{computedData.totalValue}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3Icon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Average/Year</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(computedData.average)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Peak Year</span>
            </div>
            <div className="text-lg font-bold">{computedData.maxYear.Year}</div>
            <div className="text-blue-200 text-sm">{computedData.maxYear["Number of Projects"]} projects</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Lowest Year</span>
            </div>
            <div className="text-lg font-bold">{computedData.minYear.Year}</div>
            <div className="text-blue-200 text-sm">{computedData.minYear["Number of Projects"]} projects</div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3Icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Project Distribution by Year</CardTitle>
                <CardDescription className="text-indigo-100">
                  Interactive visualization of project counts across different years
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleSort}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <SortAscIcon className="w-4 h-4 mr-2" />
                Sort by Value
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Reset to Timeline
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Chart Section */}
            <motion.div 
              className="xl:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="h-[400px] sm:h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 10, left: 40, bottom: 20 }}
                  >
                    {(options?.grid !== false) && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                    <XAxis dataKey="Number of Projects" stroke="#6b7280" />
                    <YAxis
                      dataKey="Year"
                      stroke="#6b7280"
                      type="category"
                      interval={0}
                      width={50}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value} Projects`, "Projects"]}
                      labelFormatter={(label: string) => `Year: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                    <ReferenceLine 
                      x={computedData.average} 
                      stroke="#EA580C" 
                      strokeDasharray="3 3" 
                      label={{ 
                        position: 'top', 
                        value: `Avg: ${Math.round(computedData.average)}`, 
                        fill: '#EA580C', 
                        fontSize: 12 
                      }} 
                    />
                    <Bar 
                      dataKey="Number of Projects" 
                      fill={options?.barColor || "#4F46E5"} 
                      radius={[0, 4, 4, 0]}
                      name="Projects"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            {/* Project Summary */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4 border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Year Breakdown</h3>
                <div className="space-y-3">
                  {computedData.data.map((year) => (
                    <div key={year.Year} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {year.Year}
                        </span>
                      </div>
                      <Badge 
                        variant={year["Number of Projects"] === computedData.maxYear["Number of Projects"] ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {year["Number of Projects"]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border">
                <h4 className="font-semibold text-gray-800 mb-2">Timeline Insights</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Peak activity in {computedData.maxYear.Year} with {computedData.maxYear["Number of Projects"]} projects</li>
                  <li>• {computedData.data.filter(y => y["Number of Projects"] >= computedData.average).length} years above average</li>
                  <li>• Total span: {computedData.data.length > 0 ? Math.max(...computedData.data.map(d => d.Year)) - Math.min(...computedData.data.map(d => d.Year)) + 1 : 0} years of data</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default NumberOfProjects;