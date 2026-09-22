// src/app/expo/ExpoMapCore.tsx
'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

// Fix de íconos por defecto de Leaflet para Next.js
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type LayerType = 'ndvi' | 'satelital' | 'termico';

interface ExpoMapCoreProps {
  lat?: number;
  lng?: number;
  activeLayer: LayerType;
  loteNombre: string;
}

const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { animate: false });
  }, [center, map]);
  return null;
};

export const ExpoMapCore: React.FC<ExpoMapCoreProps> = ({
  lat,
  lng,
  activeLayer,
  loteNombre,
}) => {
  const centerLat = lat ?? -31.6565;
  const centerLng = lng ?? -68.5630;
  const center: [number, number] = [centerLat, centerLng];

  // Coordenadas de la parcela agrícola
  const polygonCoordinates: [number, number][] = [
    [centerLat + 0.0025, centerLng - 0.0035],
    [centerLat + 0.0028, centerLng + 0.0032],
    [centerLat - 0.0024, centerLng + 0.0030],
    [centerLat - 0.0026, centerLng - 0.0037],
  ];

  // Filtros estáticos limpios sin transiciones para evitar flickering/temblor
  const getMapTileFilter = () => {
    switch (activeLayer) {
      case 'satelital':
        return 'brightness(0.95) contrast(1.1)';
      case 'termico':
        return 'brightness(0.75) contrast(1.6) saturate(2) invert(0.15) hue-rotate(150deg)';
      case 'ndvi':
      default:
        return 'brightness(0.85) contrast(1.4) saturate(2.2) hue-rotate(25deg)';
    }
  };

  const getPolygonStyle = () => {
    switch (activeLayer) {
      case 'satelital':
        return { 
          color: '#38bdf8', 
          fillColor: '#0284c7', 
          fillOpacity: 0.15, 
          weight: 2 
        };
      case 'termico':
        return { 
          color: '#f59e0b', 
          fillColor: '#ef4444', 
          fillOpacity: 0.45, 
          weight: 2.5 
        };
      case 'ndvi':
      default:
        return { 
          color: '#10b981', 
          fillColor: '#059669', 
          fillOpacity: 0.45, 
          weight: 2.5 
        };
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden z-0">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        attributionControl={false} // <--- Desactiva el texto de Leaflet / Esri
        className="w-full h-full min-h-72"
        style={{ background: '#020617' }}
      >
        <MapController center={center} />

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          className={getMapTileFilter()}
        />

        <Polygon positions={polygonCoordinates} pathOptions={getPolygonStyle()} />

        <Marker position={center}>
          <Popup>
            <div className="text-xs font-mono font-bold text-slate-900">
              {loteNombre}
              <br />
              <span className="text-[10px] text-slate-600">Lote Verificado • Pocito</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};