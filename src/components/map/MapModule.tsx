// src/components/map/MapModule.tsx
'use client';

import React, { useState } from 'react';
import { Layers, Compass, Grid, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Importación dinámica obligatoria para Leaflet (evita errores de SSR en Next.js)
const ExpoMapCore = dynamic(
  () => import('@/app/expo/ExpoMapCore').then((mod) => mod.ExpoMapCore),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-950 flex items-center justify-center text-xs font-mono text-emerald-500 animate-pulse">Cargando mapa de finca GIS...</div> }
);

interface MapModuleProps {
  selectedLoteId: string;
  onSelectLote: (id: string) => void;
}

type LayerType = 'ndvi' | 'satelital' | 'termico';

// Coordenadas actualizadas a zonas rurales/agrícolas reales (fincas con verde y cultivo en San Juan)
const FINCA_CUARTELES: Record<string, { name: string; shortName: string; hectareas: number; score: number; lat: number; lng: number }> = {
  'ARG-SJ-2026': { name: 'Cuartel Principal (Don Juan)', shortName: 'C. Principal', hectareas: 145, score: 92, lat: -31.5125, lng: -68.4682 },
  'ARG-SJ-2027': { name: 'Cuartel Sur (Parcela 12)', shortName: 'C. Sur', hectareas: 88, score: 74, lat: -31.5890, lng: -68.5920 },
};

export const MapModule: React.FC<MapModuleProps> = ({ selectedLoteId, onSelectLote }) => {
  const [activeLayer, setActiveLayer] = useState<LayerType>('ndvi');
  const [mapView, setMapView] = useState<'vectorial' | 'satelital'>('satelital');

  const activeCuartel = FINCA_CUARTELES[selectedLoteId] || FINCA_CUARTELES['ARG-SJ-2026'];

  // Funciones limpias para evitar ternarios anidados (SonarQube S3358)
  const handleCycleLayer = () => {
    if (activeLayer === 'ndvi') {
      setActiveLayer('termico');
    } else if (activeLayer === 'termico') {
      setActiveLayer('satelital');
    } else {
      setActiveLayer('ndvi');
    }
  };

  const getLayerTitle = () => {
    if (activeLayer === 'ndvi') return 'Vigor Vegetativo (NDVI)';
    if (activeLayer === 'termico') return 'Estrés Hídrico/Térmico';
    return 'Imagen Satelital Finca';
  };

  const getLayerScaleRange = () => {
    if (activeLayer === 'ndvi') return '0.2 - 0.9';
    if (activeLayer === 'termico') return '18°C - 38°C';
    return 'RGB High-Res';
  };

  const getLayerGradientClass = () => {
    if (activeLayer === 'ndvi') {
      return 'bg-linear-to-r from-red-500 via-amber-400 to-emerald-500';
    }
    if (activeLayer === 'termico') {
      return 'bg-linear-to-r from-blue-500 via-yellow-400 to-red-600';
    }
    return 'bg-linear-to-r from-slate-600 to-slate-300';
  };

  return (
    <div className="col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden relative flex flex-col h-full min-h-130 shadow-2xl">
      
      {/* Estilo local para forzar la desaparición de los botones de zoom de Leaflet */}
      <style jsx global>{`
        .leaflet-control-zoom {
          display: none !important;
        }
      `}</style>

      {/* FILA SUPERIOR 1: CUARTEL ACTIVO */}
      <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto max-w-full">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-300 truncate">
            <strong className="text-white font-semibold">{activeCuartel.name}</strong>{' '}
            <span className="text-emerald-400 font-mono">({activeCuartel.hectareas} Ha)</span>
          </span>
        </div>
      </div>

      {/* FILA SUPERIOR 2: BOTONES DE ACCIÓN RÁPIDA (SEPARADOS PARA QUE NO SE SOLAPEN) */}
      <div className="absolute top-15 left-3 right-3 z-40 flex items-center justify-between gap-1.5 pointer-events-none">
        
        {/* Selector de Cuarteles */}
        <div className="flex items-center gap-1 bg-slate-950/95 backdrop-blur-md border border-slate-800 p-1 rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => onSelectLote('ARG-SJ-2026')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              selectedLoteId === 'ARG-SJ-2026'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Principal
          </button>
          <button
            onClick={() => onSelectLote('ARG-SJ-2027')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              selectedLoteId === 'ARG-SJ-2027'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sur
          </button>
        </div>

        {/* Capas y Vistas */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleCycleLayer}
            className="bg-slate-950/95 backdrop-blur-md border border-emerald-500/45 hover:border-emerald-500 text-xs px-2.5 py-1.5 rounded-xl text-emerald-400 font-medium flex items-center gap-1 shadow-lg transition cursor-pointer"
          >
            <Layers className="w-3 h-3" />
            <span className="capitalize">{activeLayer}</span>
          </button>

          <div className="flex bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg text-xs">
            <button
              onClick={() => {
                setMapView('vectorial');
                setActiveLayer('satelital');
              }}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                mapView === 'vectorial'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setMapView('satelital');
                setActiveLayer('ndvi');
              }}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                mapView === 'satelital'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* CONTENEDOR PRINCIPAL CON LEAFLET REAL (Con margen superior suficiente para que el mapa respire debajo de las dos filas) */}
      <div className="flex-1 w-full relative z-10 pt-28">
        <ExpoMapCore
          lat={activeCuartel.lat}
          lng={activeCuartel.lng}
          activeLayer={activeLayer}
          loteNombre={activeCuartel.name}
        />
      </div>

      {/* BARRA INFERIOR DE LEYENDA Y METADATOS */}
      <div className="absolute bottom-3 left-3 right-3 z-40 flex items-center justify-between pointer-events-none text-xs">
        
        {/* LEYENDA */}
        <div className="pointer-events-auto bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-xl space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {getLayerTitle()}
          </p>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-20 sm:w-28 rounded-full ${getLayerGradientClass()}`}></div>
            <span className="text-[10px] font-mono text-slate-300 font-bold">
              {getLayerScaleRange()}
            </span>
          </div>
        </div>

        {/* METADATOS ESRI */}
        <div className="pointer-events-auto hidden sm:block bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-right shadow-xl">
          <p className="text-xs text-slate-300 font-mono">
            Esri World Imagery • <span className="text-emerald-400 font-bold uppercase">{activeLayer}</span>
          </p>
        </div>

      </div>

    </div>
  );
};