import { YEARLY_DATA } from '@/constant';
import React from 'react'
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Add this new component
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 animate-in fade-in duration-200">
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-400" />
        <p className="text-slate-700 font-semibold">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default function YearlyStatisticBarchart() {
  return (
    <div className='grid gap-8'>
                  <div className='bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='mb-4'>
                      <h3 className='text-lg text-gray-700'>Monthly Trends</h3>
                      <p className='text-xs text-gray-400'>Distribution over time</p>
                    </div>
                    <div className='h-[200px] flex items-center justify-center'>
                      <BarChart width={400} height={200} data={YEARLY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
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
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </div>
                  </div>
    
                  {/* <div className='bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='mb-4'>
                      <h3 className='text-lg text-gray-700'>Distribution</h3>
                      <p className='text-xs text-gray-400'>Category breakdown</p>
                    </div>
                    <div className='h-[200px] flex items-center justify-center'>
                      <PieChart width={400} height={200}>
                        <Pie
                          data={pieData}
                          cx={200}
                          cy={100}
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
                            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                      </PieChart>
                    </div>
                  </div> */}
                </div>
  )
}
