'use client';

import { useState, useMemo, useEffect, Suspense } from "react";
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
import SearchTable from '../shared/SearchTable';
import SearchTableSkeletion from '../skeletons/SearchTableSkeletion';

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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="transition-all cursor-pointer bg-green-600 hover:bg-green-500 text-white duration-200  hover:text-gray-100"
                            onClick={() => setSelectedProject(row.original)}
                        >
                            View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] animate-in slide-in-from-top duration-300 ease-in-out">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl pb-4 border-b">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <FaProjectDiagram className="text-primary h-6 w-6" />
                                </div>
                                <span className="flex-1">{row.original.project_name}</span>
                                <Badge className={`${getStatusBadge(row.original.status)} hover:bg-none ml-2 px-4 py-1 text-sm`}>
                                    {row.original.status}
                                </Badge>
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid gap-8 py-6">
                            <div className="bg-gray-50/50 p-6 rounded-xl space-y-6 border">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <FaBuilding className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Organisation</p>
                                        <p className="text-base font-semibold">{row.original.organisation}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <FaMapMarkerAlt className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Region</p>
                                        <p className="text-base font-semibold">{row.original.region}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <FaInfoCircle className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                                        <p className="text-base text-gray-700 leading-relaxed">
                                            {row.original.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <FaEnvelope className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Contact</p>
                                        <p className="text-base font-semibold">{row.original.contact}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <FaCheckCircle className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                                        <Badge className={`${getStatusBadge(row.original.status)} px-4 py-1`}>
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
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
                <h2 className="text-2xl w-3/3 font-bold text-gray-800 flex items-center gap-2">
                    <FaProjectDiagram className="text-primary" />
                    Survey List
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