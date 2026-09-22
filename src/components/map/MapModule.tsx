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
    <div className="col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden relative flex flex-col h-full min-h-120 shadow-2xl">
      
      {/* Estilo local para forzar la desaparición de los botones de zoom de Leaflet */}
      <style jsx global>{`
        .leaflet-control-zoom {
          display: none !important;
        }
      `}</style>

      {/* BARRA SUPERIOR 1: CUARTEL ACTIVO Y CAPA (DISEÑO LIMPIO) */}
      <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Cuartel Activo */}
        <div className="flex items-center gap-1.5 bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto max-w-[65%]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-300 truncate">
            <strong className="text-white font-semibold">{activeCuartel.shortName}</strong>{' '}
            <span className="text-emerald-400 font-mono">({activeCuartel.hectareas} Ha)</span>
          </span>
        </div>

        {/* Botón de Capa */}
        <button
          onClick={handleCycleLayer}
          className="bg-slate-950/95 backdrop-blur-md border border-emerald-500/45 hover:border-emerald-500 text-xs px-3 py-1.5 rounded-xl text-emerald-400 font-medium flex items-center gap-1.5 shadow-lg transition cursor-pointer pointer-events-auto shrink-0"
          title="Cambiar capa de análisis agronómico"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="capitalize">{activeLayer}</span>
        </button>

      </div>

      {/* BARRA SUPERIOR 2: SELECTORES DE CUARTEL Y VISTA (UBICADOS DEBAJO SIN SOLAPARSE) */}
      <div className="absolute top-14 left-3 right-3 z-40 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Selector rápido de Cuarteles */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => onSelectLote('ARG-SJ-2026')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-md transition cursor-pointer ${
              selectedLoteId === 'ARG-SJ-2026'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950/90 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Principal
          </button>
          <button
            onClick={() => onSelectLote('ARG-SJ-2027')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-md transition cursor-pointer ${
              selectedLoteId === 'ARG-SJ-2027'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950/90 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Sur
          </button>
        </div>

        {/* Selector Vectorial / Satelital */}
        <div className="flex bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-lg p-0.5 shadow-lg text-[11px] pointer-events-auto">
          <button
            onClick={() => {
              setMapView('vectorial');
              setActiveLayer('satelital');
            }}
            className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              mapView === 'vectorial'
                ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3 h-3" /> <span>Vec</span>
          </button>
          <button
            onClick={() => {
              setMapView('satelital');
              setActiveLayer('ndvi');
            }}
            className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              mapView === 'satelital'
                ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3 h-3" /> <span>Sat</span>
          </button>
        </div>

      </div>

      {/* CONTENEDOR PRINCIPAL CON LEAFLET REAL (Con margen superior para que el mapa respire) */}
      <div className="flex-1 w-full relative z-10 pt-24 sm:pt-14">
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
        <div className="pointer-events-auto bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-xl space-y-0.5">
          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
            {getLayerTitle()}
          </p>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-20 rounded-full ${getLayerGradientClass()}`}></div>
            <span className="text-[9px] font-mono text-slate-300 font-bold">
              {getLayerScaleRange()}
            </span>
          </div>
        </div>

        {/* METADATOS ESRI (Oculto en móvil muy chico para limpieza) */}
        <div className="pointer-events-auto hidden sm:block bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-2 text-right shadow-xl">
          <p className="text-[10px] text-slate-300 font-mono">
            Esri World Imagery • <span className="text-emerald-400 font-bold uppercase">{activeLayer}</span>
          </p>
        </div>

      </div>

    </div>
  );
};