"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, MapPin, Users, TrendingUp, Activity, CheckCircle, Building2, Target, Globe } from 'lucide-react';
import Link from 'next/link';
import { getPartnerMappings } from '@/actions/partnerMappingActions';
import { toast } from 'sonner';
import { RiAddLine, RiHistoryLine, RiBarChartLine, RiPieChartLine } from 'react-icons/ri';
import { PartnerMappingDetailsDrawer } from '@/components/forms/partner-mapping/PartnerMappingDetailsDrawer';
import PartnerMappingData from '@/components/activities/PartnerMappingData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, BarChart3 } from 'lucide-react';

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

// Statistics Cards Component
function PartnerMappingStatsSection({ partnerMappings }: { partnerMappings: PartnerMapping[] }) {
  const totalMappings = partnerMappings.length;
  const completedMappings = partnerMappings.filter(mapping => mapping.status === 'submitted').length;
  const completionRate = totalMappings > 0 ? Math.round((completedMappings / totalMappings) * 100) : 0;
  
  const totalPartners = partnerMappings.reduce((acc, mapping) => 
    acc + (mapping.data?.partnerMappings?.length || 0), 0
  );
  
  const recentMappings = partnerMappings.filter(mapping => {
    const mappingDate = new Date(mapping.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return mappingDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <RiBarChartLine className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            Total
          </span>
        </div>
        <h3 className="text-sm font-medium text-blue-700 mb-2">Total Mappings</h3>
        <p className="text-3xl font-bold text-blue-900">{totalMappings}</p>
        <p className="text-xs text-blue-600 mt-2">All your mappings</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-500 rounded-xl shadow-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Complete
          </span>
        </div>
        <h3 className="text-sm font-medium text-green-700 mb-2">Completed</h3>
        <p className="text-3xl font-bold text-green-900">{completedMappings}</p>
        <p className="text-xs text-green-600 mt-2">Successfully submitted</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            Partners
          </span>
        </div>
        <h3 className="text-sm font-medium text-purple-700 mb-2">Total Partners</h3>
        <p className="text-3xl font-bold text-purple-900">{totalPartners}</p>
        <p className="text-xs text-purple-600 mt-2">Across all mappings</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            Recent
          </span>
        </div>
        <h3 className="text-sm font-medium text-orange-700 mb-2">Recent Activity</h3>
        <p className="text-3xl font-bold text-orange-900">{recentMappings}</p>
        <p className="text-xs text-orange-600 mt-2">Last 30 days</p>
      </div>
    </div>
  );
}

// Controls Section Component
function PartnerMappingControlsSection() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <RiHistoryLine className="text-blue-500" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Partner Mapping History</h2>
            <p className="text-gray-500 text-sm">View and manage your partner mapping submissions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-300">
            <Link href="/dashboard/partner-mapping/form">
              <RiAddLine size={20} />
              New Partner Mapping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function PartnerMappingStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PartnerMappingsPage() {
  const [partnerMappings, setPartnerMappings] = useState<PartnerMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMapping, setSelectedMapping] = useState<PartnerMapping | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    const loadPartnerMappings = async () => {
      try {
        const result = await getPartnerMappings();
        if (result.success && result.partnerMappings) {
          setPartnerMappings(result.partnerMappings);
        } else {
          toast.error('Failed to load partner mappings');
        }
      } catch (error) {
        console.error('Error loading partner mappings:', error);
        toast.error('Failed to load partner mappings');
      } finally {
        setIsLoading(false);
      }
    };

    loadPartnerMappings();
  }, []);

  useEffect(() => {
    if (success === 'true') {
      toast.success('Partner mapping submitted successfully!');
    }
  }, [success]);

  const handleViewDetails = (mapping: PartnerMapping) => {
    setSelectedMapping(mapping);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMapping(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="animate-pulse">
            <div className="flex justify-between items-center">
              <div>
                <div className="w-64 h-8 bg-gray-200 rounded mb-2"></div>
                <div className="w-96 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-48 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <PartnerMappingStatsSkeleton />

        {/* Controls Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="animate-pulse">
            <div className="flex justify-between items-center">
              <div className="w-64 h-6 bg-gray-200 rounded"></div>
              <div className="w-48 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header - Loads immediately */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Partner Mapping Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all your partner mapping submissions in one place</p>
        </div>
        <Link
          href="/dashboard/partner-mapping/form"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <RiAddLine size={20} />
          Start New Mapping
        </Link>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="survey-data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg">
          <TabsTrigger value="survey-data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Survey-Based Data
          </TabsTrigger>
          <TabsTrigger value="my-mappings" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            My Mappings
          </TabsTrigger>
        </TabsList>

        {/* Survey-Based Partner Mapping Data */}
        <TabsContent value="survey-data" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Survey-Based Partner Mapping Data</CardTitle>
                  <p className="text-indigo-100 text-sm mt-1">
                    Individual organization submissions from surveys that can be used for partner mapping
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <PartnerMappingData />
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Partner Mapping Submissions */}
        <TabsContent value="my-mappings" className="space-y-6">
          {/* Partner Mapping Statistics Cards */}
          <PartnerMappingStatsSection partnerMappings={partnerMappings} />

          {/* Partner Mapping Controls Section */}
          <PartnerMappingControlsSection />

      {/* Partner Mapping History List */}
      {partnerMappings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Partner Mappings Yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Start building your network by creating your first partner mapping. Track collaborations, organizations, and project relationships.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-300">
              <Link href="/dashboard/partner-mapping/form">
                <RiAddLine size={20} />
                Create Your First Mapping
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {partnerMappings.map((mapping) => (
            <Card key={mapping.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 mb-1">
                        Partner Mapping #{mapping.id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Created on {new Date(mapping.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`capitalize px-3 py-1 ${
                      mapping.status === 'submitted' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    {mapping.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {mapping.data.partnerMappings.length}
                        </p>
                        <p className="text-xs text-gray-600">
                          Partner{mapping.data.partnerMappings.length !== 1 ? 's' : ''} Mapped
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {mapping.data.partnerMappings[0]?.projectRegion || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600">Primary Region</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {mapping.data.partnerMappings[0]?.year || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600">Project Year</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Organizations */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Organizations & Partners:</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mapping.data.partnerMappings.slice(0, 4).map((pm, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200">
                          {pm.organization}
                        </Badge>
                      ))}
                      {mapping.data.partnerMappings.length > 4 && (
                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-gray-50 text-gray-700 border-gray-200">
                          +{mapping.data.partnerMappings.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span>Last updated: {new Date(mapping.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                        onClick={() => handleViewDetails(mapping)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>
      </Tabs>

      {/* Partner Mapping Details Drawer */}
      <PartnerMappingDetailsDrawer
        mapping={selectedMapping}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
