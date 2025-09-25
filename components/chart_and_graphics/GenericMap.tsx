"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import { Feature, Geometry, FeatureCollection } from 'geojson';
import { PathOptions, LatLngBounds, Layer, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Users, Activity, Target, X } from 'lucide-react';

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
  showRegionLabels?: boolean;
  showTooltips?: boolean;
  enableInteractions?: boolean;
}

// Map bounds component to handle initial view
function MapBounds({ bounds }: { bounds: LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, bounds]);
  return null;
}

// Medium green for all regions
const defaultRegionColor = '#4ade80'; // Medium green

export default function GenericMap({
  geoData,
  regionLabels,
  title = "Map View",
  regionNameField = "name",
  mapHeight = "500px",
  onRegionSelect,
  customStyles = {},
  emptyRegionColor = '#e0f2fe',
  filledRegionColor = '#81c784',
  selectedRegionColor = '#388e3c',
  showRegionLabels = true,
  showTooltips = true,
  enableInteractions = true
}: GeneralMapProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(
    searchParams.get('region')
  );
  const selectedRegionRef = React.useRef(selectedRegion);

  useEffect(() => {
    setMounted(true);
  }, []);


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
      currentSelectedRegion: string | null,
      currentHoveredRegion: string | null
    ) => (
      feature: Feature<Geometry, any>,
      layer: Layer
    ) => {
      if (!feature.properties?.[regionNameField]) return;
      const region = feature.properties[regionNameField];
      const isSelected = currentSelectedRegion && region.toLowerCase() === currentSelectedRegion.toLowerCase();
      const isHovered = currentHoveredRegion && region.toLowerCase() === currentHoveredRegion.toLowerCase();
      
      // Use medium green for all regions
      let fillColor = defaultRegionColor;
      
      if (isSelected) {
        fillColor = selectedRegionColor;
      } else if (isHovered) {
        fillColor = filledRegionColor;
      }

      const style: PathOptions = {
        fillColor,
        weight: isSelected ? 3 : isHovered ? 2.5 : 2,
        opacity: 1,
        color: isSelected ? selectedRegionColor : isHovered ? filledRegionColor : '#ffffff',
        fillOpacity: isSelected ? 0.7 : isHovered ? 0.5 : 0.3,
        dashArray: isSelected ? '5, 5' : undefined,
      };
      (layer as any).setStyle(style);
      
      if (enableInteractions) {
        layer.on({
          click: (e: any) => {
            handleRegionChange(region);
          },
          mouseover: (e: any) => {
            setHoveredRegion(region);
            if (showTooltips) {
              layer.openTooltip();
            }
          },
          mouseout: () => {
            setHoveredRegion(null);
            layer.closeTooltip();
          },
        });
      }
      
      if (showTooltips) {
        layer.bindTooltip(`
          <div class="custom-tooltip">
            <div class="tooltip-header">${region}</div>
            <div class="tooltip-content">
              <div class="tooltip-stats">
                <span class="stat-item">
                  <i class="icon">📍</i>
                  Region
                </span>
              </div>
            </div>
          </div>
        `, { 
          sticky: true,
          className: 'custom-tooltip-wrapper',
          direction: 'top',
          offset: [0, -10]
        });
      }
    },
    [regionNameField, emptyRegionColor, filledRegionColor, selectedRegionColor, handleRegionChange, enableInteractions, showTooltips]
  );

  const ghanaBounds = new LatLngBounds([4.7, -3.5], [11.2, 1.2]);

  const onEachFeature = useCallback(
    createOnEachFeature(selectedRegion, hoveredRegion),
    [selectedRegion, hoveredRegion, createOnEachFeature]
  );

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center" style={{ height: mapHeight }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghs-green mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">Loading Interactive Map...</p>
          <p className="text-sm text-slate-500 mt-1">Preparing regional data visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ height: mapHeight }}>
      {/* Map Container */}
      <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
        <MapContainer
          center={[4.9, -0.8]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          bounds={ghanaBounds}
          maxBounds={ghanaBounds}
          attributionControl={false}
          minZoom={6}
          maxZoom={10}
          boundsOptions={{ padding: [20, 20] }}
          zoomControl={enableInteractions}
          scrollWheelZoom={enableInteractions}
          doubleClickZoom={enableInteractions}
          dragging={enableInteractions}
          touchZoom={enableInteractions}
          boxZoom={false}
          keyboard={false}
          className="map-container"
        >
          <MapBounds bounds={ghanaBounds} />
          
          {/* Enhanced Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
            maxZoom={18}
          />
          
          {/* GeoJSON Regions */}
          <GeoJSON
            key={`${selectedRegion || 'none'}-${hoveredRegion || 'none'}`}
            data={geoData}
            onEachFeature={onEachFeature}
            style={{
              weight: 2, 
              opacity: 1, 
              color: '#ffffff', 
              fillOpacity: 0.6,
              fillColor: defaultRegionColor
            }}
          />
          
          {/* Region Labels */}
          {showRegionLabels && Object.entries(regionLabels).map(([region, position]) => {
            const isSelected = selectedRegion && region.toLowerCase() === selectedRegion.toLowerCase();
            const isHovered = hoveredRegion && region.toLowerCase() === hoveredRegion.toLowerCase();
            
            return (
              <Marker
                key={region}
                position={position}
                icon={divIcon({
                  className: 'region-label',
                  html: `
                    <div class="label-container ${isSelected ? 'selected' : isHovered ? 'hovered' : ''}">
                      <span class="region-name">${region}</span>
                    </div>
                  `,
                  iconSize: [60, 20],
                  iconAnchor: [30, 10]
                })}
                eventHandlers={enableInteractions ? {
                  click: () => {
                    handleRegionChange(region);
                  },
                  mouseover: () => {
                    setHoveredRegion(region);
                  },
                  mouseout: () => {
                    setHoveredRegion(null);
                  },
                } : {}}
              />
            );
          })}
        </MapContainer>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-slate-200">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: defaultRegionColor }}></div>
            <span className="text-slate-600">Regions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: filledRegionColor }}></div>
            <span className="text-slate-600">Hovered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-dashed" style={{ backgroundColor: selectedRegionColor }}></div>
            <span className="text-slate-600">Selected</span>
          </div>
        </div>
      </div>
      
      {/* Map Controls */}
      {selectedRegion && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-ghs-green" />
            <span className="font-medium text-slate-800">{selectedRegion}</span>
            <button
              onClick={() => handleRegionChange(null)}
              className="ml-2 p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="h-3 w-3 text-slate-500" />
            </button>
          </div>
        </div>
      )}
      <style>{`
        .map-container {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .map-tiles {
          filter: grayscale(20%) brightness(1.1) contrast(1.1);
          transition: filter 0.3s ease;
        }
        
        .leaflet-container {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: inherit;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: none !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
          color: #1f2937 !important;
        }
        
        .leaflet-interactive {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .leaflet-interactive:hover {
          filter: brightness(1.1);
        }
        
        .leaflet-interactive:focus {
          outline: none !important;
        }
        
        .region-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .label-container {
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .region-name {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .label-container.hovered .region-name {
          background: rgba(255, 255, 255, 1);
          color: #22c55e;
          transform: scale(1.05);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        
        .label-container.selected .region-name {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          font-weight: 700;
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(34, 197, 94, 0.3);
        }
        
        .custom-tooltip-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .custom-tooltip {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-width: 120px;
        }
        
        .tooltip-header {
          background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
          color: white;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }
        
        .tooltip-content {
          padding: 8px 12px;
        }
        
        .tooltip-stats {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #6b7280;
        }
        
        .stat-item .icon {
          font-size: 12px;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
        }
        
        .leaflet-popup-tip {
          background: white !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Animation for smooth interactions */
        @keyframes regionPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .leaflet-interactive[style*="stroke: rgb(56, 142, 60)"] {
          animation: regionPulse 2s infinite;
          filter: drop-shadow(0 0 8px rgba(56, 142, 60, 0.4));
        }
        
        /* Loading animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .map-container {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .region-name {
            font-size: 10px;
            padding: 3px 6px;
          }
          
          .tooltip-header {
            font-size: 12px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </div>
  );
}
