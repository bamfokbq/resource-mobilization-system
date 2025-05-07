"use client";

import React, { useMemo } from 'react';
import GeneralMap from '@/components/chart_and_graphics/GeneralMap';
import geoData from '@/constant/geo.json';
import healthData from '@/constant/health_data.json';

// Define the type for our transformed health data items
interface HealthDataItem {
  region: string;
  facilityName: string;
  facilityType: string;
  district: string;
  staffCount: number;
}

// Region coordinates for labels (same as PartnersDisplayMap)
const regionLabels: { [region: string]: [number, number] } = {
  "Greater Accra": [5.7, 0.1],
  "Ashanti": [6.7, -1.5],
  "Western": [5.5, -2.2],
  "Western North": [6.2, -2.8],
  "Central": [5.5, -1.0],
  "Eastern": [6.3, -0.4],
  "Volta": [6.5, 0.5],
  "Oti": [7.9, 0.2],
  "Northern": [9.6, -0.3],
  "Savannah": [9.2, -1.7],
  "North East": [10.4, -0.6],
  "Upper East": [10.8, -0.9],
  "Upper West": [10.3, -2.2],
  "Bono": [7.6, -2.4],
  "Bono East": [7.9, -1.2],
  "Ahafo": [6.9, -2.6]
};

// Health facility data fields to display
const healthFields = [
  {
    key: "facilityType",
    label: "Facility Type",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    key: "district",
    label: "District",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    key: "staffCount",
    label: "Staff",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

export default function RegionMap() {
  // Transform the health data object into an array of objects that GeneralMap can use
  const transformedHealthData = useMemo(() => {
    const result: HealthDataItem[] = [];
    // For each region in the health data
    Object.entries(healthData).forEach(([region, diseases]) => {
      // For each disease in the region, create a facility entry
      Object.entries(diseases as Record<string, number>).forEach(([disease, count]) => {
        if (count !== null) {
          result.push({
            region: region,
            facilityName: `${disease} Treatment Center`,
            facilityType: disease,
            district: `${region} District`,
            staffCount: count
          });
        }
      });
    });
    return result;
  }, []);

  return (
    <GeneralMap
      geoData={geoData as any}
      dataItems={transformedHealthData}
      regionLabels={regionLabels}
      title="Health Facilities by Region"
      regionField="region"
      regionNameField="name"
      dataItemTitleField="facilityName"
      dataItemFields={healthFields}
      showDataPanel={true}
      mapHeight="550px"
      emptyRegionColor="#e0f7fa"
      filledRegionColor="#26a69a"
      selectedRegionColor="#ff5722"
      customStyles={{
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}
    />
  );
}