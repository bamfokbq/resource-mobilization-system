'use client';

import { useEffect, useState, useMemo } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';

// Import modular components
import {
    UserStatsCards,
    UserSearchAndFilters,
    UserTable,
    UserTableLoading,
    UserDetailsDrawer,
    ResetPasswordDialog,
    ToggleStatusDialog,
    useUserTableColumns,
    useUsersData,
    useUserActions,
    type UserTableStats,
    type UserActionsHandlers
} from './admin-users';

/**
 * Enhanced Admin Users Table Component
 * 
 * This component has been refactored to follow separation of concerns principles:
 * - Data management: useUsersData hook
 * - User actions: useUserActions hook
 * - Table columns: useUserTableColumns hook
 * - UI components: Modular components for different table sections
 * - Loading states: Dedicated loading component
 * - Dialogs/Drawers: Separate components for each interaction
 */
export default function EnhancedAdminUsersTable() {
    // Table state
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Data management
    const { data, isLoading, fetchUsers, refreshUsers } = useUsersData();

    // User actions management
    const userActions = useUserActions(refreshUsers);

    // Table columns configuration
    const actionHandlers: UserActionsHandlers = useMemo(() => ({
        onResetPassword: userActions.handleResetPasswordDialog,
        onToggleStatus: userActions.handleToggleStatusDialog,
        onViewDetails: userActions.handleViewDetails,
        onCopyEmail: userActions.handleCopyEmail,
    }), [userActions]);

    const columns = useUserTableColumns({ handlers: actionHandlers });

    // Table setup
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

    // Calculate stats
    const stats: UserTableStats = useMemo(() => {
        const totalUsers = data.length;
        const activeUsers = data.filter(user => user.isActive).length;
        const adminUsers = data.filter(user => user.role === 'Admin').length;
        const newThisMonth = data.filter(user => {
            if (!user.createdAt) return false;
            const userDate = new Date(user.createdAt);
            const now = new Date();
            return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
        }).length;

        return { totalUsers, activeUsers, adminUsers, newThisMonth };
    }, [data]);

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Loading state
    if (isLoading) {
        return <UserTableLoading />;
    }

    return (
        <TooltipProvider>
            <div className="space-y-6">
                {/* Statistics Cards */}
                <UserStatsCards stats={stats} />

                {/* Search and Filters */}
                <UserSearchAndFilters
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    filteredCount={table.getFilteredRowModel().rows.length}
                    totalCount={data.length}
                />

                {/* Main Table */}
                <UserTable 
                    table={table} 
                    globalFilter={globalFilter}
                />

                {/* Dialogs and Drawers */}
                <ResetPasswordDialog
                    dialog={userActions.resetPasswordDialog}
                    onClose={userActions.closeResetPasswordDialog}
                    onConfirm={userActions.handleResetPassword}
                    isLoading={userActions.actionLoading}
                />

                <ToggleStatusDialog
                    dialog={userActions.toggleStatusDialog}
                    onClose={userActions.closeToggleStatusDialog}
                    onConfirm={userActions.handleToggleStatus}
                    isLoading={userActions.actionLoading}
                />

                <UserDetailsDrawer
                    drawer={userActions.userDetailsDrawer}
                    onClose={userActions.closeUserDetailsDrawer}
                />
            </div>
        </TooltipProvider>
    );
}
