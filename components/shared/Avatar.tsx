"use client";

import { useUserStore } from '@/store/userStore';
import React from 'react'

interface AvatarProps {
    variant: 'admin' | 'user';
}

export default function Avatar({ variant }: AvatarProps) {
    const userInfo = useUserStore((state) => state.userInfo);

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    const initials = userInfo ? getInitials(userInfo.firstName, userInfo.lastName) : '';
    
    return (
        <div className='flex items-center gap-2'>
            <div className='h-10 text-white w-10 bg-navy-blue rounded-full flex items-center justify-center'>
                <p>{initials}</p>
            </div>
            <div className='flex flex-col'>
                <p className='text-sm font-medium'>{userInfo?.name}</p>
                <p className='text-xs text-gray-600'>{variant === 'admin' ? "ADMIN" : "USER"}</p>
            </div>
        </div>
    )
}
