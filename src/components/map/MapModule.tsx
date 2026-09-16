'use client';

import React from 'react';
import { Layers, Compass } from 'lucide-react';

interface MapModuleProps {
  selectedLoteId: string;
  onSelectLote: (id: string) => void;
}

export const MapModule: React.FC<MapModuleProps> = ({ selectedLoteId, onSelectLote }) => {
  return (
    <div className="col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden relative flex flex-col h-full min-h-[450px]">
      {/* Capas y Filtros Top */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button className="bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-2 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-emerald-400" /> Capa: NDVI (Biomasa)
        </button>
        <button className="bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 rounded-xl font-medium shadow-lg transition">
          Estrés Hídrico
        </button>
      </div>

      {/* Contenedor del Mapa GIS (Simulado para maquetación) */}
      <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
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

        <div className="absolute bottom-4 right-4 text-slate-600 flex items-center gap-1 text-xs">
          <Compass className="w-4 h-4" /> GIS Leaflet / Mapbox Engine
        </div>
      </div>
    </div>
  );
};