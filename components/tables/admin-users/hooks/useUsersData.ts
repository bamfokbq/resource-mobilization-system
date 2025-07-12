'use client';

import { useState, useCallback } from 'react';
import { getAllUsers } from '@/actions/users';
import { toast } from 'sonner';
import { type User } from '../types';

export const useUsersData = () => {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
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
    }, []);

    const refreshUsers = useCallback(() => {
        return fetchUsers();
    }, [fetchUsers]);

    return {
        data,
        isLoading,
        fetchUsers,
        refreshUsers
    };
};
