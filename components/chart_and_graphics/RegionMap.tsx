"use client";

import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { Feature, Geometry } from 'geojson';
import { PathOptions, LatLngBounds, Layer, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import the GeoJSON data directly
const defaultGeoData = {
  "type": "FeatureCollection",
  "features": [
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.434997558899005, 6.355712816738901],[-2.437927246084382, 6.359130921007754],[-2.4412231450353774, 6.363708521950744],[-2.443725585958438, 6.365478485588571],[-2.4462890629268386, 6.3685302195493],[-2.448913573965646, 6.371704076944532],[-2.4514770510348276, 6.3737182874516165],[-2.454101562958868, 6.375488251088094],[-2.456909180062867, 6.376525924753497],[-2.4602050779312266, 6.378723095092528]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHAF",
        "name": "Ahafo"
      },
      "id": 1
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692],[-2.373107970702432, 6.37670903479953],[-2.383117736196117, 6.3873291170389495],[-2.3911132911779065, 6.394897465315719]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHAH",
        "name": "Ashanti"
      },
      "id": 2
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHBO",
        "name": "Bono"
      },
      "id": 3
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHBE",
        "name": "Bono East"
      },
      "id": 4
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHCP",
        "name": "Central"
      },
      "id": 5
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHEP",
        "name": "Eastern"
      },
      "id": 6
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHAA",
        "name": "Greater Accra"
      },
      "id": 7
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHNP",
        "name": "Northern"
      },
      "id": 8
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHNE",
        "name": "North East"
      },
      "id": 9
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHOT",
        "name": "Oti"
      },
      "id": 10
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHSV",
        "name": "Savannah"
      },
      "id": 11
    },
    {
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHUE",
        "name": "Upper East"
      },
      "id": 12
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHUW",
        "name": "Upper West"
      },
      "id": 13
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHTV",
        "name": "Volta"
      },
      "id": 14
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHWP",
        "name": "Western"
      },
      "id": 15
    },
    {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-2.4304199219879936, 6.354309073192517],[-2.357727027248403, 6.361328091349648],[-2.365112265496174, 6.370117223353692]]]
      },
      "type": "Feature",
      "properties": {
        "source": "https://simplemaps.com",
        "id": "GHWN",
        "name": "Western North"
      },
      "id": 16
    }
  ]
};

export interface RegionData {
  name: string;
  count: number;
  items: any[];
}

export interface RegionLabelMap {
  [region: string]: [number, number]; // [lat, lng]
}

interface RegionMapProps {
  geoData?: any; // FeatureCollection - now optional with default value
  regionsData: RegionData[];
  regionLabels: RegionLabelMap;
  selectedRegion: string | null;
  setSelectedRegion: (region: string | null) => void;
  popupPosition: [number, number] | null;
  setPopupPosition: (pos: [number, number] | null) => void;
  renderRegionPopupContent?: (region: string, items: any[]) => React.ReactNode;
  renderRegionCardContent?: (region: string, count: number, onClick: () => void) => React.ReactNode;
  mapBounds?: LatLngBounds;
  mapCenter?: [number, number];
  mapZoom?: number;
  selectedFillColor?: string;
  activeFillColor?: string;
  inactiveFillColor?: string;
}

export default function RegionMap({
  geoData = defaultGeoData, // Use the default GeoJSON data if none is provided
  regionsData,
  regionLabels,
  selectedRegion,
  setSelectedRegion,
  popupPosition,
  setPopupPosition,
  renderRegionPopupContent,
  renderRegionCardContent,
  mapBounds = new LatLngBounds([4.7, -3.5], [11.2, 1.2]), // Default to Ghana bounds
  mapCenter = [4.9, -0.8],
  mapZoom = 7,
  selectedFillColor = '#ff9800',
  activeFillColor = '#3388ff',
  inactiveFillColor = '#b2ebf2'
}: RegionMapProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getRegionData = (regionName: string): RegionData | undefined => {
    return regionsData.find(r => r.name.toLowerCase() === regionName.toLowerCase());
  };

  const getRegionCount = (regionName: string): number => {
    const regionData = getRegionData(regionName);
    return regionData ? regionData.count : 0;
  };

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
      const count = getRegionCount(region);
      const isSelected = selectedRegion && region.toLowerCase() === selectedRegion.toLowerCase();
      const style: PathOptions = {
        fillColor: isSelected ? selectedFillColor : (count > 0 ? activeFillColor : inactiveFillColor),
        weight: isSelected ? 4 : 2,
        opacity: 1,
        color: isSelected ? selectedFillColor : 'white',
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

  const onEachFeature = React.useCallback(
    createOnEachFeature(setSelectedRegion, setPopupPosition, selectedRegion),
    [setSelectedRegion, setPopupPosition, selectedRegion, selectedFillColor, activeFillColor, inactiveFillColor]
  );

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '100%', width: '100%' }}>
      {mounted && (
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          maxBounds={mapBounds}
          minZoom={6}
          maxZoom={9}
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
            const count = getRegionCount(region);
            return (
              <Marker
                key={region}
                position={position}
                icon={divIcon({
                  className: 'region-label',
                  html: `<div class="label-container">
                          <span class="region-total">${count}</span>
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
                {renderRegionPopupContent ? (
                  renderRegionPopupContent(
                    selectedRegion, 
                    getRegionData(selectedRegion)?.items || []
                  )
                ) : (
                  <div>
                    <h3 className="font-bold text-lg mb-2">{selectedRegion}</h3>
                    <div className="text-black">
                      {getRegionCount(selectedRegion)} items in this region
                    </div>
                  </div>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}

      <style jsx global>{`
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
            background: ${activeFillColor};
            padding: 1px 6px;
            border-radius: 10px;
            box-shadow: none;
            margin-right: 2px;
            min-width: 18px;
            text-align: center;
        }
        .leaflet-interactive[style*="stroke: ${selectedFillColor}"] {
            filter: drop-shadow(0 0 6px ${selectedFillColor});
        }
        .leaflet-interactive:focus {
            outline: none !important;
        }
      `}</style>
    </div>
  );
}