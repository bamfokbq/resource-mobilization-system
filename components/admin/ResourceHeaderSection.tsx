import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderOpen } from 'lucide-react'

export function ResourceHeaderSection() {
    return (
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <FolderOpen className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Resource Management
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Manage, upload, and organize organizational resources
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            Admin Dashboard
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
