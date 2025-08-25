"use client";

import { useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend, LabelList } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface DataItem {
    name: string;
    value: number;
}

interface VerticalBarchartProps {
    data: DataItem[];
    name: string;
}

const formatValue = (value: number) => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
};

const CustomTooltip = ({ active, payload, label, totalActivities }: any) => {
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
                        {formatValue(value)}
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

const VerticalBarchart = ({ data, name }: VerticalBarchartProps) => {
    const [sortedData, setSortedData] = useState(data);
    const totalActivities = data.reduce((sum, item) => sum + item.value, 0);
    
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
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200 cursor-pointer"
                >
                    Sort by Value
                </button>
            </div>
            <CardContent className="h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={sortedData}
                        margin={{ top: 10, right: 50, left: 0, bottom: 10 }}
                        style={{ cursor: 'default' }}
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
                            tickFormatter={(value) => formatValue(value)}
                        />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={190}
                            stroke="#6b7280"
                            fontSize={13}
                            tick={({ x, y, payload }) => (
                                <g transform={`translate(${x},${y})`}>
                                    <foreignObject width="180" height="30" x="-185" y="-15">
                                        <div className="h-full flex items-center">
                                            <span className="px-3 py-1 bg-gray-50 rounded-full text-gray-700 text-sm truncate">
                                                {payload.value}
                                            </span>
                                        </div>
                                    </foreignObject>
                                </g>
                            )}
                        />
                        <Tooltip content={<CustomTooltip totalActivities={totalActivities} />} />
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
                                value: `Avg: ${formatValue(Math.round(average))}`,
                                fill: '#EA580C',
                                fontSize: 12
                            }}
                        />
                        <Bar 
                            name={name}
                            dataKey="value" 
                            fill="url(#barGradient)"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                            onClick={handleBarClick}
                            animationDuration={1000}
                            animationBegin={200}
                            cursor="pointer"
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
                        >
                            <LabelList
                                dataKey="value"
                                position="right"
                                formatter={(value: any) => {
                                    const numValue = typeof value === 'number' ? value : Number(value);
                                    return formatValue(numValue);
                                }}
                                style={{ fill: '#6b7280', fontSize: '12px' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default VerticalBarchart;
