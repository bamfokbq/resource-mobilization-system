'use client';

import { Card, CardContent } from "@/components/ui/card";
import { 
    FaUsers, 
    FaCheckCircle, 
    FaUserShield, 
    FaCalendarAlt 
} from 'react-icons/fa';
import { type UserTableStats } from './types';

interface UserStatsCardsProps {
    stats: UserTableStats;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
    const { totalUsers, activeUsers, adminUsers, newThisMonth } = stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">Total Users</p>
                            <p className="text-2xl font-bold text-emerald-900">{totalUsers}</p>
                        </div>
                        <FaUsers className="h-8 w-8 text-emerald-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-700">Active Users</p>
                            <p className="text-2xl font-bold text-green-900">{activeUsers}</p>
                        </div>
                        <FaCheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-700">Admins</p>
                            <p className="text-2xl font-bold text-blue-900">{adminUsers}</p>
                        </div>
                        <FaUserShield className="h-8 w-8 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-700">New This Month</p>
                            <p className="text-2xl font-bold text-purple-900">{newThisMonth}</p>
                        </div>
                        <FaCalendarAlt className="h-8 w-8 text-purple-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
