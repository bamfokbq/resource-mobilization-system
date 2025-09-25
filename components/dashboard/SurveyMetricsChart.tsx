"use client";

import React, { useRef } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ExportService from '@/lib/exportService';

interface SurveyMetric {
  month: string;
  submitted: number;
  draft: number;
  total: number;
}

interface SurveyStatus {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // Index signature for recharts compatibility
}

interface SurveyMetricsChartProps {
  data: SurveyMetric[];
  statusData: SurveyStatus[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SurveyMetricsChart({ data, statusData }: SurveyMetricsChartProps) {
  const trendsChartRef = useRef<HTMLDivElement>(null);
  const statusChartRef = useRef<HTMLDivElement>(null);

  const exportTrendsChart = async () => {
    if (trendsChartRef.current) {
      try {
        await ExportService.exportChartAsImage(trendsChartRef.current, {
          filename: 'survey_trends_chart',
          title: 'Survey Activity Trends'
        });
      } catch (error) {
        console.error('Trends chart export error:', error);
      }
    }
  };

  const exportStatusChart = async () => {
    if (statusChartRef.current) {
      try {
        await ExportService.exportChartAsImage(statusChartRef.current, {
          filename: 'survey_status_chart',
          title: 'Survey Status Distribution'
        });
      } catch (error) {
        console.error('Status chart export error:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Survey Trends Chart */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Survey Activity Trends
            </CardTitle>
            <Button
              onClick={exportTrendsChart}
              variant="outline"
              size="sm"
              className="border-blue-200 hover:bg-blue-50 text-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={trendsChartRef}>
            <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="submittedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="draftGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="submitted" 
                fill="url(#submittedGradient)"
                name="Submitted"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="draft" 
                fill="url(#draftGradient)"
                name="Drafts"
                radius={[4, 4, 0, 0]}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Total"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#8B5CF6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Survey Status Distribution */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Survey Status Distribution
            </CardTitle>
            <Button
              onClick={exportStatusChart}
              variant="outline"
              size="sm"
              className="border-green-200 hover:bg-green-50 text-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={statusChartRef}>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={3}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
                        <p className="font-semibold text-gray-800">{data.name}</p>
                        <p className="text-sm" style={{ color: data.color }}>
                          Count: {data.value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
