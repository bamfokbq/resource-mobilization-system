import React from 'react'

export default function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <div className="h-8 bg-gray-200 rounded-lg w-80 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-96"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
                        <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                    </div>
                </div>
            </div>

            {/* Performance Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
                            <div className="bg-gray-200 rounded-full w-16 h-6"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                ))}
            </div>

            {/* KPI Cards Skeleton */}
            <div>
                <div className="mb-6">
                    <div className="h-8 bg-gray-200 rounded w-80 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-96"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
                                <div className="bg-gray-200 rounded-full w-16 h-6"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Skeleton */}
            <div>
                <div className="mb-6">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-80"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="grid grid-cols-4 gap-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
