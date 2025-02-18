import { auth } from '@/auth';
import React from 'react'

interface AvatarProps {
    variant: 'admin' | 'user';
}

export default async function Avatar({ variant }: AvatarProps) {
    const session = await auth();
    const userInfo = session?.user;
    const firstLetter = userInfo?.name?.split(' ').map(name => name[0]).join('') ?? 'U';
    
    return (
        <div className='flex items-center gap-2'>
            <div className='h-10 text-white w-10 bg-navy-blue rounded-full flex items-center justify-center'>
                <p>{firstLetter}</p>
            </div>
            <div className='flex flex-col'>
                <p className='text-sm font-medium'>{userInfo?.name}</p>
                <p className='text-xs text-gray-600'>{variant === 'admin' ? "ADMIN" : "USER"}</p>
            </div>
        </div>
    )
}
