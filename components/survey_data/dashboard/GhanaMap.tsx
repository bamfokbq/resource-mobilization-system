"use client"

import React from 'react'
import dynamic from 'next/dynamic';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
];

export default function GhanaMap() {
  const LandingPageMapComponent = React.useMemo(() => {
    return dynamic(
      () => import('./OutbreakOverviewMap'),
      {
        loading: () => <p>Loading Map...</p>,
        ssr: false
      }
    );
  }, []);

  return (
    <section className='my-8'>
      <div className='min-h-[90vh] overflow-hidden flex gap-5 bg-white rounded-2xl'>
        <div className='flex-1'>
          <LandingPageMapComponent />
        </div>
        <div className='flex-1 h-full p-6 bg-gray-50 overflow-y-auto'>
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-medium text-gray-800'>Analytics Overview</h2>
              <p className='text-sm text-gray-500'>Statistical data visualization</p>
            </div>

            <div className='grid gap-8'>
              <div className='bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
                <div className='mb-4'>
                  <h3 className='text-lg text-gray-700'>Monthly Trends</h3>
                  <p className='text-xs text-gray-400'>Distribution over time</p>
                </div>
                <div className='h-[200px] flex items-center justify-center'>
                  <BarChart width={400} height={200} data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        color: '#1e293b'
                      }}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </div>
              </div>

              <div className='bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
