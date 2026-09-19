// src/components/map/MapModule.tsx
'use client';

import React, { useState } from 'react';
import { Layers, Compass, Plus, Minus } from 'lucide-react';

interface MapModuleProps {
  selectedLoteId: string;
  onSelectLote: (id: string) => void;
}

export const MapModule: React.FC<MapModuleProps> = ({ selectedLoteId, onSelectLote }) => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'estres'>('ndvi');

  return (
    <div className="col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden relative flex flex-col h-full min-h-112.5">
      {/* Capas y Filtros Top */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setActiveLayer('ndvi')}
          className={`backdrop-blur-md border text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-2 shadow-lg transition cursor-pointer ${
            activeLayer === 'ndvi'
              ? 'bg-slate-950/90 border-emerald-500/50 text-emerald-400'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" /> Capa: NDVI (Biomasa)
        </button>
        <button
          onClick={() => setActiveLayer('estres')}
          className={`backdrop-blur-md border text-xs px-3 py-1.5 rounded-xl font-medium shadow-lg transition cursor-pointer ${
            activeLayer === 'estres'
              ? 'bg-slate-950/90 border-amber-500/50 text-amber-400'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Estrés Hídrico
        </button>
      </div>

      {/* Controles Flotantes de Zoom (Arriba Derecha) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-lg text-slate-300">
        <button className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition border-b border-slate-800/80 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition cursor-pointer">
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Contenedor del Mapa GIS */}
      <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[16px_16px] opacity-40"></div>
        
        {/* Polígono interactivo Lote 1 */}
        <button
          onClick={() => onSelectLote('ARG-SJ-2026')}
          className={`absolute top-1/3 left-1/4 w-48 h-36 border-2 rounded-2xl flex items-center justify-center backdrop-blur-xs cursor-pointer transition shadow-lg ${
            selectedLoteId === 'ARG-SJ-2026'
              ? 'bg-emerald-500/30 border-emerald-400 shadow-emerald-500/20 scale-105 z-10'
              : 'bg-emerald-500/20 border-emerald-500/60 hover:bg-emerald-500/30 shadow-emerald-950/50'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-300 bg-slate-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-lg">
            Lote Don Juan (92 pts)
          </span>
        </button>

        {/* Polígono interactivo Lote 2 */}
        <button
          onClick={() => onSelectLote('ARG-SJ-2027')}
          className={`absolute bottom-1/4 right-1/3 w-36 h-28 border-2 rounded-xl flex items-center justify-center backdrop-blur-xs cursor-pointer transition shadow-lg ${
            selectedLoteId === 'ARG-SJ-2027'
              ? 'bg-amber-500/30 border-amber-400 shadow-amber-500/20 scale-105 z-10'
              : 'bg-amber-500/20 border-amber-500/60 hover:bg-amber-500/30 shadow-amber-950/50'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-300 bg-slate-950/90 border border-amber-500/40 px-2 py-0.5 rounded-lg">
            Parcela 12 (74 pts)
          </span>
        </button>

        {/* Leyenda del Índice NDVI (Abajo Izquierda) */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-lg space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Vigor Vegetativo (NDVI)</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-linear-to-r from-red-500 via-amber-400 to-emerald-500"></div>
            <span className="text-[10px] font-mono text-slate-400">0.2 - 0.9</span>
          </div>
        </div>

        {/* Motor GIS y Metadatos del Satélite (Abajo Derecha) */}
        <div className="absolute bottom-4 right-4 z-10 text-right space-y-0.5">
          <p className="text-[10px] text-slate-500 font-mono">Sentinel-2 L2A • Captura: Hace 48h</p>
          <div className="text-slate-600 flex items-center justify-end gap-1 text-xs">
            <Compass className="w-3.5 h-3.5 text-slate-500" /> GIS Leaflet / Mapbox Engine
          </div>
        </div>
      </div>
    </div>
  );
};