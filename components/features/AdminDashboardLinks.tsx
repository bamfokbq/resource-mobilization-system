'use client'

import { Users, BarChart3, FileText, Settings, Home } from 'lucide-react'
import type { AdminDashboardLinksProps } from '@/types/dashboard-sidebar'
import DashboardSidebar from '../shared/DashboardSidebar'

export default function AdminDashboardLinks({ session }: AdminDashboardLinksProps) {
    // Navigation items configuration
    const navigationItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
        { path: '/admin/dashboard/users', label: 'Users', icon: Users },
        // { path: '/admin/dashboard/surveys', label: 'Surveys', icon: FileText },
        { path: '/admin/dashboard/surveys', label: 'Mapping', icon: FileText },
        { path: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/dashboard/profile', label: 'Profile', icon: Settings },
    ]

    return (
        <DashboardSidebar
            session={session}
            navigationItems={navigationItems}
            redirectPath="/admin"
            ariaLabel="Admin Dashboard Navigation"
        />
    )
}

