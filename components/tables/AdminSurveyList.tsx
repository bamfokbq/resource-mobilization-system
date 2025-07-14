'use client';

import { getAllSurveys } from '@/actions/surveyActions';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
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
    const [isSheetOpen, setIsSheetOpen] = useState(false);
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

    const handleViewSurvey = (survey: SurveyData) => {
        setSelectedProject(survey);
        setIsSheetOpen(true);
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
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaBuilding className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate" title={row.original?.organisationInfo?.organisationName || 'N/A'}>
                            {row.original?.organisationInfo?.organisationName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 truncate" title={row.original?.organisationInfo?.sector || 'Unknown sector'}>
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
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaUser className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate" title={row.original?.createdBy?.name || 'Unknown User'}>
                            {row.original?.createdBy?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 truncate" title={row.original?.createdBy?.email || 'No email'}>
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
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaProjectDiagram className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate" title={row.original?.projectInfo?.projectName || 'Unnamed Project'}>
                            {row.original?.projectInfo?.projectName || 'Unnamed Project'}
                        </div>
                        <div className="text-sm text-gray-500 truncate" title={row.original?.organisationInfo?.region || 'Unknown region'}>
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSurvey(row.original)}
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
                                    <table className="w-full min-w-full table-fixed">
                                        <colgroup>
                                            <col className="w-[30%]" />
                                            <col className="w-[25%]" />
                                            <col className="w-[25%]" />
                                            <col className="w-[10%]" />
                                            <col className="w-[10%]" />
                                        </colgroup>
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th key={header.id} className="px-4 py-4 text-left">
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
                                                <td key={cell.id} className="px-4 py-4 truncate">
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

            {/* Survey Details Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-gray-900">
                            Survey Details
                        </SheetTitle>
                        <SheetDescription>
                            View comprehensive information about this survey submission
                        </SheetDescription>
                    </SheetHeader>

                    {selectedProject && (
                        <div className="mt-6 space-y-6">
                            {/* Organisation Information */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaBuilding className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-blue-900">Organisation Information</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-blue-700">Organisation Name</label>
                                        <p className="text-gray-800 font-medium">
                                            {selectedProject.organisationInfo?.organisationName || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium text-blue-700">Region</label>
                                            <p className="text-gray-800">
                                                {selectedProject.organisationInfo?.region || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-blue-700">Sector</label>
                                            <p className="text-gray-800">
                                                {selectedProject.organisationInfo?.sector || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-blue-700">Email</label>
                                        <p className="text-gray-800">
                                            {selectedProject.organisationInfo?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Project Information */}
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaProjectDiagram className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-lg font-semibold text-purple-900">Project Information</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-purple-700">Project Name</label>
                                        <p className="text-gray-800 font-medium">
                                            {selectedProject.projectInfo?.projectName || 'Unnamed Project'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium text-purple-700">Start Date</label>
                                            <p className="text-gray-800">
                                                {selectedProject.projectInfo?.startDate ?
                                                    formatDate(selectedProject.projectInfo.startDate) : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-purple-700">End Date</label>
                                            <p className="text-gray-800">
                                                {selectedProject.projectInfo?.endDate ?
                                                    formatDate(selectedProject.projectInfo.endDate) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-purple-700">Regions</label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedProject.projectInfo?.regions?.length ?
                                                selectedProject.projectInfo.regions.map((region, index) => (
                                                    <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                                                        {region}
                                                    </Badge>
                                                )) :
                                                <span className="text-gray-800">N/A</span>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-purple-700">Targeted NCDs</label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedProject.projectInfo?.targetedNCDs?.length ?
                                                selectedProject.projectInfo.targetedNCDs.map((ncd, index) => (
                                                    <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                                                        {ncd}
                                                    </Badge>
                                                )) :
                                                <span className="text-gray-800">N/A</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Creator Information */}
                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaUser className="h-5 w-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-green-900">Created By</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-green-700">Name</label>
                                        <p className="text-gray-800 font-medium">
                                            {selectedProject.createdBy?.name || 'Unknown User'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-green-700">Email</label>
                                        <p className="text-gray-800">
                                            {selectedProject.createdBy?.email || 'No email'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-green-700">User ID</label>
                                        <p className="text-gray-800 text-sm font-mono bg-white px-2 py-1 rounded">
                                            {selectedProject.createdBy?.userId || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-green-700">Created On</label>
                                        <p className="text-gray-800">
                                            {selectedProject.createdBy?.timestamp ?
                                                formatDate(selectedProject.createdBy.timestamp) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submission Details */}
                            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaCalendarAlt className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-indigo-900">Submission Details</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium text-indigo-700">Survey ID</label>
                                            <p className="text-gray-800 text-sm font-mono bg-white px-2 py-1 rounded">
                                                {selectedProject._id}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-indigo-700">Version</label>
                                            <p className="text-gray-800">
                                                {selectedProject.version || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium text-indigo-700">Submitted</label>
                                            <p className="text-gray-800">
                                                {formatDate(selectedProject.submissionDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-indigo-700">Last Updated</label>
                                            <p className="text-gray-800">
                                                {formatDate(selectedProject.lastUpdated)}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-indigo-700">Status</label>
                                        <div className="mt-1">
                                            <Badge className={`${getStatusBadge(selectedProject.status || 'inactive')} font-medium`}>
                                                {(selectedProject.status || 'inactive').charAt(0).toUpperCase() +
                                                    (selectedProject.status || 'inactive').slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    onClick={() => router.push(`/survey-data/overview?id=${selectedProject._id}`)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    <FaEye className="h-4 w-4 mr-2" />
                                    View Full Details
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSheetOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
