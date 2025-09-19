"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, RefreshCw, Building2, MapPin, Calendar, Users, Target, Globe, Phone, Mail, ExternalLink } from 'lucide-react';
import { usePartnerMappingData } from '@/hooks/useSurveyData';
import { toast } from 'sonner';

interface PartnerMappingItem {
  id: string;
  organization: string;
  projectName: string;
  projectRegion: string;
  district?: string;
  disease: string;
  workNature: string;
  year: number;
  sector: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  submissionDate: string;
  userId: string;
  partner: string;
  role: string;
}

export default function UserPartnerMappingData() {
  const { data: partnerMappingData, isLoading, error, refetch } = usePartnerMappingData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDisease, setSelectedDisease] = useState('all');
  const [selectedWorkNature, setSelectedWorkNature] = useState('all');
  const [sortField, setSortField] = useState<keyof PartnerMappingItem>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get unique values for filters
  const uniqueRegions = useMemo(() => {
    if (!partnerMappingData) return [];
    return Array.from(new Set(partnerMappingData.map(item => item.projectRegion).filter(Boolean))).sort();
  }, [partnerMappingData]);

  const uniqueDiseases = useMemo(() => {
    if (!partnerMappingData) return [];
    return Array.from(new Set(partnerMappingData.flatMap(item => 
      Array.isArray(item.disease) ? item.disease : [item.disease]
    ).filter(Boolean))).sort();
  }, [partnerMappingData]);

  const uniqueWorkNatures = useMemo(() => {
    if (!partnerMappingData) return [];
    return Array.from(new Set(partnerMappingData.map(item => item.workNature).filter(Boolean))).sort();
  }, [partnerMappingData]);

  // Enhanced filtering and sorting logic
  const filteredAndSortedData = useMemo(() => {
    if (!partnerMappingData) return [];

    let filtered = partnerMappingData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectRegion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(item.disease) ? item.disease.join(', ').toLowerCase() : item.disease.toLowerCase()).includes(searchTerm.toLowerCase());

      const matchesRegion = selectedRegion === 'all' || item.projectRegion === selectedRegion;
      const matchesDisease = selectedDisease === 'all' || 
        (Array.isArray(item.disease) ? item.disease.includes(selectedDisease) : item.disease === selectedDisease);
      const matchesWorkNature = selectedWorkNature === 'all' || item.workNature === selectedWorkNature;

      return matchesSearch && matchesRegion && matchesDisease && matchesWorkNature;
    });

    // Sort the filtered data
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'submissionDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [partnerMappingData, searchTerm, selectedRegion, selectedDisease, selectedWorkNature, sortField, sortDirection]);

  const handleSort = (field: keyof PartnerMappingItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Data refreshed successfully');
  };

  const handleExport = () => {
    if (!filteredAndSortedData.length) {
      toast.error('No data to export');
      return;
    }

    const csvContent = [
      ['Organization', 'Project Name', 'Region', 'District', 'Disease', 'Work Nature', 'Year', 'Sector', 'Phone', 'Email', 'Website', 'Submission Date'],
      ...filteredAndSortedData.map(item => [
        item.organization,
        item.projectName,
        item.projectRegion,
        item.district || '',
        Array.isArray(item.disease) ? item.disease.join(', ') : item.disease,
        item.workNature,
        item.year.toString(),
        item.sector,
        item.contact.phone || '',
        item.contact.email || '',
        item.contact.website || '',
        new Date(item.submissionDate).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `partner-mapping-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <Building2 className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error loading partner mapping data</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!partnerMappingData || partnerMappingData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <Building2 className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">No partner mapping data available</p>
          <p className="text-sm text-gray-600">Submit surveys to see partner mapping data here</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Survey-Based Partner Mapping Data</h3>
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedData.length} of {partnerMappingData.length} organizations
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {uniqueRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDisease} onValueChange={setSelectedDisease}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by disease" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Diseases</SelectItem>
            {uniqueDiseases.map(disease => (
              <SelectItem key={disease} value={disease}>{disease}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedWorkNature} onValueChange={setSelectedWorkNature}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by work nature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Work Types</SelectItem>
            {uniqueWorkNatures.map(workNature => (
              <SelectItem key={workNature} value={workNature}>{workNature}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('organization')}
                  >
                    <div className="flex items-center gap-2">
                      Organization
                      {sortField === 'organization' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('projectName')}
                  >
                    <div className="flex items-center gap-2">
                      Project Name
                      {sortField === 'projectName' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('projectRegion')}
                  >
                    <div className="flex items-center gap-2">
                      Region
                      {sortField === 'projectRegion' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('workNature')}
                  >
                    <div className="flex items-center gap-2">
                      Work Nature
                      {sortField === 'workNature' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('year')}
                  >
                    <div className="flex items-center gap-2">
                      Year
                      {sortField === 'year' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('submissionDate')}
                  >
                    <div className="flex items-center gap-2">
                      Submitted
                      {sortField === 'submissionDate' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((item, index) => (
                  <TableRow key={item.id || index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="truncate max-w-[200px]" title={item.organization}>
                          {item.organization}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="truncate max-w-[200px]" title={item.projectName}>
                        {item.projectName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{item.projectRegion}</span>
                        {item.district && (
                          <span className="text-gray-500 text-xs">({item.district})</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(item.disease) ? (
                          item.disease.map((disease: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {disease}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            {item.disease}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.workNature === 'RESEARCH' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {item.workNature}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{item.year}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {item.contact.phone && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{item.contact.phone}</span>
                          </div>
                        )}
                        {item.contact.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[120px]" title={item.contact.email}>
                              {item.contact.email}
                            </span>
                          </div>
                        )}
                        {item.contact.website && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <ExternalLink className="w-3 h-3" />
                            <a 
                              href={item.contact.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 truncate max-w-[120px]"
                              title={item.contact.website}
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-600">
                        {new Date(item.submissionDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No data matches your current filters</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('all');
              setSelectedDisease('all');
              setSelectedWorkNature('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
