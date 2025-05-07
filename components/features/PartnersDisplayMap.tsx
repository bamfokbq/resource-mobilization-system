"use client";

import React from 'react';
import GeneralMap from '@/components/chart_and_graphics/GeneralMap';
import geoData from '@/constant/geo.json';
import partnerData from '@/constant/partner.json';

// Region coordinates for labels
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

// Data fields to display for each partner
const partnerFields = [
    {
        key: "Activity Area",
        label: "Area",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        )
    },
    {
        key: "District of Operation",
        label: "District",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        key: "No. of Years in District",
        label: "Years",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
      )
  }
];

export default function PartnersDisplayMap() {
    const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

    // Handle region selection event from the GeneralMap component
    const handleRegionSelect = (region: string | null) => {
        setSelectedRegion(region);
        // Any additional logic when a region is selected can go here
    };

    return (
        <GeneralMap
            geoData={geoData as any}
            dataItems={partnerData}
            regionLabels={regionLabels}
            title="Partners by Region"
            regionField="Region"
            regionNameField="name"
            dataItemTitleField="Name of NGO/PARTNER"
            dataItemFields={partnerFields}
            onRegionSelect={handleRegionSelect}
            showDataPanel={true}
            mapHeight="600px"
            emptyRegionColor="#b2ebf2"
            filledRegionColor="#3388ff"
            selectedRegionColor="#ff9800"
        />
    );
}
