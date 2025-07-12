'use client';

import { Input } from "@/components/ui/input";
import { FaSearch, FaInfoCircle } from 'react-icons/fa';

interface UserSearchAndFiltersProps {
    globalFilter: string;
    onGlobalFilterChange: (value: string) => void;
    filteredCount: number;
    totalCount: number;
}

export function UserSearchAndFilters({ 
    globalFilter, 
    onGlobalFilterChange, 
    filteredCount, 
    totalCount 
}: UserSearchAndFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search users by name, email, region..."
                    value={globalFilter ?? ""}
                    onChange={(event) => onGlobalFilterChange(String(event.target.value))}
                    className="pl-10 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <FaInfoCircle className="w-4 h-4 text-blue-500" />
                    <span>Showing {filteredCount} of {totalCount} users</span>
                </div>
            </div>
        </div>
    );
}
