// src/components/InsumosSimulator.tsx
"use client";

import React, { useState } from "react";
import { Calculator, Package, CheckCircle2, TrendingDown, RefreshCw, Layers } from "lucide-react";

interface InsumoItem {
  id?: string;
  name?: string;
  type?: string;
  pricePerUnit?: number;
  unit?: string;
  recommendedDose?: number;
}

interface InsumosSimulatorProps {
  initialItems?: InsumoItem[];
  onCalculate?: (result: { itemId: string; totalCost: number; quantity: number }) => void;
}

const DEFAULT_INSUMOS: InsumoItem[] = [
  { id: "1", name: "Glifosato 66%", type: "herbicida", pricePerUnit: 8.5, unit: "L", recommendedDose: 2.5 },
  { id: "2", name: "Urea Granulada", type: "fertilizante", pricePerUnit: 520, unit: "TN", recommendedDose: 0.12 },
  { id: "3", name: "Semilla Maíz Híbrido", type: "semilla", pricePerUnit: 180, unit: "Bolsa", recommendedDose: 0.8 },
  { id: "4", name: "Atrazina 50%", type: "herbicida", pricePerUnit: 12.0, unit: "L", recommendedDose: 3.0 },
];

export const InsumosSimulator: React.FC<InsumosSimulatorProps> = ({ initialItems, onCalculate }) => {
  const safeItems = Array.isArray(initialItems) && initialItems.length > 0 ? initialItems : DEFAULT_INSUMOS;

  const [selectedItemId, setSelectedItemId] = useState<string>(safeItems[0]?.id || "1");
  const [hectareas, setHectareas] = useState<number>(100);

  // Búsqueda del ítem con fallback a objeto vacío seguro
  const selectedItem = safeItems.find((item) => item?.id === selectedItemId) || safeItems[0] || {};

  // Extracción segura sin riesgo de TypeError
  const itemType = (selectedItem?.type || "general").toUpperCase();
  const itemName = selectedItem?.name || "Insumo Seleccionado";
  const pricePerUnit = Number(selectedItem?.pricePerUnit) || 0;
  const unit = selectedItem?.unit || "unidad";
  const recommendedDose = Number(selectedItem?.recommendedDose) || 0;

  const totalQuantity = (hectareas || 0) * recommendedDose;
  const totalCost = totalQuantity * pricePerUnit;

  const handleApplySimulation = () => {
    if (onCalculate && selectedItem?.id) {
      onCalculate({
        itemId: selectedItem.id,
        totalCost,
        quantity: totalQuantity,
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 space-y-6 backdrop-blur-xl shadow-xl">
      {/* Cabecera del simulador */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Calculadora y Estimador de Insumos</h3>
            <p className="text-xs text-slate-400">Simulación de costos operativos y dosis requerida por superficie</p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Simulador Pro
        </span>
      </div>

      {/* Inputs del Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="insumo-select" className="text-[11px] font-medium text-slate-300 block mb-1.5">
            Seleccionar Insumo del Catálogo
          </label>
          <div className="relative">
            <select
              id="insumo-select"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
            >
              {safeItems.map((item) => {
                if (!item) return null;
                const labelType = (item?.type || "general").toUpperCase();
                return (
                  <option key={item?.id || Math.random()} value={item?.id}>
                    {item?.name || "Sin Nombre"} — [{labelType}]
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="hectareas-input" className="text-[11px] font-medium text-slate-300 block mb-1.5">
            Superficie Total (Hectáreas)
          </label>
          <input
            id="hectareas-input"
            type="number"
            min="1"
            value={hectareas}
            onChange={(e) => setHectareas(Math.max(1, Number(e.target.value) || 0))}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            placeholder="Ingrese hectáreas..."
          />
        </div>
      </div>

      {/* Detalles del Insumo Seleccionado */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800/50 pb-2">
          <span className="text-slate-400">Insumo:</span>
          <span className="font-semibold text-slate-200">{itemName}</span>
        </div>
        <div className="flex items-center justify-between text-xs border-b border-slate-800/50 pb-2">
          <span className="text-slate-400">Dosis Sugerida:</span>
          <span className="font-mono text-slate-300">{recommendedDose} {unit}/ha</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Precio Unitario Ref:</span>
          <span className="font-mono text-slate-300">USD {pricePerUnit.toFixed(2)} / {unit}</span>
        </div>
      </div>

      {/* Resumen de cálculo */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block mb-1">Categoría</span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wider font-mono">
            {itemType}
          </span>
        </div>

        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block mb-1">Volumen Total</span>
          <span className="text-xs font-mono font-bold text-slate-200">
            {totalQuantity.toLocaleString("es-AR", { maximumFractionDigits: 2 })} {unit}
          </span>
        </div>

        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block mb-1">Costo Estimado</span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            USD {totalCost.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Acción opcional */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleApplySimulation}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-medium transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Aplicar Simulación
        </button>
      </div>
    </div>
  );
};