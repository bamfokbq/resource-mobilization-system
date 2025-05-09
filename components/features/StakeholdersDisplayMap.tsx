"use client";

import React from 'react';
import GeneralMap from '@/components/chart_and_graphics/GeneralMap';
import geoData from '@/constant/geo.json';
import regionLabels from '@/constant/regions.json';

// Define the expected structure of a stakeholder item
interface StakeholderItem {
  Region?: string;
  Name?: string;
  Sector?: string;
  FocusArea?: string;
  ContactPerson?: string;
  [key: string]: any; // Allow other properties
}

// Data fields to display for each stakeholder - customize as needed
const stakeholderFields = [
    {
        key: "Sector", 
        label: "Sector",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M5 6h14M5 10h14M5 14h14M5 18h14" />
            </svg>
        )
    },
    {
        key: "FocusArea", 
        label: "Focus Area",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        key: "ContactPerson", 
        label: "Contact",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
      )
  }
];

export default function StakeholdersDisplayMap() {
    const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

    const handleRegionSelect = (region: string | null) => {
        setSelectedRegion(region);
    };

    return (
        <GeneralMap
            geoData={geoData as any} // GeoJSON data for map boundaries
            dataItems={[]} // Stakeholder data array
            regionLabels={regionLabels as any} // Coordinates for region labels
            title="Stakeholders by Region"
            regionField="Region" // Field in stakeholderData to match with map regions
            regionNameField="name" // Field in geoData properties that contains the region name
            dataItemTitleField="Name" // Field in stakeholderData to use as the title for items in the panel
            dataItemFields={stakeholderFields} // Configuration for displaying stakeholder details
            onRegionSelect={handleRegionSelect} // Callback for when a region is selected
            showDataPanel={false} // Whether to show the data panel
            mapHeight="600px" 
            emptyRegionColor="#ECEFF1" // Color for regions with no data
            filledRegionColor="#66BB6A" // Color for regions with data (e.g., a shade of green)
            selectedRegionColor="#FFCA28" // Color for selected regions (e.g., a shade of amber)
        />
    );
}
