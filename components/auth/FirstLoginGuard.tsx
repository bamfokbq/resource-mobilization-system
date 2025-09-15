'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PasswordChangeForm from '@/components/forms/PasswordChangeForm'
import { Loader2 } from 'lucide-react'

interface FirstLoginGuardProps {
  children: React.ReactNode
}

export default function FirstLoginGuard({ children }: FirstLoginGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // If user is authenticated and has firstLogin flag, redirect to password change
    if (session?.user?.firstLogin) {
      // Don't redirect if already on password change page to avoid infinite loop
      if (window.location.pathname !== '/auth/change-password') {
        router.push('/auth/change-password')
      }
    }
  }, [session, status, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children
  if (status === 'unauthenticated') {
    return null
  }

  // If first login, show password change form
  if (session?.user?.firstLogin) {
    return <PasswordChangeForm userEmail={session.user.email || ''} />
  }

  // Otherwise, render the protected content
  return <>{children}</>
}
