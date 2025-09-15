'use client'

import { AlertCircle, CheckCircle2, Loader2, LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Session } from 'next-auth'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { Route } from 'next'

interface NavigationItem {
    path: string
    label: string
    icon: React.ComponentType<{ className?: string; size?: number }>
    badge?: number
}

interface DashboardNavigationProps {
    session?: Session | null
    navigationItems: NavigationItem[]
    variant?: 'user' | 'admin'
    redirectPath?: string
}

export default function DashboardNavigation({ 
    session, 
    navigationItems, 
    variant = 'user',
    redirectPath = '/auth/signin'
}: DashboardNavigationProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(true)

    const isAdmin = variant === 'admin'

    const linkClass = (path: string, isActive: boolean) => {
        if (isAdmin) {
            return `
                relative flex flex-col items-center justify-center gap-1 text-base p-3 rounded-lg min-h-[60px]
                ${isActive
                    ? 'text-mint-green bg-mint-green/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-mint-green before:rounded-r-lg'
                    : 'text-light-blue hover:text-mint-green/80 hover:bg-white/5'
                } 
                transition-all duration-300 hover:scale-[1.02]`
        }
        
        return `
            relative flex items-center gap-3 text-lg p-3 rounded-lg
            ${isActive
                ? 'text-mint-green before:absolute before:inset-0 before:bg-mint-green/10 before:rounded-lg before:animate-pulse'
                : 'text-light-blue'
            } 
            hover:text-mint-green/70 transition-all duration-300 hover:scale-105
            group`
    }

    const handleSignOut = async () => {
        setLoading(true)
        
        if (isAdmin) {
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
        } else {
            try {
                await signOut({ redirect: true, callbackUrl: redirectPath })
            } catch (error) {
                console.error('Sign out error:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    const checkIsActive = (path: string) => {
        return pathname === path || (path === '/dashboard/surveys' && pathname.startsWith('/dashboard/surveys/form'))
    }

    if (isAdmin) {
        return (
            <aside
                className="bg-navy-blue flex-shrink-0 w-[90px] flex flex-col relative transition-all duration-300 
                           shadow-xl border-r border-light-blue/10 h-screen overflow-hidden"
                role="navigation"
                aria-label="Admin Dashboard Navigation"
            >
                {/* Header */}
                {session?.user && (
                    <div className="px-4 pb-6 border-b border-light-blue/20">
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-mint-green/20 flex items-center justify-center">
                                <User className="text-mint-green" size={20} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation menu */}
                <nav className="flex-1 mt-4 flex flex-col">
                    <ul className='flex flex-col gap-2 w-full' role="menubar">
                        {navigationItems.map((item) => {
                            const isActive = checkIsActive(item.path)
                            const Icon = item.icon

                            return (
                                <li key={item.path} role="none">
                                    <Link
                                        className={linkClass(item.path, isActive)}
                                        href={item.path as Route}
                                        title={item.label}
                                        role="menuitem"
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        <Icon className="text-xl flex-shrink-0" />
                                        <span className="text-xs text-center truncate w-full leading-tight">
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Logout button */}
                    <div className="mt-8 pt-4 border-t border-light-blue/20">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex flex-col items-center justify-center gap-1 p-3 rounded-lg text-white hover:bg-red-500/10 
                                      hover:text-red-400 transition-all duration-300 focus:outline-none 
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
                                </>
                            )}
                        </button>
                    </div>
                </nav>
            </aside>
        )
    }

    // User dashboard layout
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
                {navigationItems.map((item) => {
                    const isActive = checkIsActive(item.path)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.path}
                            className={linkClass(item.path, isActive)}
                            href={item.path as Route}
                            title={!isOpen ? item.label : ''}
                        >
                            <Icon className="text-2xl" />
                            {isOpen && <span>{item.label}</span>}
                        </Link>
                    )
                })}
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
                            <LogOut className="text-2xl" />
                            {isOpen && <span>Logout</span>}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
