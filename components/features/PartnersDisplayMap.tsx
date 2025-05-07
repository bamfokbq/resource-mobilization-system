"use client";

import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { Feature, Geometry, FeatureCollection } from 'geojson';
import { PathOptions, LatLngBounds, Layer, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoData from '@/constant/geo.json';
import partnerData from '@/constant/partner.json';

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

const getRegionPartnerCount = (region: string) =>
    partnerData.filter((p) => p.Region && p.Region.toLowerCase() === region.toLowerCase()).length;

const createOnEachFeature = (
    setSelectedRegion: (region: string | null) => void,
    setPopupPosition: (pos: [number, number] | null) => void,
    selectedRegion: string | null
) => (
    feature: Feature<Geometry, { name: string }>,
    layer: Layer
) => {
        if (!feature.properties?.name) return;
        const region = feature.properties.name;
        const count = getRegionPartnerCount(region);
        const isSelected = selectedRegion && region.toLowerCase() === selectedRegion.toLowerCase();
        const style: PathOptions = {
            fillColor: isSelected ? '#ff9800' : (count > 0 ? '#3388ff' : '#b2ebf2'),
            weight: isSelected ? 4 : 2,
            opacity: 1,
            color: isSelected ? '#ff9800' : 'white',
            fillOpacity: 0.7,
        };
        (layer as any).setStyle(style);
        layer.on({
            click: (e: any) => {
                setSelectedRegion(region);
                setPopupPosition([e.latlng.lat, e.latlng.lng]);
            },
            mouseover: () => layer.openPopup(),
        });
        layer.bindTooltip(region, { sticky: true });
    };

export default function PartnersDisplayMap() {
    const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);
    const [popupPosition, setPopupPosition] = React.useState<[number, number] | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const ghanaBounds = new LatLngBounds([4.7, -3.5], [11.2, 1.2]);
    const regionPartners = selectedRegion
        ? partnerData.filter((p) => p.Region && p.Region.toLowerCase() === selectedRegion.toLowerCase())
        : [];

    const onEachFeature = React.useCallback(
        createOnEachFeature(setSelectedRegion, setPopupPosition, selectedRegion),
        [setSelectedRegion, setPopupPosition, selectedRegion]
    );

    return (
        <section className="bg-gradient-to-br from-navy-blue/15 to-mode-blue/10 p-4 md:p-8 relative">
            <div className="absolute inset-0 bg-pattern opacity-5 z-0"></div>
            <div className="relative z-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-navy-blue mb-2">Partners by Region</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-navy-blue to-mode-blue rounded-full"></div>
                </div>
                <div className="flex flex-col md:flex-row gap-6" style={{ height: '600px' }}>
                    {/* Map Panel */}
                    <div
                        className="flex-1 bg-white rounded-lg shadow-md overflow-hidden"
                        style={{
                            height: '600px',
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {mounted && (
                            <MapContainer
                                center={[4.9, -0.8]}
                                zoom={7}
                                style={{ height: '100%', width: '100%' }}
                                maxBounds={ghanaBounds}
                                minZoom={6}
                                maxZoom={7}
                                boundsOptions={{ padding: [5, 5] }}
                                zoomControl={false}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                                dragging={true}
                                touchZoom={false}
                                boxZoom={false}
                                keyboard={false}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    className="map-tiles"
                                />
                                <GeoJSON
                                    key={selectedRegion || 'none'}
                                    data={geoData as FeatureCollection}
                                    onEachFeature={onEachFeature}
                                    style={{ weight: 2, opacity: 1, color: 'white', fillOpacity: 0.7 }}
                                />
                                {Object.entries(regionLabels).map(([region, position]) => {
                                    const total = getRegionPartnerCount(region);
                                    return (
                                        <Marker
                                            key={region}
                                            position={position}
                                            icon={divIcon({
                                                className: 'region-label',
                                                html: `<div class="label-container">
                                                        <span class="region-total">${total}</span>
                                                       </div>`,
                                                iconSize: [40, 20],
                                                iconAnchor: [20, 10]
                                            })}
                                        />
                                    );
                                })}
                                {popupPosition && selectedRegion && (
                                    <Marker position={popupPosition} icon={divIcon({ className: 'region-label', html: '', iconSize: [1, 1] })}>
                                        <Popup
                                            position={popupPosition}
                                            eventHandlers={{
                                                remove: () => setSelectedRegion(null),
                                            }}
                                        >
                                            <div>
                                                <h3 className="font-bold text-lg mb-2">{selectedRegion}</h3>
                                                {regionPartners.length > 0 ? (
                                                    <ul className="text-black max-h-48 overflow-y-auto">
                                                        {regionPartners.map((p, i) => (
                                                            <li key={i} className="mb-2 border-b pb-1">
                                                                <div className="font-semibold">{p["Name of NGO/PARTNER"]}</div>
                                                                {p["Activity Area"] && <div>Area: {p["Activity Area"]}</div>}
                                                                {p["District of Operation"] && <div>District: {p["District of Operation"]}</div>}
                                                                {p["No. of Years in District"] && <div>Years: {p["No. of Years in District"]}</div>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="text-black">No partners found for this region.</div>
                                                )}
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        )}
                    </div>
                    {/* Data Panel */}
                    <div
                        className="bg-white text-black rounded-lg shadow-lg p-0 overflow-hidden"
                        style={{ flex: '0 0 60%', maxWidth: '60%', minWidth: 0 }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Panel Header */}
                            <div className="bg-gradient-to-r from-navy-blue to-mode-blue text-white p-4">
                                {selectedRegion ? (
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-xl flex items-center">
                                            <span className="inline-block mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            {selectedRegion}
                                        </h3>
                                        <button
                                            className="flex items-center text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full transition-all duration-200"
                                            onClick={() => setSelectedRegion(null)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            All Regions
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-xl flex items-center">
                                            <span className="inline-block mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                        </span>
                                        Partners Overview
                                    </h3>
                                    <div className="text-sm bg-white bg-opacity-20 px-3 py-1.5 rounded-full">
                                        {partnerData.length} Total Partners
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Panel Content */}
                        <div className="p-4 flex-1 overflow-y-auto">
                            {selectedRegion ? (
                                <div>
                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <div className="bg-light-blue p-2 rounded-full mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy-blue" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                </svg>
                                            </div>
                                            <span className="text-lg">
                                                <span className="font-semibold text-navy-blue">{regionPartners.length}</span>
                                                <span className="text-dark-gray ml-1">Partners in this region</span>
                                            </span>
                                        </div>
                                    </div>

                                    {regionPartners.length > 0 ? (
                                        <div className="grid gap-4 max-h-[55vh] overflow-y-auto pr-2">
                                            {regionPartners.map((p, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-white border border-ligher-gray rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <div className="font-bold text-navy-blue mb-2">{p["Name of NGO/PARTNER"]}</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-dark-gray">
                                                        {p["Activity Area"] && (
                                                            <div className="flex items-start">
                                                                <span className="inline-block text-mode-blue mr-2 mt-0.5">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                                                    </svg>
                                                                </span>
                                                                <span><span className="font-medium">Area:</span> {p["Activity Area"]}</span>
                                                            </div>
                                                        )}
                                                        {p["District of Operation"] && (
                                                            <div className="flex items-start">
                                                                <span className="inline-block text-mode-blue mr-2 mt-0.5">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                </span>
                                                                <span><span className="font-medium">District:</span> {p["District of Operation"]}</span>
                                                            </div>
                                                        )}
                                                        {p["No. of Years in District"] && (
                                                            <div className="flex items-start">
                                                                <span className="inline-block text-mode-blue mr-2 mt-0.5">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </span>
                                                                <span><span className="font-medium">Years:</span> {p["No. of Years in District"]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-dark-gray">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-ligher-gray mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold">No partners found</p>
                                                <p className="text-sm mt-1">There are currently no registered partners in this region.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {Object.keys(regionLabels).map(region => {
                                                    const count = getRegionPartnerCount(region);
                                                    return (
                                                        <div
                                                            key={region}
                                                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${count > 0 ? 'bg-gradient-to-br from-light-blue/30 to-light-blue/50 hover:shadow-md' : 'bg-ligher-gray hover:bg-ligher-gray/80'
                                                                }`}
                                                            onClick={() => {
                                                                setSelectedRegion(region);
                                                                setPopupPosition(regionLabels[region]);
                                                            }}
                                                        >
                                                            <div className="flex flex-col h-full">
                                                                <div className="text-sm font-medium text-dark-gray mb-1">Region</div>
                                                                <div className="font-semibold text-navy-blue mb-2 line-clamp-1">{region}</div>
                                                                <div className="mt-auto pt-2 flex items-center justify-between">
                                                                    <div className={`text-sm flex items-center ${count > 0 ? 'text-mode-blue' : 'text-dark-gray/50'}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                        </svg>
                                                                        Partners
                                                                    </div>
                                                                    <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold ${count > 0 ? 'bg-navy-blue text-white' : 'bg-ligher-gray text-dark-gray/60'
                                                                        }`}>
                                                                        {count}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .map-tiles {
                    filter: grayscale(100%) brightness(0.8);
                }
                .leaflet-container {
                    background: #f0f0f0;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 8px;
                    padding: 0;
                }
                .leaflet-popup-content {
                    margin: 0;
                    line-height: 1.4;
                }
                .custom-popup {
                    min-width: 120px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .popup-header {
                    background: #3388ff;
                    color: white;
                    padding: 3px 5px;
                    font-size: 12px;
                    font-weight: 600;
                    border-radius: 4px 4px 0 0;
                }
                .popup-content {
                    padding: 3px 5px;
                    background: white;
                    border-radius: 0 0 4px 4px;
                }
                .stat-row {
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                }
                .stat-value {
                    font-size: 16px;
                    font-weight: 700;
                    codiv: #3388ff;
                }
                .stat-label {
                    font-size: 11px;
                    color: #666;
                    text-transform: uppercase;
                }
                .region-label {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                }
                .label-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;
                }
                .region-total {
                    font-size: 10px;
                    font-weight: 600;
                    color: #fff;
                    background: #3388ff;
                    padding: 1px 6px;
                    border-radius: 10px;
                    box-shadow: none;
                    margin-right: 2px;
                    min-width: 18px;
                    text-align: center;
                }
                .region-name {
                    font-size: 10px;
                    font-weight: 400;
                    color: #333;
                    background: transparent;
                    padding: 0 2px;
                    border-radius: 6px;
                    margin-left: 0;
                    box-shadow: none;
                    white-space: nowrap;
                    max-width: 70px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .leaflet-interactive[style*="stroke: rgb(255, 152, 0)"] {
                    filter: drop-shadow(0 0 6px #ff9800);
                }
                /* Remove outline/box on region click/focus */
                .leaflet-interactive:focus {
                    outline: none !important;
                }
                
                /* Scrollbar styling */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #ccd4e0;
                    border-radius: 10px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #98a7ba;
                }
                
                /* For Firefox */
                .overflow-y-auto {
                    scrollbar-width: thin;
                    scrollbar-color: #ccd4e0 #f1f1f1;
                }
                
                /* Animation for the cards */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .grid > div {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .grid > div:nth-child(2) {
                    animation-delay: 0.05s;
                }
                
                .grid > div:nth-child(3) {
                    animation-delay: 0.1s;
                }
                
                .grid > div:nth-child(4) {
                    animation-delay: 0.15s;
                }
                
                .grid > div:nth-child(5) {
                    animation-delay: 0.2s;
                }
                
                .grid > div:nth-child(n+6) {
                    animation-delay: 0.25s;
                }
                
                .bg-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23223b67' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
            `}</style>
            </div>
        </section>
    );
}
