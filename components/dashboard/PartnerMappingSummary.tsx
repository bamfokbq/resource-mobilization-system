"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, MapPin, Calendar, TrendingUp, Plus, Eye, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getPartnerMappings, getPartnerMappingDraft } from '@/actions/partnerMappingActions';
import { toast } from 'sonner';

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

interface PartnerMappingDraft {
  id: string;
  userId: string;
  formData: any;
  currentStep: string;
  lastUpdated: string;
  createdAt: string;
}

export default function PartnerMappingSummary() {
  const [partnerMappings, setPartnerMappings] = useState<PartnerMapping[]>([]);
  const [draft, setDraft] = useState<PartnerMappingDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [mappingsResult, draftResult] = await Promise.all([
          getPartnerMappings(),
          getPartnerMappingDraft()
        ]);

        if (mappingsResult.success && mappingsResult.partnerMappings) {
          setPartnerMappings(mappingsResult.partnerMappings);
        }

        if (draftResult.success && draftResult.draft) {
          setDraft(draftResult.draft);
        }
      } catch (error) {
        console.error('Error loading partner mapping data:', error);
        toast.error('Failed to load partner mapping data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="w-64 h-8 bg-gray-200 rounded"></div>
            <div className="w-32 h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-3"></div>
                <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalMappings = partnerMappings.length;
  const completedMappings = partnerMappings.filter(mapping => mapping.status === 'submitted').length;
  const totalPartners = partnerMappings.reduce((acc, mapping) => 
    acc + (mapping.data?.partnerMappings?.length || 0), 0
  );
  const hasDraft = !!draft;

  const recentMappings = partnerMappings.slice(0, 3);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Partner Mapping</h2>
            <p className="text-gray-600 text-sm">Track your partnership networks and collaborations</p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasDraft && (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/partner-mapping/form">
                <Eye className="w-4 h-4 mr-2" />
                Continue Draft
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg transition-all duration-300">
            <Link href="/dashboard/partner-mapping/form">
              <Plus className="w-4 h-4 mr-2" />
              New Mapping
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Mappings</p>
              <p className="text-2xl font-bold text-blue-900">{totalMappings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Completed</p>
              <p className="text-2xl font-bold text-green-900">{completedMappings}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Partners</p>
              <p className="text-2xl font-bold text-purple-900">{totalPartners}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Mappings */}
      {recentMappings.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Mappings</h3>
          {recentMappings.map((mapping) => (
            <div key={mapping.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {mapping.data.partnerMappings[0]?.organization?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {mapping.data.partnerMappings[0]?.organization || 'Untitled Mapping'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {mapping.data.partnerMappings.length} partner{mapping.data.partnerMappings.length !== 1 ? 's' : ''} • {mapping.data.partnerMappings[0]?.projectRegion || 'Unknown Region'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    mapping.status === 'submitted' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}
                >
                  {mapping.status}
                </Badge>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/partner-mapping">
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partner Mappings Yet</h3>
          <p className="text-gray-600 mb-4">Start building your network by creating your first partner mapping</p>
          <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg transition-all duration-300">
            <Link href="/dashboard/partner-mapping/form">
              <Plus className="w-4 h-4 mr-2" />
              Create First Mapping
            </Link>
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Partner mapping insights and analytics</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/partner-mapping">
              View All Mappings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
