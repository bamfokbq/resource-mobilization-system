'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    FileText,
    Download,
    HardDrive,
    Upload,
    Clock,
    RefreshCcw
} from 'lucide-react'
import { useResourceStats } from '@/hooks/useResourceStats'

export function ResourceStatsSection() {
    const { stats, loading, error, refreshStats } = useResourceStats()

    const statItems = [
        {
            title: 'Total Resources',
            value: stats.totalResources,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: 'Total number of resources in the system'
        },
        {
            title: 'Total Downloads',
            value: stats.totalDownloads,
            icon: Download,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            description: 'Cumulative download count across all resources'
        },
        {
            title: 'Storage Used',
            value: `${(stats.totalStorageUsed / (1024 * 1024)).toFixed(1)} MB`,
            icon: HardDrive,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            description: 'Total storage space used by uploaded files'
        },
        {
            title: 'Recent Uploads',
            value: stats.recentUploads,
            icon: Upload,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            description: 'Resources uploaded in the last 30 days'
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingReviews,
            icon: Clock,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: 'Resources awaiting review approval'
        }
    ]

    if (error) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Resource Statistics</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshStats}
                        disabled={loading}
                    >
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Retry
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-red-600 py-8">
                        <p className="mb-2">Failed to load statistics</p>
                        <Badge variant="destructive">Error</Badge>
                        <p className="text-sm text-gray-500 mt-2">
                            Please check your database connection and try again.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Resource Statistics</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshStats}
                        disabled={loading}
                    >
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {statItems.map((item, index) => (
                            <div
                                key={item.title}
                                className={`p-4 rounded-lg ${item.bgColor} border border-gray-200 transition-all hover:shadow-md`}
                                title={item.description}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {item.title}
                                        </p>
                                        {loading ? (
                                            <div className="h-8 w-16 mt-1 bg-gray-200 animate-pulse rounded" />
                                        ) : (
                                                <p className="text-2xl font-bold text-gray-900 truncate">
                                                {typeof item.value === 'string' ? item.value : item.value.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <item.icon className={`h-8 w-8 ${item.color} flex-shrink-0 ml-2`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional info when not loading */}
                    {!loading && !error && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 text-center">
                                📊 Statistics update automatically when resources are uploaded or deleted.
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    )}

                    {/* Loading overlay for entire stats section */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <RefreshCcw className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Loading statistics...</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
