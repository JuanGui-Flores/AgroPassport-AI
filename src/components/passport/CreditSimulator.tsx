'use client';

import React, { useState } from 'react';
import { Calculator, TrendingDown, CheckCircle, Loader2 } from 'lucide-react';
import { EntityOption } from '@/app/data/entities';
import { toast } from 'sonner';

interface CreditSimulatorProps {
  score: number;
  loteNombre: string;
  entity?: EntityOption;
}

export const CreditSimulator: React.FC<CreditSimulatorProps> = ({
  score,
  loteNombre,
  entity,
}) => {
  const [monto, setMonto] = useState<number>(120000);
  const [plazoMeses, setPlazoMeses] = useState<number>(12);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRequested, setIsRequested] = useState<boolean>(false);

  const entityName = entity?.name || 'Banco San Juan (BSJ)';
  const isBank = entity?.type !== 'insurance';

  // Descuento de tasa por buen Passport Score
  const tasaBase = 18;

  const getBonificacion = (pts: number) => {
    if (pts > 85) return 3.5;
    if (pts > 70) return 1.5;
    return 0;
  };

  const bonificacionScore = getBonificacion(score);
  const tasaAnualEfectiva = Math.max(tasaBase - bonificacionScore, 8);

  // Cálculos financieros
  const tasaMensual = tasaAnualEfectiva / 12 / 100;
  const cuotaEstimada =
    (monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses))) /
    (Math.pow(1 + tasaMensual, plazoMeses) - 1);

  const totalIntereses = cuotaEstimada * plazoMeses - monto;

  const handleSolicitarPreAprobacion = () => {
    if (isRequested || isSubmitting) return;

    setIsSubmitting(true);

    // Simulación fluida de respuesta del banco / aseguradora (1.2 segundos)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRequested(true);

      toast.success(isBank ? 'Solicitud Enviada con Éxito' : 'Cotización Generada', {
        description: `Simulación confirmada con ${entityName}: USD ${monto.toLocaleString()} a ${plazoMeses} meses.`,
        icon: React.createElement(CheckCircle, { className: 'w-5 h-5 text-emerald-400' }),
        duration: 5000,
      });
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">
              {isBank
                ? `Simulador de Crédito Agrícola — ${entityName}`
                : `Simulador de Cobertura & Póliza — ${entityName}`}
            </h3>
            <p className="text-xs text-slate-400">{loteNombre}</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-3 py-1 rounded-full">
          {isBank ? `Tasa Pref. ${tasaAnualEfectiva}% TNA` : `Prima Bonificada ${tasaAnualEfectiva}%`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controles de Simulación */}
        <div className="space-y-4">
          {/* Slider Monto */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="monto-range" className="text-slate-400 cursor-pointer">
                {isBank ? 'Monto del Crédito' : 'Suma Asegurada'}
              </label>
              <span className="text-white font-bold font-mono">USD {monto.toLocaleString()}</span>
            </div>
            <input
              id="monto-range"
              type="range"
              min={10000}
              max={300000}
              step={5000}
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>USD 10k</span>
              <span>USD 300k</span>
            </div>
          </div>

          {/* Plazo de Pago */}
          <div>
            <span className="text-xs text-slate-400 block mb-1.5">
              {isBank ? 'Plazo de Financiación' : 'Vigencia de Cobertura'}
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[6, 12, 18, 24].map((meses) => (
                <button
                  key={meses}
                  onClick={() => setPlazoMeses(meses)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    plazoMeses === meses
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {meses} Meses
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen & Cuotas */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-900 text-slate-400">
              <span>{isBank ? 'Cuota Mensual Estimada:' : 'Prima Mensual Estimada:'}</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                USD {cuotaEstimada.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900 text-slate-400">
              <span>{isBank ? 'Intereses Totales:' : 'Costo Total Póliza:'}</span>
              <span className="text-slate-200 font-mono">USD {totalIntereses.toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span>Ahorro por Scoring ({score} pts):</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> -{bonificacionScore}% en TNA
              </span>
            </div>
          </div>

          <button
            onClick={handleSolicitarPreAprobacion}
            disabled={isSubmitting || isRequested}
            className={`w-full font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg ${
              isRequested
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/10'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : isRequested ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isRequested
              ? isBank
                ? 'Pre-Aprobación Solicitada'
                : 'Póliza Solicitada'
              : isBank
              ? `Solicitar Pre-Aprobación (${entityName})`
              : `Cotizar Póliza (${entityName})`}
          </button>
        </div>
      </div>
    </div>
  );
};