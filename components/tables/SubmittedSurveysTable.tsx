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
        <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span className="font-semibold">Survey Title</span>
          <div className="text-slate-400 group-hover:text-indigo-500 transition-colors duration-200">
            {column.getIsSorted() === "asc" ? (
              <FaSortUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <FaSortDown className="h-4 w-4" />
            ) : (
              <FaSort className="h-4 w-4" />
            )}
          </div>
        </div>
      )
    },
    cell: (info) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
          <RiSurveyLine className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{info.getValue()}</p>
          <p className="text-sm text-slate-500">Survey Response</p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('dateSubmitted', {
    header: () => <span className="font-semibold">Submission Date</span>,
    cell: (info) => (
      <div className="text-slate-700 font-medium">
        {new Date(info.getValue()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>
    ),
  }), columnHelper.accessor('status', {
    header: () => <span className="font-semibold">Status</span>,
    cell: (info) => {
      const status = info.getValue();
      let bgColor = 'bg-slate-100 text-slate-800';
      let displayText = status;

      if (status === 'completed' || status === 'submitted') {
        bgColor = 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
        displayText = 'completed';
      } else if (status === 'in_progress') {
        bgColor = 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
        displayText = 'in_progress';
      }

      return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}>
          {displayText.replace('_', ' ')}
        </span>
      );
    },
  }),
  columnHelper.accessor('score', {
    header: () => <span className="font-semibold">Score</span>,
    cell: (info) => (
      <div className="flex items-center gap-2">
        <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
            style={{ width: `${info.getValue()}%` }}
          ></div>
        </div>
        <span className="text-slate-700 font-medium">{info.getValue()}%</span>
      </div>
    ),
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
  }); return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
          <RiSurveyLine className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Submitted Surveys
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your completed survey submissions and responses
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
            <RiSurveyLine className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No submitted surveys yet</h3>
          <p className="text-slate-500 mb-6">Your completed surveys will appear here once submitted</p>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            Start Your First Survey
          </Button>
        </div>
      ) : (
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="group hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-indigo-50/30 transition-all duration-200">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-slate-700 font-medium"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-slate-100/30 px-6 py-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium">
                  Showing{" "}
                  <span className="font-bold text-slate-900">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-slate-900">
                    {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-900">
                    {data.length}
                  </span>{" "}
                  surveys
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-slate-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <FaAngleDoubleLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-slate-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <FaChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  <span className="text-sm font-medium text-slate-700">
                    {table.getState().pagination.pageIndex + 1}
                  </span>
                  <span className="text-sm text-slate-500">of</span>
                  <span className="text-sm font-medium text-slate-700">
                    {table.getPageCount()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-slate-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <FaChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-slate-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <FaAngleDoubleRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
