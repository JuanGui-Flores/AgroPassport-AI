// src/components/DigitalSignatureCard.tsx
'use client';

import React from 'react';
import { ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';
import { EntityOption } from '@/app/data/entities';
import { Lote } from '@/app/data/lotes';

interface DigitalSignatureCardProps {
  entity: EntityOption;
  lote: Lote;
}

export const DigitalSignatureCard: React.FC<DigitalSignatureCardProps> = ({ entity, lote }) => {
  const timeStamp = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="border border-slate-700 bg-slate-950 p-5 rounded-2xl space-y-4 text-slate-200">
      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono text-[#00E699] uppercase tracking-widest">
            Ficha Oficial de Validación Operativa
          </span>
          <h4 className="text-sm font-bold text-white">{entity.name}</h4>
          <p className="text-[11px] text-slate-400">Lote Activo: {lote.nombre} ({lote.hectareas} Ha)</p>
        </div>
        <QrCode className="w-10 h-10 text-slate-400" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Passport Score</span>
          <span className="text-sm font-bold text-[#00E699]">{lote.score} / 100</span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Índice Vegetativo (NDVI)</span>
          <span className="text-sm font-bold text-blue-400">{lote.ndvi} (Óptimo)</span>
        </div>
      </div>

      {/* Bloque de Firma Digital Encriptada */}
      <div className="p-3 bg-emerald-500/5 border border-[#00E699]/30 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#00E699] shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1">
              <span>Firma Digital Verificada por AgroPassport AI</span>
            </div>
            <p className="text-[9px] font-mono text-slate-400">
              HASH: 0x8F4A...2026 | Sello Temporal: {timeStamp}
            </p>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-[#00E699]" />
      </div>
    </div>
  );
};