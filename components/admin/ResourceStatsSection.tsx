'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    Download,
    HardDrive,
    Upload,
    Clock
} from 'lucide-react'
import { useResourceStats } from '@/hooks/useResourceStats'

export function ResourceStatsSection() {
    const { stats, loading, error } = useResourceStats()

    const statItems = [
        {
            title: 'Total Resources',
            value: stats.totalResources,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Total Downloads',
            value: stats.totalDownloads,
            icon: Download,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Storage Used',
            value: `${(stats.totalStorageUsed / (1024 * 1024)).toFixed(1)} MB`,
            icon: HardDrive,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Recent Uploads',
            value: stats.recentUploads,
            icon: Upload,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingReviews,
            icon: Clock,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        }
    ]

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Resource Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-red-600">
                        <p>Failed to load statistics</p>
                        <Badge variant="destructive">Error</Badge>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Resource Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {statItems.map((item, index) => (
                            <div
                                key={item.title}
                                className={`p-4 rounded-lg ${item.bgColor} border border-gray-200`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {item.title}
                                        </p>
                                        {loading ? (
                                            <div className="h-8 w-16 mt-1 bg-gray-200 animate-pulse rounded" />
                                        ) : (
                                            <p className="text-2xl font-bold text-gray-900">
                                                {typeof item.value === 'string' ? item.value : item.value.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <item.icon className={`h-8 w-8 ${item.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
