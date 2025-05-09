"use client";

import React, { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapContainer, TileLayer, GeoJSON, Marker } from 'react-leaflet';
import { Feature, Geometry, FeatureCollection } from 'geojson';
import { PathOptions, LatLngBounds, Layer, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionLabels {
  [region: string]: [number, number];
}

interface GeneralMapProps {
  geoData: FeatureCollection;
  regionLabels: RegionLabels;
  title?: string;
  regionNameField?: string;
  mapHeight?: string;
  onRegionSelect?: (region: string | null) => void;
  customStyles?: React.CSSProperties;
  emptyRegionColor?: string;
  filledRegionColor?: string;
  selectedRegionColor?: string;
}

export default function GenericMap({
  geoData,
  regionLabels,
  title = "Map View",
  regionNameField = "name",
  mapHeight = "600px",
  onRegionSelect,
  customStyles = {},
  emptyRegionColor = '#b2ebf2',
  filledRegionColor = '#3388ff',
  selectedRegionColor = '#ff9800'
}: GeneralMapProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(
    searchParams.get('region')
  );
  const selectedRegionRef = React.useRef(selectedRegion);


  // Function to handle region selection and URL update
  const handleRegionChange = useCallback((newRegion: string | null) => {
    setSelectedRegion(newRegion);
    selectedRegionRef.current = newRegion;

    const currentQueryString = searchParams.toString();
    const newParams = new URLSearchParams(currentQueryString);

    if (newRegion) {
      newParams.set('region', newRegion);
    } else {
      if (newParams.has('region')) {
        newParams.delete('region');
      }
    }

    const newQueryString = newParams.toString();

    if (newQueryString !== currentQueryString) {
      router.replace(`?${newQueryString}`, { scroll: false });
    }

    // Call external handler if provided
    if (onRegionSelect) {
      onRegionSelect(newRegion);
    }
  }, [searchParams, router, onRegionSelect]);

  const createOnEachFeature = useCallback(
    (
      currentSelectedRegion: string | null
    ) => (
      feature: Feature<Geometry, any>,
      layer: Layer
    ) => {
      if (!feature.properties?.[regionNameField]) return;
      const region = feature.properties[regionNameField];
      const isSelected = currentSelectedRegion && region.toLowerCase() === currentSelectedRegion.toLowerCase();
      const style: PathOptions = {
        fillColor: isSelected ? selectedRegionColor : emptyRegionColor,
        weight: isSelected ? 4 : 2,
        opacity: 1,
        color: isSelected ? selectedRegionColor : 'white',
        fillOpacity: 0.7,
      };
      (layer as any).setStyle(style);
      layer.on({
        click: (e: any) => {
          handleRegionChange(region);
        },
        mouseover: () => layer.openTooltip(),
      });
      layer.bindTooltip(region, { sticky: true });
    },
    [regionNameField, emptyRegionColor, filledRegionColor, selectedRegionColor, handleRegionChange]
  );

  const ghanaBounds = new LatLngBounds([4.7, -3.5], [11.2, 1.2]);

  const onEachFeature = useCallback(
    createOnEachFeature(selectedRegion),
    [selectedRegion, createOnEachFeature]
  );

  return (
    <section 
      // className="bg-gradient-to-br from-navy-blue/15 to-mode-blue/10 p-4 md:p-8 relative"
      style={customStyles}
    >
      {/* <div className="absolute inset-0 bg-pattern opacity-5 z-0"></div> */}
      <div className="relative z-10">
        <div style={{ height: mapHeight }}>
          {/* Map Panel */}
          <div
            className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden"
            style={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <MapContainer
              center={[4.9, -0.8]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              bounds={ghanaBounds}
              maxBounds={ghanaBounds}
              attributionControl={false}
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
                data={geoData}
                onEachFeature={onEachFeature}
                style={{ weight: 2, opacity: 1, color: 'white', fillOpacity: 0.7 }}
              />
              {Object.entries(regionLabels).map(([region, position]) => {
                return (
                  <Marker
                    key={region}
                    position={position}
                    icon={divIcon({
                      className: 'region-label',
                      html: `<div class="label-container">
                              <span class="region-name-map-marker text-sm">${region}</span>
                             </div>`,
                      iconSize: [30, 15],
                      iconAnchor: [15, 7]
                    })}
                    eventHandlers={{
                      click: () => {
                        handleRegionChange(region);
                      },
                    }}
                  />
                );
              })}
            </MapContainer>
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
        .region-name-map-marker {
            font-size: 9px;
            font-weight: 600;
            color: #333;
            background: rgba(255, 255, 255, 0.7);
            padding: 2px 4px;
            border-radius: 3px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .leaflet-interactive[style*="stroke: rgb(255, 152, 0)"] {
            filter: drop-shadow(0 0 6px #ff9800);
        }
        .leaflet-interactive:focus {
            outline: none !important;
        }
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
        .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: #ccd4e0 #f1f1f1;
        }
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
    </section>
  );
}
