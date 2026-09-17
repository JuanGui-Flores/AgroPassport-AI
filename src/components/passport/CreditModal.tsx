'use client';

import React from 'react';
import { Building2, CheckCircle2, DollarSign, X } from 'lucide-react';
import { EntityOption } from '@/app/data/entities';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  loteNombre: string;
  score: number;
  entity?: EntityOption;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  isOpen,
  onClose,
  loteNombre,
  score,
  entity,
}) => {
  if (!isOpen) return null;

  const entityName = entity?.name || 'Banco San Juan';
  const isBank = entity?.type !== 'insurance';

  // Opciones dinámicas según tipo de entidad
  const lineType = isBank ? 'Línea Verde Agrotech' : 'Póliza Agrícola Multiriesgo';
  const cupoLabel = isBank ? 'Cupo Pre-Aprobado:' : 'Suma Asegurable:';
  const tasaLabel = isBank ? 'Tasa Preferencial:' : 'Prima Estimada:';
  const tasaValor = isBank ? '14.5% TNA' : '2.1% Anual';
  const actionText = isBank ? 'solicitar el desembolso directo en su cuenta corriente.' : 'solicitar la emisión y alta de la cobertura.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {isBank ? 'Pre-Aprobar Financiación' : 'Emitir Póliza de Cosecha'}
            </h3>
            <p className="text-xs text-slate-400">
              {entityName} • {lineType}
            </p>
          </div>
        </div>

        {/* Detalles de la oferta */}
        <div className="space-y-2.5">
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">Garantía / Lote:</span>
            <span className="text-white font-bold">{loteNombre}</span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">Score Crediticio:</span>
            <span className="text-emerald-400 font-bold font-mono">{score} / 100</span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">{cupoLabel}</span>
            <span className="text-white font-bold font-mono">USD 250.000</span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">{tasaLabel}</span>
            <span className="text-emerald-400 font-bold font-mono">{tasaValor}</span>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-3 flex gap-2.5 items-start">
          <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-300 leading-snug">
            Al presionar confirmar, se emitirá el certificado digital de scoring para {actionText}
          </p>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition text-xs cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              alert(`Solicitud enviada exitosamente a ${entityName}`);
              onClose();
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};