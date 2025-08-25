'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Admin Resources page error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="text-center max-w-md mx-auto">
                <div className="mb-6">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Resources Error
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Something went wrong while loading the resources management page.
                    </p>
                    {error.digest && (
                        <p className="text-sm text-gray-500 mb-4">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
                
                <div className="space-y-3">
                    <Button
                        onClick={reset}
                        className="w-full"
                        variant="default"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                    
                    <Button
                        onClick={() => window.location.href = '/admin/dashboard'}
                        variant="outline"
                        className="w-full"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}
