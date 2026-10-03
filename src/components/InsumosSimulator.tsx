// src/components/InsumosSimulator.tsx
'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { EntityOption } from '@/app/data/entities';

interface InsumosSimulatorProps {
  readonly entity: EntityOption;
  readonly onExportPDF?: () => void;
}

// Helper fuera del componente para evitar ternarias anidadas (S3358)
const getDescuentoColorClass = (descuento: number): string => {
  if (descuento >= 15) {
    return 'text-[#00E699]';
  }
  if (descuento >= 10) {
    return 'text-blue-400';
  }
  return 'text-slate-400';
};

type TipoInsumo = 'fertilizante' | 'semillas' | 'defensivos';

const getCostoBasePorHa = (tipoInsumo: TipoInsumo): number => {
  if (tipoInsumo === 'fertilizante') {
    return 120;
  }
  if (tipoInsumo === 'semillas') {
    return 80;
  }
  return 95;
};

export function InsumosSimulator({ entity, onExportPDF }: Readonly<InsumosSimulatorProps>) {
  const [hectareas, setHectareas] = useState<number>(100);
  const [tipoInsumo, setTipoInsumo] = useState<TipoInsumo>('fertilizante');

  const costoBasePorHa = getCostoBasePorHa(tipoInsumo);
  const descuentoScore = entity.metrics?.score ? Math.min(Math.floor(entity.metrics.score / 10), 15) : 10;
  
  const subtotal = hectareas * costoBasePorHa;
  const ahorro = (subtotal * descuentoScore) / 100;
  const total = subtotal - ahorro;

  const colorDescuentoClass = getDescuentoColorClass(descuentoScore);

  return (
    <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00E699]/10 text-[#00E699]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
              Simulador de Canje e Insumos
            </h3>
            <p className="text-[11px] text-slate-400">
              Estimación de bonificación basada en scoring de <span className="text-[#00E699]">{entity.name}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Selector de Superficie */}
        <div>
          <label htmlFor="input-superficie-hectareas" className="block text-xs font-medium text-slate-400 mb-1.5">
            Superficie (Hectáreas)
          </label>
          <input
            id="input-superficie-hectareas"
            type="number"
            value={hectareas}
            onChange={(e) => setHectareas(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00E699] transition"
            min={1}
          />
        </div>

        {/* Selector de Insumo */}
        <div>
          <label htmlFor="select-tipo-insumo-agricola" className="block text-xs font-medium text-slate-400 mb-1.5">
            Tipo de Insumo
          </label>
          <select
            id="select-tipo-insumo-agricola"
            value={tipoInsumo}
            onChange={(e) => setTipoInsumo(e.target.value as 'fertilizante' | 'semillas' | 'defensivos')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00E699] transition"
          >
            <option value="fertilizante">Fertilizantes Nitrogenados</option>
            <option value="semillas">Semillas Híbridas</option>
            <option value="defensivos">Protección de Cultivo</option>
          </select>
        </div>

        {/* Resumen de Canje */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Bonificación Score:</span>
            <span className={`font-bold ${colorDescuentoClass}`}>-{descuentoScore}%</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-slate-400">Ahorro Est.:</span>
            <span className="font-semibold text-emerald-400">USD ${ahorro.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-white border-t border-slate-800 pt-2 mt-2">
            <span>Total Canje:</span>
            <span className="text-[#00E699]">USD ${total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {onExportPDF && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onExportPDF}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer border border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#00E699]" />
            <span>Adjuntar a Ficha Oficial</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
}