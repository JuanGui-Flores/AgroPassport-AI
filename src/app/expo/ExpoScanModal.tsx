// src/app/expo/ExpoScanModal.tsx
'use client';

import React from 'react';
import { X, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { ExpoLoteData } from './ExpoMetricsPanel';

interface ExpoScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  lote: ExpoLoteData;
}

export const ExpoScanModal: React.FC<ExpoScanModalProps> = ({ isOpen, onClose, lote }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white tracking-wide">AGROTETHER SCAN EXPLORER</h3>
              <p className="text-[10px] font-mono text-emerald-400">Red Principal • Polígono San Juan</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del Modal con los detalles de la transacción */}
        <div className="p-6 space-y-6 font-mono text-xs overflow-y-auto max-h-[75vh]">
          
          {/* Estado de la Transacción */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-white font-bold">Transacción Exitosa y Verificada</p>
                <p className="text-[10px] text-slate-400">Bloque #104928 • Consolidado hace 12 segundos</p>
              </div>
            </div>
            <span className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-bold">
              INMUTABLE
            </span>
          </div>

          {/* Detalles Técnicos */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-500">Hash de Transacción:</span>
              <span className="text-emerald-400 font-bold">{lote.hash}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-500">Establecimiento / Finca:</span>
              <span className="text-white font-bold">{lote.nombre}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-500">Ubicación Geográfica:</span>
              <span className="text-slate-300">{lote.lat}, {lote.lng} (Pocito)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-500">Índice Biomasa Registrado:</span>
              <span className="text-emerald-400 font-bold">{lote.ndvi} NDVI (Óptimo)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-500">Smart Contract:</span>
              <span className="text-sky-400">0xAgroContractV4...92a</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Gas Usado / Consenso:</span>
              <span className="text-slate-300">0.0012 ATHT (PoAV Protocol)</span>
            </div>
          </div>

          {/* Sello de Auditoría */}
          <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-[11px]">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Este registro criptográfico cuenta con validez legal para auditorías financieras y respaldo de warrants agrícolas.
            </span>
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2"
          >
            <span>Cerrar Explorador</span>
          </button>
        </div>

      </div>
    </div>
  );
};