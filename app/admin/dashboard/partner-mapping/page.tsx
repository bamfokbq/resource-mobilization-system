"use client";

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, TrendingUp, Users, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
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
    <div className="p-6 space-y-8 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 min-h-screen">
      {/* Header - Loads immediately */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-8 shadow-xl border border-green-200">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                Partner Mapping Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage and track all partner mapping submissions across the system</p>
            </div>
          </div>
        </div>
        
        <Link
          href="/admin/dashboard/partner-mapping/form"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg font-semibold group"
        >
          <RiAddLine size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          Start New Mapping
        </Link>
      </div>

      {/* Partner Mapping Submissions Data */}
      <div className="space-y-6">
        <Card className="border-0 shadow-2xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 to-yellow-500 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}></div>
            </div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Database className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">Partner Mapping Submissions Data</CardTitle>
                <p className="text-white/90 text-sm mt-1 font-medium">
                  Comprehensive directory of partner mapping submissions from organizations
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
