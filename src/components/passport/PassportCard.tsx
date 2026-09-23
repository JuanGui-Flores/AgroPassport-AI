// src/components/passport/PassportCard.tsx
'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, FileDown, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { CreditModal } from './CreditModal';
import { InsuranceModal } from './InsuranceModal';
import { EntityOption } from '@/app/data/entities';
import { generatePassportPDF } from '@/utils/generatePdf';

interface PassportCardProps {
  loteId: string;
  nombre: string;
  hectareas: number;
  score: number;
  ndvi: number;
  rindeEst: string;
  entity?: EntityOption;
  hideButtons?: boolean;
}

// Función auxiliar para evitar ternarios anidados (Regla SonarQube typescript:S3358)
const getSaludNdviTexto = (ndviValue: number): string => {
  if (ndviValue >= 0.8) {
    return 'Óptimo';
  }
  if (ndviValue >= 0.6) {
    return 'Moderado';
  }
  return 'Bajo';
};

export const PassportCard: React.FC<PassportCardProps> = ({
  loteId,
  nombre,
  hectareas,
  score,
  ndvi,
  rindeEst,
  entity,
  hideButtons = false,
}) => {
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isPreApproved, setIsPreApproved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isApproving, setIsApproving] = useState(false); // Estado de carga para el botón de pre-aprobar

  const isBank = entity?.type !== 'insurance';
  const entityName = entity?.name || 'Banco San Juan (BSJ)';

  // Evaluación dinámica según el score
  const isHighScore = score >= 80;
  const estadoTexto = isHighScore ? 'Apto Crédito & Seguro' : 'Requiere Revisión Hídrica';
  const saludNdviTexto = getSaludNdviTexto(ndvi);

  // Manejador de pre-aprobación directa con animación fluida
  const handleDirectPreApprove = () => {
    if (isPreApproved || isApproving) return;

    setIsApproving(true);

    // Simulamos la comunicación bancaria por 1.2 segundos con animación suave
    setTimeout(() => {
      setIsApproving(false);
      setIsPreApproved(true);

      toast.success(isBank ? 'Financiación Pre-Aprobada' : 'Póliza de Cosecha Emitida', {
        description: `Operación confirmada exitosamente para ${nombre} con ${entityName}.`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        duration: 5000,
      });
    }, 1200);
  };

  // Manejador original de confirmación por si usas los modales en otro flujo
  const handlePreApproveConfirm = () => {
    setIsPreApproved(true);
    setIsCreditModalOpen(false);
    setIsInsuranceModalOpen(false);
    
    toast.success(isBank ? 'Financiación Pre-Aprobada' : 'Póliza de Cosecha Emitida', {
      description: `Operación confirmada exitosamente para ${nombre} con ${entityName}.`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      duration: 5000,
    });
  };

  // Generador dinámico de PDF directo
  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      toast.info('Generando Ficha Técnica...', {
        description: 'Maquetando informe ejecutivo para evaluación de riesgo.',
      });

      await generatePassportPDF({
        loteName: nombre,
        parcela: `ID: ${loteId}`,
        location: 'San Juan, Argentina',
        hectareas,
        score,
        ndvi,
        rinde: rindeEst,
        entityName,
      });

      toast.success('PDF Exportado con Éxito', {
        description: `Se descargó la Ficha Técnica para ${nombre}.`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      });
    } catch (err) {
      console.error('Error generando el PDF:', err);
      toast.error('Error al generar el PDF', {
        description: 'Ocurrió un problema durante la maquetación. Inténtalo de nuevo.',
      });
    } finally {
      setIsExporting(false);
    }
  };

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
                <span className={`text-3xl font-black ${isHighScore ? 'text-emerald-400' : 'text-amber-400'} print:text-black`}>
                  {score}
                </span>
                <span className="text-slate-600 text-xs font-bold">/100</span>
              </div>
              <span className={`text-[11px] font-semibold ${isHighScore ? 'text-emerald-400' : 'text-amber-400'} print:text-slate-800`}>
                {estadoTexto}
              </span>
            </div>
            <div className={`w-14 h-14 rounded-full border-4 ${isHighScore ? 'border-emerald-500 text-emerald-400' : 'border-amber-500 text-amber-400'} border-t-transparent flex items-center justify-center text-[10px] font-bold print:border-slate-800 print:text-black`}>
              {score}%
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60 print:border-slate-300">
              <span className="text-slate-400 print:text-slate-600">Salud Vegetal (NDVI)</span>
              <span className="font-semibold text-slate-200 print:text-black">{ndvi} ({saludNdviTexto})</span>
            </div>
            <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60 print:border-slate-300">
              <span className="text-slate-400 print:text-slate-600">Rinde Estimado</span>
              <span className="font-semibold text-slate-200 print:text-black">{rindeEst}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción directos y funcionales con estado de carga */}
        {!hideButtons && (
          <div className="space-y-2 pt-2 print:hidden">
            {isBank ? (
              <button 
                onClick={handleDirectPreApprove}
                disabled={isPreApproved || isApproving}
                className={`w-full font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isPreApproved
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-950/50'
                }`}
              >
                {isApproving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {isPreApproved ? 'Financiación Pre-Aprobada' : `Pre-Aprobar Financiación (${entityName})`}
              </button>
            ) : (
              <button 
                onClick={handleDirectPreApprove}
                disabled={isPreApproved || isApproving}
                className={`w-full font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isPreApproved
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-950/50'
                }`}
              >
                {isApproving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
                {isPreApproved ? 'Póliza Emitida' : `Emitir Póliza de Cosecha (${entityName})`}
              </button>
            )}

            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="w-full bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition text-xs border border-dashed border-slate-700/60 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>Exportar Ficha Técnica (PDF)</span>
            </button>
          </div>
        )}
      </div>

      {/* Modales preservados por si se requieren en otros flujos */}
      {!hideButtons && (
        <>
          <CreditModal
            isOpen={isCreditModalOpen}
            onClose={() => setIsCreditModalOpen(false)}
            onConfirm={handlePreApproveConfirm}
            loteNombre={nombre}
            score={score}
            entity={entity}
          />

          <InsuranceModal
            isOpen={isInsuranceModalOpen}
            onClose={() => setIsInsuranceModalOpen(false)}
            onConfirm={handlePreApproveConfirm}
            loteNombre={nombre}
            hectareas={hectareas}
            ndvi={ndvi}
          />
        </>
      )}
    </>
  );
};