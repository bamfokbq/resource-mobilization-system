"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import geoData from '@/constant/geo.json';
import { FeatureCollection } from 'geojson';
import PartnersTable from './PartnersTable';
import { MapPin, Users, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Define a simple type for stakeholder data items
interface StakeholderDataItem {
  id: number;
  Region: string;
  name: string;
  type: string;
  contact?: string;
}

// Sample region labels (coordinates for map markers/labels)
const regionLabels = {
  "Greater Accra": [5.6037, -0.1870] as [number, number],
  "Ashanti": [6.7590, -1.5401] as [number, number],
  "Western": [5.5500, -2.2500] as [number, number],
  "Central": [5.3500, -1.3000] as [number, number],
  "Eastern": [6.3000, -0.5000] as [number, number],
  "Volta": [6.5000, 0.5000] as [number, number],
  "Oti": [7.8500, 0.2500] as [number, number],
  "Northern": [9.5000, -0.5000] as [number, number],
  "Savannah": [9.0833, -1.8333] as [number, number],
  "North East": [10.5000, -0.3500] as [number, number],
  "Upper East": [10.7500, -0.7500] as [number, number],
  "Upper West": [10.3500, -2.2500] as [number, number],
  "Bono": [7.7500, -2.2500] as [number, number],
  "Bono East": [7.9000, -1.0000] as [number, number],
  "Ahafo": [7.0000, -2.3500] as [number, number],
  "Western North": [6.3000, -2.6000] as [number, number],
};

export default function StakeholdersByRegionMap() {
  const [selectedRegionOnMap, setSelectedRegionOnMap] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

    const GenericMapComponent = React.useMemo(() => {
        return dynamic(
      () => import('./GenericMap'),
      {
        loading: () => (
          <div className="flex flex-col justify-center items-center h-96 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghs-green mb-4"></div>
            <p className="text-lg font-medium text-slate-600">Loading Interactive Map...</p>
            <p className="text-sm text-slate-500 mt-1">Please wait while we prepare the regional data</p>
          </div>
        ),
                ssr: false
            }
        );
    }, []);

  const handleRegionSelect = (region: string | null) => {
    setSelectedRegionOnMap(region);
  };

  const clearSelection = () => {
    setSelectedRegionOnMap(null);
  };

  return (
    <section className='py-8 px-4 h-fit'>
      <div>
        {/* Enhanced Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <h2 className="text-4xl font-bold text-ghs-green">Stakeholders by Region</h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-ghs-green to-blue-600 rounded-full mx-auto mb-4"></div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Map Section */}
          <div className="xl:col-span-2">
            <Card className="h-full bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-ghs-green" />
                    Regional Map
                  </CardTitle>
                  {selectedRegionOnMap && (
                    <Badge variant="secondary" className="bg-ghs-green/10 text-ghs-green border-ghs-green/20">
                      {selectedRegionOnMap}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600">
                  Click on any region to view stakeholders and filter the table below
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <GenericMapComponent
                    geoData={geoData as FeatureCollection}
                    regionLabels={regionLabels}
                    regionNameField="name"
                    mapHeight="700px"
                    onRegionSelect={handleRegionSelect}
                    emptyRegionColor="#4ade80"
                    filledRegionColor="#22c55e"
                    selectedRegionColor="#16a34a"
                    showRegionLabels={true}
                    showTooltips={true}
                    enableInteractions={true}
                  />
                  {selectedRegionOnMap && (
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearSelection}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Section */}
          <div className="xl:col-span-3">
            <PartnersTable selectedRegion={selectedRegionOnMap} />
          </div>
        </div>
      </div>
    </section>
  )
}
