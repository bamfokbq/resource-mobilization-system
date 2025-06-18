"use client";

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RegionMetric {
  region: string;
  surveys: number;
  completion: number;
  engagement: number;
  satisfaction: number;
  efficiency: number;
  impact: number;
}

interface SurveyEffort {
  complexity: number;
  completion: number;
  region: string;
  surveys: number;
}

interface RegionalInsightsProps {
  regionMetrics: RegionMetric[];
  effortData: SurveyEffort[];
}

const CustomRadarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{data.region}</p>
        <p className="text-sm text-blue-600">Complexity: {data.complexity}</p>
        <p className="text-sm text-green-600">Completion: {data.completion}%</p>
        <p className="text-sm text-purple-600">Total Surveys: {data.surveys}</p>
      </div>
    );
  }
  return null;
};

const getColorByCompletion = (completion: number) => {
  if (completion >= 80) return '#10B981'; // Green
  if (completion >= 60) return '#F59E0B'; // Yellow
  if (completion >= 40) return '#F97316'; // Orange
  return '#EF4444'; // Red
};

export default function RegionalInsights({ regionMetrics, effortData }: RegionalInsightsProps) {
  const topPerformingRegion = regionMetrics.reduce((prev, current) => 
    (prev.completion > current.completion) ? prev : current
  );

  const avgCompletion = regionMetrics.reduce((sum, region) => sum + region.completion, 0) / regionMetrics.length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-emerald-600 text-sm font-medium mb-2">Top Performing Region</p>
              <p className="text-2xl font-bold text-emerald-900">{topPerformingRegion.region}</p>
              <p className="text-sm text-emerald-700">{topPerformingRegion.completion}% completion</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-blue-600 text-sm font-medium mb-2">Active Regions</p>
              <p className="text-2xl font-bold text-blue-900">{regionMetrics.length}</p>
              <p className="text-sm text-blue-700">Across Ghana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-purple-600 text-sm font-medium mb-2">Average Completion</p>
              <p className="text-2xl font-bold text-purple-900">{avgCompletion.toFixed(1)}%</p>
              <p className="text-sm text-purple-700">Across all regions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance Radar */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Regional Performance Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={regionMetrics}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis 
                  dataKey="region" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                />
                <Radar
                  name="Completion Rate"
                  dataKey="completion"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Engagement Score"
                  dataKey="engagement"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Impact Score"
                  dataKey="impact"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Effort vs Completion Scatter */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Survey Complexity vs Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                data={effortData}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  type="number" 
                  dataKey="complexity" 
                  name="Complexity"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="completion" 
                  name="Completion %"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomScatterTooltip />} />
                <Scatter dataKey="surveys" name="Surveys">
                  {effortData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getColorByCompletion(entry.completion)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>High Completion (80%+)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>Medium Completion (60-79%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Low Completion (&lt;60%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
