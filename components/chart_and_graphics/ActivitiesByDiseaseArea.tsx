"use client";

import { useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend, LabelList } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const data = [
    { name: "Hypertension", value: 980 },
    { name: "Diabetes Mellitus", value: 832 },
    { name: "Breast Cancer", value: 234 },
    { name: "Cervical Cancer", value: 273 },
    { name: "Mental Health", value: 100 },
    { name: "Childhood Cancers", value: 50 },
    { name: "Prostate Cancer", value: 500 },
    { name: "Road Accidents", value: 129 },
    { name: "Domestic Injuries", value: 30 },
    { name: "Childhood Cancers (Dup)", value: 10 },
    { name: "COPD & Asthma", value: 60 },
    { name: "Sickle Cell Disease", value: 901 },
    { name: "CVD & Stroke", value: 875 },
    { name: "All NCDs (General)", value: 89 },
    { name: "Other NCDs", value: 89 }
];

const totalActivities = data.reduce((sum, item) => sum + item.value, 0);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    
    const value = payload[0].value;
    const percentage = (value / totalActivities * 100).toFixed(1);
    
    return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 animate-in fade-in duration-200">
            <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <p className="text-indigo-600 font-semibold">
                        {new Intl.NumberFormat().format(value)}
                    </p>
                </div>
                <div className="flex items-center gap-2 pl-4">
                    <p className="text-gray-500 text-sm">
                        {percentage}% of total
                    </p>
                </div>
            </div>
        </div>
    );
};

const ActivitiesByDieseaseArea = () => {
    const [sortedData, setSortedData] = useState(data);
    
    const handleSort = useCallback(() => {
        setSortedData([...sortedData].sort((a, b) => b.value - a.value));
    }, [sortedData]);

    const average = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;

    const handleBarClick = (entry: any) => {
        console.log('Selected:', entry);
        // Add your click handler logic here
    };

    return (
        <Card className="p-4">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handleSort}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    Sort by Value
                </button>
            </div>
            <CardContent className="h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={sortedData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4F46E5" />
                                <stop offset="100%" stopColor="#818CF8" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                            type="number" 
                            stroke="#6b7280"
                            tickFormatter={(value) => new Intl.NumberFormat().format(value)}
                        />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={190}
                            stroke="#6b7280"
                            fontSize={13}
                            tick={{
                                fill: '#374151',
                                textAnchor: 'end',
                                width: 190,
                            }}
                            tickMargin={4}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="top"
                            align="right"
                            wrapperStyle={{ paddingBottom: '20px' }}
                        />
                        <ReferenceLine
                            x={average}
                            stroke="#EA580C"
                            strokeDasharray="3 3"
                            label={{
                                position: 'right',
                                value: `Avg: ${Math.round(average)}`,
                                fill: '#EA580C',
                                fontSize: 12
                            }}
                        />
                        <Bar 
                            name="Number of Activities"
                            dataKey="value" 
                            fill="url(#barGradient)"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                            onClick={handleBarClick}
                            animationDuration={1000}
                            animationBegin={200}
                        >
                            <LabelList
                                dataKey="value"
                                position="right"
                                formatter={(value: number) => new Intl.NumberFormat().format(value)}
                                style={{ fill: '#6b7280', fontSize: '12px' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ActivitiesByDieseaseArea;
