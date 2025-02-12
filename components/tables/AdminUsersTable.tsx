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
    FaUser
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

type UserFormValues = z.infer<typeof userFormSchema>;

export default function AdminUsersTable() {
    const [data, setData] = useState<typeof USER_LISTS>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedUser, setSelectedUser] = useState<typeof USER_LISTS[0] | null>(null);
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
    };

    console.log(selectedUser);
    

    useEffect(() => {
        setData(USER_LISTS);
        setIsLoading(false);
    }, []);

    const columns = useMemo<ColumnDef<typeof USER_LISTS[0]>[]>(() => [
        {
            accessorKey: "id",
            header: ({ column }) => (
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
            ),
            cell: ({ row }) => <div className="font-medium">#{row.original.id}</div>
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    {column.getIsSorted() === "asc" ? (
                        <FaSortUp className="h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <FaSortDown className="h-4 w-4" />
                    ) : (
                        <FaSort className="h-4 w-4" />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <div className="flex items-center gap-2 cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Email
                    {column.getIsSorted() === "asc" ? (
                        <FaSortUp className="h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <FaSortDown className="h-4 w-4" />
                    ) : (
                        <FaSort className="h-4 w-4" />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "region",
            header: ({ column }) => (
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
            ),
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
                            className="transition-all cursor-pointer bg-green-600 hover:bg-green-500 text-white duration-200 hover:text-gray-100"
                            onClick={() => setSelectedUser(row.original)}
                        >
                            View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] animate-in slide-in-from-top duration-300 ease-in-out">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl pb-4 border-b">
                                <div className="p-2 rounded-full bg-navy-blue/10">
                                    <FaUser className="text-navy-blue h-6 w-6" />
                                </div>
                                <span className="flex-1 text-gray-700 font-medium">Edit User Details</span>
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className='font-light text-gray-600' htmlFor="firstName">First Name</Label>
                                    <Input
                                        className='shadow-none'
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className='font-light text-gray-600' htmlFor="lastName">Last Name</Label>
                                    <Input
                                        className='shadow-none'
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label className='font-light text-gray-600' htmlFor="email">Email</Label>
                                <Input
                                    className='shadow-none'
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className='font-light text-gray-600' htmlFor="password">Password</Label>
                                <Input
                                    className='shadow-none'
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className='font-light text-gray-600' htmlFor="telephone">Telephone</Label>
                                <Input
                                    className='shadow-none'
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    placeholder="Telephone"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className='font-light text-gray-600' htmlFor="region">Region</Label>
                                <Input
                                    className='shadow-none'
                                    id="region"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleInputChange}
                                    placeholder="Region"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className='font-light text-gray-600' htmlFor="organisation">Organisation</Label>
                                <Input
                                    className='shadow-none'
                                    id="organisation"
                                    name="organisation"
                                    value={formData.organisation}
                                    onChange={handleInputChange}
                                    placeholder="Organisation"
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline">Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )
        }
    ], []);

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
