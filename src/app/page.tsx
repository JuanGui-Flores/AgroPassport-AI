// src/app/page.tsx
'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { X, FileSpreadsheet } from 'lucide-react';
import { Navbar } from '@/components/navbar/Navbar';
import { KpiHeader } from '@/components/dashboard/KpiHeader';
import { MapModule } from '@/components/map/MapModule';
import { LoteDetailPanel } from '@/components/map/LoteDetailPanel';
import { PassportCard } from '@/components/passport/PassportCard';
import { CreditSimulator } from '@/components/passport/CreditSimulator';
import { TelemetryModule } from '@/components/telemetry/TelemetryModule';
import { IntegrationDashboard } from '@/components/IntegrationDashboard';
import { Can } from '@/components/security/Can';
import { LOTES_DATA, Lote } from '@/app/data/lotes';
import { INITIAL_BANKS, EntityOption } from '@/app/data/entities';

const subscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
};

export default function Home() {
  const isMounted = useIsMounted();
  const [selectedLoteId, setSelectedLoteId] = useState<string>('ARG-SJ-2026');
  const [selectedEntity, setSelectedEntity] = useState<EntityOption>(INITIAL_BANKS[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Mapeo dinámico del lote activo para PassportCard y componentes secundarios
  const loteActivo: Lote = Array.isArray(LOTES_DATA)
    ? LOTES_DATA.find((l) => l.id === selectedLoteId) || LOTES_DATA[0]
    : (LOTES_DATA as Record<string, Lote>)[selectedLoteId] || Object.values(LOTES_DATA)[0];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs sm:text-sm">
        Cargando AgroPassport AI...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Navbar principal */}
      <Navbar 
        selectedEntity={selectedEntity} 
        onSelectEntity={(entity) => setSelectedEntity(entity)} 
      />

      {/* Contenedor adaptativo: max-w-[1920px] para TVs/UltraWide y padding fluido */}
      <main className="p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 lg:space-y-8 flex-1 max-w-[1920px] mx-auto w-full">
        
        {/* Encabezado Principal */}
        <div className="border-b border-slate-800/80 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
              Evaluación de Riesgo & Scoring Agrícola
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-0.5">
              Monitoreo satelital y scoring crediticio consolidado
            </p>
          </div>
        </div>

        {/* KPIs (Conserva la grilla adaptativa 2x2 en mobile, 4x1 en TV/Desktop) */}
        <KpiHeader />

        {/* Módulo Central: Mapa (7-8 col) y Ficha (4-5 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
<div className="lg:col-span-7 xl:col-span-8 w-full overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col min-h-95 sm:min-h-112.5 lg:min-h-130">            <MapModule 
              selectedLoteId={selectedLoteId} 
              onSelectLote={(id) => setSelectedLoteId(id)} 
            />
          </div>
          
          <div className="lg:col-span-5 xl:col-span-4 w-full flex flex-col justify-between">
            <LoteDetailPanel 
              selectedLoteId={selectedLoteId} 
              onExport={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* Simulador de Crédito */}
        <Can I="financial:evaluate">
          <div className="transition-all duration-300">
            <CreditSimulator 
              score={loteActivo.score} 
              loteNombre={loteActivo.nombre}
              entity={selectedEntity} 
            />
          </div>
        </Can>

        {/* Telemetría IoT */}
        <Can I="producer:manage">
          <div className="transition-all duration-300">
            <TelemetryModule 
              loteNombre={loteActivo.nombre} 
            />
          </div>
        </Can>

        {/* Dashboard de Integración / Auditoría */}
        <Can I="audit:view">
          <div className="pt-4 sm:pt-6 border-t border-slate-800/80 transition-all duration-300">
            <IntegrationDashboard />
          </div>
        </Can>
      </main>

      {/* MODAL RESPONSIVE: VISTA PREVIA Y EXPORTACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-md w-full relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10 -mt-1 pt-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
                  Vista Previa del Informe
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PassportCard vista previa */}
            <div className="w-full">
              <PassportCard
                loteId={loteActivo.id}
                nombre={loteActivo.nombre}
                hectareas={loteActivo.hectareas}
                score={loteActivo.score}
                ndvi={loteActivo.ndvi}
                rindeEst={loteActivo.rindeEst}
                entity={selectedEntity}
                hideButtons={true}
              />
            </div>

            <button
              onClick={() => {
                alert(`Generando documento PDF oficial para ${loteActivo.nombre}...`);
                setIsModalOpen(false);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              Confirmar y Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}