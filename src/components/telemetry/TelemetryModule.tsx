'use client';

import React from 'react';
import { Cpu, CheckCircle, AlertTriangle, Fuel } from 'lucide-react';

export const TelemetryModule: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Telemetría IoT & Mantenimiento</h2>
        </div>
        <span className="text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
          2 Alertas Preventivas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Maquinaria 1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-white">Tractor Pauny 280A</span>
              <span className="text-[10px] text-emerald-400 font-mono">ID: T-882</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Lote Don Juan • Parcela 4</p>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Horas Uso:</span>
                <span className="text-slate-200 font-medium">1,240 hs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Presión Hidráulica:</span>
                <span className="text-emerald-400 font-medium">210 bar (Normal)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Estado Óptimo
            </span>
            <button className="text-slate-400 hover:text-white transition">Detalles →</button>
          </div>
        </div>

        {/* Maquinaria 2 - Con alerta */}
        <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-white">Cosechadora Mainero 3500</span>
              <span className="text-[10px] text-amber-400 font-mono">ID: C-104</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Parcela 12 • Sector Sur</p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Manguera Oleohidráulica:</span>
                <span className="text-amber-400 font-semibold">Desgaste 82%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Temperatura Aceite:</span>
                <span className="text-amber-400 font-medium">88°C (Elevada)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> Service Sugerido
            </span>
            <button className="text-slate-300 font-semibold hover:text-white transition underline">
              Repuesto CuyoFlex
            </button>
          </div>
        </div>

        {/* Maquinaria 3 */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-white">Pulverizadora Metalfor</span>
              <span className="text-[10px] text-emerald-400 font-mono">ID: P-402</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Lote San José • Parcela 1</p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Consumo Combustible:</span>
                <span className="text-slate-200 font-medium">18.4 L/ha</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Próximo Service:</span>
                <span className="text-slate-200 font-medium">En 120 hs</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Fuel className="w-3.5 h-3.5" /> En Operación
            </span>
            <button className="text-slate-400 hover:text-white transition">Detalles →</button>
          </div>
        </div>
      </div>
    </div>
  );
};