"use client";

import { Button } from "@/components/ui/button";
import { STAKEHOLDERS_BY_REGIONS } from '@/constant';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
    FaAngleDoubleLeft, FaAngleDoubleRight,
    FaChevronLeft, FaChevronRight,
    FaSort,
    FaSortDown,
    FaSortUp,
    FaUsers,
    FaBuilding,
    FaMapMarkerAlt
} from 'react-icons/fa';

type NestedRow = {
    region?: string;
    category?: string;
    organisations?: string[];
    subRows?: NestedRow[];
};

export default function StakeholdersTable() {
    const [data, setData] = useState<NestedRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        // Transform data into nested structure
        const nestedData = STAKEHOLDERS_BY_REGIONS.map(region => ({
            region: region.region,
            subRows: region.stakeholders.map(stakeholder => ({
                category: stakeholder.category,
                organisations: stakeholder.organisations,
            }))
        }));
        setData(nestedData);
        setIsLoading(false);
    }, []);

    const columns = useMemo<ColumnDef<NestedRow>[]>(() => [{
            accessorKey: "region",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-blue-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">Region</span>
                    <div className="text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                        {column.getIsSorted() === "asc" ? (
                            <FaSortUp className="h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <FaSortDown className="h-4 w-4" />
                        ) : (
                            <FaSort className="h-4 w-4" />
                        )}
                    </div>
                </div>
            ),
            cell: ({ row }) => {
                return row.original.region ? (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{row.original.region}</p>
                            <p className="text-sm text-slate-500">Regional Hub</p>
                        </div>
                    </div>
                ) : null;
            },
        },
        {
            accessorKey: "category",
            header: () => <span className="font-semibold">Category</span>,
            cell: ({ row }) => row.original.category ? (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    <span className="text-slate-700 font-medium">{row.original.category}</span>
                </div>
            ) : '',
        },
        {
            accessorKey: "organisations",
            header: () => <span className="font-semibold">Organisations</span>,
            cell: ({ row }) => {
                if (row.original.organisations) {
                    return (
                        <div className="space-y-1">
                            {row.original.organisations.slice(0, 3).map((org, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <FaBuilding className="h-3 w-3 text-slate-400" />
                                    <span className="text-slate-700 text-sm">{org}</span>
                                </div>
                            ))}
                            {row.original.organisations.length > 3 && (
                                <div className="text-xs text-slate-500 pl-5">
                                    +{row.original.organisations.length - 3} more organizations
                                </div>
                            )}
                        </div>
                    );
                }
                return "";
            },
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        getSubRows: row => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getExpandedRowModel: getExpandedRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
            expanded: true, // This will expand all rows by default
        },
    }); if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
                    <div className="p-6 space-y-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded flex-1 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <FaUsers className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Stakeholders Directory
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Stakeholders across different regions and categories in the NCD ecosystem
                    </p>
                </div>
            </div>

            <ScrollArea>
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
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
                                    <tr key={row.id} className="group hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-200">
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
                </div>
            </ScrollArea>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-slate-100/30 px-6 py-4 gap-4 rounded-b-xl">
                <div className="text-sm text-slate-600 font-medium">
                    Showing <span className="font-bold text-slate-900">{table.getRowModel().rows.length}</span> stakeholder regions
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FaAngleDoubleLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
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
                        className="h-9 w-9 p-0 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <FaChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <FaAngleDoubleRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
