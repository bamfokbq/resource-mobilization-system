import { YEARLY_DATA } from '@/constant';
import React from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

interface DataItem {
    name: string;
    value: number;
}

const formatValue = (value: number) => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 animate-in fade-in duration-200">
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
      <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <p className="text-indigo-600 font-semibold">
                  {formatValue(payload[0].value)}
        </p>
      </div>
    </div>
  );
};

const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
];

export default function YearlyStatisticBarchart() {
  return (
    <div className='grid gap-8'>
          <Card className="p-4">
              <div className="mb-4">
                  <h3 className='text-lg font-medium text-gray-700'>Yearly Trends</h3>
                  <p className='text-sm text-gray-500'>Distribution over time</p>
              </div>
              <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={YEARLY_DATA}>
                          <defs>
                              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#4F46E5" />
                                  <stop offset="100%" stopColor="#818CF8" />
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                              dataKey="name"
                              stroke="#6b7280"
                              fontSize={13}
                          />
                          <YAxis
                              stroke="#6b7280"
                              tickFormatter={formatValue}
                              fontSize={13}
                          />
                          <Tooltip
                              content={<CustomBarTooltip />}
                              cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                          />
                          <Bar
                              dataKey="value"
                              fill="url(#barGradient)"
                              radius={[4, 4, 0, 0]}
                              animationDuration={1000}
                              animationBegin={200}
                              onMouseEnter={(data, index) => {
                                  const element = document.querySelector(`path[index="${index}"]`) as HTMLElement;
                                  if (element) {
                                      element.style.filter = 'brightness(0.9)';
                                  }
                              }}
                              onMouseLeave={(data, index) => {
                                  const element = document.querySelector(`path[index="${index}"]`) as HTMLElement;
                                  if (element) {
                                      element.style.filter = 'none';
                                  }
                              }}
                          />
                      </BarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>

          <Card className="p-4">
              <div className="mb-4">
                  <h3 className='text-lg font-medium text-gray-700'>Distribution</h3>
                  <p className='text-sm text-gray-500'>Category breakdown</p>
              </div>
              <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="url(#pieGradient)"
                              dataKey="value"
                              label
                          />
                          <Tooltip
                              contentStyle={{
                                  backgroundColor: '#ffffff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                  color: '#1e293b'
                              }}
                          />
                          <defs>
                              <linearGradient id="pieGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#4F46E5" />
                                  <stop offset="100%" stopColor="#818CF8" />
                              </linearGradient>
                          </defs>
                      </PieChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>
  );
}
