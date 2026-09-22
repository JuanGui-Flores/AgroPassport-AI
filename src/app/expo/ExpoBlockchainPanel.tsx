// src/app/expo/ExpoBlockchainPanel.tsx
'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, Cpu, Database, CheckCircle2, Lock, 
  ExternalLink, RefreshCw, FileCode
} from 'lucide-react';
import { ExpoLoteData } from './ExpoMetricsPanel';
import { ExpoScanModal } from './ExpoScanModal';

interface ExpoBlockchainPanelProps {
  lote: ExpoLoteData;
}

export const ExpoBlockchainPanel: React.FC<ExpoBlockchainPanelProps> = ({ lote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Eventos simulados en la cadena de bloques para la parcela
  const blocks = [
    {
      id: '#104928',
      evento: 'Validación de Biomasa Activa',
      metrica: `${lote.ndvi} NDVI (Óptimo)`,
      fecha: '2026-09-22 14:30:12 UTC',
      satelite: 'Sentinel-2B',
      hash: lote.hash,
      confirmaciones: 128,
      estado: 'Confirmado',
    },
    {
      id: '#104912',
      evento: 'Registro de Telemetría Térmica',
      metrica: `Temp. Suelo ${lote.tempSuelo} • Humedad ${lote.humedad}`,
      fecha: '2026-09-22 08:15:40 UTC',
      satelite: 'IoT Sensor Node #04',
      hash: '0x3a8e...f910',
      confirmaciones: 342,
      estado: 'Confirmado',
    },
    {
      id: '#104850',
      evento: 'Emisión de Certificado AgroPassport',
      metrica: `Score Crediticio ${lote.score}/1000`,
      fecha: '2026-09-21 19:00:00 UTC',
      satelite: 'Smart Contract Engine v2',
      hash: '0x7c1b...e84d',
      confirmaciones: 1024,
      estado: 'Inmutable',
    },
  ];

  return (
    <div className="w-full max-w-5xl space-y-6 animate-in fade-in duration-300 select-none">
      
      {/* Modal interactivo de Agrotether Scan */}
      <ExpoScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lote={lote}
      />
      
      {/* Tarjeta de Resumen del Contrato Inteligente */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Database className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Red Principal Agrotether
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-400" /> Smart Contract Active
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Certificación Inmutable en Cadena de Bloques</h3>
            <p className="text-xs text-slate-400 mt-1">
              Registro criptográfico descentralizado de los índices satelitales para la finca <strong className="text-slate-200">{lote.nombre}</strong>.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-right min-w-48 shadow-md">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Estado del Contrato</span>
            <span className="text-sm font-bold text-emerald-400 font-mono flex items-center justify-end gap-1.5 mt-0.5">
              <Lock className="w-3.5 h-3.5" /> Verificado & Auditado
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              Polígono San Juan • Pocito
            </span>
          </div>
        </div>
      </div>

      {/* Grid Inferior: Línea de Tiempo de Bloques + Especificaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline de Bloques Validados */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" /> Registros de Bloques Recientes
            </h4>
            <span className="text-[11px] font-mono text-slate-500">Bloque Actual: #104928</span>
          </div>

          <div className="space-y-4">
            {blocks.map((block) => (
              <div 
                key={block.id} 
                className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl relative overflow-hidden transition hover:border-emerald-500/40"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold px-2 py-0.5 rounded">
                      {block.id}
                    </span>
                    <h5 className="text-sm font-bold text-white">{block.evento}</h5>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {block.estado}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono mb-3 bg-slate-900/60 p-2 rounded border border-slate-800">
                  {block.metrica}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-2">
                  <div>
                    <span className="text-slate-500 block">Marca de Tiempo:</span>
                    <span>{block.fecha}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fuente de Datos:</span>
                    <span className="text-sky-400">{block.satelite}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hash de Verificación:</span>
                    <span className="text-emerald-400 truncate block">{block.hash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Lateral: Parámetros Criptográficos */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" /> Parámetros Técnicos
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">Algoritmo de Consenso</span>
                <span className="text-white font-bold">Proof of Agricultural Value (PoAV)</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">Frecuencia de Sellado</span>
                <span className="text-white font-bold">Cada 5 días (Sentinel Constellation)</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">Oracle Integrado</span>
                <span className="text-emerald-400 font-bold">Chainlink AgroFeeds v4</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                <span>Explorar en Agrotether Scan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Garantía Inmutable
            </h4>
            <p className="text-xs text-slate-300">
              Cualquier entidad bancaria o comprador puede auditar de forma independiente la veracidad histórica de la biomasa de esta finca.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};