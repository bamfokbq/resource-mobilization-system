'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SURVEY_HISTORY_LISTS } from '@/constant';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
    FaAngleDoubleLeft, FaAngleDoubleRight, FaBuilding,
    FaCheckCircle,
    FaChevronLeft, FaChevronRight,
    FaEnvelope,
    FaInfoCircle,
    FaMapMarkerAlt, FaProjectDiagram, FaSort,
    FaSortDown,
    FaSortUp
} from 'react-icons/fa';
import { useRouter } from "next/navigation";
import SearchTable from '../shared/SearchTable';
import SearchTableSkeletion from '../skeletons/SearchTableSkeletion';

export default function SurveyHistoryList() {
    const router = useRouter();
    const [data, setData] = useState<typeof SURVEY_HISTORY_LISTS>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedProject, setSelectedProject] = useState<typeof SURVEY_HISTORY_LISTS[0] | null>(null);

    console.log(selectedProject);


    useEffect(() => {
        setData(SURVEY_HISTORY_LISTS);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            'active': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'completed': 'bg-blue-100 text-blue-800',
            'inactive': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    // Define table columns
    const columns = useMemo<ColumnDef<typeof SURVEY_HISTORY_LISTS[0]>[]>(() => [
        { 
            accessorKey: "id", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        ID
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
            cell: ({ row }) => (
                <div className="font-medium">#{row.original.id}</div>
            )
        },
        { 
            accessorKey: "organisation", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Organisation
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
            cell: ({ row }) => <div>{row.original.organisation}</div>
        },
        { 
            accessorKey: "region", 
            header: ({ column }) => {
                return (
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
                )
            },
            cell: ({ row }) => <div>{row.original.region}</div>
        },
        { 
            accessorKey: "project_name", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Project Name
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
            cell: ({ row }) => <div>{row.original.project_name}</div>
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="transition-all cursor-pointer bg-green-600 hover:bg-green-500 text-white duration-200 hover:text-gray-100"
                    onClick={() => router.push(`/dashboard/surveys/${row.original.id}`)}
                >
                    View Details
                </Button>
            )
        }
    ], [router]);

    // Setup the table with pagination
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
                <h2 className="text-xl w-3/3 font-medium text-navy-blue flex items-center gap-2">
                    History
                </h2>
                <Suspense fallback={<SearchTableSkeletion />}>
                    <SearchTable />
                </Suspense>
            </div>
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
                
                {/* Pagination Controls */}
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