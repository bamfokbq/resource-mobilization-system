"use client";
import { useState, useCallback, FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface NumberOfProjectsChartProps {
  data: { Year: number; "Number of Projects": number }[];
  title?: string;
  description?: string; // Added description prop
  options?: { barColor?: string; grid?: boolean }; // Added options for customization
}

const NumberOfProjects: FC<NumberOfProjectsChartProps> = ({ data, title, description, options }) => {
  const [chartData, setChartData] = useState(data);

  const totalValue = data.reduce((sum: number, item: { Year: number; "Number of Projects": number }) => sum + item["Number of Projects"], 0);
  const average = totalValue / data.length;

  const handleSort = useCallback(() => {
    setChartData([...chartData].sort((a, b) => b["Number of Projects"] - a["Number of Projects"]));
  }, [chartData]);

  return (
    <section id="projects">
      <Card className="p-4">
        {(title || true) && (
          <div className="flex justify-between items-center mb-4">
            {title && <h3 className="text-lg font-medium">{title}</h3>}
            <button
              onClick={handleSort}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200 cursor-pointer"
            >
              Sort by Value
            </button>
          </div>
        )}
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
        <CardContent style={{ height: "600px", width: "800px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              {options?.grid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
              <XAxis dataKey="Number of Projects" stroke="#6b7280" />
              <YAxis
                dataKey="Year"
                stroke="#6b7280"
                type="category"
                interval={0} // Ensures all categories (years) are displayed
              />
              <Tooltip
                formatter={(value: number) => [`${value} Projects`, "Year"]}
                labelFormatter={(label: string) => `Year: ${label}`}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
              <ReferenceLine x={average} stroke="#EA580C" strokeDasharray="3 3" label={{ position: 'top', value: `Avg: ${Math.round(average)}`, fill: '#EA580C', fontSize: 12 }} />
              <Bar dataKey="Number of Projects" fill={options?.barColor || "#4F46E5"} barSize={100} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default NumberOfProjects;