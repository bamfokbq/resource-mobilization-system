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
import { RiSurveyLine } from 'react-icons/ri';

interface Survey {
  id: string;
  title: string;
  dateSubmitted: string;
  status: 'completed' | 'in_progress' | 'submitted';
  score: number;
}

interface SubmittedSurveysTableProps {
  surveys?: any[];
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
  }), columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      let bgColor = 'bg-gray-100 text-gray-800';
      let displayText = status;

      if (status === 'completed' || status === 'submitted') {
        bgColor = 'bg-green-100 text-green-800';
        displayText = 'completed';
      } else if (status === 'in_progress') {
        bgColor = 'bg-yellow-100 text-yellow-800';
        displayText = 'in_progress';
      }

      return (
        <span className={`px-2 py-1 rounded-full text-sm ${bgColor}`}>
          {displayText.replace('_', ' ')}
        </span>
      );
    },
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    cell: (info) => `${info.getValue()}%`,
  }),
];

export default function SubmittedSurveysTable({ surveys = [] }: SubmittedSurveysTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Transform the surveys data to match the table interface
  const transformedData: Survey[] = surveys.map((survey) => ({
    id: survey._id?.toString() || '',
    title: survey.projectInfo?.projectName || survey.organisationInfo?.organisationName || 'Untitled Survey',
    dateSubmitted: survey.submissionDate || survey.lastUpdated || new Date().toISOString(),
    status: survey.status === 'submitted' ? 'completed' : 'in_progress',
    score: 100 // Default score since we don't have scoring yet
  }));

  const [data] = useState(() => transformedData);

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

      {data.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="text-gray-400 mb-4">
            <RiSurveyLine size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 mb-2">No submitted surveys yet</p>
          <p className="text-sm text-gray-400">Your completed surveys will appear here</p>
        </div>
      ) : (
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
          </div>        </div>
      )}
    </div>
  );
}
