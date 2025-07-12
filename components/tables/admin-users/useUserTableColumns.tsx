'use client';

import { useMemo } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { 
    FaSort, 
    FaSortDown, 
    FaSortUp, 
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaBuilding 
} from 'react-icons/fa';
import { type User, type UserActionsHandlers } from './types';
import { UserCell, UserActionsDropdown } from './UserTableCells';

interface UseUserTableColumnsProps {
    handlers: UserActionsHandlers;
}

export function useUserTableColumns({ handlers }: UseUserTableColumnsProps) {
    return useMemo<ColumnDef<User>[]>(() => [
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
            cell: ({ row }) => <UserCell user={row.original} />
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <UserActionsDropdown 
                    user={row.original} 
                    handlers={handlers}
                />
            ),
        }
    ], [handlers]);
}
