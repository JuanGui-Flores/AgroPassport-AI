// src/components/dashboard/LotDashboard.tsx
import React from 'react';
import { Can } from '../common/Can';
import { Sprout } from 'lucide-react';

export function LotDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Panel de Operaciones Agrícolas</h1>
          <p className="text-xs text-slate-400 mt-1">Gestión de lotes, trazabilidad satelital y canje de insumos</p>
        </div>

        {/* El botón de registrar lote lo ve el productor o admin */}
        <Can I="lotes:create">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer">
            + Registrar Nuevo Lote
          </button>
        </Can>
      </div>
      
      {/* Listado de Lotes Agrícolas */}
      <Can I="lotes:read">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Listado de Lotes Agrícolas</h2>
          <div className="text-xs text-slate-400 py-8 text-center border border-dashed border-slate-800 rounded-xl">
            Tabla de lotes y monitoreo NDVI activo...
          </div>
        </div>
      </Can>

      {/* Panel de Validación para Canje de Insumos (Reemplazo del Panel Financiero) */}
      <Can I="lotes:create">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Módulo de Canje de Insumos</h3>
            <p className="text-xs text-slate-400 mt-1">
              Validación de rendimientos estimados y métricas satelitales para la aprobación directa con cooperativas y distribuidores.
            </p>
          </div>
        </div>
      </Can>
    </div>
  );
}