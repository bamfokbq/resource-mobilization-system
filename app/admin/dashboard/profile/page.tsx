import React, { Suspense } from 'react'
import { AdminProfileSection } from '@/components/admin/AdminProfileSections'
import { AdminProfileSkeleton } from '@/components/skeletons/AdminSkeletons'

export default function AdminDashboardProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<AdminProfileSkeleton />}>
                <AdminProfileSection />
            </Suspense>
        </div>
    )
}
