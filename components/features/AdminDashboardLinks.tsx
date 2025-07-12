'use client'

import { AlertCircle, CheckCircle2, Loader2, Users, BarChart3, FileText, Settings, Home, LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Session } from 'next-auth'

interface NavigationItem {
    path: string
    label: string
    icon: React.ComponentType<{ className?: string; size?: number }>
    badge?: number
}

interface AdminDashboardLinksProps {
    session?: Session | null
}

export default function AdminDashboardLinks({ session }: AdminDashboardLinksProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Navigation items configuration
    const navigationItems: NavigationItem[] = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
        { path: '/admin/dashboard/users', label: 'Users', icon: Users },
        { path: '/admin/dashboard/surveys', label: 'Surveys', icon: FileText },
        { path: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/dashboard/profile', label: 'Profile', icon: Settings },
    ]

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    const linkClass = (path: string, isActive: boolean) => `
        relative flex flex-col items-center justify-center gap-1 text-base p-3 rounded-lg min-h-[60px] group
        ${isActive
            ? 'text-mint-green bg-mint-green/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-mint-green before:rounded-r-lg'
            : 'text-light-blue hover:text-mint-green/80 hover:bg-white/5'
        } 
        transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-mint-green/50 focus:ring-offset-2 focus:ring-offset-navy-blue
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
        <aside
            className="bg-navy-blue flex-shrink-0 w-[80px] flex flex-col py-6 relative transition-all duration-300 
                       shadow-xl border-r border-light-blue/10 h-screen overflow-hidden"
            role="navigation"
            aria-label="Admin Dashboard Navigation"
        >
            {/* Header */}
            <div className="relative">
                {/* User info section - only show avatar in collapsed state */}
                {session?.user && (
                    <div className="px-4 pb-6 border-b border-light-blue/20">
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-mint-green/20 flex items-center justify-center group relative">
                                <User className="text-mint-green" size={20} />
                                {/* Tooltip on hover */}
                                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                    {session.user.name || session.user.email}
                                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation menu */}
            <nav className="flex-1 px-4 mt-6 flex flex-col">
                <ul className='flex flex-col gap-2 w-full' role="menubar">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.path
                        const Icon = item.icon

                        return (
                            <li key={item.path} role="none">
                                <Link
                                    className={linkClass(item.path, isActive)}
                                    href={item.path}
                                    title={item.label}
                                    role="menuitem"
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon className="text-xl flex-shrink-0" />
                                    <span className="text-xs text-center truncate w-full leading-tight">
                                        {item.label}
                                    </span>
                                    {/* Tooltip on hover */}
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                        {item.label}
                                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                                    </div>
                                    {item.badge && !isActive && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Logout button moved up */}
                <div className="mt-8 pt-4 border-t border-light-blue/20">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex flex-col items-center justify-center gap-1 p-3 rounded-lg text-white hover:bg-red-500/10 
                                  hover:text-red-400 transition-all duration-300 group focus:outline-none 
                                  focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-navy-blue
                                  min-h-[60px] relative"
                        title="Logout"
                        disabled={loading}
                        aria-label="Sign out"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin text-xl" />
                        ) : (
                            <>
                                <LogOut className="text-xl flex-shrink-0" />
                                    <span className="text-xs text-center">Logout</span>
                                    {/* Tooltip on hover */}
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                        Logout
                                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                                    </div>
                            </>
                        )}
                    </button>
                </div>
            </nav>
        </aside>
    )
}