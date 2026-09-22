// src/app/expo/ExpoMetricsPanel.tsx
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Layers, Activity, Sun, Droplets, Wind, ShieldCheck, 
  AreaChart, RefreshCw, MapPin, ChevronDown, Check,
  Flame, Leaf, Eye
} from 'lucide-react';

export interface ExpoLoteData {
  loteId: string;
  nombre: string;
  hectareas: number;
  score: number;
  ndvi: number;
  riesgo: 'Bajo' | 'Moderado' | 'Alto';
  rindeEst: string;
  humedad: string;
  tempSuelo: string;
  viento: string;
  hash: string;
  lat?: number;
  lng?: number;
}

type LayerType = 'ndvi' | 'satelital' | 'termico';

interface ExpoMetricsPanelProps {
  lote: ExpoLoteData;
}

const ExpoMapCore = dynamic(
  () => import('./ExpoMapCore').then((mod) => mod.ExpoMapCore),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-mono text-xs gap-2">
        <RefreshCw className="w-4 h-4 animate-spin" /> Cargando Visor Multiespectral...
      </div>
    ),
  }
);

const getSpectralRangeText = (layer: LayerType): string => {
  if (layer === 'satelital') return 'RGB Verdadero';
  if (layer === 'termico') return '18°C - 38°C';
  return '0.10 - 0.95 NDVI';
};

export const ExpoMetricsPanel: React.FC<ExpoMetricsPanelProps> = ({ lote }) => {
  const [activeLayer, setActiveLayer] = useState<LayerType>('ndvi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const coords = {
    lat: lote.lat ?? -31.6565,
    lng: lote.lng ?? -68.5630,
  };

  const layerOptions: { type: LayerType; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      type: 'ndvi', 
      label: 'Capa NDVI (Biomasa)', 
      icon: <Leaf className="w-3.5 h-3.5 text-emerald-400" />,
      desc: 'Índice de fotosíntesis y salud del follaje'
    },
    { 
      type: 'satelital', 
      label: 'RGB Satelital Real', 
      icon: <Eye className="w-3.5 h-3.5 text-sky-400" />,
      desc: 'Fotografía aérea en color verdadero'
    },
    { 
      type: 'termico', 
      label: 'Estrés Térmico / Hídrico', 
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
      desc: 'Análisis radiométrico de temperatura y sequía'
    },
  ];

  const currentOption = layerOptions.find((o) => o.type === activeLayer) || layerOptions[0];

  return (
    <div className="w-full max-w-5xl space-y-6 animate-in fade-in duration-300 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contenedor del Mapa Satelital Real */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative min-h-96 shadow-2xl">
          
          {/* Encabezado Superior: Título + Badge NDVI + Dropdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-30 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
                  <Layers className="w-3 h-3" /> Sentinel-2
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" /> San Juan ({coords.lat.toFixed(2)}, {coords.lng.toFixed(2)})
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{lote.nombre} ({lote.hectareas} Ha)</h3>
              <p className="text-xs text-slate-400">{currentOption.desc}</p>
            </div>

            {/* Bloque Derecho: Valor Promedio NDVI + Dropdown de Capas */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              
              {/* RECUADRO ÍNDICE PROMEDIO DESTACADO */}
              <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-right shadow-md">
                <span className="text-[9px] uppercase text-slate-400 font-mono block leading-none">Índice Promedio</span>
                <span className="text-base font-black text-emerald-400 font-mono">{lote.ndvi} NDVI</span>
              </div>

              {/* Selector Desplegable */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 bg-slate-950 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold transition transform active:scale-95 cursor-pointer shadow-md"
                >
                  {currentOption.icon}
                  <span>{currentOption.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                    {layerOptions.map((option) => (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => {
                          setActiveLayer(option.type);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                          activeLayer === option.type
                            ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                        {activeLayer === option.type && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Visor Satelital Real Leaflet */}
          <div className="relative w-full h-72 my-auto rounded-xl border border-slate-800 overflow-hidden shadow-inner z-0">
            <ExpoMapCore
              lat={coords.lat}
              lng={coords.lng}
              activeLayer={activeLayer}
              loteNombre={lote.nombre}
            />

            {/* Badge de Capa Activa Flotante */}
            <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-2 shadow-lg">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-300 uppercase">
                {currentOption.label}
              </span>
            </div>
          </div>

          {/* BARRA DE RANGO ESPECTRAL */}
          <div className="border-t border-slate-800/80 pt-3 mt-3 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase">
              <span>Rango Espectral</span>
              <span>{getSpectralRangeText(activeLayer)}</span>
            </div>

            <div className="w-full h-2 rounded-full overflow-hidden relative border border-slate-800">
              {activeLayer === 'ndvi' && (
                <div className="w-full h-full bg-linear-to-r from-amber-600 via-emerald-500 to-emerald-300" />
              )}
              {activeLayer === 'termico' && (
                <div className="w-full h-full bg-linear-to-r from-blue-500 via-amber-400 to-rose-600" />
              )}
              {activeLayer === 'satelital' && (
                <div className="w-full h-full bg-linear-to-r from-slate-700 via-sky-600 to-blue-400" />
              )}
            </div>

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{activeLayer === 'termico' ? 'Suelo Frío / Húmedo' : 'Suelo Descubierto'}</span>
              <span>{activeLayer === 'termico' ? 'Estrés Térmico Crítico' : 'Vigor Vegetal Óptimo'}</span>
            </div>
          </div>

        </div>

        {/* Panel Lateral: Telemetría & Clima */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AreaChart className="w-4 h-4 text-emerald-400" /> Telemetría de Suelo
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humedad
                </div>
                <span className="text-lg font-bold text-white font-mono">{lote.humedad}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Temp. Suelo
                </div>
                <span className="text-lg font-bold text-white font-mono">{lote.tempSuelo}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Wind className="w-4 h-4 text-emerald-400" /> Vel. Viento
              </div>
              <span className="text-sm font-bold text-white font-mono">{lote.viento}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Certificación AgroPassport
            </h4>
            <p className="text-xs text-slate-300">
              Biomasa verificada por constelación satelital con firma criptográfica en cadena de bloques.
            </p>
            <div className="pt-1">
              <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] px-2.5 py-1 rounded-lg font-mono">
                Hash: {lote.hash}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};