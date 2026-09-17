'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileDown, ShieldAlert } from 'lucide-react';
import { CreditModal } from './CreditModal';
import { InsuranceModal } from './InsuranceModal';
import { EntityOption } from '@/app/data/entities';

interface PassportCardProps {
  loteId: string;
  nombre: string;
  hectareas: number;
  score: number;
  ndvi: number;
  rindeEst: string;
  entity?: EntityOption; 
}

export const PassportCard: React.FC<PassportCardProps> = ({
  loteId,
  nombre,
  hectareas,
  score,
  ndvi,
  rindeEst,
  entity,
}) => {
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const isBank = entity?.type !== 'insurance';
  const entityName = entity?.name || 'Banco San Juan (BSJ)';

  return (
    <>
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between print:border-none print:shadow-none print:bg-white print:text-black">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider print:border-slate-300 print:text-black print:bg-slate-100">
              ● Verificado
            </span>
            <span className="text-xs text-slate-500 font-mono print:text-slate-600">ID: {loteId}</span>
          </div>

          <h3 className="text-lg font-bold text-white leading-snug print:text-black">{nombre}</h3>
          <p className="text-xs text-slate-400 mb-4 print:text-slate-600">
            San Juan, Argentina • {hectareas} Hectáreas
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between mb-4 print:bg-slate-100 print:border-slate-300">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider print:text-slate-600">
                Passport Score
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-400 print:text-black">{score}</span>
                <span className="text-slate-600 text-xs font-bold">/100</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 print:text-emerald-700">
                Apto Crédito & Seguro
              </span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500 border-t-transparent flex items-center justify-center text-[10px] font-bold text-emerald-400 print:border-emerald-600 print:text-black">
              {score}%
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60 print:border-slate-300">
              <span className="text-slate-400 print:text-slate-600">Salud Vegetal (NDVI)</span>
              <span className="font-semibold text-slate-200 print:text-black">{ndvi} (Óptimo)</span>
            </div>
            <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60 print:border-slate-300">
              <span className="text-slate-400 print:text-slate-600">Rinde Estimado</span>
              <span className="font-semibold text-slate-200 print:text-black">{rindeEst}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 print:hidden">
          {isBank ? (
            <button 
              onClick={() => setIsCreditModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Pre-Aprobar Financiación ({entityName})
            </button>
          ) : (
            <button 
              onClick={() => setIsInsuranceModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" /> Emitir Póliza de Cosecha ({entityName})
            </button>
          )}

          <button
            onClick={handlePrint}
            className="w-full bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition text-xs border border-dashed border-slate-700/60 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" /> Exportar Ficha Técnica (PDF)
          </button>
        </div>
      </div>

      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        loteNombre={nombre}
        score={score}
        entity={entity}
      />

      <InsuranceModal
        isOpen={isInsuranceModalOpen}
        onClose={() => setIsInsuranceModalOpen(false)}
        loteNombre={nombre}
        hectareas={hectareas}
        ndvi={ndvi}
      />
    </>
  );
};