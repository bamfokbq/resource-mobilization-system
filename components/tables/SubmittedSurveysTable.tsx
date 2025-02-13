'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FaSort, FaSortUp, FaSortDown, FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Survey {
  id: string;
  title: string;
  dateSubmitted: string;
  status: 'completed' | 'in_progress';
  score: number;
}

const columnHelper = createColumnHelper<Survey>();

const columns = [
  columnHelper.accessor('title', {
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Survey Title
          {column.getIsSorted() === "asc" ? (
            <FaSortUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <FaSortDown className="h-4 w-4" />
          ) : (
            <FaSort className="h-4 w-4" />
          )}
        </div>
      )
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('dateSubmitted', {
    header: 'Submission Date',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          info.getValue() === 'completed'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {info.getValue().replace('_', ' ')}
      </span>
    ),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    cell: (info) => `${info.getValue()}%`,
  }),
];

const mockData: Survey[] = Array.from({ length: 50 }, (_, i) => ({
  id: `survey-${i + 1}`,
  title: `Survey ${i + 1}`,
  dateSubmitted: new Date(2024, 0, i + 1).toISOString(),
  status: Math.random() > 0.5 ? 'completed' : 'in_progress',
  score: Math.floor(Math.random() * 100),
}));

export default function SubmittedSurveysTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data] = useState(() => mockData);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-navy-blue flex items-center gap-2">
        Submitted Surveys
      </h2>
      <div className="rounded-lg overflow-hidden border bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {table.getPageCount()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:bg-primary hover:text-white"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <FaAngleDoubleLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:bg-primary hover:text-white"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FaChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:bg-primary hover:text-white"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <FaChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:bg-primary hover:text-white"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <FaAngleDoubleRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
