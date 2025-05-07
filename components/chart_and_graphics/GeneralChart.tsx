"use client";

import { useState, useCallback, ReactNode } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend, LabelList } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// Define TypeScript interfaces for props
export interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: any; // Allow additional properties
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  totalValue: number;
  valueKey: string;
  tooltipFormatter?: (value: number) => string;
}

interface GeneralChartProps {
  data: ChartDataItem[];
  title?: string;
  layout?: 'vertical' | 'horizontal';
  showAverage?: boolean;
  showSort?: boolean;
  height?: number | string;
  barColor?: string;
  barGradient?: {
    startColor: string;
    endColor: string;
  };
  valueKey?: string;
  tooltipFormatter?: (value: number) => string;
  onBarClick?: (data: any, index: number) => void;
  customTooltip?: (props: CustomTooltipProps) => ReactNode;
}

const DefaultCustomTooltip = ({ active, payload, label, totalValue, valueKey, tooltipFormatter }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  
  const value = payload[0].value;
  const percentage = (value / totalValue * 100).toFixed(1);
  const formattedValue = tooltipFormatter ? tooltipFormatter(value) : new Intl.NumberFormat().format(value);
  
  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 animate-in fade-in duration-200">
      <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600" />
          <p className="text-indigo-600 font-semibold">
            {formattedValue}
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

const GeneralChart = ({
  data,
  title,
  layout = 'vertical',
  showAverage = true,
  showSort = true,
  height = 600,
  barColor = '#4F46E5',
  barGradient = { startColor: '#4F46E5', endColor: '#818CF8' },
  valueKey = 'value',
  tooltipFormatter,
  onBarClick,
  customTooltip
}: GeneralChartProps) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>(data);
  
  const totalValue = data.reduce((sum, item) => sum + item[valueKey], 0);
  const average = data.reduce((acc, curr) => acc + curr[valueKey], 0) / data.length;

  const handleSort = useCallback(() => {
    setChartData([...chartData].sort((a, b) => b[valueKey] - a[valueKey]));
  }, [chartData, valueKey]);

  const handleBarClick = (entry: any, index: number) => {
    if (onBarClick) {
      onBarClick(entry, index);
    }
  };

  const isVertical = layout === 'vertical';

  return (
    <Card className="p-4">
      {(title || showSort) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {showSort && (
            <button 
              onClick={handleSort}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200 cursor-pointer"
            >
              Sort by Value
            </button>
          )}
        </div>
      )}
      <CardContent style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout={layout}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            style={{ cursor: 'default' }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2={isVertical ? "1" : "0"} y2={isVertical ? "0" : "1"}>
                <stop offset="0%" stopColor={barGradient.startColor} />
                <stop offset="100%" stopColor={barGradient.endColor} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type={isVertical ? "number" : "category"} 
              dataKey={isVertical ? undefined : "name"}
              stroke="#6b7280"
              tickFormatter={isVertical ? (value) => new Intl.NumberFormat().format(value) : undefined}
              height={60}
              tickMargin={10}
              angle={isVertical ? 0 : -45}
              textAnchor={isVertical ? "end" : "end"}
            />
            <YAxis 
              type={isVertical ? "category" : "number"} 
              dataKey={isVertical ? "name" : undefined}
              width={isVertical ? 190 : 60}
              stroke="#6b7280"
              fontSize={13}
              tick={{
                fill: '#374151',
                textAnchor: isVertical ? 'end' : 'end',
                width: isVertical ? 190 : undefined,
              }}
              tickMargin={4}
              tickFormatter={isVertical ? undefined : (value) => new Intl.NumberFormat().format(value)}
            />
            <Tooltip 
              content={(props) => 
                customTooltip ? 
                  customTooltip({...props, totalValue, valueKey, tooltipFormatter}) : 
                  <DefaultCustomTooltip {...props} totalValue={totalValue} valueKey={valueKey} tooltipFormatter={tooltipFormatter} />
              } 
            />
            <Legend 
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            {showAverage && (
              <ReferenceLine
                x={isVertical ? average : undefined}
                y={isVertical ? undefined : average}
                stroke="#EA580C"
                strokeDasharray="3 3"
                label={{
                  position: 'right',
                  value: `Avg: ${Math.round(average)}`,
                  fill: '#EA580C',
                  fontSize: 12
                }}
              />
            )}
            <Bar 
              name="Values"
              dataKey={valueKey} 
              fill={barGradient ? "url(#barGradient)" : barColor}
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
                dataKey={valueKey}
                position="right"
                formatter={(value: number) => tooltipFormatter ? tooltipFormatter(value) : new Intl.NumberFormat().format(value)}
                style={{ fill: '#6b7280', fontSize: '12px' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GeneralChart;
