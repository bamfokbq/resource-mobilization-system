"use client";

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { toast } from 'sonner';
import PartnerMappingData from '@/components/activities/PartnerMappingData';
import Link from 'next/link';
import { RiAddLine } from 'react-icons/ri';


export default function AdminPartnerMappingsPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Partner mapping submitted successfully!');
    }
  }, [success]);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header - Loads immediately */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Partner Mapping Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all partner mapping submissions across the system</p>
        </div>
        <Link
          href="/admin/dashboard/partner-mapping/form"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <RiAddLine size={20} />
          Start New Mapping
        </Link>
      </div>

      {/* Partner Mapping Submissions Data */}
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Partner Mapping Submissions Data</CardTitle>
                <p className="text-indigo-100 text-sm mt-1">
                  Direct partner mapping submissions from organizations for survey analysis
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <PartnerMappingData />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
