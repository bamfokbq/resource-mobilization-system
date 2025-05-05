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
    console.log(regionPartners);


    return (
        <section className="bg-navy-blue min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-4">Partners by Region</h2>
            <div style={{ height: '70vh', width: '100%', borderRadius: 8, overflow: 'hidden' }}>
                {mounted && (
                    <MapContainer
                        center={[7.9, -1.0]}
                        zoom={7}
                        style={{ height: '100%', width: '100%' }}
                        maxBounds={ghanaBounds}
                        minZoom={6}
                        maxZoom={8}
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
                            key={selectedRegion || 'none'} // <-- force remount on selection
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
                    color: #3388ff;
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
            `}</style>
        </section >
    );
}
