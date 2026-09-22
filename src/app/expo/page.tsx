// src/app/expo/page.tsx
'use client';

import React, { useState } from 'react';
import { CreditCard, Satellite, Database, MonitorPlay, ChevronDown, Cpu, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

import { ExpoMetricsPanel, ExpoLoteData } from './ExpoMetricsPanel';
import { ExpoBlockchainPanel } from './ExpoBlockchainPanel';

type ActiveTab = 'pasaporte' | 'satelital' | 'blockchain';

// Datos Mock para el selector de lotes en la Expo
const mockLotes: ExpoLoteData[] = [
  {
    loteId: 'lote-1',
    nombre: 'Lote Don Guillermo',
    hectareas: 450,
    score: 875,
    ndvi: 0.82,
    riesgo: 'Bajo',
    rindeEst: '4.2 Tn/Ha',
    humedad: '34.2 %',
    tempSuelo: '22.4 °C',
    viento: '12 km/h SO',
    hash: '0x8f2a...e91c',
    lat: -31.6565,
    lng: -68.5630,
  },
  {
    loteId: 'lote-2',
    nombre: 'Finca La Esperanza',
    hectareas: 280,
    score: 720,
    ndvi: 0.68,
    riesgo: 'Moderado',
    rindeEst: '3.1 Tn/Ha',
    humedad: '28.1 %',
    tempSuelo: '25.8 °C',
    viento: '18 km/h O',
    hash: '0x4b1e...f382',
    lat: -31.6420,
    lng: -68.5800,
  },
  {
    loteId: 'lote-3',
    nombre: 'Establecimiento San José',
    hectareas: 620,
    score: 910,
    ndvi: 0.89,
    riesgo: 'Bajo',
    rindeEst: '5.0 Tn/Ha',
    humedad: '38.5 %',
    tempSuelo: '21.0 °C',
    viento: '9 km/h S',
    hash: '0x9d3f...a112',
    lat: -31.6700,
    lng: -68.5500,
  },
];

export default function ExpoPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('satelital');
  const [selectedLoteId, setSelectedLoteId] = useState<string>('lote-1');
  const [isScreenSaver, setIsScreenSaver] = useState(false);

  const selectedLote = mockLotes.find((l) => l.loteId === selectedLoteId) || mockLotes[0];

  const handleDismissScreenSaver = () => {
    if (isScreenSaver) {
      setIsScreenSaver(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* SALVAPANTALLAS ORIGINAL RESTAURADO */}
      {isScreenSaver && (
        <button
          type="button"
          onClick={handleDismissScreenSaver}
          className="fixed inset-0 z-50 w-full h-full bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 sm:p-12 text-center animate-in fade-in duration-300 cursor-pointer select-none border-0 outline-none m-0 appearance-none focus:ring-2 focus:ring-emerald-500"
        >
          {/* Cabecera del Salvapantallas */}
          <div className="w-full max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-left font-mono">
                <h2 className="text-sm font-black tracking-wider text-white">AGROPASSPORT AI</h2>
                <p className="text-[10px] text-emerald-400 tracking-widest">DEMO INTERACTIVA • MODO EXPO</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistema Inteligente Activo</span>
            </div>
          </div>

          {/* Contenido Central */}
          <div className="max-w-3xl flex flex-col items-center space-y-6 my-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> SCORING AGRÍCOLA & FINANCIERO EN TIEMPO REAL
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              El Pasaporte Digital <br />
              de tu <br />
              <span className="text-emerald-400">Establecimiento</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed">
              Auditabilidad satelital, scoring de biomasa (NDVI) y simulación instantánea de crédito y pólizas de seguro.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-emerald-500/20 transition transform hover:scale-105">
                <MonitorPlay className="w-4 h-4" />
                <span>Toca la pantalla para comenzar</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Pie del Salvapantallas con características */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900/80 pt-6 text-xs font-mono text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certificación de Scoring</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Satellite className="w-4 h-4 text-emerald-400" />
              <span>Índice Satelital NDVI</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Desembolso & Póliza Digital</span>
            </div>
          </div>
        </button>
      )}

      {/* ENCABEZADO SUPERIOR DEL KIOSCO */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-900 z-10">
        
        {/* Selector de Lotes Mock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-mono uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />{' '}
            STAND EXPO
          </div>

          <div className="relative">
            <select
              value={selectedLoteId}
              onChange={(e) => setSelectedLoteId(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 text-white text-xs font-bold font-mono px-4 py-2 pr-8 rounded-xl focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              {mockLotes.map((lote) => (
                <option key={lote.loteId} value={lote.loteId}>
                  {`${lote.nombre} (Score: ${lote.score})`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Navegación por Pestañas principales */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab('pasaporte')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'pasaporte'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pasaporte Digital</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('satelital')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'satelital'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Monitoreo Satelital</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blockchain')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'blockchain'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Trazabilidad Blockchain</span>
          </button>
        </div>

        {/* Botón para forzar salvapantallas */}
        <button
          type="button"
          onClick={() => setIsScreenSaver(true)}
          className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-mono transition cursor-pointer bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
          title="Modo Demostración"
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          <span>Probar Salvapantallas</span>
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <main className="w-full flex-1 flex items-center justify-center py-6">
        {activeTab === 'satelital' && <ExpoMetricsPanel lote={selectedLote} />}
        
        {activeTab === 'blockchain' && <ExpoBlockchainPanel lote={selectedLote} />}

        {activeTab === 'pasaporte' && (
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono">
              {`Score Certificado: ${selectedLote.score} / 1000`}
            </div>
            <h2 className="text-2xl font-bold text-white">{selectedLote.nombre}</h2>
            <p className="text-xs text-slate-400">
              Ficha crediticia lista para respaldar warrants, créditos verdes y financiamiento agropecuario.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Rendimiento Estimado:</span>
                <span className="text-emerald-400 font-bold">{selectedLote.rindeEst}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nivel de Riesgo:</span>
                <span className="text-sky-400 font-bold">{selectedLote.riesgo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Superficie Total:</span>
                <span className="text-white font-bold">{`${selectedLote.hectareas} Ha`}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA KIOSCO */}
      <footer className="w-full max-w-5xl border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>AgroPassport Stand Mode v2.4 • Pocito, San Juan</span>
        </div>
        <div>
          <span>Presione para alternar lotes o capas espectrales</span>
        </div>
      </footer>
    </div>
  );
}