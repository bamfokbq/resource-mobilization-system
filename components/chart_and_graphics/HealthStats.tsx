"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import * as XLSX from 'xlsx';
import ExportService from '@/lib/exportService';
// Import shadcn Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Image } from "lucide-react";

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
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Derived state
  const [filteredData, setFilteredData] = useState<{name: string; value: number}[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  
  // Refs for PNG export
  const chartRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
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

  // Export functions
  const exportFilteredData = () => {
    setIsExporting(true);

    try {
      const fileName = `NCD_${selectedRegion !== 'All' ? selectedRegion + '_' : ''}${selectedDisease !== 'All' ? selectedDisease + '_' : ''}${selectedLevel !== 'All' ? selectedLevel + '_' : ''
        }data.xlsx`;

      // Create worksheet from the current filtered data
      const ws = XLSX.utils.json_to_sheet(
        filteredData.map(item => ({
          Region: item.name,
          Cases: item.value,
          Percentage: `${((item.value / totalCases) * 100).toFixed(2)}%`
        }))
      );

      // Add totals row
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', totalCases, '100%']
      ], { origin: -1 });

      // Column widths
      ws['!cols'] = [
        { wch: 20 }, // Region
        { wch: 10 }, // Cases
        { wch: 12 }  // Percentage
      ];

      // Create workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Filtered NCD Data');

      // Add filter info to a new sheet
      const infoWs = XLSX.utils.aoa_to_sheet([
        ['NCD Navigator Data Export'],
        ['Date of Export', new Date().toLocaleDateString()],
        [''],
        ['Filters Applied:'],
        ['Region', selectedRegion],
        ['Disease', selectedDisease],
        ['Facility Level', selectedLevel],
        [''],
        ['Total Cases', totalCases.toString()]
      ]);

      // Column widths for info sheet
      infoWs['!cols'] = [
        { wch: 20 }, // Label
        { wch: 30 }  // Value
      ];

      XLSX.utils.book_append_sheet(wb, infoWs, 'Export Info');

      // Export file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  const exportFullData = () => {
    setIsExporting(true);

    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Process and add region sheets
      ncdStats.forEach(region => {
        // Create flat data structure for the region
        const regionData: {
          Disease: string;
          'Facility Level': string;
          'Total Cases': number;
        }[] = [];

        region.diseases.forEach(disease => {
          disease.levels.forEach(level => {
            if (level.total > 0) { // Only include non-zero entries
              regionData.push({
                Disease: disease.disease,
                'Facility Level': level.level,
                'Total Cases': level.total
              });
            }
          });
        });

        // Skip if no data
        if (regionData.length === 0) return;

        // Create worksheet and add to workbook
        const ws = XLSX.utils.json_to_sheet(regionData);

        // Set column widths
        ws['!cols'] = [
          { wch: 40 }, // Disease name
          { wch: 30 }, // Facility Level
          { wch: 12 }  // Total Cases
        ];

        XLSX.utils.book_append_sheet(wb, ws, region.region);
      });

      // Create summary sheet
      const summaryData = ncdStats.map(region => {
        const totalCases = region.diseases.reduce((sum, disease) => {
          return sum + disease.levels.reduce((levelSum, level) => levelSum + level.total, 0);
        }, 0);

        return {
          Region: region.region,
          'Total Cases': totalCases
        };
      });

      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

      // Export the file
      XLSX.writeFile(wb, 'NCD_Complete_Dataset.xlsx');
    } catch (error) {
      console.error('Error exporting full data:', error);
      alert('Failed to export full dataset. Please try again.');
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  // PNG Export functions
  const exportChartAsPNG = async () => {
    if (chartRef.current) {
      try {
        await ExportService.exportChartAsImage(chartRef.current, {
          filename: `ncd_stats_chart_${selectedRegion}_${selectedDisease}_${selectedLevel}`,
          title: `NCD Statistics Chart - ${selectedRegion} - ${selectedDisease} - ${selectedLevel}`
        });
      } catch (error) {
        console.error('Chart PNG export error:', error);
      }
    }
  };

  const exportTableAsPNG = async () => {
    if (tableRef.current) {
      try {
        await ExportService.exportTableAsPNG(tableRef.current, {
          filename: `ncd_stats_table_${selectedRegion}_${selectedDisease}_${selectedLevel}`,
          title: `NCD Statistics Table - ${selectedRegion} - ${selectedDisease} - ${selectedLevel}`
        });
      } catch (error) {
        console.error('Table PNG export error:', error);
      }
    }
  };

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
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={500}>
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
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={regionColorMap[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} cases`, 'Total']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart
                data={filteredData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 70
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-90}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} cases`, 'Total']} />
                <Legend />
                <Line 
                  type="monotone"
                  dataKey="value" 
                  name="Cases"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{
                    stroke: '#8884d8',
                    strokeWidth: 2,
                    r: 6,
                    fill: 'white'
                  }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'bar':
      default:
        return (
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={filteredData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 70, // Increased bottom margin to accommodate vertical labels
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-90}
                  textAnchor="end"
                  height={60} // Increased height for the labels
                  tick={{ fontSize: 12 }} // Optional: control font size
                />
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
          </div>
        );
    }
  };

  // Render table view
  const renderTable = () => {
    if (filteredData.length === 0) {
      return <div className="text-center text-lg text-gray-500">No data available for the selected filters</div>;
    }

    return (
      <div ref={tableRef} className="overflow-x-auto">
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
    <section className="w-full max-w-7xl mx-auto p-6 md:p-10 my-8 md:my-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 border-b pb-4 border-gray-200">
        Regional Distribution of NCDs for 2024
      </h2>
      
      {/* Stats Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 transform hover:shadow-lg transition-all duration-300">
        <h3 className="font-semibold text-xl mb-4 text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Data Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg shadow-sm border border-blue-200 flex items-center">
            <div className="bg-blue-500 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Total Cases</p>
              <p className="text-2xl font-bold text-blue-900">{totalCases.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-lg shadow-sm border border-green-200 flex items-center">
            <div className="bg-green-500 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Selected Region</p>
              <p className="text-xl font-semibold text-green-900">{selectedRegion}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-lg shadow-sm border border-yellow-200 flex items-center">
            <div className="bg-yellow-500 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">Selected Disease</p>
              <p className="text-xl font-semibold text-yellow-900">{selectedDisease}</p>
            </div>
          </div>
        </div>
        {/* Contact Information */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Ghana Health Service ICT Department</span>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@ghsict.gov" className="text-sm text-blue-600 hover:underline">info@ghs.gov.gh</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+233243127089" className="text-sm text-blue-600 hover:underline">+233 24 312 7089</a>
              </div>
            </div>
          </div>
        </div>
        {/* Add export button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setShowExportModal(true)}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="font-semibold text-xl mb-4 text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disease</label>
            <div className="relative">
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                {diseases.map(disease => (
                  <option key={disease} value={disease}>{disease}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facility Level</label>
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
            <div className="flex rounded-lg shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('chart')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  viewMode === 'chart'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  } border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Chart
                </div>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  } border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Table
                </div>
              </button>
            </div>
          </div>
          {viewMode === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <div className="relative">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="line">Line Chart</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Chart or Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-semibold text-xl mb-6 text-gray-700 flex items-center border-b border-gray-200 pb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>
            {selectedRegion === 'All' ? 'All Regions' : selectedRegion} —
            {selectedDisease === 'All' ? ' All Diseases' : ` ${selectedDisease}`} —
            {selectedLevel === 'All' ? ' All Levels' : ` ${selectedLevel}`}
          </span>
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          {viewMode === 'chart' ? renderChart() : renderTable()}
        </div>
        
        {/* Export Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="border-green-200 hover:bg-green-50 text-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            
            {viewMode === 'chart' && (
              <Button
                onClick={exportChartAsPNG}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50 text-blue-700"
              >
                <Image className="h-4 w-4 mr-2" />
                Export Chart PNG
              </Button>
            )}
            
            {viewMode === 'table' && (
              <Button
                onClick={exportTableAsPNG}
                variant="outline"
                className="border-purple-200 hover:bg-purple-50 text-purple-700"
              >
                <Image className="h-4 w-4 mr-2" />
                Export Table PNG
              </Button>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Total Cases: <span className="font-semibold text-gray-700">{totalCases.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-600 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Data source: DHIMS2</p>
      </div>

      {/* Export Modal - Using shadcn Dialog */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>
              Choose what data you want to export
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h4 className="font-medium text-gray-800 mb-1">Export Current View</h4>
              <p className="text-sm text-gray-600 mb-3">
                Export data based on your current filters:
                {selectedRegion !== 'All' && <span className="font-medium"> Region: {selectedRegion}</span>}
                {selectedDisease !== 'All' && <span className="font-medium"> Disease: {selectedDisease}</span>}
                {selectedLevel !== 'All' && <span className="font-medium"> Level: {selectedLevel}</span>}
                {selectedRegion === 'All' && selectedDisease === 'All' && selectedLevel === 'All' &&
                  <span className="font-medium"> All data</span>
                }
              </p>
              <Button
                onClick={exportFilteredData}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export Current View
                  </>
                )}
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h4 className="font-medium text-gray-800 mb-1">Export Complete Dataset</h4>
              <p className="text-sm text-gray-600 mb-3">
                Export the full NCD dataset with all regions, diseases and facility levels.
                Each region will be in a separate sheet.
              </p>
              <Button
                onClick={exportFullData}
                disabled={isExporting}
                variant="secondary"
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Complete Dataset
                  </>
                )}
              </Button>
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <div className="text-xs text-gray-500">
              Files will be downloaded as Excel (.xlsx) format
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
