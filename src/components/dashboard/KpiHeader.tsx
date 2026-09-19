// src/components/dashboard/KpiHeader.tsx
import React from 'react';
import { ShieldCheck, Layers, BadgeDollarSign, Wrench } from 'lucide-react';

export const KpiHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* KPI 1: Passport Score */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-medium line-clamp-1">Passport Score</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <span className="text-xl sm:text-2xl font-bold text-white">86.4</span>
          <span className="text-[10px] sm:text-xs font-medium text-emerald-400">+2.1% vs mes ant.</span>
        </div>
      </div>

      {/* KPI 2: Hectáreas */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-medium line-clamp-1">Hectáreas Monitoreadas</span>
          <Layers className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <span className="text-xl sm:text-2xl font-bold text-white">142.800</span>
          <span className="text-[10px] sm:text-xs font-medium text-slate-500">Ha activas</span>
        </div>
      </div>

      {/* KPI 3: Créditos */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-medium line-clamp-1">Créditos Pre-Aprobados</span>
          <BadgeDollarSign className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <span className="text-xl sm:text-2xl font-bold text-white">USD 4.2M</span>
          <span className="text-[10px] sm:text-xs font-medium text-amber-400">18 Lotes aptos</span>
        </div>
      </div>

      {/* KPI 4: Telemetría / Mantenimiento */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-medium line-clamp-1">Alertas IoT</span>
          <Wrench className="w-4 h-4 text-rose-400 shrink-0 ml-1" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <span className="text-xl sm:text-2xl font-bold text-white">12</span>
          <span className="text-[10px] sm:text-xs font-medium text-rose-400">Mantenimiento próx.</span>
        </div>
      </div>
    </div>
  );
};