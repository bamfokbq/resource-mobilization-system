'use client';

import { useState, useCallback } from 'react';
import { resetUserPassword, toggleUserStatus } from '@/actions/users';
import { toast } from 'sonner';
import { type User, type DialogState } from '../types';

export const useUserActions = (refreshUsers: () => Promise<void>) => {
    const [resetPasswordDialog, setResetPasswordDialog] = useState<DialogState>({
        open: false,
        user: null
    });
    const [toggleStatusDialog, setToggleStatusDialog] = useState<DialogState>({
        open: false,
        user: null
    });
    const [userDetailsDrawer, setUserDetailsDrawer] = useState<DialogState>({
        open: false,
        user: null
    });
    const [actionLoading, setActionLoading] = useState(false);

    const handleResetPassword = useCallback(async () => {
        if (!resetPasswordDialog.user) return;

        setActionLoading(true);
        try {
            const result = await resetUserPassword(resetPasswordDialog.user.id);
            if (result.success) {
                toast.success(`Password reset successfully for ${resetPasswordDialog.user.name}`);
                setResetPasswordDialog({ open: false, user: null });
                await refreshUsers();
            } else {
                toast.error(result.error || "Failed to reset password");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Failed to reset password");
        } finally {
            setActionLoading(false);
        }
    }, [resetPasswordDialog.user, refreshUsers]);

    const handleToggleStatus = useCallback(async () => {
        if (!toggleStatusDialog.user) return;

        setActionLoading(true);
        try {
            const result = await toggleUserStatus(toggleStatusDialog.user.id);
            if (result.success) {
                toast.success(result.message);
                setToggleStatusDialog({ open: false, user: null });
                await refreshUsers();
            } else {
                toast.error(result.error || "Failed to update user status");
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            toast.error("Failed to update user status");
        } finally {
            setActionLoading(false);
        }
    }, [toggleStatusDialog.user, refreshUsers]);

    const handleViewDetails = useCallback((user: User) => {
        setUserDetailsDrawer({ open: true, user });
    }, []);

    const handleResetPasswordDialog = useCallback((user: User) => {
        setResetPasswordDialog({ open: true, user });
    }, []);

    const handleToggleStatusDialog = useCallback((user: User) => {
        setToggleStatusDialog({ open: true, user });
    }, []);

    const handleCopyEmail = useCallback((email: string) => {
        navigator.clipboard.writeText(email);
        toast.success('Email copied to clipboard!');
    }, []);

    const closeResetPasswordDialog = useCallback(() => {
        setResetPasswordDialog({ open: false, user: null });
    }, []);

    const closeToggleStatusDialog = useCallback(() => {
        setToggleStatusDialog({ open: false, user: null });
    }, []);

    const closeUserDetailsDrawer = useCallback(() => {
        setUserDetailsDrawer({ open: false, user: null });
    }, []);

    return {
        // State
        resetPasswordDialog,
        toggleStatusDialog,
        userDetailsDrawer,
        actionLoading,
        
        // Actions
        handleResetPassword,
        handleToggleStatus,
        handleViewDetails,
        handleResetPasswordDialog,
        handleToggleStatusDialog,
        handleCopyEmail,
        
        // Dialog controls
        closeResetPasswordDialog,
        closeToggleStatusDialog,
        closeUserDetailsDrawer
    };
};
