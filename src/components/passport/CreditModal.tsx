'use client';

import React from 'react';
import { X, Building2, CheckCircle2, DollarSign } from 'lucide-react';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  loteNombre: string;
  score: number;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  isOpen,
  onClose,
  loteNombre,
  score,
}) => {
  if (!isOpen) return null;

  // Monto pre-aprobado y tasa bonificada según el Passport Score
  const montoPreAprobado = score >= 80 ? 250000 : 120000;
  const tasaBonificada = score >= 80 ? '14.5% TNA' : '18.0% TNA';

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
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pre-Aprobar Financiación</h3>
            <p className="text-xs text-slate-400">Banco San Juan • Línea Verde Agrotech</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Garantía / Lote:</span>
            <span className="font-semibold text-slate-200">{loteNombre}</span>
          </div>
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Score Crediticio:</span>
            <span className="font-bold text-emerald-400">{score} / 100</span>
          </div>
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Cupo Pre-Aprobado:</span>
            <span className="font-bold text-white">USD {montoPreAprobado.toLocaleString()}</span>
          </div>
          <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Tasa Preferencial:</span>
            <span className="font-extrabold text-emerald-400 text-sm">{tasaBonificada}</span>
          </div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex gap-2 text-xs text-emerald-300">
          <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Al presionar confirmar, se emitirá el certificado digital de scoring para solicitar el desembolso directo en su cuenta corriente.
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
              alert('¡Pre-aprobación solicitada con éxito al Banco San Juan!');
              onClose();
            }}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};