"use client";

import { MapContainer, TileLayer, GeoJSON, Marker } from 'react-leaflet';
import { Feature, Geometry, FeatureCollection } from 'geojson';
import { PathOptions, LatLngBounds, Layer, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoData from '@/constant/geo.json';

type RegionName =
    | "Greater Accra"
    | "Ashanti"
    | "Western"
    | "Western North"
    | "Central"
    | "Eastern"
    | "Volta"
    | "Oti"
    | "Northern"
    | "Savannah"
    | "North East"
    | "Upper East"
    | "Upper West"
    | "Bono"
    | "Bono East"
    | "Ahafo";

interface ActivityData {
    total: number;
}

type RegionActivityData = {
    [K in RegionName]: ActivityData;
}

const activities: RegionActivityData = {
    "Greater Accra": { total: 169 },
    "Ashanti": { total: 90 },
    "Western": { total: 89 },
    "Western North": { total: 23 },
    "Central": { total: 37 },
    "Eastern": { total: 35 },
    "Volta": { total: 25 },
    "Oti": { total: 21 },
    "Northern": { total: 35 },
    "Savannah": { total: 33 },
    "North East": { total: 34 },
    "Upper East": { total: 31 },
    "Upper West": { total: 27 },
    "Bono": { total: 27 },
    "Bono East": { total: 27 },
    "Ahafo": { total: 23 }
};

const getColor = (total: number) => {
    if (total > 100) return '#0a2472';
    if (total > 75) return '#1e3799';
    if (total > 50) return '#4a69bd';
    if (total > 25) return '#6a89cc';
    return '#c7ecee';
};

const calculateTotalActivities = () => {
    return Object.values(activities).reduce((sum, { total }) => sum + total, 0);
};

const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
};

const onEachFeature = (feature: Feature<Geometry, { name: string }>, layer: Layer) => {
    if (!feature.properties?.name) {
        console.warn('Feature missing name property:', feature);
        return;
    }

    const region = feature.properties.name as RegionName;
    if (!activities[region]) {
        console.warn(`No activity data found for region: ${region}`);
        return;
    }

    const { total = 0 } = activities[region];
    const totalActivities = calculateTotalActivities();
    const percentage = calculatePercentage(total, totalActivities);
    
    const style: PathOptions = {
        fillColor: getColor(total),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
    };

    try {
        (layer as unknown as { setStyle: (style: PathOptions) => void }).setStyle(style);
        layer.bindPopup(`
            <div class="custom-popup">
                <div class="popup-header">${region}</div>
                <div class="popup-content">
                    <div class="stat-row">
                        <span class="stat-value">${percentage}%</span>
                        <span class="stat-label">of total activities</span>
                    </div>
                </div>
            </div>
        `);

        // Add event listeners to ensure popup works
        layer.on('click', () => {
            layer.openPopup();
        });
        layer.on('mouseover', () => {
            layer.openPopup();
        });
    } catch (error) {
        console.error(`Error setting up layer for region ${region}:`, error);
    }
};

// Add this new constant for region label positions
const regionLabels: { [K in RegionName]: [number, number] } = {
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

export default function ActivitiesByRegionMap() {
    const typedGeoData = geoData as FeatureCollection;
    const ghanaBounds = new LatLngBounds(
        [4.7, -3.5], // Southwest coordinates
        [11.2, 1.2]  // Northeast coordinates
    );
    
    return (
        <div className="relative h-full w-full flex-col flex items-center justify-center z-40">
            <MapContainer 
                center={[8.0, -1.0]}
                zoom={6.5} 
                className="h-full w-full object-cover"
                maxBounds={ghanaBounds}
                minZoom={6.5}
                maxZoom={8}
                boundsOptions={{ padding: [0, 0] }}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                touchZoom={false}
                doubleClickZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    className="map-tiles"
                />
                <GeoJSON
                    data={typedGeoData}
                    onEachFeature={onEachFeature}
                    style={{
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7,
                    }}
                />
                {Object.entries(regionLabels).map(([region, position]) => {
                    const { total } = activities[region as RegionName];
                    return (
                        <Marker
                            key={region}
                            position={position}
                            icon={divIcon({
                                className: 'region-label',
                                html: `
                                    <div class="label-container">
                                        <span class="region-total">${total}</span>
                                    </div>
                                `,
                                iconSize: [40, 20],
                                iconAnchor: [20, 10]
                            })}
                        />
                    );
                })}
            </MapContainer>
            <div className="absolute bottom-4 left-4 bg-white/95 p-2 shadow-lg rounded-md z-[1000] scale-75 origin-bottom-left">
                <h3 className="font-bold mb-1 text-sm text-gray-800">Activities</h3>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#0a2472] inline-block rounded-sm"></span> Over 100</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#1e3799] inline-block rounded-sm"></span> 76-100</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#4a69bd] inline-block rounded-sm"></span> 51-75</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#6a89cc] inline-block rounded-sm"></span> 26-50</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#c7ecee] inline-block rounded-sm"></span> 0-25</div>
                </div>
                <p className="text-[10px] mt-1 text-gray-600 font-medium">*Number of activities</p>
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
                    background: #2c3e50;
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
                    color: #2c3e50;
                }
                .stat-label {
                    font-size: 11px;
                    color: #666;
                    text-transform: uppercase;
                }
                .label {
                    color: #666;
                }
                .value {
                    color: #2c3e50;
                }
                .region-name {
                    font-weight: 600;
                    color: #2c3e50;
                }
                .total-value {
                    color: #666;
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
                }
                .region-total {
                    font-size: 12px;
                    font-weight: 700;
                    color: #2c3e50;
                    background: white;
                    padding: 2px 6px;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}
