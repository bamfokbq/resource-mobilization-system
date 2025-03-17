"use client";

import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Line, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';
import healthData from '@/constant/health_data.json';

// Define types for our data
type DiseaseData = {
  [key: string]: number | null;
};

type HealthData = {
  [region: string]: DiseaseData;
};

type ChartDataPoint = {
  name: string;
  value: number;
};

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1',
  '#83a6ed', '#b393f0', '#e57373', '#F39C12', '#67c6be'
];

// Fix the type casting for healthData
const typedHealthData = healthData as HealthData;

export default function NcdStats() {
  const [selectedRegion, setSelectedRegion] = useState('Ghana');
  const [selectedDisease, setSelectedDisease] = useState('All');
  const [chartView, setChartView] = useState('bar'); // Add state for chart type toggle

  // Get all regions and diseases
  const regions = Object.keys(healthData);
  const diseases = useMemo(() => {
    return Object.keys(healthData.Ghana).filter(disease => disease !== 'Chronic Kidney Disease_NCD');
  }, []);

  // Prepare data for national overview
  const nationalOverviewData = useMemo(() => {
    return diseases.map(disease => ({
      name: disease,
      value: healthData.Ghana[disease as keyof typeof healthData.Ghana] ? Number(healthData.Ghana[disease as keyof typeof healthData.Ghana]) : 0
    })).sort((a, b) => b.value - a.value);
  }, [diseases]);

  // Prepare data for regional comparison for selected disease
  const regionalComparisonData = useMemo(() => {
    if (selectedDisease === 'All') {
      return regions
        .filter(region => region !== 'Ghana')
        .map(region => {
          const totalCases = diseases.reduce((sum, disease) => {
            const value = typedHealthData[region]?.[disease];
            return sum + (value ? Number(value) : 0);
          }, 0);
          return { name: region, value: totalCases };
        })
        .sort((a, b) => b.value - a.value);
    }

    return regions
      .filter(region => region !== 'Ghana')
      .map(region => {
        // Fixed access pattern
        const value = typedHealthData[region]?.[selectedDisease];
        return {
          name: region,
          value: value ? Number(value) : 0
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [selectedDisease, regions, diseases]);

  // Prepare data for disease breakdown in selected region
  const diseaseBreakdownData = useMemo(() => {
    return diseases
      .map(disease => {
        // Fixed access pattern
        const value = typedHealthData[selectedRegion]?.[disease];
        return {
          name: disease,
          value: value ? Number(value) : 0
        };
      })
      .filter(item => item.value > 0) // Only show diseases with values
      .sort((a, b) => b.value - a.value);
  }, [selectedRegion, diseases]);

  // Prepare data for radar chart comparing top regions for each disease
  const radarData = useMemo(() => {
    const topRegionsForDiseases: Record<string, { region: string; value: number }[]> = {};

    diseases.forEach(disease => {
      const regionValues = regions
        .filter(region => region !== 'Ghana')
        .map(region => {
          // Fixed access pattern
          const value = typedHealthData[region]?.[disease];
          return {
            region,
            value: value ? Number(value) : 0
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      topRegionsForDiseases[disease] = regionValues;
    });

    return diseases.map(disease => {
      const dataPoint: Record<string, string | number> = { disease };
      topRegionsForDiseases[disease].forEach(item => {
        if (item.value > 0) {
          dataPoint[item.region] = item.value;
        }
      });
      return dataPoint;
    });
  }, [regions, diseases]);

  // Custom label renderer for pie chart to prevent text overlap
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
      >
        {name.length > 15 ? name.substring(0, 15) + '...' : name} ({(percent * 100).toFixed(1)}%)
      </text>
    );
  };

  // Simplified data for charts
  const simplifiedNationalData = useMemo(() => {
    return nationalOverviewData.slice(0, 10); // Only show top 10 for readability
  }, [nationalOverviewData]);

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border shadow rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-medium">{payload[0].name}: </span>
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Get safe value for stats
  const getSafeValue = (key: string): number => {
    const value = typedHealthData.Ghana[key];
    return value ? Number(value) : 0;
  };

  // Calculate total cancer cases safely
  const totalCancerCases =
    getSafeValue("Breast Cancer") +
    getSafeValue("Cervical Cancer") +
    getSafeValue("Prostate Cancer") +
    getSafeValue("Lymphoma");

  return (
    <div className="w-full container mx-auto p-4 md:p-10 my-10 md:my-20 overflow-hidden py-8 px-4 rounded-lg bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">Ghana Health Services NCD Dashboard</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div className="flex gap-2 items-center">
          <label className="font-medium">Region:</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border rounded p-2"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="font-medium">Disease:</label>
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            className="border rounded p-2"
          >
            <option value="All">All Diseases</option>
            {diseases.map(disease => (
              <option key={disease} value={disease}>{disease}</option>
            ))}
          </select>
        </div>

        {/* Add chart type selection */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Chart Type:</label>
          <div className="flex rounded-md border overflow-hidden">
            <button
              className={`px-3 py-2 text-sm ${chartView === 'bar' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={() => setChartView('bar')}
            >
              Bar
            </button>
            <button
              className={`px-3 py-2 text-sm ${chartView === 'pie' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={() => setChartView('pie')}
            >
              Pie
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="my-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "Total Hypertension Cases",
            value: getSafeValue("Hypertension").toLocaleString(),
            color: "bg-blue-100 text-blue-800",
            icon: "🫀"
          },
          {
            title: "Total Diabetes Cases",
            value: getSafeValue("Diabetes Mellitus").toLocaleString(),
            color: "bg-green-100 text-green-800",
            icon: "💉"
          },
          {
            title: "Total Cancer Cases",
            value: totalCancerCases.toLocaleString(),
            color: "bg-red-100 text-red-800",
            icon: "🔬"
          },
          {
            title: "Total Stroke Cases",
            value: getSafeValue("Stroke").toLocaleString(),
            color: "bg-purple-100 text-purple-800",
            icon: "🧠"
          }
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} p-4 rounded-lg shadow-sm flex items-center`}>
            <div className="text-3xl mr-3">{stat.icon}</div>
            <div>
              <h3 className="font-medium text-sm">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* National Overview - Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">National Disease Overview</h2>
          <p className="text-sm text-gray-500 mb-2">Showing top 10 diseases by prevalence</p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={simplifiedNationalData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatNumber} />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8">
                {simplifiedNationalData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Disease Breakdown - Pie Chart with Toggle */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedRegion === 'Ghana' ? 'National' : selectedRegion} Disease Breakdown
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            {diseaseBreakdownData.length > 10 ? 'Showing top 10 diseases by prevalence' : 'Distribution of diseases'}
          </p>
          <ResponsiveContainer width="100%" height={400}>
            {chartView === 'pie' ? (
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={diseaseBreakdownData.slice(0, 10)}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  label={renderCustomizedLabel}
                  dataKey="value"
                >
                  {diseaseBreakdownData.slice(0, 10).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => value.toLocaleString()} />
              </PieChart>
            ) : (
              <BarChart
                data={diseaseBreakdownData.slice(0, 10)}
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatNumber} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8">
                  {diseaseBreakdownData.slice(0, 10).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
          {diseaseBreakdownData.length > 10 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              {diseaseBreakdownData.length - 10} more diseases not shown
            </p>
          )}
        </div>

        {/* Regional Comparison for Selected Disease */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedDisease === 'All' ? 'Total NCD Cases' : selectedDisease} by Region
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={regionalComparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-60}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8">
                {regionalComparisonData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="value" stroke="#ff7300" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Disease Distribution Analysis - Radar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top 5 Regions per Disease</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="disease"
                tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
              />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              {regions.filter(r => r !== 'Ghana').slice(0, 5).map((region, index) => (
                <Radar
                  key={region}
                  name={region}
                  dataKey={region}
                  stroke={COLORS[index]}
                  fill={COLORS[index]}
                  fillOpacity={0.3}
                />
              ))}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Data source: Ghana Health Services NCD Statistics</p>
      </div>
    </div>
  );
}
