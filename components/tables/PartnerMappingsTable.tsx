'use client';

import React, { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { PartnerMappingDetailsDrawer } from '@/components/forms/partner-mapping/PartnerMappingDetailsDrawer';
import { PageSizeSelector } from '@/components/resources/ResourcesPagination/PageSizeSelector';
import { cn } from '@/lib/utils';

interface PartnerMapping {
  id: string;
  userId: string;
  data: {
    partnerMappings: Array<{
      year: number;
      workNature: string;
      organization: string;
      projectName: string;
      projectRegion: string;
      district?: string;
      disease: string;
      partner: string;
      role: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface PartnerMappingsTableProps {
  data: PartnerMapping[];
  isLoading?: boolean;
}

export default function PartnerMappingsTable({ data, isLoading = false }: PartnerMappingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedMapping, setSelectedMapping] = useState<PartnerMapping | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns = useMemo<ColumnDef<PartnerMapping>[]>(() => [
    {
      accessorKey: 'partnerCount',
      header: 'Partners',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100/50">
          <div className="p-1 bg-blue-100 rounded-md">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold text-blue-800">
            {row.original.data.partnerMappings.length}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'primaryRegion',
      header: 'Primary Region',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 bg-green-50/50 px-3 py-2 rounded-lg border border-green-100/50">
          <div className="p-1 bg-green-100 rounded-md">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-green-800 font-medium">{row.original.data.partnerMappings[0]?.projectRegion || 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'year',
      header: 'Year',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 bg-purple-50/50 px-3 py-2 rounded-lg border border-purple-100/50">
          <div className="p-1 bg-purple-100 rounded-md">
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-purple-800 font-medium">{row.original.data.partnerMappings[0]?.year || 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'organizations',
      header: 'Organizations',
      cell: ({ row }) => {
        const organizations = row.original.data.partnerMappings.map(pm => pm.organization);
        const uniqueOrgs = [...new Set(organizations)];
        const displayOrgs = uniqueOrgs.slice(0, 2);
        const remainingCount = uniqueOrgs.length - 2;
        
        return (
          <div className="flex flex-wrap gap-1">
            {displayOrgs.map((org, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 shadow-sm">
                {org}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-white text-blue-600 border-blue-200 shadow-sm">
                +{remainingCount}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
          {new Date(row.original.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => {
            setSelectedMapping(row.original);
            setIsDrawerOpen(true);
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          View Details
        </Button>
      ),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleViewDetails = (mapping: PartnerMapping) => {
    setSelectedMapping(mapping);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMapping(null);
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-sm">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            Partner Mappings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-xl border border-blue-100/30"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-sm">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            Partner Mappings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Building2 className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">No Partner Mappings Found</h3>
            <p className="text-blue-600/80 text-lg">No partner mappings match your current filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-sm">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              Partner Mappings ({data.length})
            </CardTitle>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Input
                  placeholder="Search mappings..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-blue-100/50 bg-white">
            <table className="w-full">
              <thead className="bg-blue-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-blue-100/50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left py-4 px-6 font-semibold text-blue-800/90 text-sm uppercase tracking-wide"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'flex items-center gap-2 group',
                              header.column.getCanSort() && 'cursor-pointer hover:text-blue-600 transition-colors duration-200'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <div className="flex flex-col opacity-60 group-hover:opacity-100 transition-opacity">
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUp className="w-4 h-4 text-blue-600" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDown className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <div className="w-4 h-4">
                                    <ChevronUp className="w-4 h-4 text-blue-400" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-blue-100/30">
                {table.getRowModel().rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className={cn(
                      "transition-all duration-200 hover:shadow-md",
                      index % 2 === 0 ? "bg-white" : "bg-blue-50/30",
                      "hover:bg-blue-50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-6 text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-2">
            {/* Page Info and Size Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-blue-700/80 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                Showing <span className="font-semibold text-blue-800">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
                <span className="font-semibold text-blue-800">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </span> of{' '}
                <span className="font-semibold text-blue-800">{table.getFilteredRowModel().rows.length}</span> results
              </div>

              <PageSizeSelector
                pageSize={table.getState().pagination.pageSize}
                onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
                options={[5, 10, 25, 50, 100]}
              />
            </div>

            {/* Page Controls */}
            <div className="flex items-center justify-center space-x-1 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              {/* First Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="h-9 w-9 p-0 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 disabled:opacity-50"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Previous Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-9 w-9 p-0 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 disabled:opacity-50"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === table.getState().pagination.pageIndex + 1;
                  
                  return (
                    <Button
                      key={page}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => table.setPageIndex(page - 1)}
                      className={cn(
                        "h-9 w-9 p-0",
                        isCurrentPage 
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                          : "bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
                      )}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              {/* Next Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-9 w-9 p-0 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 disabled:opacity-50"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Last Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="h-9 w-9 p-0 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 disabled:opacity-50"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Mapping Details Drawer */}
      <PartnerMappingDetailsDrawer
        mapping={selectedMapping}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
