'use client'

import { Home, FileText, Settings, Network } from 'lucide-react'
import type { UserDashboardLinksProps } from '@/types/dashboard-sidebar'
import DashboardSidebar from '../shared/DashboardSidebar'

export default function UserDashboardLinks({ session }: UserDashboardLinksProps) {
    // Navigation items configuration
    const navigationItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        // { path: '/dashboard/surveys', label: 'Surveys', icon: FileText },
        { path: '/dashboard/surveys', label: 'Mapping', icon: FileText },
        { path: '/dashboard/partner-mapping', label: 'Partner Mapping', icon: Network },
        { path: '/dashboard/profile', label: 'Profile', icon: Settings },
    ]

    // Custom path logic for surveys and partner mapping to handle form routes
    const customPathLogic = (pathname: string, itemPath: string) => {
        if (itemPath === '/dashboard/surveys' && pathname.startsWith('/dashboard/surveys/form')) {
            return true
        }
        if (itemPath === '/dashboard/partner-mapping' && pathname.startsWith('/dashboard/partner-mapping/')) {
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

