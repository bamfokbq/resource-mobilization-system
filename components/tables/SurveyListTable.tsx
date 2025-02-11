'use client';

import { useState, useMemo, useEffect } from "react";
import { 
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    ColumnDef, 
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaEye, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaBuilding, 
         FaMapMarkerAlt, FaProjectDiagram, FaSort, FaSortUp, FaSortDown, FaInfoCircle, 
         FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";
import { MdEmail } from 'react-icons/md';
import { SURVEY_LISTS } from '@/constant';

export default function SurveyListTable() {
    const [data, setData] = useState<typeof SURVEY_LISTS>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedProject, setSelectedProject] = useState<typeof SURVEY_LISTS[0] | null>(null);

    useEffect(() => {
        setData(SURVEY_LISTS);
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
    const columns = useMemo<ColumnDef<typeof SURVEY_LISTS[0]>[]>(() => [
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-500" />
                    <span>{row.original.organisation}</span>
                </div>
            )
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>{row.original.region}</span>
                </div>
            )
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaProjectDiagram className="text-gray-500" />
                    <span>{row.original.project_name}</span>
                </div>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="transition-all duration-200 hover:bg-primary hover:text-white"
                            onClick={() => setSelectedProject(row.original)}
                        >
                            <FaEye className="mr-2 h-4 w-4" /> View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl pb-2 border-b">
                                <FaProjectDiagram className="text-primary" />
                                <span className="flex-1">{row.original.project_name}</span>
                                <Badge className={`${getStatusBadge(row.original.status)} ml-2`}>
                                    {row.original.status}
                                </Badge>
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid gap-6 py-4">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaBuilding className="text-gray-500 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Organisation</p>
                                        <p className="text-base">{row.original.organisation}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-gray-500 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Region</p>
                                        <p className="text-base">{row.original.region}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaInfoCircle className="text-gray-500 h-5 w-5 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Description</p>
                                        <p className="text-base text-gray-700">{row.original.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-gray-500 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Contact</p>
                                        <p className="text-base">{row.original.contact}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <FaCheckCircle className="text-gray-500 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <Badge className={getStatusBadge(row.original.status)}>
                                            {row.original.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }
    ], []);

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
        <div className="space-y-4 p-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaProjectDiagram className="text-primary" />
                Survey List
            </h2>
            <div className="rounded-lg border bg-white shadow-lg">
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