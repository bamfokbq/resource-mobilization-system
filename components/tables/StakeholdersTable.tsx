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

    const columns = useMemo<ColumnDef<NestedRow>[]>(() => [
        {
            accessorKey: "region",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Region
                    {column.getIsSorted() === "asc" ? (
                        <FaSortUp className="h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <FaSortDown className="h-4 w-4" />
                    ) : (
                        <FaSort className="h-4 w-4" />
                    )}
                </div>
            ),
            cell: ({ row }) => {
                return row.original.region ? (
                    <span className="font-medium">{row.original.region}</span>
                ) : null;
            },
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => row.original.category || '',
        },
        {
            accessorKey: "organisations",
            header: "Organisations",
            cell: ({ row }) => {
                if (row.original.organisations) {
                    return row.original.organisations.join(", ");
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
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <p className="mt-2 text-sm text-gray-600">
                    A comprehensive list of stakeholders across different regions and categories in the NCD ecosystem.
                </p>
            </div>
            <ScrollArea>
                <div className="rounded-lg overflow-hidden border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
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
                                                className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700"
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t px-3 py-2 sm:px-6 sm:py-3 gap-3 sm:gap-0">
                <div className="text-xs sm:text-sm text-gray-700">
                    Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>{" "}
                    of <span className="font-medium">{table.getPageCount()}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9 transition-all duration-200 hover:bg-navy-blue hover:text-white border-navy-blue text-navy-blue"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FaAngleDoubleLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9 transition-all duration-200 hover:bg-navy-blue hover:text-white border-navy-blue text-navy-blue"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9 transition-all duration-200 hover:bg-navy-blue hover:text-white border-navy-blue text-navy-blue"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9 transition-all duration-200 hover:bg-navy-blue hover:text-white border-navy-blue text-navy-blue"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <FaAngleDoubleRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
