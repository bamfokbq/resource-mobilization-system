'use client'

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { FaHome } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa6'
import { MdLogout, MdSettings } from 'react-icons/md'

export default function AdminDashboardLinks() {
    const pathname = usePathname()

    const linkClass = (path: string) => `
    flex items-center gap-2 text-lg
    ${pathname === path
            ? 'text-mint-green'
            : 'text-light-blue'
        } 
    hover:text-mint-green/70 transition-colors duration-200
  `

    return (
        <div className='bg-navy-blue w-[200px] flex flex-col items-center justify-between py-4'>
            <ul className='flex flex-col gap-4'>
                <Link
                    className={linkClass('/admin/dashboard')}
                    href={'/admin/dashboard'}
                >
                    <FaHome />
                    <span>Dashboard</span>
                </Link>
                <Link
                    className={linkClass('/admin/dashboard/users')}
                    href={'/admin/dashboard/users'}
                >
                    <FaUser />
                    <span>Users</span>
                </Link>
                <Link
                    className={linkClass('/admin/dashboard/profile')}
                    href={'/admin/dashboard/profile'}
                >
                    <MdSettings />
                    <span>Profile</span>
                </Link>
            </ul>

            <div>
                <Link className='text-xl text-white flex items-center gap-1' href={'/admin'}>
                    <MdLogout />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    )
}