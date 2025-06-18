'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_LISTS } from '@/constant';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
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
    FaCheckCircle
} from 'react-icons/fa';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  telephone: z.string().optional(),
  region: z.string().min(2, "Region is required"),
  organisation: z.string().optional(),
});


export default function AdminUsersTable() {
    const [data, setData] = useState<typeof USER_LISTS>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedUser, setSelectedUser] = useState<typeof USER_LISTS[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        telephone: '',
        region: '',
        organisation: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        setIsDialogOpen(false);
    };

    // Update useEffect to set form data when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            const [firstName, lastName] = selectedUser.name.split(' ');
            setFormData({
                firstName: firstName || '',
                lastName: lastName || '',
                email: selectedUser.email,
                password: '',
                telephone: selectedUser.telephone || '',
                region: selectedUser.region,
                organisation: selectedUser.organisation || ''
            });
        }
    }, [selectedUser]);

    useEffect(() => {
        setData(USER_LISTS);
        setIsLoading(false);
    }, []);

    const columns = useMemo<ColumnDef<typeof USER_LISTS[0]>[]>(() => [{
            accessorKey: "id",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer group hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="font-semibold">ID</span>
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
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                <span className="font-bold text-slate-900">#{row.original.id}</span>
            </div>
        )
        },
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
                        <FaUser className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{row.original.name}</p>
                        <p className="text-sm text-slate-500">User Account</p>
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
                    <span className="text-slate-700 font-medium">{row.original.region}</span>
                </div>
            )
        },
        {
            id: "actions",
            header: () => <span className="font-semibold">Actions</span>,
            cell: ({ row }) => (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
                            onClick={() => setSelectedUser(row.original)}
                        >
                            <FaUser className="h-4 w-4 mr-2" />
                            Edit User
                        </Button>
                    </DialogTrigger>                    <DialogContent className="sm:max-w-[600px] bg-white rounded-xl border border-slate-200/60 shadow-2xl shadow-slate-900/10">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl pb-6 border-b border-slate-200/60">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                                    <FaUser className="text-white h-6 w-6" />
                                </div>
                                <div>
                                    <span className="flex-1 text-slate-900 font-bold">Edit User Details</span>
                                    <p className="text-sm text-slate-500 font-normal mt-1">Update user information and settings</p>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="firstName">
                                        First Name
                                    </label>
                                    <Input
                                        className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="lastName">
                                        Last Name
                                    </label>
                                    <Input
                                        className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                                    Email Address
                                </label>
                                <Input
                                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                    Password
                                </label>
                                <Input
                                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter new password"
                                />
                                <p className="text-xs text-slate-500">Leave blank to keep current password</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="telephone">
                                    Telephone
                                </label>
                                <Input
                                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="region">
                                    Region
                                </label>
                                <Input
                                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                    id="region"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleInputChange}
                                    placeholder="Enter region"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="organisation">
                                    Organisation
                                </label>
                                <Input
                                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                    id="organisation"
                                    name="organisation"
                                    value={formData.organisation}
                                    onChange={handleInputChange}
                                    placeholder="Enter organisation"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/60">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        setFormData({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            password: '',
                                            telephone: '',
                                            region: '',
                                            organisation: ''
                                        });
                                        setSelectedUser(null);
                                    }}
                                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    <FaCheckCircle className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )
        }
    ], [isDialogOpen, formData]);

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
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 animate-pulse"></div>
                                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <FaUser className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        User Management
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage and edit user accounts
                    </p>
                </div>
            </div>

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
                                <tr key={row.id} className="group hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-teal-50/30 transition-all duration-200">
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
                            users
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0 border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <FaAngleDoubleLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0 border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
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
                            className="h-9 w-9 p-0 border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <FaChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0 border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
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
