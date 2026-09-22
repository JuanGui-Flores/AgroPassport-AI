// src/app/expo/ExpoStandbyOverlay.tsx
'use client';

import React from 'react';
import { Sparkles, Touchpad, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface ExpoStandbyOverlayProps {
  isActive: boolean;
  onStartDemo: () => void;
}

export const ExpoStandbyOverlay: React.FC<ExpoStandbyOverlayProps> = ({
  isActive,
  onStartDemo,
}) => {
  if (!isActive) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Stop click propagation to elements underneath
    onStartDemo();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed inset-0 z-100 flex flex-col justify-between bg-slate-950/95 backdrop-blur-md p-8 md:p-12 cursor-pointer select-none animate-in fade-in duration-300 text-left w-full h-full border-none outline-none"
    >
      {/* Fondo cinemático con brillo centrado */}
      <div className="absolute inset-0 bg-linear-to-tr from-emerald-950/40 via-slate-950 to-blue-950/30 -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-500/10 rounded-full blur-[140px] -z-10 animate-pulse" />

      {/* Encabezado */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">AGROPASSPORT AI</h1>
            <p className="text-xs text-emerald-400 font-mono">DEMO INTERACTIVA • MODO EXPO</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          {'Sistema Inteligente Activo'}
        </div>
      </div>

      {/* Bloque central de llamada a la acción */}
      <div className="flex flex-col items-center text-center my-auto space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Scoring Agrícola & Financiero en Tiempo Real
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
          El Pasaporte Digital de tu <span className="text-emerald-400">Establecimiento</span>
        </h2>

        <p className="text-slate-400 text-base md:text-lg max-w-xl">
          Auditabilidad satelital, scoring de biomasa (NDVI) y simulación instantánea de crédito y pólizas de seguro.
        </p>

        <div className="pt-4">
          <span className="group relative inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg px-8 py-5 rounded-2xl shadow-xl shadow-emerald-950/60 transition-all transform group-hover:scale-105 active:scale-95 cursor-pointer">
            <Touchpad className="w-6 h-6 animate-bounce" />
            Toca la pantalla para comenzar
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </span>
        </div>
      </div>

      {/* Pie de pantalla */}
      <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400 w-full">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Certificación de Scoring</span>
        </div>
        <div className="flex items-center justify-center gap-2 border-x border-slate-800">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Índice Satelital NDVI</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Desembolso & Póliza Digital</span>
        </div>
      </div>
    </button>
  );
};