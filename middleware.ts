import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Check if the request is for the settings page
  if (request.nextUrl.pathname === '/admin/dashboard/settings') {
    // If not authenticated, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // Check if user has system owner permissions
    const userEmail = session.user?.email
    const userRole = session.user?.role
    
    if (userEmail !== 'systemowner' || userRole !== 'Admin') {
      // Redirect to admin dashboard with access denied message
      const url = new URL('/admin/dashboard', request.url)
      url.searchParams.set('error', 'access_denied')
      url.searchParams.set('message', 'Settings access restricted to system owner only')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/dashboard/settings',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Add other protected routes here if needed
  ],
  runtime: 'nodejs',
}
