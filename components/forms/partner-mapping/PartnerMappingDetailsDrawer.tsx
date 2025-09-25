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
    X,
    ArrowRight,
    TrendingUp,
    Award
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
            <DrawerContent className="max-h-[100vh] overflow-hidden">
                <DrawerHeader className="border-b bg-green-50 relative overflow-hidden">
                    <div className="flex items-center justify-between relative">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="p-3 bg-green-600 rounded-xl shadow-sm">
                                    <Building2 className="h-7 w-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                            </div>
                            <div className="space-y-1">
                                <DrawerTitle className="text-2xl font-bold text-green-900">
                                    Partner Mapping Details
                                </DrawerTitle>
                                <DrawerDescription className="text-green-700 font-medium">
                                    Complete information for mapping #{mapping.id.slice(-8)}
                                </DrawerDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge 
                                variant="outline" 
                                className={`capitalize px-4 py-2 text-sm font-semibold border ${getStatusColor(mapping.status)} shadow-sm`}
                            >
                                <div className="w-2 h-2 rounded-full bg-current mr-2" />
                                {mapping.status}
                            </Badge>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="px-6 pb-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    <div className="space-y-8">
                        {/* Overview Section */}
                        <div className="bg-green-50 rounded-2xl p-8 mt-6 border border-green-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-600 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-900">Project Overview</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-600 rounded-xl group-hover:bg-green-700 transition-colors duration-300">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-900">
                                                {mapping.data.partnerMappings.length}
                                            </p>
                                            <p className="text-sm font-medium text-green-700">Total Partners</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-600 rounded-xl group-hover:bg-green-700 transition-colors duration-300">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-900">
                                                {mapping.data.partnerMappings[0]?.year || 'N/A'}
                                            </p>
                                            <p className="text-sm font-medium text-green-700">Project Year</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Section */}
                        <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-600 rounded-xl">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-900">Activity Timeline</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                                    <div className="p-3 bg-green-600 rounded-xl shadow-sm">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-green-900">Created</p>
                                        <p className="text-sm text-green-700">{formatDate(mapping.createdAt)}</p>
                                    </div>
                                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                                    <div className="p-3 bg-green-600 rounded-xl shadow-sm">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-green-900">Last Updated</p>
                                        <p className="text-sm text-green-700">{formatDate(mapping.updatedAt)}</p>
                                    </div>
                                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Partner Mappings Section */}
                        <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-600 rounded-xl">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-green-900">Partner Mappings</h3>
                                    <p className="text-sm text-green-700">{mapping.data.partnerMappings.length} partnership{mapping.data.partnerMappings.length !== 1 ? 's' : ''} configured</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {mapping.data.partnerMappings.map((partnerMapping, index) => (
                                    <div key={index} className="group bg-green-50 border border-green-200 rounded-2xl p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors duration-300">
                                                        <span className="text-lg font-bold text-white">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-bold text-green-900 group-hover:text-green-700 transition-colors duration-300">
                                                        {partnerMapping.projectName || 'Unnamed Project'}
                                                    </h4>
                                                    <p className="text-sm font-medium text-green-700">{partnerMapping.organization}</p>
                                                </div>
                                            </div>
                                            <Badge 
                                                variant="secondary" 
                                                className={`px-4 py-2 text-sm font-semibold ${getWorkNatureColor(partnerMapping.workNature)} border shadow-sm`}
                                            >
                                                {partnerMapping.workNature}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-green-200">
                                                    <div className="p-2 bg-green-600 rounded-lg">
                                                        <MapPin className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Region</p>
                                                        <p className="text-sm font-medium text-green-900">{partnerMapping.projectRegion}</p>
                                                    </div>
                                                </div>
                                                {partnerMapping.district && (
                                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-green-200">
                                                        <div className="p-2 bg-green-600 rounded-lg">
                                                            <Globe className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">District</p>
                                                            <p className="text-sm font-medium text-green-900">{partnerMapping.district}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-green-200">
                                                    <div className="p-2 bg-green-600 rounded-lg">
                                                        <FileText className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Disease Focus</p>
                                                        <p className="text-sm font-medium text-green-900">{partnerMapping.disease}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-green-200">
                                                    <div className="p-2 bg-green-600 rounded-lg">
                                                        <Calendar className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Year</p>
                                                        <p className="text-sm font-medium text-green-900">{partnerMapping.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Partner Details */}
                                        <div className="pt-6 border-t border-green-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-green-600 rounded-lg">
                                                    <Users className="w-5 h-5 text-white" />
                                                </div>
                                                <p className="text-lg font-bold text-green-900">Partner Information</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border border-green-200">
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Partner Organization</p>
                                                            <p className="text-sm font-medium text-green-900">{partnerMapping.partner}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Role & Responsibilities</p>
                                                            <p className="text-sm font-medium text-green-900">{partnerMapping.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t bg-green-50 p-6">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-200 rounded-lg">
                                <FileText className="w-4 h-4 text-green-700" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-800">Mapping ID</p>
                                <p className="text-xs font-mono text-green-600 bg-green-200 px-2 py-1 rounded">{mapping.id}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <DrawerClose asChild>
                                <Button variant="outline" className="hover:bg-green-100 border-green-300">
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

