// src/components/map/MapModule.tsx
'use client';

import React, { useState } from 'react';
import { Layers, Compass, Plus, Minus, Image as ImageIcon, Grid, MapPin } from 'lucide-react';
import Image from 'next/image';

interface MapModuleProps {
  selectedLoteId: string;
  onSelectLote: (id: string) => void;
}

const LOTE_DETAILS: Record<string, { name: string; hectareas: number; score: number; lat: string; lng: string }> = {
  'ARG-SJ-2026': { name: 'Lote Don Juan', hectareas: 145, score: 92, lat: '-31.5373', lng: '-68.5364' },
  'ARG-SJ-2027': { name: 'Parcela 12', hectareas: 88, score: 74, lat: '-31.5421', lng: '-68.5298' },
};

export const MapModule: React.FC<MapModuleProps> = ({ selectedLoteId, onSelectLote }) => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'estres'>('ndvi');
  const [mapView, setMapView] = useState<'vectorial' | 'satelital'>('satelital');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activeLote = LOTE_DETAILS[selectedLoteId] || LOTE_DETAILS['ARG-SJ-2026'];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));

  return (
    <div className="col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden relative flex flex-col h-full min-h-80 sm:min-h-112.5 shadow-2xl">
      
      {/* BARRA SUPERIOR DE CONTROLES */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* LOTE ACTIVO + CAPA */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300">
              <strong className="text-white font-semibold">{activeLote.name}</strong>{' '}
              <span className="text-emerald-400 font-mono">({activeLote.hectareas} Ha)</span>
            </span>
          </div>

          <button
            onClick={() => setActiveLayer(activeLayer === 'ndvi' ? 'estres' : 'ndvi')}
            className="bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 hover:border-emerald-500 text-xs px-3 py-1.5 rounded-xl text-emerald-400 font-medium flex items-center gap-1.5 shadow-lg transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{activeLayer === 'ndvi' ? 'NDVI (Biomasa)' : 'Estrés Hídrico'}</span>
          </button>
        </div>

        {/* SELECTOR VISTA VEC / SAT */}
        <div className="flex items-center gap-1 pointer-events-auto">
          <div className="flex bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg text-xs">
            <button
              onClick={() => setMapView('vectorial')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition cursor-pointer ${
                mapView === 'vectorial'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> <span>Vectorial</span>
            </button>
            <button
              onClick={() => setMapView('satelital')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition cursor-pointer ${
                mapView === 'satelital'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> <span>Satelital</span>
            </button>
          </div>
        </div>

      </div>

      {/* CONTROLES DE ZOOM FLOTANTES */}
      <div className="absolute right-3 top-20 z-30 flex flex-col bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-300">
        <button
          onClick={handleZoomIn}
          title="Zoom +"
          className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition border-b border-slate-800 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom -"
          className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* CONTENEDOR DEL MAPA */}
      <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden min-h-75">
        
        {/* FONDO VECTORIAL */}
        <div className={`absolute inset-0 bg-slate-950 transition-opacity duration-300 ${mapView === 'vectorial' ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-size-[24px_24px] opacity-60"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[96px_96px] opacity-30"></div>
        </div>

        {/* FONDO SATELITAL CON NEXT/IMAGE OPTIMIZADO */}
        <div className={`absolute inset-0 bg-slate-950 transition-opacity duration-300 ${mapView === 'satelital' ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none'}`}>
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"
            alt="Mapa Satelital Agrícola"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-70 contrast-125 saturate-75 filter"
          />
          <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/50"></div>
        </div>

        {/* LIENZO DE LOTES INTERACTIVOS */}
        <div
          className="w-full h-full relative z-20 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Lote Don Juan */}
          <button
            onClick={() => onSelectLote('ARG-SJ-2026')}
            className={`absolute top-1/3 left-1/4 w-44 sm:w-60 h-28 sm:h-40 border-2 rounded-2xl flex flex-col items-center justify-center backdrop-blur-xs cursor-pointer transition shadow-2xl ${
              selectedLoteId === 'ARG-SJ-2026'
                ? 'bg-emerald-500/30 border-emerald-400 shadow-emerald-500/40 scale-105 z-30 ring-2 ring-emerald-400/50'
                : 'bg-emerald-500/20 border-emerald-500/70 hover:bg-emerald-500/30 shadow-black/60'
            }`}
          >
            <span className="text-xs font-bold text-emerald-200 bg-slate-950/90 border border-emerald-500/50 px-2.5 py-1 rounded-lg text-center shadow">
              Lote Don Juan (92 pts)
            </span>
          </button>

          {/* Parcela 12 */}
          <button
            onClick={() => onSelectLote('ARG-SJ-2027')}
            className={`absolute bottom-1/4 right-1/4 w-36 sm:w-52 h-24 sm:h-36 border-2 rounded-xl flex flex-col items-center justify-center backdrop-blur-xs cursor-pointer transition shadow-2xl ${
              selectedLoteId === 'ARG-SJ-2027'
                ? 'bg-amber-500/30 border-amber-400 shadow-amber-500/40 scale-105 z-30 ring-2 ring-amber-400/50'
                : 'bg-amber-500/20 border-amber-500/70 hover:bg-amber-500/30 shadow-black/60'
            }`}
          >
            <span className="text-xs font-bold text-amber-200 bg-slate-950/90 border border-amber-500/50 px-2.5 py-1 rounded-lg text-center shadow">
              Parcela 12 (74 pts)
            </span>
          </button>
        </div>

        {/* LEYENDA NDVI */}
        <div className="absolute bottom-3 left-3 z-30 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-xl space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Vigor (NDVI)</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-20 sm:w-28 rounded-full bg-linear-to-r from-red-500 via-amber-400 to-emerald-500"></div>
            <span className="text-[10px] font-mono text-slate-300 font-bold">0.2 - 0.9</span>
          </div>
        </div>

        {/* COORDENADAS */}
        <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-30 items-center gap-2 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 shadow-xl">
          <span className="text-emerald-400 font-bold">LAT:</span> {activeLote.lat}
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-bold">LNG:</span> {activeLote.lng}
        </div>

        {/* METADATOS SATELITALES */}
        <div className="hidden md:block absolute bottom-3 right-3 z-30 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-right space-y-0.5 shadow-xl">
          <p className="text-xs text-slate-300 font-mono">
            Captura: <span className="text-emerald-400 font-bold">Sentinel-2</span>
          </p>
          <div className="text-slate-400 flex items-center justify-end gap-1.5 text-[10px] font-mono">
            <span className="text-emerald-400 font-bold uppercase">{mapView}</span>
            <span>•</span>
            <Compass className="w-3.5 h-3.5 text-emerald-500 inline" />
            <span>GIS Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
};