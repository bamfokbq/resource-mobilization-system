'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaHome } from 'react-icons/fa'
import { MdAssignment, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { MdLogout, MdSettings } from 'react-icons/md'
import { signOut } from 'next-auth/react'

export default function UserDashboardLinks() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)

    const linkClass = (path: string) => `
        relative flex items-center gap-3 text-lg p-3 rounded-lg
        ${(pathname === path || (path === '/dashboard/surveys' && pathname.startsWith('/dashboard/surveys/form')))
        ? 'text-mint-green before:absolute before:inset-0 before:bg-mint-green/10 before:rounded-lg before:animate-pulse'
            : 'text-light-blue'
        } 
        hover:text-mint-green/70 transition-all duration-300 hover:scale-105
        group
    `

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/auth/signin' })
    }

    return (
        <div className={`bg-navy-blue flex-shrink-0 ${isOpen ? 'w-[240px]' : 'w-[80px]'} flex flex-col items-center justify-between py-6 relative transition-all duration-300 shadow-xl`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-4 top-0 bg-white rounded-full p-2 z-10 text-navy-blue hover:text-mint-green 
                          transition-all duration-300 border-2 border-light-blue/20 hover:border-mint-green
                          hover:scale-110 hover:rotate-[360deg]"
            >
                {isOpen ? <MdChevronLeft size={20} /> : <MdChevronRight size={20} />}
            </button>

            <ul className='flex flex-col gap-3 w-full px-4'>
                <Link
                    className={linkClass('/dashboard')}
                    href={'/dashboard'}
                    title={!isOpen ? 'Dashboard' : ''}
                >
                    <FaHome className="text-2xl" />
                    {isOpen && <span>Dashboard</span>}
                </Link>
                <Link
                    className={linkClass('/dashboard/surveys')}
                    href={'/dashboard/surveys'}
                    title={!isOpen ? 'Surveys' : ''}
                >
                    <MdAssignment className="text-2xl" />
                    {isOpen && <span>Surveys</span>}
                </Link>
                <Link
                    className={linkClass('/dashboard/profile')}
                    href={'/dashboard/profile'}
                    title={!isOpen ? 'Profile' : ''}
                >
                    <MdSettings className="text-2xl" />
                    {isOpen && <span>Profile</span>}
                </Link>
            </ul>

            <div className="w-full px-4">
                <button
                    onClick={handleSignOut}
                    className='w-full flex items-center gap-3 p-3 rounded-lg text-white hover:bg-red-500/10 
                              hover:text-red-400 transition-all duration-300 group'
                    title={!isOpen ? 'Logout' : ''}
                >
                    <MdLogout className="text-2xl" />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    )
}