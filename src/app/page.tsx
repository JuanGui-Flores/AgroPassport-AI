'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { KpiHeader } from '@/components/dashboard/KpiHeader';
import { MapModule } from '@/components/map/MapModule';
import { PassportCard } from '@/components/passport/PassportCard';
import { CreditSimulator } from '@/components/passport/CreditSimulator';
import { TelemetryModule } from '@/components/telemetry/TelemetryModule';
import { LOTES_DATA, Lote } from '@/app/data/lotes';
import { INITIAL_BANKS, EntityOption } from '@/app/data/entities';

// Hook para evitar descalce de hidratación en Next.js
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

  // Búsqueda segura y fuertemente tipada (sin 'any')
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar principal */}
      <Navbar 
        selectedEntity={selectedEntity} 
        onSelectEntity={(entity) => setSelectedEntity(entity)} 
      />

      <main className="p-6 space-y-6 flex-1 max-w-[1600px] mx-auto w-full">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <div>
            <h1 className="text-lg font-semibold text-white">
              Evaluación de Riesgo & Scoring Agrícola
            </h1>
            <p className="text-xs text-slate-400">
              Monitoreo satelital y scoring crediticio consolidado
            </p>
          </div>
        </div>

        <KpiHeader />

        {/* Grilla balanceada de 12 columnas sin pasar props inválidas a MapModule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <MapModule 
              selectedLoteId={selectedLoteId} 
              onSelectLote={(id) => setSelectedLoteId(id)} 
            />
          </div>
          <div className="lg:col-span-4">
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

        <CreditSimulator 
          score={loteActivo.score} 
          loteNombre={loteActivo.nombre}
          entity={selectedEntity} 
        />

        {/* Telemetría */}
        <TelemetryModule loteNombre={loteActivo.nombre} />
      </main>
    </div>
  );
}