'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface LoteFiltersProps {
  minScore: number;
  setMinScore: (val: number) => void;
  minNdvi: number;
  setMinNdvi: (val: number) => void;
  onReset: () => void;
}

export const LoteFilters: React.FC<LoteFiltersProps> = ({
  minScore,
  setMinScore,
  minNdvi,
  setMinNdvi,
  onReset,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Filtros de Análisis de Lotes</span>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" /> Limpiar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Filtro por Score Mínimo */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Score Mínimo:</span>
            <span className="text-emerald-400 font-bold font-mono">{minScore} pts</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-emerald-400 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Filtro por NDVI Mínimo */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>NDVI Mínimo:</span>
            <span className="text-emerald-400 font-bold font-mono">{minNdvi.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={minNdvi}
            onChange={(e) => setMinNdvi(Number(e.target.value))}
            className="w-full accent-emerald-400 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};