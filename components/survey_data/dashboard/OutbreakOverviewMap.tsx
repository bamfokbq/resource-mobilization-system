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

interface DiseaseData {
    meningitis: number;
    cholera: number;
}

type RegionDiseaseData = {
    [K in RegionName]: DiseaseData;
}

const diseaseData: RegionDiseaseData = {
    "Greater Accra": { meningitis: 10, cholera: 50 },
    "Ashanti": { meningitis: 20, cholera: 30 },
    "Western": { meningitis: 5, cholera: 10 },
    "Western North": { meningitis: 8, cholera: 15 },
    "Central": { meningitis: 12, cholera: 25 },
    "Eastern": { meningitis: 15, cholera: 20 },
    "Volta": { meningitis: 7, cholera: 18 },
    "Oti": { meningitis: 9, cholera: 12 },
    "Northern": { meningitis: 30, cholera: 5 },
    "Savannah": { meningitis: 25, cholera: 8 },
    "North East": { meningitis: 28, cholera: 6 },
    "Upper East": { meningitis: 22, cholera: 9 },
    "Upper West": { meningitis: 20, cholera: 7 },
    "Bono": { meningitis: 11, cholera: 16 },
    "Bono East": { meningitis: 13, cholera: 14 },
    "Ahafo": { meningitis: 10, cholera: 13 }
};

const getColor = (meningitis: number, cholera: number) => {
    const totalCases = meningitis + cholera;
    if (totalCases > 40) return '#0a2472'; // Dark blue
    if (totalCases > 30) return '#1e3799'; // Medium dark blue
    if (totalCases > 20) return '#4a69bd'; // Medium blue
    if (totalCases > 10) return '#6a89cc'; // Light blue
    return '#c7ecee'; // Very light blue
};

const onEachFeature = (feature: Feature<Geometry, { name: string }>, layer: Layer) => {
    const region = feature.properties.name as RegionName;
    const { meningitis = 0, cholera = 0 } = diseaseData[region] || { meningitis: 0, cholera: 0 };
    const total = meningitis + cholera;
    
    const style: PathOptions = {
        fillColor: getColor(meningitis, cholera),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
    };

    (layer as unknown as { setStyle: (style: PathOptions) => void }).setStyle(style);
    layer.bindPopup(`
        <div class="custom-popup">
            <h3 class="popup-title">${region}</h3>
            <div class="popup-content">
                <div class="disease-stat">
                    <span class="label">Meningitis:</span>
                    <span class="value">${meningitis} cases</span>
                </div>
                <div class="disease-stat">
                    <span class="label">Cholera:</span>
                    <span class="value">${cholera} cases</span>
                </div>
                <div class="total-stat">
                    <span class="label">Total:</span>
                    <span class="value">${total} cases</span>
                </div>
            </div>
        </div>
    `);
};

// Add this new constant for region label positions
const regionLabels: { [K in RegionName]: [number, number] } = {
    "Greater Accra": [5.6, 0.2],
    "Ashanti": [6.7, -1.0],
    "Western": [5.5, -1.8],
    "Western North": [6.2, -2.5],
    "Central": [5.5, -0.5], // adjusted position
    "Eastern": [6.3, -0.1],
    "Volta": [6.5, 1.0], // adjusted position
    "Oti": [7.9, 0.8], // adjusted position
    "Northern": [9.6, 0.3], // adjusted position
    "Savannah": [9.2, -1.5],
    "North East": [10.4, -0.4],
    "Upper East": [10.8, -0.5],
    "Upper West": [10.3, -1.8],
    "Bono": [7.6, -2.0],
    "Bono East": [7.9, -1.0],
    "Ahafo": [6.9, -2.1]
};

export default function OutbreakOverviewMap() {
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
                {Object.entries(regionLabels).map(([region, position]) => (
                    <Marker
                        key={region}
                        position={position}
                        icon={divIcon({
                            className: 'region-label',
                            html: `<span>${region}</span>`,
                            iconSize: [120, 20], // increased width to accommodate longer text
                            iconAnchor: [60, 10] // adjusted anchor point
                        })}
                    />
                ))}
            </MapContainer>
            <div className="absolute bottom-4 left-4 bg-white/95 p-2 shadow-lg rounded-md z-[1000] scale-75 origin-bottom-left">
                <h3 className="font-bold mb-1 text-sm text-gray-800">Disease Cases</h3>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#0a2472] inline-block rounded-sm"></span> Over 40</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#1e3799] inline-block rounded-sm"></span> 31-40</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#4a69bd] inline-block rounded-sm"></span> 21-30</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#6a89cc] inline-block rounded-sm"></span> 11-20</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700"><span className="w-3 h-3 bg-[#c7ecee] inline-block rounded-sm"></span> 0-10</div>
                </div>
                <p className="text-[10px] mt-1 text-gray-600 font-medium">*Total cases</p>
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
                    min-width: 200px;
                }
                .popup-title {
                    background: #2c3e50;
                    color: white;
                    padding: 4px 6px;
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 8px 8px 0 0;
                }
                .popup-content {
                    padding: 6px;
                }
                .disease-stat {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                    font-size: 13px;
                }
                .total-stat {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid #eee;
                    font-weight: 600;
                    font-size: 13px;
                }
                .label {
                    color: #666;
                }
                .value {
                    color: #2c3e50;
                }
                .region-label {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                }
                .region-label span {
                    font-size: 10px;
                    font-weight: 600;
                    color: #2c3e50;
                    text-shadow: 
                        -1px -1px 0 #fff,
                        1px -1px 0 #fff,
                        -1px 1px 0 #fff,
                        1px 1px 0 #fff;
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
}
