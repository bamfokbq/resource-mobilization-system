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
    FaUser,
    FaEnvelope,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaUserCircle,
    FaKey,
    FaInfoCircle,
    FaUserShield,
    FaUsers
} from 'react-icons/fa';
import { type DialogState } from './types';

interface UserDetailsDrawerProps {
    drawer: DialogState;
    onClose: () => void;
}

export function UserDetailsDrawer({ drawer, onClose }: UserDetailsDrawerProps) {
    const user = drawer.user;

    return (
        <Drawer open={drawer.open} onOpenChange={onClose} direction="right">
            <DrawerContent className="max-h-[100vh] w-full max-w-lg">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <FaUserCircle className="h-6 w-6 text-emerald-600" />
                        User Details - {user?.name}
                    </DrawerTitle>
                    <DrawerDescription>
                        Complete information for this user account
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 pb-4 overflow-y-auto">
                    {user && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaUser className="h-5 w-5 text-emerald-600" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="text-gray-900 font-medium">{user.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Role</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                                                {user.role === 'Admin' ? (
                                                    <><FaUserShield className="w-3 h-3 mr-1" /> Admin</>
                                                ) : (
                                                    <><FaUsers className="w-3 h-3 mr-1" /> User</>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">First Name</label>
                                        <p className="text-gray-900">{user.firstName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Last Name</label>
                                        <p className="text-gray-900">{user.lastName || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaEnvelope className="h-5 w-5 text-blue-600" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                                        <p className="text-gray-900 font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                        <p className="text-gray-900">{user.telephone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location & Organization */}
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
                                    Location & Organization
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Region</label>
                                        <p className="text-gray-900">{user.region || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Organization</label>
                                        <p className="text-gray-900">{user.organisation || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaShieldAlt className="h-5 w-5 text-purple-600" />
                                    Account Status
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            {user.isActive ? (
                                                <>
                                                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                                        Active
                                                    </Badge>
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimesCircle className="h-4 w-4 text-red-500" />
                                                    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                                        Inactive
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Member Since</label>
                                        <p className="text-gray-900">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    {user.passwordResetAt && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Last Password Reset</label>
                                            <p className="text-gray-900 flex items-center gap-2">
                                                <FaKey className="w-4 h-4 text-orange-500" />
                                                {new Date(user.passwordResetAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {user.statusUpdatedAt && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Status Last Updated</label>
                                            <p className="text-gray-900">
                                                {new Date(user.statusUpdatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio Section */}
                            {user.bio && (
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaInfoCircle className="h-5 w-5 text-orange-600" />
                                        Bio
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                            Close
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
