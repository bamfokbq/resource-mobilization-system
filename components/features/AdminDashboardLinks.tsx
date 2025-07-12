'use client'

import { AlertCircle, CheckCircle2, Loader2, Users, BarChart3, FileText, Settings, Home, ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
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
    const [isOpen, setIsOpen] = useState(true)
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

    // Keyboard navigation
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault()
            setIsOpen(!isOpen)
        }
    }, [isOpen])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    // Save sidebar state to localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('admin-sidebar-open')
        if (savedState !== null) {
            setIsOpen(JSON.parse(savedState))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('admin-sidebar-open', JSON.stringify(isOpen))
    }, [isOpen])

    const linkClass = (path: string, isActive: boolean) => `
        relative flex items-center gap-3 text-base p-3 rounded-lg
        ${isActive
            ? 'text-mint-green bg-mint-green/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-mint-green before:rounded-r-lg'
            : 'text-light-blue hover:text-mint-green/80 hover:bg-white/5'
        } 
        transition-all duration-300 hover:scale-[1.02] group focus:outline-none focus:ring-2 focus:ring-mint-green/50 focus:ring-offset-2 focus:ring-offset-navy-blue
        ${!isOpen ? 'justify-center' : ''}
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

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <aside
            className={`bg-navy-blue flex-shrink-0 ${isOpen ? 'w-[280px]' : 'w-[80px]'} 
                       flex flex-col justify-between py-6 relative transition-all duration-300 
                       shadow-xl border-r border-light-blue/10 h-screen overflow-hidden`}
            role="navigation"
            aria-label="Admin Dashboard Navigation"
        >
            {/* Header with toggle button */}
            <div className="relative">
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-4 top-2 bg-white rounded-full p-2 z-10 text-navy-blue hover:text-mint-green 
                              transition-all duration-300 border-2 border-light-blue/20 hover:border-mint-green
                              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-mint-green/50
                              shadow-lg"
                    title={`${isOpen ? 'Collapse' : 'Expand'} sidebar (Ctrl+B)`}
                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} sidebar`}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>

                {/* User info section */}
                {isOpen && session?.user && (
                    <div className="px-4 pb-6 border-b border-light-blue/20">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-mint-green/20 flex items-center justify-center">
                                <User className="text-mint-green" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">
                                    {session.user.name || session.user.email}
                                </p>
                                <p className="text-light-blue text-xs">Administrator</p>
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="text-light-blue text-xs">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation menu */}
            <nav className="flex-1 px-4 mt-6">
                <ul className='flex flex-col gap-2 w-full' role="menubar">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.path
                        const Icon = item.icon

                        return (
                            <li key={item.path} role="none">
                                <Link
                                    className={linkClass(item.path, isActive)}
                                    href={item.path}
                                    title={!isOpen ? item.label : ''}
                                    role="menuitem"
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <div className="relative flex items-center">
                                        <Icon className="text-xl flex-shrink-0" />
                                    </div>
                                    {isOpen && (
                                        <div className="flex items-center justify-between flex-1 min-w-0">
                                            <span className="truncate">{item.label}</span>
                                            {item.badge && !isActive && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Footer with logout */}
            <div className="px-4 pt-6 border-t border-light-blue/20">
                <button
                    onClick={handleSignOut}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-white hover:bg-red-500/10 
                              hover:text-red-400 transition-all duration-300 group focus:outline-none 
                              focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-navy-blue
                              ${!isOpen ? 'justify-center' : ''}`}
                    title={!isOpen ? 'Logout' : ''}
                    disabled={loading}
                    aria-label="Sign out"
                >
                    {loading ? (
                        <Loader2 className="animate-spin text-xl" />
                    ) : (
                        <>
                                <LogOut className="text-xl flex-shrink-0" />
                                {isOpen && <span>Logout</span>}
                        </>
                    )}
                </button>
            </div>
        </aside>
    )
}