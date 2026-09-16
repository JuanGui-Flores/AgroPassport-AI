'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { KpiHeader } from '../components/dashboard/KpiHeader';
import { MapModule } from '../components/map/MapModule';
import { PassportCard } from '../components/passport/PassportCard';
import { CreditSimulator } from '../components/passport/CreditSimulator';
import { TelemetryModule } from '../components/telemetry/TelemetryModule';
import { LOTES_DATA } from './data/lotes';

export default function Home() {
  const [selectedLoteId, setSelectedLoteId] = useState<string>('ARG-SJ-2026');
  const loteActivo = LOTES_DATA[selectedLoteId] || LOTES_DATA['ARG-SJ-2026'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

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
          />
        </div>

        <CreditSimulator 
          score={loteActivo.score} 
          loteNombre={loteActivo.nombre} 
        />

        <TelemetryModule />
      </main>
    </div>
  );
}