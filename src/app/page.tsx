'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { KpiHeader } from '@/components/dashboard/KpiHeader';
import { MapModule } from '@/components/map/MapModule';
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
            <PassportCard
              loteId={loteActivo.id}
              nombre={loteActivo.nombre}
              hectareas={loteActivo.hectareas}
              score={loteActivo.score}
              ndvi={loteActivo.ndvi}
              rindeEst={loteActivo.rindeEst}
              entity={selectedEntity}
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

        {/* Telemetría */}
        <Can I="producer:manage">
          <div className="transition-all duration-300">
            <TelemetryModule loteNombre={loteActivo.nombre} />
          </div>
        </Can>

        {/* Integration Dashboard */}
        <Can I="audit:view">
          <div className="pt-6 border-t border-slate-800/80 transition-all duration-300">
            <IntegrationDashboard />
          </div>
        </Can>
      </main>
    </div>
  );
}