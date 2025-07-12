'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminAnalyticsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Admin Analytics Error:', error)
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
                    Analytics Error
                </h1>
                
                <p className="text-gray-600 mb-6">
                    Something went wrong while loading the analytics data. 
                    This could be a temporary issue with data fetching.
                </p>
                
                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </button>
                    
                    <Link
                        href="/admin/dashboard"
                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
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
