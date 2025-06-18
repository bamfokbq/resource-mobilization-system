'use client';

import { getAllSurveys } from '@/actions/surveyActions';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
    FaAngleDoubleLeft, FaAngleDoubleRight, FaBuilding,
    FaCalendarAlt,
    FaChevronLeft, FaChevronRight,
    FaInfoCircle,
    FaMapMarkerAlt, FaProjectDiagram, FaSort,
    FaSortDown,
    FaSortUp,
    FaUser,
    FaEye
} from 'react-icons/fa';
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
        timestamp: string; // ISO string
    };
    submissionDate: string; // ISO string
    lastUpdated: string; // ISO string
    status: string;
    version: string;
}

interface AdminSurveyListProps {
    initialData?: {
        success: boolean;
        data?: SurveyData[];
        message: string;
        count?: number;
    };
}

export default function AdminSurveyList({ initialData }: AdminSurveyListProps) {
    const router = useRouter();
    const [data, setData] = useState<SurveyData[]>(initialData?.data || []);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedProject, setSelectedProject] = useState<SurveyData | null>(null);
    const [error, setError] = useState<string | null>(
        initialData && !initialData.success ? initialData.message : null
    );

    useEffect(() => {
        // Only fetch data if we don't have initial data from server
        if (initialData) {
            return; // Data is already set in state initialization
        }

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
    }, [initialData]);

    const getStatusBadge = (status: string) => {
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
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    // Define table columns for admin view
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
                        <div className="font-medium text-gray-900">
                            {row.original?.organisationInfo?.organisationName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {row.original?.organisationInfo?.sector || 'Unknown sector'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "createdBy.name",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Created By</span>
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
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <FaUser className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            {row.original?.createdBy?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {row.original?.createdBy?.email || 'No email'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "projectInfo.projectName",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold">Project</span>
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
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <FaProjectDiagram className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            {row.original?.projectInfo?.projectName || 'Unnamed Project'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {row.original?.organisationInfo?.region || 'Unknown region'}
                        </div>
                    </div>
                </div>
            ),
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
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">
                        {formatDate(row.original.submissionDate)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status || 'inactive';
                return (
                    <Badge className={`${getStatusBadge(status)} font-medium`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/survey-data/overview?id=${row.original._id}`)}
                        className="hover:bg-blue-50 hover:text-blue-600 border-blue-200"
                    >
                        <FaEye className="h-4 w-4 mr-1" />
                        View
                    </Button>
                </div>
            ),
        },
    ], [router]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    if (error) {
        return (
            <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-center">
                    <FaInfoCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Surveys</h3>
                    <p className="text-gray-600">{error}</p>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4"
                        variant="outline"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Search & Filter</h3>
                    <Suspense fallback={<SearchTableSkeletion />}>
                        <SearchTable />
                    </Suspense>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        All Survey Submissions ({data.length})
                    </h3>
                </div>

                {isLoading ? (
                    <div className="p-8">
                        <div className="animate-pulse space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center">
                        <FaInfoCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Surveys Found</h3>
                        <p className="text-gray-600">No surveys have been submitted yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th key={header.id} className="px-6 py-4 text-left">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        data.length
                                    )}{' '}
                                    of {data.length} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <FaAngleDoubleLeft />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <FaChevronLeft />
                                    </Button>
                                    <span className="text-sm text-gray-600 px-2">
                                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <FaChevronRight />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <FaAngleDoubleRight />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
