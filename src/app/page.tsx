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

  // Mapeo dinámico del lote activo para PassportCard
  const loteActivo: Lote = Array.isArray(LOTES_DATA)
    ? LOTES_DATA.find((l) => l.id === selectedLoteId) || LOTES_DATA[0]
    : (LOTES_DATA as Record<string, Lote>)[selectedLoteId] || Object.values(LOTES_DATA)[0];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Cargando AgroPassport AI...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30">
      {/* Navbar principal */}
      <Navbar 
        selectedEntity={selectedEntity} 
        onSelectEntity={(entity) => setSelectedEntity(entity)} 
      />

      <main className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1 max-w-[1600px] mx-auto w-full">
        {/* Encabezado Responsive Compactado */}
        <div className="border-b border-slate-800/80 pb-3 sm:pb-4">
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
            Evaluación de Riesgo & Scoring Agrícola
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-400 mt-0.5">
            Monitoreo satelital y scoring crediticio consolidado
          </p>
        </div>

        {/* KPIs */}
        <KpiHeader />

        {/* Módulo Central: Mapa y Ficha del Pasaporte */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 w-full overflow-hidden rounded-2xl border border-slate-800/80">
            <MapModule 
              selectedLoteId={selectedLoteId} 
              onSelectLote={(id) => setSelectedLoteId(id)} 
            />
          </div>
          
          <div className="lg:col-span-4 w-full">
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
              score={selectedLoteId === 'ARG-SJ-2026' ? 92 : 74} 
              loteNombre={selectedLoteId === 'ARG-SJ-2026' ? 'Lote Don Juan' : 'Parcela 12'}
              entity={selectedEntity} 
            />
          </div>
        </Can>

        {/* Telemetría */}
        <Can I="producer:manage">
          <div className="transition-all duration-300">
            <TelemetryModule 
              loteNombre={selectedLoteId === 'ARG-SJ-2026' ? 'Lote Don Juan' : 'Parcela 12'} 
            />
          </div>
        </Can>

        {/* Integration Dashboard */}
        <Can I="audit:view">
          <div className="pt-6 border-t border-slate-800/80 transition-all duration-300">
            <IntegrationDashboard />
          </div>
        </Can>
      </main>

      {/* MODAL: VISTA PREVIA Y EXPORTACIÓN DE PASAPORTE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Vista Previa del Informe
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PassportCard como preview pre-descarga */}
            <PassportCard
              loteId={loteActivo.id}
              nombre={loteActivo.nombre}
              hectareas={loteActivo.hectareas}
              score={loteActivo.score}
              ndvi={loteActivo.ndvi}
              rindeEst={loteActivo.rindeEst}
              entity={selectedEntity}
            />

            <button
              onClick={() => {
                alert(`Generando documento PDF oficial para ${loteActivo.nombre}...`);
                setIsModalOpen(false);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              Confirmar y Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}