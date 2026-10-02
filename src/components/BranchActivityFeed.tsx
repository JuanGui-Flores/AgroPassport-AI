// src/components/BranchActivityFeed.tsx
'use client';

import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { EntityOption } from '@/app/data/entities';

interface BranchActivityFeedProps {
  entity: EntityOption;
}

export const BranchActivityFeed: React.FC<BranchActivityFeedProps> = ({ entity }) => {
  const activities = entity.recentActivity || [
    { id: '1', text: 'Sincronización general completada correctamente', time: 'Recién', type: 'success' as const }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
              Actividad en Tiempo Real — {entity.name}
            </h4>
            <p className="text-[11px] text-slate-400">Monitoreo de eventos y flujos operativos de la entidad</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
           <span>Conectado</span>
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <div 
            key={act.id} 
            className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {act.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {act.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {act.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                  {act.text}
                </p>
                <span className="text-[10px] text-slate-500">{act.time}</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
};