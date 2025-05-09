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
import { Eye } from 'lucide-react';

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
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
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
      header: "Partner",
          cell: ({ row }) => {
              const partnerName = row.getValue("Partner") as string;
              return <div className="capitalize">{partnerName || 'N/A'}</div>;
          }
      },
      {
          accessorKey: "Regions",
          header: "Region(s) of Operation",
          cell: ({ row }) => {
          const regions = row.getValue("Regions") as string[];
          return regions && regions.length > 0 ? regions.join(', ') : 'N/A';
      },
    },
    {
      id: "actions",
      header: "View Activities",
      cell: ({ row }) => {
          const partnerRowData = row.original;
        return (
            <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                  setSelectedPartnerNameForSheet(partnerRowData.Partner);
                setIsSheetOpen(true);
              }}
              className="p-1 h-auto"
            >
              <Eye className="h-5 w-5" />
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
      <div className="w-full self-end p-4 bg-white rounded-lg shadow">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <TableHead
                        key={header.id}
                        className={`px-4 py-3 ${header.id === 'actions' ? 'text-center' : 'text-left'}`}
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                      <TableCell
                          key={cell.id}
                          className={`px-4 py-2 ${cell.column.id === 'actions' ? 'text-center' : 'text-left'}`}
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
              >
                  First
              </Button>
              <Button
                  variant="outline"
                  size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
              <span className="text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
              >
                  Last
              </Button>
              <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                      table.setPageSize(Number(value));
                  }}
              >
                  <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
      </div>

          {selectedPartnerNameForSheet && activitiesForSheet.length > 0 && (
              <Sheet open={isSheetOpen} onOpenChange={(isOpen) => {
                  setIsSheetOpen(isOpen);
                  if (!isOpen) {
                      setSelectedPartnerNameForSheet(null);
                  }
              }}>
                  <SheetContent className="sm:max-w-2xl w-full bg-card">
            <SheetHeader>
                          <SheetTitle className="text-navy-blue">Activities for: {selectedPartnerNameForSheet}</SheetTitle>
                          <SheetDescription className="text-muted-foreground">
                              Detailed information about projects and activities.
                              {selectedRegion && <span className="block mt-1 text-xs">Filtered by Region: {selectedRegion}</span>}
              </SheetDescription>
            </SheetHeader>
                      <div className="py-4 max-h-[80vh] overflow-y-auto pr-2">
                          {activitiesForSheet.map((activity, index) => (
                              <div key={index} className="border border-border p-3 rounded-md mb-4 shadow-sm bg-ligher-gray">
                                  <h4 className="font-semibold mb-3 text-md text-smit-green">
                                      {activity["Project name"] ? `Project: ${activity["Project name"]}` : `Activity ${index + 1}`}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 text-sm">
                                      <span className="md:col-span-3 text-right font-medium text-muted-foreground">Organization:</span>
                                      <span className="md:col-span-9 break-words text-foreground">{activity.Organization || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-muted-foreground">Region:</span>
                                      <span className="md:col-span-9 break-words text-foreground">{activity["Project region"] || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-muted-foreground">Year:</span>
                                      <span className="md:col-span-9 break-words text-foreground">{activity.Year || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-muted-foreground">Work Nature:</span>
                                      <span className="md:col-span-9 break-words text-foreground">{activity["Work nature"] || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-muted-foreground">Disease Focus:</span>
                                      <span className="md:col-span-9 break-words text-foreground">{activity.Disease || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-muted-foreground">Role/Activities:</span>
                                      <span className="md:col-span-9 break-words text-foreground">{activity.Role || 'N/A'}</span>

                          {activity.District && (
                              <>
                                              <span className="md:col-span-3 text-right font-medium text-muted-foreground">District:</span>
                                              <span className="md:col-span-9 break-words text-foreground">{activity.District}</span>
                              </>
                          )}
                      </div>
                </div>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                              <Button className='bg-navy-blue text-primary-foreground hover:bg-navy-blue/90' type="button" onClick={() => {
                                  setIsSheetOpen(false);
                                  setSelectedPartnerNameForSheet(null);
                              }}>Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
