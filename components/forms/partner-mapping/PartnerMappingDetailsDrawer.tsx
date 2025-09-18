'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Building2,
    Calendar,
    MapPin,
    Users,
    Target,
    FileText,
    Globe,
    Activity,
    CheckCircle,
    Clock,
    AlertCircle,
    X
} from 'lucide-react';

interface PartnerMapping {
    id: string;
    userId: string;
    data: {
        partnerMappings: Array<{
            year: number;
            workNature: string;
            organization: string;
            projectName: string;
            projectRegion: string;
            district?: string;
            disease: string;
            partner: string;
            role: string;
        }>;
    };
    createdAt: string;
    updatedAt: string;
    status: string;
}

interface PartnerMappingDetailsDrawerProps {
    mapping: PartnerMapping | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PartnerMappingDetailsDrawer({ mapping, isOpen, onClose }: PartnerMappingDetailsDrawerProps) {
    if (!mapping) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'draft':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'pending':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getWorkNatureColor = (workNature: string) => {
        switch (workNature.toLowerCase()) {
            case 'project':
                return 'bg-blue-100 text-blue-800';
            case 'program':
                return 'bg-purple-100 text-purple-800';
            case 'research':
                return 'bg-green-100 text-green-800';
            case 'capacity building':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction="right" >
            <DrawerContent className="max-h-[100vh]">
                <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DrawerTitle className="text-xl">
                                    Partner Mapping Details
                                </DrawerTitle>
                                <DrawerDescription>
                                    Complete information for mapping #{mapping.id.slice(-8)}
                                </DrawerDescription>
                            </div>
                        </div>
                        <Badge 
                            variant="outline" 
                            className={`capitalize px-3 py-1 ${getStatusColor(mapping.status)}`}
                        >
                            {mapping.status}
                        </Badge>
                    </div>
                </DrawerHeader>

                <div className="px-6 pb-6 overflow-y-auto flex-1">
                    <div className="space-y-6">
                        {/* Overview Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {mapping.data.partnerMappings.length}
                                        </p>
                                        <p className="text-xs text-gray-600">Total Partners</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {mapping.data.partnerMappings[0]?.year || 'N/A'}
                                        </p>
                                        <p className="text-xs text-gray-600">Project Year</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-600" />
                                Timeline
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Created</p>
                                        <p className="text-xs text-gray-600">{formatDate(mapping.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Activity className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                                        <p className="text-xs text-gray-600">{formatDate(mapping.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partner Mappings Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-600" />
                                Partner Mappings ({mapping.data.partnerMappings.length})
                            </h3>
                            <div className="space-y-4">
                                {mapping.data.partnerMappings.map((partnerMapping, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-blue-600">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {partnerMapping.projectName || 'Unnamed Project'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">{partnerMapping.organization}</p>
                                                </div>
                                            </div>
                                            <Badge 
                                                variant="secondary" 
                                                className={getWorkNatureColor(partnerMapping.workNature)}
                                            >
                                                {partnerMapping.workNature}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">Region</p>
                                                        <p className="text-sm text-gray-900">{partnerMapping.projectRegion}</p>
                                                    </div>
                                                </div>
                                                {partnerMapping.district && (
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-500">District</p>
                                                            <p className="text-sm text-gray-900">{partnerMapping.district}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">Disease Focus</p>
                                                        <p className="text-sm text-gray-900">{partnerMapping.disease}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">Year</p>
                                                        <p className="text-sm text-gray-900">{partnerMapping.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Partner Details */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-700">Partner Information</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">Partner:</span> {partnerMapping.partner}
                                                </p>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    <span className="font-medium">Role:</span> {partnerMapping.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Mapping ID: {mapping.id}
                        </div>
                        <div className="flex gap-2">
                            <DrawerClose asChild>
                                <Button variant="outline">
                                    <X className="w-4 h-4 mr-2" />
                                    Close
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
