'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Admin Dashboard Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Dashboard Error
                </h1>
                
                <p className="text-gray-600 mb-6">
                    Something went wrong while loading the admin dashboard. 
                    This could be a temporary issue with data loading.
                </p>
                
                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </button>
                    
                    <Link
                        href="/admin"
                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Go to Admin Home
                    </Link>
                </div>
                
                {error.digest && (
                    <p className="text-xs text-gray-400 mt-4">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    )
}
