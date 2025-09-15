import { Session } from 'next-auth'

/**
 * Check if the current user has system owner permissions
 * @param session - The current user session
 * @returns boolean - True if user is system owner, false otherwise
 */
export function isSystemOwner(session: Session | null): boolean {
  return session?.user?.email === 'systemowner' && session?.user?.role === 'Admin'
}

/**
 * Check if the current user has admin permissions
 * @param session - The current user session
 * @returns boolean - True if user is admin, false otherwise
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === 'Admin'
}

/**
 * Check if the current user has the required permissions for settings access
 * @param session - The current user session
 * @returns boolean - True if user can access settings, false otherwise
 */
export function canAccessSettings(session: Session | null): boolean {
  return isSystemOwner(session)
}
