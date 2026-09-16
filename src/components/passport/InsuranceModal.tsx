'use client';

import React from 'react';
import { X, ShieldAlert, CheckCircle2, CloudRain } from 'lucide-react';

interface InsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  loteNombre: string;
  hectareas: number;
  ndvi: number;
}

export const InsuranceModal: React.FC<InsuranceModalProps> = ({
  isOpen,
  onClose,
  loteNombre,
  hectareas,
  ndvi,
}) => {
  if (!isOpen) return null;

  // Prima estimada ajustada por hectáreas y salud vegetal (NDVI)
  const sumaAsegurada = hectareas * 850; // USD 850 por Ha estimada
  const tasaRiesgo = ndvi > 0.75 ? 2.1 : 3.8; // Menor tasa si la biomasa es óptima
  const costoPrima = Math.round((sumaAsegurada * tasaRiesgo) / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cotización Póliza Cosecha</h3>
            <p className="text-xs text-slate-400">La Segunda Seguros • Paramétrico Granizo & Sequía</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Lote Asegurado:</span>
            <span className="font-semibold text-slate-200">{loteNombre} ({hectareas} Ha)</span>
          </div>
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Suma Asegurada:</span>
            <span className="font-bold text-white">USD {sumaAsegurada.toLocaleString()}</span>
          </div>
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Tasa de Riesgo (NDVI {ndvi}):</span>
            <span className="font-bold text-blue-400">{tasaRiesgo}%</span>
          </div>
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Prima Estimada:</span>
            <span className="font-extrabold text-emerald-400 text-sm">USD {costoPrima.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-3 flex gap-2 text-xs text-blue-300">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p>
            {ndvi > 0.75
              ? 'Descuento del 15% aplicado a la prima por bajo riesgo biológico y óptimo vigor vegetal.'
              : 'Cobertura estándar sin bonificaciones por índice de vegetación moderado.'}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2.5 rounded-xl transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              alert('¡Póliza de cosecha emitida y vinculada al lote correctamente!');
              onClose();
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> Emitir Póliza
          </button>
        </div>
      </div>
    </div>
  );
};