// src/components/passport/PassportCard.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { FileDown, Loader2, CheckCircle2, Sprout } from "lucide-react";
import { EntityOption } from "@/app/data/entities";
import { generatePassportPDF } from "@/utils/generatePdf";

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
    return "Óptimo";
  }
  if (ndviValue >= 0.6) {
    return "Moderado";
  }
  return "Bajo";
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
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const entityName = entity?.name || "Cooperativa Agrícola Regional";

  // Evaluación dinámica según el score
  const isHighScore = score >= 80;
  const estadoTexto = isHighScore
    ? "Certificado para Canje"
    : "Revisión Agronómica Requerida";
  const saludNdviTexto = getSaludNdviTexto(ndvi);

  // Manejador de validación / confirmación operativa
  const handleConfirmOperation = () => {
    setIsConfirmed(true);

    toast.success("Operación Validada", {
      description: `Lote ${nombre} verificado exitosamente para canje de insumos con ${entityName}.`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      duration: 5000,
    });
  };

  // Generador dinámico de PDF directo
  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      toast.info("Generando Ficha Técnica...", {
        description: "Maquetando informe ejecutivo de trazabilidad agronómica.",
      });

      await generatePassportPDF({
        loteName: nombre,
        parcela: `ID: ${loteId}`,
        location: "San Juan, Argentina",
        hectareas,
        score,
        ndvi,
        rinde: rindeEst,
        entityName,
      });

      toast.success("PDF Exportado con Éxito", {
        description: `Se descargó la Ficha Técnica para ${nombre}.`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      });
    } catch (err) {
      console.error("Error generando el PDF:", err);
      toast.error("Error al generar el PDF", {
        description:
          "Ocurrió un problema durante la maquetación. Inténtalo de nuevo.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between print:border-none print:shadow-none print:bg-white print:text-black">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider print:border-slate-300 print:text-black print:bg-slate-100">
            ● Verificado Satelital
          </span>
          <span className="text-xs text-slate-500 font-mono print:text-slate-600">
            ID: {loteId}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white leading-snug print:text-black">
          {nombre}
        </h3>
        <p className="text-xs text-slate-400 mb-4 print:text-slate-600">
          San Juan, Argentina • {hectareas} Hectáreas
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between mb-4 print:bg-slate-100 print:border-slate-300">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider print:text-slate-600">
              Passport Score
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-3xl font-black ${isHighScore ? "text-emerald-400" : "text-amber-400"} print:text-black`}
              >
                {score}
              </span>
              <span className="text-slate-600 text-xs font-bold">/100</span>
            </div>
            <span
              className={`text-[11px] font-semibold ${isHighScore ? "text-emerald-400" : "text-amber-400"} print:text-slate-800`}
            >
              {estadoTexto}
            </span>
          </div>
          <div
            className={`w-14 h-14 rounded-full border-4 ${isHighScore ? "border-emerald-500 text-emerald-400" : "border-amber-500 text-amber-400"} border-t-transparent flex items-center justify-center text-[10px] font-bold print:border-slate-800 print:text-black`}
          >
            {score}%
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60 print:border-slate-300">
            <span className="text-slate-400 print:text-slate-600">
              Salud Vegetal (NDVI)
            </span>
            <span className="font-semibold text-slate-200 print:text-black">
              {ndvi} ({saludNdviTexto})
            </span>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60 print:border-slate-300">
            <span className="text-slate-400 print:text-slate-600">
              Rinde Estimado
            </span>
            <span className="font-semibold text-slate-200 print:text-black">
              {rindeEst}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de acción ocultables mediante hideButtons */}
      {!hideButtons && (
        <div className="space-y-2 pt-2 print:hidden">
          <button
            onClick={handleConfirmOperation}
            disabled={isConfirmed}
            className={`w-full font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isConfirmed
                ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default"
                : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-950/50"
            }`}
          >
            <Sprout className="w-4 h-4" />
            {isConfirmed
              ? "Lote Validado para Canje"
              : `Validar Lote (${entityName})`}
          </button>

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
  );
};
