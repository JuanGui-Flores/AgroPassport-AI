'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { KpiHeader } from '@/components/dashboard/KpiHeader';
import { MapModule } from '@/components/map/MapModule';
import { PassportCard } from '@/components/passport/PassportCard';
import { CreditSimulator } from '@/components/passport/CreditSimulator';
import { TelemetryModule } from '@/components/telemetry/TelemetryModule';
import { LOTES_DATA } from '@/app/data/lotes';
import { INITIAL_BANKS, EntityOption } from '@/app/data/entities';

export default function Home() {
  const [selectedLoteId, setSelectedLoteId] = useState<string>('ARG-SJ-2026');
  
  // Estado para la entidad seleccionada (por defecto Banco San Juan)
  const [selectedEntity, setSelectedEntity] = useState<EntityOption>(INITIAL_BANKS[0]);

  const loteActivo = LOTES_DATA[selectedLoteId] || LOTES_DATA['ARG-SJ-2026'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Pasamos las props requeridas al Navbar */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MapModule 
            selectedLoteId={selectedLoteId} 
            onSelectLote={(id) => setSelectedLoteId(id)} 
          />
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

        <CreditSimulator 
          score={loteActivo.score} 
          loteNombre={loteActivo.nombre}
          entity={selectedEntity} 
        />

        {/* Pasamos el nombre del lote activo a la telemetría */}
        <TelemetryModule loteNombre={loteActivo.nombre} />
      </main>
    </div>
  );
}