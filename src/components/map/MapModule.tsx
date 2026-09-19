// src/components/map/MapModule.tsx
'use client';

import React, { useState } from 'react';
import { Layers, Compass, Plus, Minus, Image as ImageIcon, Grid, MapPin } from 'lucide-react';

interface MapModuleProps {
  selectedLoteId: string;
  onSelectLote: (id: string) => void;
}

const LOTE_DETAILS: Record<string, { name: string; hectareas: number; score: number }> = {
  'ARG-SJ-2026': { name: 'Lote Don Juan', hectareas: 145, score: 92 },
  'ARG-SJ-2027': { name: 'Parcela 12', hectareas: 88, score: 74 },
};

export const MapModule: React.FC<MapModuleProps> = ({ selectedLoteId, onSelectLote }) => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'estres'>('ndvi');
  const [mapView, setMapView] = useState<'vectorial' | 'satelital'>('vectorial');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activeLote = LOTE_DETAILS[selectedLoteId] || LOTE_DETAILS['ARG-SJ-2026'];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));

  return (
    <div className="col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden relative flex flex-col h-full min-h-80 sm:min-h-112.5">
      
      {/* BARRA SUPERIOR DE CONTROLES REORGANIZADA (LAYOUT COMPACTO) */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
        
        {/* LOTE ACTIVO + CAPA RAPIDA */}
        <div className="flex items-center gap-1.5 pointer-events-auto min-w-0">
          <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-300 truncate">
              <strong className="text-white font-semibold">{activeLote.name}</strong>{' '}
              <span className="text-emerald-400 font-mono hidden min-[360px]:inline">({activeLote.hectareas} Ha)</span>
            </span>
          </div>

          {/* Toggle Rápido NDVI / Estrés */}
          <button
            onClick={() => setActiveLayer(activeLayer === 'ndvi' ? 'estres' : 'ndvi')}
            className={`backdrop-blur-md border text-[10px] sm:text-xs px-2 py-1 sm:py-1.5 rounded-xl font-medium flex items-center gap-1 shadow-lg transition cursor-pointer shrink-0 ${
              activeLayer === 'ndvi'
                ? 'bg-slate-950/90 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-950/90 border-amber-500/50 text-amber-400'
            }`}
          >
            <Layers className="w-3 h-3 shrink-0" />
            <span>{activeLayer === 'ndvi' ? 'NDVI' : 'Estrés'}</span>
          </button>
        </div>

        {/* SELECTOR VISTA VEC/SAT */}
        <div className="flex items-center gap-1 pointer-events-auto shrink-0">
          <div className="flex bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-0.5 shadow-lg text-[10px] sm:text-xs">
            <button
              onClick={() => setMapView('vectorial')}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition cursor-pointer ${
                mapView === 'vectorial'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3 h-3" /> <span className="hidden min-[400px]:inline">Vectorial</span>
            </button>
            <button
              onClick={() => setMapView('satelital')}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition cursor-pointer ${
                mapView === 'satelital'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3 h-3" /> <span className="hidden min-[400px]:inline">Satelital</span>
            </button>
          </div>
        </div>

      </div>

      {/* CONTROLES FLOTANTES LATERALES (ZOOM EN VERTICAL A LA DERECHA) */}
      <div className="absolute right-2 top-14 z-20 flex flex-col bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-300 shrink-0">
        <button
          onClick={handleZoomIn}
          title="Zoom +"
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition border-b border-slate-800 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom -"
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CONTENEDOR DEL MAPA GIS */}
      <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden min-h-65">
        
        {/* Fondo Capa Vectorial */}
        {mapView === 'vectorial' && (
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[16px_16px] opacity-40"></div>
        )}

        {/* Fondo Capa Satelital */}
        {mapView === 'satelital' && (
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-emerald-950/30 to-slate-950 opacity-90 transition-opacity duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] bg-size-[32px_32px] opacity-20"></div>
          </div>
        )}

        {/* Lienzo interactivo con escala de zoom */}
        <div
          className="w-full h-full relative flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Polígono Lote 1 */}
          <button
            onClick={() => onSelectLote('ARG-SJ-2026')}
            className={`absolute top-1/3 left-1/4 w-28 sm:w-48 h-20 sm:h-36 border-2 rounded-2xl flex items-center justify-center backdrop-blur-xs cursor-pointer transition shadow-lg ${
              selectedLoteId === 'ARG-SJ-2026'
                ? 'bg-emerald-500/30 border-emerald-400 shadow-emerald-500/20 scale-105 z-10'
                : 'bg-emerald-500/20 border-emerald-500/60 hover:bg-emerald-500/30 shadow-emerald-950/50'
            }`}
          >
            <span className="text-[9px] sm:text-[11px] font-bold text-emerald-300 bg-slate-950/90 border border-emerald-500/40 px-1.5 py-0.5 rounded-lg text-center truncate max-w-[90%]">
              Lote Don Juan (92 pts)
            </span>
          </button>

          {/* Polígono Lote 2 */}
          <button
            onClick={() => onSelectLote('ARG-SJ-2027')}
            className={`absolute bottom-1/4 right-1/4 w-24 sm:w-36 h-16 sm:h-28 border-2 rounded-xl flex items-center justify-center backdrop-blur-xs cursor-pointer transition shadow-lg ${
              selectedLoteId === 'ARG-SJ-2027'
                ? 'bg-amber-500/30 border-amber-400 shadow-amber-500/20 scale-105 z-10'
                : 'bg-amber-500/20 border-amber-500/60 hover:bg-amber-500/30 shadow-amber-950/50'
            }`}
          >
            <span className="text-[9px] sm:text-[11px] font-bold text-amber-300 bg-slate-950/90 border border-amber-500/40 px-1.5 py-0.5 rounded-lg text-center truncate max-w-[90%]">
              Parcela 12 (74 pts)
            </span>
          </button>
        </div>

        {/* Leyenda del Índice NDVI (Abajo Izquierda) */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow-lg space-y-0.5">
          <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Vigor (NDVI)</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-12 sm:w-24 rounded-full bg-linear-to-r from-red-500 via-amber-400 to-emerald-500"></div>
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">0.2 - 0.9</span>
          </div>
        </div>

        {/* METADATOS DEL SATÉLITE (Abajo Derecha) */}
        <div className="hidden min-[520px]:block absolute bottom-2 right-2 z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-2 text-right space-y-0.5 shadow-lg">
          <p className="text-[10px] text-slate-400 font-mono">
            Captura: <span className="text-slate-200">Sentinel-2</span>
          </p>
          <div className="text-slate-500 flex items-center justify-end gap-1 text-[10px] font-mono">
            <span>{mapView.toUpperCase()}</span>
            <span>•</span>
            <Compass className="w-3 h-3 text-emerald-500 inline ml-0.5" />
            <span className="text-slate-400">GIS Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
};