import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PassportCardProps {
  loteId: string;
  nombre: string;
  hectareas: number;
  score: number;
  ndvi: number;
  rindeEst: string;
}

export const PassportCard: React.FC<PassportCardProps> = ({
  loteId,
  nombre,
  hectareas,
  score,
  ndvi,
  rindeEst,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            ● Verificado
          </span>
          <span className="text-xs text-slate-500 font-mono">ID: {loteId}</span>
        </div>

        <h3 className="text-lg font-bold text-white leading-snug">{nombre}</h3>
        <p className="text-xs text-slate-400 mb-4">
          San Juan, Argentina • {hectareas} Hectáreas
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Passport Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-400">{score}</span>
              <span className="text-slate-600 text-xs font-bold">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">
              Apto Crédito & Seguro
            </span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-emerald-500 border-t-transparent flex items-center justify-center text-[10px] font-bold text-emerald-400">
            {score}%
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400">Salud Vegetal (NDVI)</span>
            <span className="font-semibold text-slate-200">{ndvi} (Óptimo)</span>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400">Rinde Estimado</span>
            <span className="font-semibold text-slate-200">{rindeEst}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-4 h-4" /> Pre-Aprobar Financiación (BSJ)
        </button>
        <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition text-xs border border-slate-700">
          Emitir Póliza de Cosecha (La Segunda)
        </button>
      </div>
    </div>
  );
};