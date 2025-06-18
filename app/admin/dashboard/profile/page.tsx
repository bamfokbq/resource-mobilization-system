import React from 'react'
import DisplayAdminProfile from '@/components/features/DisplayAdminProfile'
import { RiUserLine, RiSettings2Line } from 'react-icons/ri'

export default function AdminDashboardProfilePage() {
    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <RiUserLine className="text-blue-500" />
                        Admin Profile
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your admin account settings and information</p>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <RiSettings2Line className="text-purple-500 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                </div>

                <DisplayAdminProfile />
            </div>
        </div>
    )
}
