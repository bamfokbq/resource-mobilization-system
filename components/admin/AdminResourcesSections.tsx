'use client'

import React, { useState } from 'react'
import { ResourceStatsSection } from './ResourceStatsSection'
import { ResourceManagementTable } from './ResourceManagementTable'
import { ResourceUploadSection } from './ResourceUploadSection'
import { ResourceHeaderSection } from './ResourceHeaderSection'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Resource } from '@/types/resources'

// Main Admin Resources Page
export default function AdminResourcesSections() {
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleEditResource = (resource: Resource) => {
        setSelectedResource(resource)
        setIsEditDialogOpen(true)
    }

    return (
        <div className="space-y-8">
            {/* Stats Section */}
            <ResourceStatsSection />

            {/* Management Section */}
            <ResourceManagementTable onEditResource={handleEditResource} />

            {/* Upload Section */}
            <ResourceUploadSection />

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Resource</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <p>Edit functionality will be implemented here</p>
                        {selectedResource && (
                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                <h4 className="font-medium">{selectedResource.title}</h4>
                                <p className="text-sm text-gray-600">{selectedResource.description}</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Export individual sections for backward compatibility
export { ResourceHeaderSection as AdminResourcesHeaderSection }
export { ResourceStatsSection as AdminResourcesStatsSection }
export { ResourceManagementTable as AdminResourcesManagementSection }
export { ResourceUploadSection as AdminResourcesUploadSection }
