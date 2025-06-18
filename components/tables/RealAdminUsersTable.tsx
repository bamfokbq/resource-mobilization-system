'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    FaUserCircle,
    FaEllipsisV,
    FaKey,
    FaToggleOn,
    FaToggleOff,
    FaCalendarAlt,
    FaInfoCircle,
    FaUserShield,
    FaUsers
} from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { getAllUsers, resetUserPassword, toggleUserStatus } from "@/actions/users";
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    region: string;
    telephone: string;
    organisation: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    bio: string;
    passwordResetAt?: Date;
    statusUpdatedAt?: Date;
}

export default function RealAdminUsersTable() {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [resetPasswordDialog, setResetPasswordDialog] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null
    });
    const [toggleStatusDialog, setToggleStatusDialog] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null
    });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const users = await getAllUsers();
                setData(users);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleResetPassword = async () => {
        if (!resetPasswordDialog.user) return;

        setActionLoading(true);
        try {
            const result = await resetUserPassword(resetPasswordDialog.user.id);
            if (result.success) {
                toast.success(`Password reset successfully for ${resetPasswordDialog.user.name}`);
                setResetPasswordDialog({ open: false, user: null });
                // Refresh the data to show updated passwordResetAt
                const users = await getAllUsers();
                setData(users);
            } else {
                toast.error(result.error || "Failed to reset password");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Failed to reset password");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!toggleStatusDialog.user) return;

        setActionLoading(true);
        try {
            const result = await toggleUserStatus(toggleStatusDialog.user.id);
            if (result.success) {
                toast.success(result.message);
                setToggleStatusDialog({ open: false, user: null });
                // Refresh the data to show updated status
                const users = await getAllUsers();
                setData(users);
            } else {
                toast.error(result.error || "Failed to update user status");
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            toast.error("Failed to update user status");
        } finally {
            setActionLoading(false);
        }
    };

    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">User</span>
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
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                            <FaUserCircle className="h-7 w-7 text-emerald-600" />
                        </div>
                        {/* Activity indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${row.original.isActive ? 'bg-green-400' : 'bg-gray-400'
                            }`}></div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">
                            {row.original.name || 'N/A'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={row.original.role === 'Admin' ? 'destructive' : 'secondary'} className="text-xs">
                                {row.original.role === 'Admin' ? (
                                    <><FaUserShield className="w-3 h-3 mr-1" /> Admin</>
                                ) : (
                                    <><FaUsers className="w-3 h-3 mr-1" /> User</>
                                )}
                            </Badge>
                            {row.original.passwordResetAt && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <FaKey className="w-3 h-3 text-orange-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Password reset on {new Date(row.original.passwordResetAt).toLocaleDateString()}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">Contact Info</span>
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
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FaEnvelope className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-slate-700 font-medium truncate">{row.original.email}</span>
                    </div>
                    {row.original.telephone && (
                        <div className="flex items-center gap-2">
                            <FaPhone className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <span className="text-slate-600 text-sm">{row.original.telephone}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            accessorKey: "region",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">Location & Org</span>
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
                <div className="space-y-2">
                    {row.original.region && (
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-slate-700 font-medium text-sm">{row.original.region}</span>
                        </div>
                    )}
                    {row.original.organisation && (
                        <div className="flex items-center gap-2">
                            <FaBuilding className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                            <span className="text-slate-600 text-sm truncate">{row.original.organisation}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {row.original.isActive ? (
                            <>
                                <FaCheckCircle className="h-4 w-4 text-green-500" />
                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                    Active
                                </Badge>
                            </>
                        ) : (
                            <>
                                <FaTimesCircle className="h-4 w-4 text-red-500" />
                                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                    Inactive
                                </Badge>
                            </>
                        )}
                    </div>
                    {row.original.statusUpdatedAt && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <FaCalendarAlt className="h-3 w-3" />
                            <span>{new Date(row.original.statusUpdatedAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => (
                <div className="space-y-1">
                    <span className="text-slate-700 font-medium text-sm">
                        {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    {row.original.createdAt && (
                        <div className="text-xs text-slate-500">
                            {new Date(row.original.createdAt).toLocaleDateString() === new Date().toLocaleDateString()
                                ? 'Today'
                                : `${Math.floor((Date.now() - new Date(row.original.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
                        </div>
                    )}
                </div>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <span className="sr-only">Open menu</span>
                            <FaEllipsisV className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setResetPasswordDialog({ open: true, user: row.original })}
                            className="cursor-pointer"
                        >
                            <FaKey className="mr-2 h-4 w-4" />
                            Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setToggleStatusDialog({ open: true, user: row.original })}
                            className="cursor-pointer"
                        >
                            {row.original.isActive ? (
                                <>
                                    <FaToggleOff className="mr-2 h-4 w-4" />
                                    Deactivate User
                                </>
                            ) : (
                                <>
                                    <FaToggleOn className="mr-2 h-4 w-4" />
                                    Activate User
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(row.original.email)}
                            className="cursor-pointer"
                        >
                            <FaEnvelope className="mr-2 h-4 w-4" />
                            Copy Email
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
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
        <TooltipProvider>
            <div className="space-y-6">
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-700">Total Users</p>
                                    <p className="text-2xl font-bold text-emerald-900">{data.length}</p>
                                </div>
                                <FaUsers className="h-8 w-8 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700">Active Users</p>
                                    <p className="text-2xl font-bold text-green-900">{data.filter(user => user.isActive).length}</p>
                                </div>
                                <FaCheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700">Admins</p>
                                    <p className="text-2xl font-bold text-blue-900">{data.filter(user => user.role === 'Admin').length}</p>
                                </div>
                                <FaUserShield className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700">New This Month</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {data.filter(user => {
                                            if (!user.createdAt) return false;
                                            const userDate = new Date(user.createdAt);
                                            const now = new Date();
                                            return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                                <FaCalendarAlt className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
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
                            <FaInfoCircle className="w-4 h-4 text-blue-500" />
                            <span>Showing {table.getFilteredRowModel().rows.length} of {data.length} users</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
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
                                        className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                            }`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-6 py-4 text-sm"
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

                    {/* Enhanced Pagination */}
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

                {/* Password Reset Dialog */}
                <Dialog open={resetPasswordDialog.open} onOpenChange={(open) => setResetPasswordDialog({ open, user: null })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to reset the password for <strong>{resetPasswordDialog.user?.name}</strong>?
                                <br />
                                <span className="text-sm text-muted-foreground mt-2 block">
                                    The password will be reset to the default: <code className="bg-gray-100 px-1 rounded">ncd@2025</code>
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setResetPasswordDialog({ open: false, user: null })}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleResetPassword}
                                disabled={actionLoading}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                {actionLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Toggle Status Dialog */}
                <Dialog open={toggleStatusDialog.open} onOpenChange={(open) => setToggleStatusDialog({ open, user: null })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {toggleStatusDialog.user?.isActive ? 'Deactivate' : 'Activate'} User
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to {toggleStatusDialog.user?.isActive ? 'deactivate' : 'activate'} <strong>{toggleStatusDialog.user?.name}</strong>?
                                <br />
                                <span className="text-sm text-muted-foreground mt-2 block">
                                    {toggleStatusDialog.user?.isActive
                                        ? 'This will prevent the user from logging in.'
                                        : 'This will allow the user to log in again.'
                                    }
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setToggleStatusDialog({ open: false, user: null })}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleToggleStatus}
                                disabled={actionLoading}
                                variant={toggleStatusDialog.user?.isActive ? "destructive" : "default"}
                            >
                                {actionLoading
                                    ? (toggleStatusDialog.user?.isActive ? "Deactivating..." : "Activating...")
                                    : (toggleStatusDialog.user?.isActive ? "Deactivate" : "Activate")
                                }
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
