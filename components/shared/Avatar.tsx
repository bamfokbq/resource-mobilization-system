import { auth } from '@/auth';
import React from 'react'

export default async function Avatar() {
    const session = await auth();
    const userInfo = session?.user;
    const firstLetter = userInfo?.name?.split(' ').map(name => name[0]).join('') ?? 'U';
    const role = userInfo?.role;
    
    return (
        <div className='flex items-center gap-2'>
            <div className='h-10 text-white w-10 bg-ghs-green rounded-full flex items-center justify-center'>
                <p>{firstLetter}</p>
            </div>
            <div className='flex flex-col'>
                <p className='text-sm font-medium'>{userInfo?.name}</p>
                <p className='text-xs text-gray-600'>{role}</p>
            </div>
        </div>
    )
}
