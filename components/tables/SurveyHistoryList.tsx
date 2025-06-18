'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllSurveys } from '@/actions/surveyActions';
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
    FaSortUp,
    FaCalendarAlt,
    FaUser
} from 'react-icons/fa';
import { useRouter } from "next/navigation";
import SearchTable from '../shared/SearchTable';
import SearchTableSkeletion from '../skeletons/SearchTableSkeletion';

// Interface for survey data from database
interface SurveyData {
    _id: string;
    organisationInfo?: {
        organisationName: string;
        region: string;
        sector: string;
        email: string;
    };
    projectInfo?: {
        projectName: string;
        startDate: string;
        endDate?: string;
        regions: string[];
        targetedNCDs: string[];
    };
    createdBy: {
        userId: string;
        email: string;
        name: string;
        timestamp: Date;
    };
    submissionDate: Date;
    lastUpdated: Date;
    status: string;
    version: string;
}

export default function SurveyHistoryList() {
    const router = useRouter();
    const [data, setData] = useState<SurveyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedProject, setSelectedProject] = useState<SurveyData | null>(null);
    const [error, setError] = useState<string | null>(null);

    console.log(selectedProject);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setIsLoading(true);
                const result = await getAllSurveys();

                if (result.success && result.data) {
                    setData(result.data);
                    setError(null);
                } else {
                    setError(result.message || 'Failed to load surveys');
                    setData([]);
                }
            } catch (err) {
                console.error('Error fetching surveys:', err);
                setError('An unexpected error occurred while loading surveys');
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurveys();
    }, []); const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            'submitted': 'bg-green-100 text-green-800',
            'draft': 'bg-yellow-100 text-yellow-800',
            'pending': 'bg-blue-100 text-blue-800',
            'inactive': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string | Date) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };    // Define table columns
    const columns = useMemo<ColumnDef<SurveyData>[]>(() => [
        {
            accessorKey: "organisationInfo.organisationName", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Organisation</span>
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
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <FaBuilding className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <span className="font-medium text-slate-900">
                            {row.original.organisationInfo?.organisationName || 'Unknown Organisation'}
                        </span>
                        <p className="text-xs text-slate-500">
                            {row.original.organisationInfo?.sector || 'Unknown Sector'}
                        </p>
                    </div>
                </div>
            )
        },
        { 
            accessorKey: "organisationInfo.region", 
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
                         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Region</span>
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-green-500" />
                    <span className="text-slate-700 font-medium">
                        {row.original.organisationInfo?.region || 'Unknown Region'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "projectInfo.projectName",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Project Name</span>
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
            }, cell: ({ row }) => (
                <div className="max-w-xs">
                    <p className="font-semibold text-slate-900 truncate">
                        {row.original.projectInfo?.projectName || 'Untitled Project'}
                    </p>
                </div>
            )
        },
        {
            accessorKey: "submissionDate",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Submitted</span>
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
            }, cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-purple-500" />
                    <span className="text-slate-700 font-medium">
                        {formatDate(row.original.submissionDate)}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Status</span>
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
            cell: ({ row }) => (
                <Badge className={`${getStatusBadge(row.original.status)} border-0 font-medium`}>
                    {row.original.status === 'submitted' ? 'Completed' : row.original.status}
                </Badge>
            )
        }, {
            id: "actions",
            header: () => <span className="font-semibold">Actions</span>,
            cell: ({ row }) => (
                <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium w-10 h-10 p-0"
                    onClick={() => router.push(`/dashboard/surveys/${row.original._id}`)}
                    title="View Details"
                >
                    <FaInfoCircle className="h-4 w-4" />
                </Button>
            )
        }
    ], [router, formatDate, getStatusBadge]);

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

    if (error) {
        return (
            <div className="space-y-6">
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <FaProjectDiagram className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Survey History
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                View and manage your completed surveys
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-red-200/60 shadow-lg shadow-red-900/5 p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                        <FaInfoCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Surveys</h3>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <Button
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                        <FaProjectDiagram className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Survey History
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            View and manage your completed surveys
                        </p>
                    </div>
                </div>                <div className="w-80">
                    <Suspense fallback={<SearchTableSkeletion />}>
                        <SearchTable />
                    </Suspense>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                        <FaProjectDiagram className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No surveys found</h3>
                    <p className="text-slate-500 mb-6">Your survey history will appear here once you complete surveys.</p>
                    <Button
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => router.push('/survey')}
                    >
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
                                    {table.getRowModel().rows.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            className="group hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-200"
                                        >
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
                                    results
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <FaAngleDoubleLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
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
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <FaChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
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