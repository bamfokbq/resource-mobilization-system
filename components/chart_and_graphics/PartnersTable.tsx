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
  GroupingState,
  ExpandedState,
  getGroupedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { Eye, ChevronRight, ChevronDown } from 'lucide-react';

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

export default function PartnersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<PartnerEntry | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [grouping, setGrouping] = useState<GroupingState>(['Project region']);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Filter out entries where essential data for the table might be missing or null
  const validPartnersData = useMemo(() => 
    (partnersData as PartnerEntry[]).filter(partner => 
      partner.Organization && partner.Partner && partner["Project region"]
    )
  , []);

  const data = useMemo(() => validPartnersData, [validPartnersData]);

  const columns: ColumnDef<PartnerEntry>[] = useMemo(() => [
    {
      accessorKey: "Project region",
      header: "Project Region",
      cell: ({ row, getValue }) => {
        if (row.getIsGrouped()) {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={row.getToggleExpandedHandler()}
              className="flex items-center gap-1 p-1 h-auto text-left"
            >
              {row.getIsExpanded() ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span className="font-semibold">{getValue() as string}</span> 
              <span className="text-xs text-gray-500">({row.subRows.length})</span>
            </Button>
          );
        }
        // For non-grouped rows, we don't want to render the region again here,
        // as it's implicitly part of the group.
        // However, if you decided to not group by default or allow ungrouping,
        // you might want to display it:
        // return getValue() as string; 
        return null; 
      },
    },
    {
      accessorKey: "Partner",
      header: "Partner",
      cell: ({ row, getValue }) => {
        if (row.getIsGrouped()) return null; // Don't show for group header rows
        return (
          <div 
            className="capitalize"
            style={{ paddingLeft: `${row.depth * 1.5}rem` }} // Indent sub-rows
          >
            {getValue() as string || 'N/A'}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "View Activities",
      cell: ({ row }) => {
        if (row.getIsGrouped() || !row.original) return null;
        const partner = row.original;
        return (
          <div style={{ paddingLeft: `${row.depth * 1.5}rem` }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPartner(partner);
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
      grouping,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetExpanded: false, // Keep expanded state on data/filter changes
  });

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
                        paddingLeft: cell.column.id !== 'Project region' && row.depth > 0 ? `${row.depth * 0.5}rem` : undefined,
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

      {selectedPartner && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-[525px]">
            <SheetHeader>
              <SheetTitle>Project Details: {selectedPartner["Project name"] || 'N/A'}</SheetTitle>
              <SheetDescription>
                Detailed information about the project and activities.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold col-span-1">Organization:</span>
                <span className="col-span-3">{selectedPartner.Organization || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold col-span-1">Partner:</span>
                <span className="col-span-3">{selectedPartner.Partner || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold col-span-1">Project Region:</span>
                <span className="col-span-3">{selectedPartner["Project region"] || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold col-span-1">Year:</span>
                <span className="col-span-3">{selectedPartner.Year || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold col-span-1">Work Nature:</span>
                <span className="col-span-3">{selectedPartner["Work nature"] || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold col-span-1">Disease Focus:</span>
                <span className="col-span-3">{selectedPartner.Disease || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold col-span-1">Role/Activities:</span>
                <span className="col-span-3">{selectedPartner.Role || 'N/A'}</span>
              </div>
               {selectedPartner.District && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-right font-semibold col-span-1">District:</span>
                    <span className="col-span-3">{selectedPartner.District}</span>
                </div>
              )}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
