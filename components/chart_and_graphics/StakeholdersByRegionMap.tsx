"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import geoData from '@/constant/geo.json'; // Importing GeoJSON data
import { FeatureCollection } from 'geojson';
import PartnersTable from './PartnersTable';

// Define a simple type for stakeholder data items
interface StakeholderDataItem {
  id: number;
  Region: string; // This should match a region name in geoData properties
  name: string;
  type: string;
  contact?: string;
}


// Sample region labels (coordinates for map markers/labels)
// These would typically be the centroids or prominent points of your regions
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
    const GenericMapComponent = React.useMemo(() => {
        return dynamic(
            () => import('./GenericMap'), // Assuming GenericMap is in the same directory
            {
                loading: () => <div className="flex justify-center items-center h-96"><p className="text-lg">Loading Map...</p></div>,
                ssr: false
            }
        );
    }, []);


    return (
      <section className="py-8 px-4 bg-slate-50 flex items-center">
          <div className="w-full">
              <GenericMapComponent
                  geoData={geoData as FeatureCollection}
                  regionLabels={regionLabels}
                  title="Stakeholders by Region"
                  regionNameField="name" // Key in `geoData.features.properties` for region name
                  mapHeight="700px"
                //   dataItemFields={dataItemFields}
                  // Optional: customize colors if needed
                  emptyRegionColor="#e03"
                  filledRegionColor="#81c784"
                  selectedRegionColor="#4caf50"
          />
        </div>
         <PartnersTable />
    </section>
  )
}
