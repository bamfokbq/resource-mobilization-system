'use client'

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { FaHome } from 'react-icons/fa'
import { MdAssignment } from 'react-icons/md'
import { MdLogout, MdSettings } from 'react-icons/md'
import { signOut } from 'next-auth/react'

export default function UserDashboardLinks() {
    const pathname = usePathname()

    const linkClass = (path: string) => `
    flex items-center gap-2 text-lg
    ${(pathname === path || (path === '/dashboard/surveys' && pathname.startsWith('/dashboard/surveys/form')))
            ? 'text-mint-green'
            : 'text-light-blue'
        } 
    hover:text-mint-green/70 transition-colors duration-200
  `

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/auth/signin' })
    }

    return (
        <div className='bg-navy-blue flex-shrink-0 w-[80px] md:w-[200px] flex flex-col items-center justify-between py-4'>
            <ul className='flex flex-col gap-4'>
                <Link
                    className={linkClass('/dashboard')}
                    href={'/dashboard'}
                >
                    <FaHome className="text-2xl" />
                    <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link
                    className={linkClass('/dashboard/surveys')}
                    href={'/dashboard/surveys'}
                >
                    <MdAssignment className="text-2xl" />
                    <span className="hidden md:inline">Surveys</span>
                </Link>
                <Link
                    className={linkClass('/dashboard/profile')}
                    href={'/dashboard/profile'}
                >
                    <MdSettings className="text-2xl" />
                    <span className="hidden md:inline">Profile</span>
                </Link>
            </ul>

            <div>
                <button
                    onClick={handleSignOut}
                    className='text-xl text-white flex items-center gap-1 hover:text-mint-green/70 transition-colors duration-200'
                >
                    <MdLogout className="text-2xl" />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </div>
    )
}