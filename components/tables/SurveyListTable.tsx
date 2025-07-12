'use client';

import { getAllSurveys } from '@/actions/surveyActions';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
        timestamp: string;
    };
    submissionDate: string;
    lastUpdated: string;
    status: string;
    version: string;
}

export default function SurveyListTable() {
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
                    // Limit to recent 10 surveys for dashboard display
                    const recentSurveys = result.data.slice(0, 10);
                    setData(recentSurveys);
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
    }, []);

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

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            'submitted': 'bg-green-100 text-green-800',
            'draft': 'bg-yellow-100 text-yellow-800',
            'pending': 'bg-blue-100 text-blue-800',
            'inactive': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    // Define table columns
    const columns = useMemo<ColumnDef<SurveyData>[]>(() => [
        {
            accessorKey: "organisationInfo.organisationName",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-orange-600 transition-colors duration-200"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold text-xs sm:text-sm">Organisation</span>
                        <div className="text-slate-400 group-hover:text-orange-500 transition-colors duration-200">
                            {column.getIsSorted() === "asc" ? (
                                <FaSortUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : column.getIsSorted() === "desc" ? (
                                    <FaSortDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                                        <FaSort className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                        </div>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaBuilding className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                    </div>
                    <span className="font-medium text-slate-900 text-xs sm:text-sm truncate">
                        {row.original.organisationInfo?.organisationName || 'Unknown Organisation'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "organisationInfo.region",
            header: ({ column }) => {
                return (
                    <div className="hidden sm:flex items-center gap-2 cursor-pointer group hover:text-orange-600 transition-colors duration-200"
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
                <div className="hidden sm:flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium text-sm">
                        {row.original.organisationInfo?.region || 'Unknown Region'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "projectInfo.projectName",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2 cursor-pointer group hover:text-orange-600 transition-colors duration-200"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="font-semibold text-xs sm:text-sm">Project</span>
                        <div className="text-slate-400 group-hover:text-orange-500 transition-colors duration-200">
                            {column.getIsSorted() === "asc" ? (
                                <FaSortUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : column.getIsSorted() === "desc" ? (
                                    <FaSortDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                                        <FaSort className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                        </div>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="max-w-[120px] sm:max-w-xs">
                    <p className="font-semibold text-slate-900 truncate text-xs sm:text-sm">
                        {row.original.projectInfo?.projectName || 'Untitled Project'}
                    </p>
                    <p className="text-xs text-slate-500 hidden sm:block">Project Status</p>
                    <p className="text-xs text-slate-500 sm:hidden">
                        {row.original.organisationInfo?.region || 'Unknown Region'}
                    </p>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: () => <span className="font-semibold text-xs sm:text-sm">Status</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge className={`${getStatusBadge(row.original.status || 'inactive')} hover:bg-none px-2 sm:px-3 py-1 text-xs font-medium`}>
                        <span className="hidden sm:inline">
                            {(row.original.status || 'inactive').charAt(0).toUpperCase() + (row.original.status || 'inactive').slice(1)}
                        </span>
                        <span className="sm:hidden">
                            {(row.original.status || 'inactive').charAt(0).toUpperCase() + (row.original.status || 'inactive').slice(1, 3)}
                        </span>
                    </Badge>
                </div>
            )
        },
        {
            id: "actions",
            header: () => <span className="font-semibold text-xs sm:text-sm">Actions</span>,
            cell: ({ row }) => (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                            onClick={() => setSelectedProject(row.original)}
                        >
                            <FaInfoCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                            <span className="hidden sm:inline">View Details</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-top duration-300 ease-in-out bg-background">
                        <DialogHeader>
                            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-lg sm:text-2xl pb-4 border-b border-border">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="p-2 rounded-full bg-navy-blue/10 flex-shrink-0">
                                        <FaProjectDiagram className="text-navy-blue h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <span className="flex-1 text-foreground text-sm sm:text-lg break-words">
                                        {row.original.projectInfo?.projectName || 'Untitled Project'}
                                    </span>
                                </div>
                                <Badge className={`${getStatusBadge(row.original.status || 'inactive')} hover:bg-none px-3 sm:px-4 py-1 text-xs sm:text-sm flex-shrink-0`}>
                                    {(row.original.status || 'inactive').charAt(0).toUpperCase() + (row.original.status || 'inactive').slice(1)}
                                </Badge>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-6 sm:gap-8 py-4 sm:py-6">
                            <div className="bg-muted/50 p-4 sm:p-6 rounded-xl space-y-4 sm:space-y-6 border border-border shadow-sm">
                                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 rounded-lg bg-navy-blue/10 flex-shrink-0">
                                        <FaBuilding className="text-navy-blue h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Organisation</p>
                                        <p className="text-sm sm:text-base font-semibold text-foreground break-words">
                                            {row.original.organisationInfo?.organisationName || 'Unknown Organisation'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 rounded-lg bg-navy-blue/10 flex-shrink-0">
                                        <FaMapMarkerAlt className="text-navy-blue h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Region</p>
                                        <p className="text-sm sm:text-base font-semibold text-foreground">
                                            {row.original.organisationInfo?.region || 'Unknown Region'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 rounded-lg bg-navy-blue/10 flex-shrink-0">
                                        <FaEnvelope className="text-navy-blue h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Contact Email</p>
                                        <p className="text-sm sm:text-base font-semibold text-foreground break-all">
                                            {row.original.organisationInfo?.email || 'No email provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 rounded-lg bg-navy-blue/10 flex-shrink-0">
                                        <FaInfoCircle className="text-navy-blue h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Project Details</p>
                                        <div className="space-y-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Submission Date:</span>
                                                <span className="text-xs sm:text-sm text-foreground">
                                                    {formatDate(row.original.submissionDate)}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created By:</span>
                                                <span className="text-xs sm:text-sm text-foreground break-words">
                                                    {row.original.createdBy?.name || 'Unknown User'}
                                                </span>
                                            </div>
                                            {row.original.projectInfo?.regions && (
                                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                                    <span className="text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0">Target Regions:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {row.original.projectInfo.regions.map((region, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {region}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {row.original.projectInfo?.targetedNCDs && (
                                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                                    <span className="text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0">Target NCDs:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {row.original.projectInfo.targetedNCDs.map((ncd, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {ncd}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 rounded-lg bg-navy-blue/10 flex-shrink-0">
                                        <FaCheckCircle className="text-navy-blue h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Status</p>
                                        <Badge className={`${getStatusBadge(row.original.status || 'inactive')} px-3 sm:px-4 py-1`}>
                                            {(row.original.status || 'inactive').charAt(0).toUpperCase() + (row.original.status || 'inactive').slice(1)}
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
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="h-6 sm:h-8 w-24 sm:w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                    <div className="h-8 sm:h-10 w-full sm:w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
                    <div className="p-4 sm:p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-2 sm:space-x-4">
                                <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-12 sm:w-16 animate-pulse"></div>
                                <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20 sm:w-32 animate-pulse"></div>
                                <div className="hidden sm:block h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 animate-pulse"></div>
                                <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 sm:w-40 animate-pulse"></div>
                                <div className="h-6 sm:h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16 sm:w-20 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <Suspense fallback={<SearchTableSkeletion />}>
                    <SearchTable />
                </Suspense>
            </div>

            {error ? (
                <div className="bg-white rounded-xl border border-red-200 shadow-lg p-6 sm:p-12 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <FaInfoCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-2">Error Loading Surveys</h3>
                    <p className="text-sm sm:text-base text-red-600 mb-4 sm:mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base px-4 py-2"
                    >
                        Try Again
                    </Button>
                </div>
            ) : data.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 p-6 sm:p-12 text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                            <FaProjectDiagram className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                    </div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No surveys available</h3>
                        <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6">Available surveys will appear here when created.</p>
                        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base px-4 py-2">
                        Create New Survey
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <table className="w-full min-w-[600px] table-auto">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60">
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 whitespace-nowrap"
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
                                                className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 font-medium align-top"
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
                            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-slate-100/30 px-3 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 order-2 sm:order-1">
                                    <span className="text-xs sm:text-sm text-slate-600 font-medium text-center">
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
                                <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <FaAngleDoubleLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                    <div className="flex items-center gap-1 mx-1 sm:mx-2">
                                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                                            {table.getState().pagination.pageIndex + 1}
                                        </span>
                                        <span className="text-xs sm:text-sm text-slate-500">of</span>
                                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                                            {table.getPageCount()}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-slate-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <FaAngleDoubleRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
            )}
        </div>
    );
}