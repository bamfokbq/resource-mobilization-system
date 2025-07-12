'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    FaUserCircle,
    FaEllipsisV,
    FaKey,
    FaToggleOn,
    FaToggleOff,
    FaEnvelope,
    FaInfoCircle,
    FaUserShield,
    FaUsers
} from 'react-icons/fa';
import { type User, type UserActionsHandlers } from './types';

interface UserActionsDropdownProps {
    user: User;
    handlers: UserActionsHandlers;
}

export function UserActionsDropdown({ user, handlers }: UserActionsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 rounded-full hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-200 group"
                >
                    <span className="sr-only">Open menu</span>
                    <FaEllipsisV className="h-4 w-4 text-gray-500 group-hover:text-emerald-600 transition-colors duration-200" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 p-1 border border-gray-200 shadow-lg rounded-lg bg-white"
                sideOffset={8}
                alignOffset={-8}
            >
                <DropdownMenuItem
                    onClick={() => handlers.onViewDetails(user)}
                    className="cursor-pointer px-2 py-2 rounded-md hover:bg-blue-50 transition-colors duration-150"
                >
                    <FaInfoCircle className="mr-2 h-4 w-4 text-blue-600" />
                    <span className="font-medium">View Details</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handlers.onResetPassword(user)}
                    className="cursor-pointer px-2 py-2 rounded-md hover:bg-orange-50 transition-colors duration-150"
                >
                    <FaKey className="mr-2 h-4 w-4 text-orange-600" />
                    <span className="font-medium">Reset Password</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handlers.onToggleStatus(user)}
                    className={`cursor-pointer px-2 py-2 rounded-md transition-colors duration-150 ${user.isActive
                        ? 'hover:bg-red-50'
                        : 'hover:bg-green-50'
                        }`}
                >
                    {user.isActive ? (
                        <>
                            <FaToggleOff className="mr-2 h-4 w-4 text-red-600" />
                            <span className="font-medium">Deactivate</span>
                        </>
                    ) : (
                        <>
                            <FaToggleOn className="mr-2 h-4 w-4 text-green-600" />
                            <span className="font-medium">Activate</span>
                        </>
                    )}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                    onClick={() => handlers.onCopyEmail(user.email)}
                    className="cursor-pointer px-2 py-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
                >
                    <FaEnvelope className="mr-2 h-4 w-4 text-gray-600" />
                    <span className="font-medium">Copy Email</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface UserCellProps {
    user: User;
}

export function UserCell({ user }: UserCellProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                    <FaUserCircle className="h-7 w-7 text-emerald-600" />
                </div>
                {/* Activity indicator */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 truncate">
                    {user.name || 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'} className="text-xs">
                        {user.role === 'Admin' ? (
                            <><FaUserShield className="w-3 h-3 mr-1" /> Admin</>
                        ) : (
                            <><FaUsers className="w-3 h-3 mr-1" /> User</>
                        )}
                    </Badge>
                    {user.passwordResetAt && (
                        <Tooltip>
                            <TooltipTrigger>
                                <FaKey className="w-3 h-3 text-orange-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Password reset on {new Date(user.passwordResetAt).toLocaleDateString()}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
}
