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
              const partnerName = row.getValue("Partner") as string; // Corrected: Added accessorKey
              return <div className="capitalize">{partnerName || 'N/A'}</div>;
          }
      },
      {
          accessorKey: "Regions",
          header: "Region(s) of Operation",
          cell: ({ row }) => {
              const regions = row.getValue("Regions") as string[]; // Corrected: Added accessorKey
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
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
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
    <div className="w-1/2 self-end p-4 bg-white rounded-lg shadow">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter partners..."
          value={globalFilter ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ textAlign: header.id === 'actions' ? 'center' : 'left' }}>
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
                    <TableCell key={cell.id} style={{ 
                          paddingLeft: cell.column.id === 'actions' ? undefined : '0.5rem',
                          textAlign: cell.column.id === 'actions' ? 'center' : 'left',
                      }}>
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
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

          {selectedPartnerNameForSheet && activitiesForSheet.length > 0 && (
              <Sheet open={isSheetOpen} onOpenChange={(isOpen) => {
                  setIsSheetOpen(isOpen);
                  if (!isOpen) {
                      setSelectedPartnerNameForSheet(null);
                  }
              }}>
                  <SheetContent className="sm:max-w-2xl w-full">
            <SheetHeader>
                          <SheetTitle>Activities for: {selectedPartnerNameForSheet}</SheetTitle>
              <SheetDescription>
                              Detailed information about projects and activities.
                              {selectedRegion && <span className="block mt-1 text-xs">Filtered by Region: {selectedRegion}</span>}
              </SheetDescription>
            </SheetHeader>
                      <div className="py-4 max-h-[80vh] overflow-y-auto pr-2">
                          {activitiesForSheet.map((activity, index) => (
                              <div key={index} className="border p-3 rounded-md mb-4 shadow-sm bg-slate-50">
                                  <h4 className="font-semibold mb-3 text-md text-blue-700">
                                      {activity["Project name"] ? `Project: ${activity["Project name"]}` : `Activity ${index + 1}`}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 text-sm">
                                      <span className="md:col-span-3 text-right font-medium text-gray-600">Organization:</span>
                                      <span className="md:col-span-9 break-words">{activity.Organization || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-gray-600">Region:</span>
                                      <span className="md:col-span-9 break-words">{activity["Project region"] || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-gray-600">Year:</span>
                                      <span className="md:col-span-9 break-words">{activity.Year || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-gray-600">Work Nature:</span>
                                      <span className="md:col-span-9 break-words">{activity["Work nature"] || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-gray-600">Disease Focus:</span>
                                      <span className="md:col-span-9 break-words">{activity.Disease || 'N/A'}</span>

                                      <span className="md:col-span-3 text-right font-medium text-gray-600">Role/Activities:</span>
                                      <span className="md:col-span-9 break-words">{activity.Role || 'N/A'}</span>

                                      {activity.District && (
                                          <>
                                              <span className="md:col-span-3 text-right font-medium text-gray-600">District:</span>
                                              <span className="md:col-span-9 break-words">{activity.District}</span>
                                          </>
                                      )}
                                  </div>
                </div>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                              <Button type="button" onClick={() => {
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
