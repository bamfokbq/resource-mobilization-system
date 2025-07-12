import type { Session } from 'next-auth'

export interface NavigationItem {
    path: string
    label: string
    icon: React.ComponentType<{ className?: string; size?: number }>
    badge?: number
}

export interface DashboardSidebarProps {
    session?: Session | null
    navigationItems: NavigationItem[]
    redirectPath: string
    ariaLabel: string
    customPathLogic?: (pathname: string, itemPath: string) => boolean
}

export interface AdminDashboardLinksProps {
    session?: Session | null
}

export interface UserDashboardLinksProps {
    session?: Session | null
}
