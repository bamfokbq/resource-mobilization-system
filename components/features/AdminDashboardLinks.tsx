'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { FaHome } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa6'
import { MdSettings } from 'react-icons/md'
import { Button } from '../ui/button'
import { Loader2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboardLinks() {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const linkClass = (path: string) => `
    flex items-center gap-2 text-lg
    ${pathname === path
            ? 'text-mint-green'
            : 'text-light-blue'
        } 
    hover:text-mint-green/70 transition-colors duration-200
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
        <div className='bg-navy-blue flex-shrink-0 w-[200px] flex flex-col items-center justify-between py-4'>
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
                <Button
                    className='text-xl text-white bg-transparent shadow-none hover:bg-transparent hover:shadow-none hover:text-gray-200 flex items-center gap-1 cursor-pointer'
                    onClick={handleSignOut}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <LogOut />
                            <span>Logout</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}