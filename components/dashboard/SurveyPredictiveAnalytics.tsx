"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Brush,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Target, TrendingUp, Clock } from 'lucide-react';

interface PredictionData {
  date: string;
  actual: number | null;
  predicted: number;
  confidence: {
    lower: number;
    upper: number;
  };
  target: number;
}

interface Milestone {
  date: string;
  label: string;
  value: number;
}

interface SurveyPredictiveAnalyticsProps {
  predictionData: PredictionData[];
  milestones: Milestone[];
  projectedCompletion: number;
  timeToTarget: number;
  confidenceLevel: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 min-w-[200px]">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          if (entry.dataKey === 'confidence') return null;
          return (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${typeof entry.value === 'number' ? '%' : ''}`}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function SurveyPredictiveAnalytics({
  predictionData,
  milestones,
  projectedCompletion,
  timeToTarget,
  confidenceLevel
}: SurveyPredictiveAnalyticsProps) {
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Key Predictions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Projected Completion</p>
                <p className="text-3xl font-bold text-blue-900">{projectedCompletion}%</p>
                <p className="text-xs text-blue-700">By target date</p>
              </div>
              <Target className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Time to Target</p>
                <p className="text-3xl font-bold text-green-900">{timeToTarget}</p>
                <p className="text-xs text-green-700">Days remaining</p>
              </div>
              <Clock className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Confidence Level</p>
                <p className="text-3xl font-bold text-purple-900">{confidenceLevel}%</p>
                <p className="text-xs text-purple-700">Prediction accuracy</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Next Milestone</p>
                <p className="text-lg font-bold text-orange-900">
                  {milestones.length > 0 ? milestones[0].label : 'None'}
                </p>
                <p className="text-xs text-orange-700">
                  {milestones.length > 0 ? formatDate(milestones[0].date) : 'No upcoming'}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics Chart */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Survey Completion Forecast
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Predictive analysis with confidence intervals and milestone tracking
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={predictionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                tickFormatter={formatDate}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Confidence Interval Area */}
              <Area
                type="monotone"
                dataKey="confidence.upper"
                stackId="1"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={0.3}
                name="Confidence Range"
              />
              <Area
                type="monotone"
                dataKey="confidence.lower"
                stackId="1"
                stroke="none"
                fill="#fff"
                name=""
              />
              
              {/* Target Line */}
              <Line
                type="monotone"
                dataKey="target"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="8 8"
                dot={false}
                name="Target"
              />
              
              {/* Actual Progress */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Actual Progress"
              />
              
              {/* Predicted Progress */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#3B82F6"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Predicted Progress"
              />
              
              {/* Current Date Reference Line */}
              <ReferenceLine 
                x={currentDate} 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ value: "Today", position: "top" }}
              />
              
              {/* Milestone Markers */}
              {milestones.map((milestone, index) => (
                <ReferenceLine
                  key={index}
                  x={milestone.date}
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  label={{ 
                    value: milestone.label, 
                    position: "top",
                    className: "text-xs font-medium"
                  }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
          <Brush dataKey="date" height={30} stroke="#8B5CF6" />
        </CardContent>
      </Card>

      {/* Milestone Timeline */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Upcoming Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800">{milestone.label}</h4>
                  <p className="text-gray-600">Target: {milestone.value}% completion</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{formatDate(milestone.date)}</p>
                  <p className="text-xs text-gray-500">
                    {Math.ceil((new Date(milestone.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            ))}
            {milestones.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No upcoming milestones defined</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
