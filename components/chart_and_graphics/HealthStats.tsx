"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState
} from '@tanstack/react-table';
import ncdStats from '@/constant/ncd_stats.json';

// Custom colors for charts
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

// Get all unique regions to assign consistent colors
const allRegions = [...new Set(ncdStats.map(item => item.region))];
// Create a map of region to color
const regionColorMap = Object.fromEntries(
  allRegions.map((region, index) => [region, COLORS[index % COLORS.length]])
);

export default function HealthStats() {
  // State for filters
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDisease, setSelectedDisease] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [chartType, setChartType] = useState('bar'); // 'bar', 'pie', 'line'
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Derived state
  const [filteredData, setFilteredData] = useState<{name: string; value: number}[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  
  // Get unique options for filters
  const regions = ['All', ...new Set(ncdStats.map(item => item.region))];
  
  const diseases = ['All', ...new Set(
    ncdStats.flatMap(region => 
      region.diseases.map(disease => disease.disease)
    )
  )];
  
  const levels = ['All', ...new Set(
    ncdStats.flatMap(region => 
      region.diseases.flatMap(disease => 
        disease.levels.map(level => level.level)
      )
    )
  )];

  // Process data whenever filters change
  useEffect(() => {
    // Filter by region
    let processedData = [...ncdStats];
    
    if (selectedRegion !== 'All') {
      processedData = processedData.filter(item => item.region === selectedRegion);
    }
    
    // Transform data based on filters
    let chartData = [];
    let total = 0;

    if (selectedDisease === 'All' && selectedLevel === 'All') {
      // Group by regions and sum up all diseases and levels
      chartData = processedData.map(region => {
        const regionTotal = region.diseases.reduce((sum, disease) => {
          return sum + disease.levels.reduce((levelSum, level) => levelSum + level.total, 0);
        }, 0);
        total += regionTotal;
        return {
          name: region.region,
          value: regionTotal
        };
      });
    } else if (selectedDisease !== 'All' && selectedLevel === 'All') {
      // Filter by disease and group by regions
      chartData = processedData.map(region => {
        const disease = region.diseases.find(d => d.disease === selectedDisease);
        const diseaseTotal = disease ? disease.levels.reduce((sum, level) => sum + level.total, 0) : 0;
        total += diseaseTotal;
        return {
          name: region.region,
          value: diseaseTotal
        };
      });
    } else if (selectedDisease === 'All' && selectedLevel !== 'All') {
      // Filter by level and group by regions
      chartData = processedData.map(region => {
        let levelTotal = 0;
        region.diseases.forEach(disease => {
          const levelData = disease.levels.find(l => l.level === selectedLevel);
          if (levelData) levelTotal += levelData.total;
        });
        total += levelTotal;
        return {
          name: region.region,
          value: levelTotal
        };
      });
    } else {
      // Filter by both disease and level
      chartData = processedData.map(region => {
        const disease = region.diseases.find(d => d.disease === selectedDisease);
        const levelData = disease?.levels.find(l => l.level === selectedLevel);
        const value = levelData ? levelData.total : 0;
        total += value;
        return {
          name: region.region,
          value
        };
      });
    }
    
    // Remove entries with zero values
    chartData = chartData.filter(item => item.value > 0);
    
    setFilteredData(chartData);
    setTotalCases(total);
  }, [selectedRegion, selectedDisease, selectedLevel]);

  // Table configuration
  const columnHelper = createColumnHelper<{name: string; value: number}>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Region',
      cell: info => info.getValue(),
      footer: props => props.column.id,
    }),
    columnHelper.accessor('value', {
      header: 'Cases',
      cell: info => info.getValue().toLocaleString(),
      footer: props => props.column.id,
    }),
    columnHelper.accessor(row => {
      return (row.value / totalCases * 100).toFixed(2) + '%';
    }, {
      id: 'percentage',
      header: 'Percentage',
      cell: info => info.getValue(),
      footer: props => props.column.id,
    }),
  ], [totalCases]);
  
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    if (filteredData.length === 0) {
      return <div className="text-center text-lg text-gray-500">No data available for the selected filters</div>;
    }

    switch(chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={regionColorMap[entry.name] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} cases`, 'Total']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} cases`, 'Total']} />
              <Legend />
              {filteredData.map((entry, index) => (
                <Line 
                  key={`line-${entry.name}`}
                  type="monotone" 
                  dataKey="value" 
                  name={entry.name}
                  data={[entry]}
                  stroke={regionColorMap[entry.name] || COLORS[index % COLORS.length]} 
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} cases`, 'Total']} />
              <Legend />
              <Bar dataKey="value" name="Cases">
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={regionColorMap[entry.name] || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  // Render table view
  const renderTable = () => {
    if (filteredData.length === 0) {
      return <div className="text-center text-lg text-gray-500">No data available for the selected filters</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} 
                  className="hover:bg-gray-50"
                  style={{ 
                    backgroundColor: `${regionColorMap[row.original.name]}20` // Adding 20 for slight transparency
                  }}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>
          <span className="text-sm text-gray-700">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-2 py-1 border rounded"
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full container mx-auto p-4 md:p-10 my-10 md:my-20 overflow-hidden py-8 px-4 rounded-lg bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">NCD Health Statistics Dashboard</h2>
      
      {/* Stats Summary */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold text-lg mb-2">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Cases</p>
            <p className="text-2xl font-bold">{totalCases.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Selected Region</p>
            <p className="text-xl font-semibold">{selectedRegion}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Selected Disease</p>
            <p className="text-xl font-semibold">{selectedDisease}</p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold text-lg mb-2">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {diseases.map(disease => (
                <option key={disease} value={disease}>{disease}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'chart'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                Chart
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                Table
              </button>
            </div>
          </div>
          {viewMode === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      {/* Chart or Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">
          {selectedRegion === 'All' ? 'All Regions' : selectedRegion} - 
          {selectedDisease === 'All' ? ' All Diseases' : ` ${selectedDisease}`} - 
          {selectedLevel === 'All' ? ' All Levels' : ` ${selectedLevel}`}
        </h3>
        {viewMode === 'chart' ? renderChart() : renderTable()}
      </div>
    </section>
  );
}
