'use client'

import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SettingsManager from '@/components/admin/SettingsManager'
import { Shield, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await auth()
  
  // Check if user is authenticated
  if (!session) {
    redirect('/auth/signin')
  }

  const userEmail = session.user?.email
  const userRole = session.user?.role

  // Check if user has the required permissions
  if (userEmail !== 'systemowner' || userRole !== 'Admin') {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <Card className="shadow-lg border-red-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <Shield className="text-red-600" size={32} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Access Denied
            </CardTitle>
            <CardDescription className="text-lg">
              You don't have permission to access the Settings page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <AlertTriangle size={20} />
              <span className="font-medium">Restricted Access</span>
            </div>
            <div className="text-gray-600 space-y-2">
              <p>This page is only accessible to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Users with email: <span className="font-mono bg-gray-100 px-2 py-1 rounded">systemowner</span></li>
                <li>Users with role: <span className="font-mono bg-gray-100 px-2 py-1 rounded">Admin</span></li>
              </ul>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              <p>Current user: <span className="font-medium">{userEmail}</span></p>
              <p>Current role: <span className="font-medium">{userRole}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <SettingsManager />
}
