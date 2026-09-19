// src/components/dashboard/KpiHeader.tsx
import React from 'react';
import { ShieldCheck, Layers, BadgeDollarSign, Wrench } from 'lucide-react';

export const KpiHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {/* KPI 1: Passport Score */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center text-slate-400 mb-1">
          <span className="text-[10px] sm:text-xs font-medium truncate">Passport Score</span>
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 ml-1" />
        </div>
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-2xl font-bold text-white tracking-tight">86.4</span>
          <span className="text-[9px] sm:text-xs font-medium text-emerald-400 shrink-0">+2.1%</span>
        </div>
      </div>

      {/* KPI 2: Hectáreas */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center text-slate-400 mb-1">
          <span className="text-[10px] sm:text-xs font-medium truncate">Hectáreas</span>
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 ml-1" />
        </div>
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-2xl font-bold text-white tracking-tight">142.8k</span>
          <span className="text-[9px] sm:text-xs font-medium text-slate-500 shrink-0">Ha</span>
        </div>
      </div>

      {/* KPI 3: Créditos */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center text-slate-400 mb-1">
          <span className="text-[10px] sm:text-xs font-medium truncate">Créditos</span>
          <BadgeDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 ml-1" />
        </div>
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-2xl font-bold text-white tracking-tight">USD 4.2M</span>
          <span className="text-[9px] sm:text-xs font-medium text-amber-400 shrink-0">18 Lotes</span>
        </div>
      </div>

      {/* KPI 4: Telemetría / Mantenimiento */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center text-slate-400 mb-1">
          <span className="text-[10px] sm:text-xs font-medium truncate">Alertas IoT</span>
          <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0 ml-1" />
        </div>
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-base sm:text-2xl font-bold text-white tracking-tight">12</span>
          <span className="text-[9px] sm:text-xs font-medium text-rose-400 shrink-0">Próx.</span>
        </div>
      </div>
    </div>
  );
};