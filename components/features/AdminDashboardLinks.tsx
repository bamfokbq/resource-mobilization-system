'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { FaHome } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa6'
import { MdAssignment, MdSettings, MdChevronLeft, MdChevronRight, MdLogout } from 'react-icons/md'
import { Button } from '../ui/button'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboardLinks() {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(true)

    const linkClass = (path: string) => `
        relative flex items-center gap-3 text-lg p-3 rounded-lg
        ${pathname === path
        ? 'text-mint-green before:absolute before:inset-0 before:bg-mint-green/10 before:rounded-lg before:animate-pulse'
            : 'text-light-blue'
        } 
        hover:text-mint-green/70 transition-all duration-300 hover:scale-105
        group
    `

    const handleSignOut = async () => {
        setLoading(true)
        const loadingToast = toast.loading('Signing out...', {
            icon: <Loader2 className="animate-spin" />,
            description: 'Please wait while we sign you out'
        })

        try {
            await signOut({ redirect: false })
            toast.dismiss(loadingToast)
            toast.success('Signed out successfully', {
                icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
                description: 'Redirecting you to login...'
            })
            router.push("/admin")
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error('Failed to sign out', {
                icon: <AlertCircle className="text-red-500 h-5 w-5" />,
                description: 'Please try again'
            })
            console.error('Sign out error:', error)
        } finally {
            setLoading(false)
        }
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
                    className={linkClass('/admin/dashboard')}
                    href={'/admin/dashboard'}
                    title={!isOpen ? 'Dashboard' : ''}
                >
                    <FaHome className="text-2xl" />
                    {isOpen && <span>Dashboard</span>}
                </Link>                <Link
                    className={linkClass('/admin/dashboard/users')}
                    href={'/admin/dashboard/users'}
                    title={!isOpen ? 'Users' : ''}
                >
                    <FaUser className="text-2xl" />
                    {isOpen && <span>Users</span>}
                </Link>
                <Link
                    className={linkClass('/admin/dashboard/surveys')}
                    href={'/admin/dashboard/surveys'}
                    title={!isOpen ? 'Surveys' : ''}
                >
                    <MdAssignment className="text-2xl" />
                    {isOpen && <span>Surveys</span>}
                </Link>
                <Link
                    className={linkClass('/admin/dashboard/profile')}
                    href={'/admin/dashboard/profile'}
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
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin text-2xl" />
                    ) : (
                        <>
                                <MdLogout className="text-2xl" />
                                {isOpen && <span>Logout</span>}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}