'use client'

import { Home, FileText, Settings } from 'lucide-react'
import type { UserDashboardLinksProps } from '@/types/dashboard-sidebar'
import DashboardSidebar from '../shared/DashboardSidebar'

export default function UserDashboardLinks({ session }: UserDashboardLinksProps) {
    // Navigation items configuration
    const navigationItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/dashboard/surveys', label: 'Surveys', icon: FileText },
        { path: '/dashboard/profile', label: 'Profile', icon: Settings },
    ]

    // Custom path logic for surveys to handle form routes
    const customPathLogic = (pathname: string, itemPath: string) => {
        if (itemPath === '/dashboard/surveys' && pathname.startsWith('/dashboard/surveys/form')) {
            return true
        }
        return pathname === itemPath
    }

    return (
        <DashboardSidebar
            session={session}
            navigationItems={navigationItems}
            redirectPath="/auth/signin"
            ariaLabel="User Dashboard Navigation"
            customPathLogic={customPathLogic}
        />
    )
}

