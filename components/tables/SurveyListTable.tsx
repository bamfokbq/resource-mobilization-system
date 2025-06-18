'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SURVEY_LISTS } from '@/constant';
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
import SearchTable from '../shared/SearchTable';
import SearchTableSkeletion from '../skeletons/SearchTableSkeletion';

export default function SurveyListTable() {
    const [data, setData] = useState<typeof SURVEY_LISTS>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedProject, setSelectedProject] = useState<typeof SURVEY_LISTS[0] | null>(null);

    console.log(selectedProject);


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
    };    // Define table columns
    const columns = useMemo<ColumnDef<typeof SURVEY_LISTS[0]>[]>(() => [
        { 
            accessorKey: "id", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-orange-600 transition-colors duration-200"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">ID</span>
                        <div className="text-slate-400 group-hover:text-orange-500 transition-colors duration-200">
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                    <span className="font-bold text-slate-900">#{row.original.id}</span>
                </div>
            )
        },
        { 
            accessorKey: "organisation", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-orange-600 transition-colors duration-200"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Organisation</span>
                        <div className="text-slate-400 group-hover:text-orange-500 transition-colors duration-200">
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
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                        <FaBuilding className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-medium text-slate-900">{row.original.organisation}</span>
                </div>
            )
        },
        { 
            accessorKey: "region", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-orange-600 transition-colors duration-200"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Region</span>
                        <div className="text-slate-400 group-hover:text-orange-500 transition-colors duration-200">
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-green-500" />
                    <span className="text-slate-700 font-medium">{row.original.region}</span>
                </div>
            )
        },
        { 
            accessorKey: "project_name", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-orange-600 transition-colors duration-200"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Project Name</span>
                        <div className="text-slate-400 group-hover:text-orange-500 transition-colors duration-200">
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
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <p className="font-semibold text-slate-900 truncate">{row.original.project_name}</p>
                    <p className="text-sm text-slate-500">Active Survey</p>
                </div>
            )
        },
        {
            id: "actions",
            header: () => <span className="font-semibold">Actions</span>,
            cell: ({ row }) => (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
                            onClick={() => setSelectedProject(row.original)}
                        >
                            <FaInfoCircle className="h-4 w-4 mr-2" />
                            View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] animate-in slide-in-from-top duration-300 ease-in-out bg-background">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl pb-4 border-b border-border">
                                <div className="p-2 rounded-full bg-navy-blue/10">
                                    <FaProjectDiagram className="text-navy-blue h-6 w-6" />
                                </div>
                                <span className="flex-1 text-foreground">{row.original.project_name}</span>
                                {/* <Badge className={`${getStatusBadge(row.original.status)} hover:bg-none ml-2 px-4 py-1 text-sm`}>
                                    {row.original.status}
                                </Badge> */}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid gap-8 py-6">
                            <div className="bg-muted/50 p-6 rounded-xl space-y-6 border border-border shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-navy-blue/10">
                                        <FaBuilding className="text-navy-blue h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Organisation</p>
                                        <p className="text-base font-semibold text-foreground">{row.original.organisation}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-navy-blue/10">
                                        <FaMapMarkerAlt className="text-navy-blue h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Region</p>
                                        <p className="text-base font-semibold text-foreground">{row.original.region}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-navy-blue/10">
                                        <FaInfoCircle className="text-navy-blue h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                                        <p className="text-base text-foreground/90 leading-relaxed">
                                            {row.original.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-navy-blue/10">
                                        <FaEnvelope className="text-navy-blue h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Contact</p>
                                        <p className="text-base font-semibold text-foreground">{row.original.contact}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-navy-blue/10">
                                        <FaCheckCircle className="text-navy-blue h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
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
    }); if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-40 animate-pulse"></div>
                                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                        <FaProjectDiagram className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Survey List
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Browse and manage available surveys
                        </p>
                    </div>
                </div>
                <Suspense fallback={<SearchTableSkeletion />}>
                    <SearchTable />
                </Suspense>
            </div>

            {data.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                        <FaProjectDiagram className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No surveys available</h3>
                    <p className="text-slate-500 mb-6">Available surveys will appear here when created.</p>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        Create New Survey
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
                                    <tr key={row.id} className="group hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-red-50/30 transition-all duration-200">
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

                        {/* Enhanced Pagination Controls */}
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
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <FaAngleDoubleLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
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
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <FaChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
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