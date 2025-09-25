"use client";
import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Users, 
  MapPin, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  X
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import partnersData from '@/data/Partners.json'; 
import { PartnerEntry } from '@/types/partners'; 

// Define the expected props for PartnersTable
interface PartnersTableProps {
    selectedRegion: string | null;
}

// New interface for the data structure for the table rows
interface UniquePartnerRow {
    Partner: string;
    Regions: string[];
    allActivities: PartnerEntry[];
}

export default function PartnersTable({ selectedRegion }: PartnersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedPartnerNameForSheet, setSelectedPartnerNameForSheet] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

    const processedData = useMemo(() => {
        let filteredByRegion = partnersData as PartnerEntry[];
        if (selectedRegion) {
            filteredByRegion = filteredByRegion.filter(
                partner => partner["Project region"] && partner["Project region"].toLowerCase() === selectedRegion.toLowerCase()
            );
        }

      const groupedByPartner = filteredByRegion.reduce((acc, activity) => {
          const partnerName = activity.Partner;
          if (typeof partnerName !== 'string' || !partnerName.trim()) {
              return acc;
          }

        if (!acc[partnerName]) {
            acc[partnerName] = {
                Partner: partnerName,
                Regions: new Set<string>(),
                allActivities: [],
            };
        }
        if (typeof activity["Project region"] === 'string' && activity["Project region"].trim()) {
            acc[partnerName].Regions.add(activity["Project region"]);
        }
        acc[partnerName].allActivities.push(activity);
        return acc;
    }, {} as Record<string, { Partner: string; Regions: Set<string>; allActivities: PartnerEntry[] }>);

      return Object.values(groupedByPartner).map(p => ({
          ...p,
          Regions: Array.from(p.Regions),
      }));
  }, [selectedRegion]);

    const data = useMemo(() => processedData, [processedData]);

  const columns: ColumnDef<UniquePartnerRow>[] = useMemo(() => [
    {
      accessorKey: "Partner",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:text-ghs-green"
          >
            <Users className="mr-2 h-4 w-4" />
            Stakeholders
            {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
          </Button>
        );
      },
      cell: ({ row }) => {
        const partnerName = row.getValue("Partner") as string;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-ghs-green/10 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-ghs-green" />
            </div>
            <div>
              <div className="font-medium text-slate-900 capitalize">{partnerName || 'N/A'}</div>
              <div className="text-sm text-slate-500">
                {row.original.allActivities.length} activit{row.original.allActivities.length !== 1 ? 'ies' : 'y'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const partnerRowData = row.original;
        return (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPartnerNameForSheet(partnerRowData.Partner);
                setIsSheetOpen(true);
              }}
              className="h-8 px-3 bg-ghs-green/5 border-ghs-green/20 text-ghs-green hover:bg-ghs-green hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
        globalFilter,
        pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
  });

    const activitiesForSheet = useMemo(() => {
        if (!selectedPartnerNameForSheet) return [];
        const partnerDetail = processedData.find(p => p.Partner === selectedPartnerNameForSheet);
        return partnerDetail ? partnerDetail.allActivities : [];
    }, [selectedPartnerNameForSheet, processedData]);

  return (
    <Card className="w-full h-[700px] bg-white/90 backdrop-blur-sm border-0 shadow-xl flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-6 w-6 text-ghs-green" />
              Stakeholders Directory
            </CardTitle>
            <p className="text-slate-600 mt-1">
              {selectedRegion ? `Filtered by ${selectedRegion}` : 'All stakeholders across regions'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-ghs-green/10 text-ghs-green border-ghs-green/20">
              {data.length} stakeholder{data.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="p-6 pb-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search stakeholders..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 h-10 border-slate-300 focus:border-ghs-green focus:ring-ghs-green/20"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {globalFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGlobalFilter('')}
                  className="h-10 px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-slate-50/50 hover:bg-slate-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`px-6 py-4 ${header.id === 'actions' ? 'text-center' : 'text-left'}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-ghs-green mb-2" />
                      <p className="text-slate-600">Loading stakeholders...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`px-6 py-4 ${cell.column.id === 'actions' ? 'text-center' : 'text-left'}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-12 w-12 text-slate-300 mb-4" />
                      <p className="text-lg font-medium text-slate-600 mb-2">No stakeholders found</p>
                      <p className="text-sm text-slate-500">
                        {globalFilter ? 'Try adjusting your search terms' : 'No data available for the selected criteria'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Enhanced Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50/50 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Showing</span>
            <span className="font-medium">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </span>
            <span>to</span>
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>
            <span>of</span>
            <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>
            <span>stakeholders</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const startPage = Math.max(0, pageIndex - 2);
                const page = startPage + i;
                
                if (page >= table.getPageCount()) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === pageIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(page)}
                    className={`h-8 w-8 p-0 ${
                      page === pageIndex 
                        ? 'bg-ghs-green text-white hover:bg-ghs-green/90' 
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    {page + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Enhanced Activities Sheet Modal */}
      {selectedPartnerNameForSheet && activitiesForSheet.length > 0 && (
        <Sheet open={isSheetOpen} onOpenChange={(isOpen) => {
          setIsSheetOpen(isOpen);
          if (!isOpen) {
            setSelectedPartnerNameForSheet(null);
          }
        }}>
          <SheetContent className="sm:max-w-4xl w-full bg-white">
            <SheetHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ghs-green/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-ghs-green" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-slate-800">
                    {selectedPartnerNameForSheet}
                  </SheetTitle>
                  <SheetDescription className="text-slate-600 mt-1">
                    Detailed project activities and stakeholder information
                    {selectedRegion && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                        {selectedRegion}
                      </Badge>
                    )}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>{activitiesForSheet.length} activit{activitiesForSheet.length !== 1 ? 'ies' : 'y'}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[...new Set(activitiesForSheet.map(a => a["Project region"]).filter(Boolean))].length} region{activitiesForSheet.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </SheetHeader>

            <div className="py-4 max-h-[70vh] overflow-y-auto pr-2 space-y-4">
              {activitiesForSheet.map((activity, index) => (
                <Card key={index} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-ghs-green mb-2">
                          {activity["Project name"] ? activity["Project name"] : `Activity ${index + 1}`}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {activity.Year && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {activity.Year}
                            </Badge>
                          )}
                          {activity["Project region"] && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {activity["Project region"]}
                            </Badge>
                          )}
                          {activity.Disease && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {activity.Disease}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-slate-600 block mb-1">Organization</label>
                          <p className="text-sm text-slate-900 bg-slate-50 p-2 rounded border">
                            {activity.Organization || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-600 block mb-1">Work Nature</label>
                          <p className="text-sm text-slate-900 bg-slate-50 p-2 rounded border">
                            {activity["Work nature"] || 'N/A'}
                          </p>
                        </div>

                        {activity.District && (
                          <div>
                            <label className="text-sm font-medium text-slate-600 block mb-1">District</label>
                            <p className="text-sm text-slate-900 bg-slate-50 p-2 rounded border">
                              {activity.District}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-slate-600 block mb-1">Role/Activities</label>
                          <p className="text-sm text-slate-900 bg-slate-50 p-2 rounded border min-h-[60px]">
                            {activity.Role || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <SheetFooter className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-slate-600">
                  Showing {activitiesForSheet.length} of {activitiesForSheet.length} activities
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <SheetClose asChild>
                    <Button 
                      className="bg-ghs-green text-white hover:bg-ghs-green/90" 
                      type="button" 
                      onClick={() => {
                        setIsSheetOpen(false);
                        setSelectedPartnerNameForSheet(null);
                      }}
                    >
                      Close
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </Card>
  );
}
