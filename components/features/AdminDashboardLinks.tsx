'use client'

import { Users, BarChart3, FileText, Settings, Home, Folder, UserRoundPen } from 'lucide-react'
import type { AdminDashboardLinksProps } from '@/types/dashboard-sidebar'
import DashboardSidebar from '../shared/DashboardSidebar'
import { canAccessSettings } from '@/lib/permissions'

export default function AdminDashboardLinks({ session }: AdminDashboardLinksProps) {
    // Check if user is system owner
    const isSystemOwner = canAccessSettings(session as any)
    
    // Base navigation items
    const baseNavigationItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
        { path: '/admin/dashboard/users', label: 'Users', icon: Users },
        { path: '/admin/dashboard/resources', label: 'Resources', icon: Folder },
        // { path: '/admin/dashboard/surveys', label: 'Surveys', icon: FileText },
        { path: '/admin/dashboard/surveys', label: 'Mapping', icon: FileText },
        { path: '/admin/dashboard/partner-mapping', label: 'Partner Mapping', icon: FileText },
        // { path: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/dashboard/profile', label: 'Profile', icon: UserRoundPen },
    ]

    // Add Settings link only for system owner
    const navigationItems = isSystemOwner 
        ? [
            ...baseNavigationItems.slice(0, 7), // First 6 items
            { path: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
            ...baseNavigationItems.slice(6) // Profile item
          ]
        : baseNavigationItems

    return (
        <DashboardSidebar
            session={session}
            navigationItems={navigationItems}
            redirectPath="/admin"
            ariaLabel="Admin Dashboard Navigation"
        />
    )
}


