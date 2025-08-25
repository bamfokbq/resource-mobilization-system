import { Suspense } from 'react'
import {
    AdminResourcesHeaderSection,
    AdminResourcesStatsSection,
    AdminResourcesManagementSection,
    AdminResourcesUploadSection
} from '@/components/admin/AdminResourcesSections'

// Individual section skeletons
function HeaderSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
        </div>
    )
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-6 w-6 bg-gray-200 rounded"></div>
                            <div className="h-5 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ManagementSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function UploadSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                    <div className="h-32 bg-gray-100 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default async function AdminResourcesPage() {
    return (
        <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen overflow-x-hidden">
            <Suspense fallback={<HeaderSkeleton />}>
                <AdminResourcesHeaderSection />
            </Suspense>

            <Suspense fallback={<StatsSkeleton />}>
                <AdminResourcesStatsSection />
            </Suspense>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                <div className="xl:col-span-2">
                    <Suspense fallback={<ManagementSkeleton />}>
                        <AdminResourcesManagementSection />
                    </Suspense>
                </div>
                
                <div className="xl:col-span-1">
                    <Suspense fallback={<UploadSkeleton />}>
                        <AdminResourcesUploadSection />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
