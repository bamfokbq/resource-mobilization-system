'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
    FaAngleDoubleLeft, FaAngleDoubleRight,
    FaChevronLeft, FaChevronRight,
    FaSort,
    FaSortDown,
    FaSortUp,
    FaUser,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaBuilding,
    FaShieldAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaSearch,
    FaUserCircle
} from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { getAllUsers } from "@/actions/users";

interface User {
    name: string;
    email: string;
    region: string;
    telephone: string;
    organisation: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    bio: string;
}

export default function RealAdminUsersTable() {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const users = await getAllUsers();
                setData(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">Name</span>
                    <div className="text-slate-400 group-hover:text-emerald-500 transition-colors duration-200">
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
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                        <FaUserCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{row.original.name || 'N/A'}</p>
                        <p className="text-sm text-slate-500">{row.original.role}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">Email</span>
                    <div className="text-slate-400 group-hover:text-emerald-500 transition-colors duration-200">
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaEnvelope className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-700 font-medium">{row.original.email}</span>
                </div>
            )
        },
        {
            accessorKey: "telephone",
            header: "Phone",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaPhone className="h-4 w-4 text-purple-500" />
                    <span className="text-slate-700 font-medium">{row.original.telephone || 'N/A'}</span>
                </div>
            )
        },
        {
            accessorKey: "region",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">Region</span>
                    <div className="text-slate-400 group-hover:text-emerald-500 transition-colors duration-200">
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-green-500" />
                    <span className="text-slate-700 font-medium">{row.original.region || 'N/A'}</span>
                </div>
            )
        },
        {
            accessorKey: "organisation",
            header: "Organisation",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaBuilding className="h-4 w-4 text-indigo-500" />
                    <span className="text-slate-700 font-medium">{row.original.organisation || 'N/A'}</span>
                </div>
            )
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaShieldAlt className="h-4 w-4 text-orange-500" />
                    <Badge variant={row.original.role === 'Admin' ? 'destructive' : 'secondary'}>
                        {row.original.role}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.isActive ? (
                        <>
                            <FaCheckCircle className="h-4 w-4 text-green-500" />
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Active
                            </Badge>
                        </>
                    ) : (
                        <>
                            <FaTimesCircle className="h-4 w-4 text-red-500" />
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Inactive
                            </Badge>
                        </>
                    )}
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span className="text-slate-600 text-sm">
                    {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : 'N/A'}
                </span>
            )
        }
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Stats */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search users by name, email, region..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(String(event.target.value))}
                        className="pl-10 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                    />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span>Total Users: {data.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span>Active: {data.filter(user => user.isActive).length}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                        >
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
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                    }`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {table.getRowModel().rows.length === 0 && (
                    <div className="text-center py-12">
                        <FaUser className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500">
                            {globalFilter ? 'Try adjusting your search criteria.' : 'No users have been created yet.'}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {table.getRowModel().rows.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-700">
                                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )}{' '}
                                of {table.getFilteredRowModel().rows.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="h-8 w-8 p-0"
                                >
                                    <FaAngleDoubleLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="h-8 w-8 p-0"
                                >
                                    <FaChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-gray-700 px-2">
                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="h-8 w-8 p-0"
                                >
                                    <FaChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="h-8 w-8 p-0"
                                >
                                    <FaAngleDoubleRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
