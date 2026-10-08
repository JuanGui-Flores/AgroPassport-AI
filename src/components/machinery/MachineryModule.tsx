'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  X, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Fuel
} from 'lucide-react';
import { EntityOption } from '@/app/data/entities';
import { Lote } from '@/app/data/lotes';

export interface Machine {
  id: string;
  code: string;
  nombre: string;
  tipo: string;
  estado: string;
  horasUso: number;
  combustiblePct: number;
  alertasCount: number;
  loteAsignadoId?: string;
  entityId: string;
}

interface MachineryModuleProps {
  readonly entity?: EntityOption;
  readonly lotesList?: Lote[];
}

const DEFAULT_MACHINERY: Machine[] = [
  {
    id: 'mac-1',
    code: 'TRAC-01',
    nombre: 'Tractor John Deere 7230R',
    tipo: 'Tractor',
    estado: 'Operativo',
    horasUso: 1240,
    combustiblePct: 84,
    alertasCount: 0,
    entityId: '1'
  },
  {
    id: 'mac-2',
    code: 'COS-01',
    nombre: 'Cosechadora Case IH Axial-Flow',
    tipo: 'Cosechadora',
    estado: 'Mantenimiento',
    horasUso: 890,
    combustiblePct: 42,
    alertasCount: 1,
    entityId: '1'
  }
];

export function MachineryModule({ entity, lotesList = [] }: MachineryModuleProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

 const entityId = entity?.id;

  const fetchMachinery = useCallback(async () => {
    if (!entityId) {
      setMachines([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/maquinaria?entityId=${entityId}`);
      if (!res.ok) throw new Error('Error al obtener maquinaria');
      const data: Machine[] = await res.json();
      setMachines(Array.isArray(data) && data.length > 0 ? data : DEFAULT_MACHINERY);
    } catch {
      console.warn('Cargando maquinas demo por defecto');
      setMachines(DEFAULT_MACHINERY);
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      if (isSubscribed) {
        await fetchMachinery();
      }
    };

    void loadData();

    return () => {
      isSubscribed = false;
    };
  }, [fetchMachinery]);

  const handleCreateMachine = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      entityId: entity?.id || '1',
      code: (formData.get('code') as string) || `MAC-${Date.now().toString().slice(-4)}`,
      nombre: (formData.get('nombre') as string) || 'Nueva Máquina',
      tipo: (formData.get('tipo') as string) || 'Tractor',
      estado: 'Operativo',
      horasUso: Number(formData.get('horasUso')) || 0,
      combustiblePct: Number(formData.get('combustiblePct')) || 100,
      alertasCount: 0,
      loteId: (formData.get('loteId') as string) || null,
    };

    try {
      const res = await fetch('/api/maquinaria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchMachinery();
      } else {
        console.warn('API no disponible, guardando localmente');
        const newMachine: Machine = {
          id: `mac-${Date.now()}`,
          code: payload.code,
          nombre: payload.nombre,
          tipo: payload.tipo,
          estado: payload.estado,
          horasUso: payload.horasUso,
          combustiblePct: payload.combustiblePct,
          alertasCount: payload.alertasCount,
          entityId: payload.entityId,
          loteAsignadoId: payload.loteId || undefined,
        };
        setMachines((prev) => [...prev, newMachine]);
        setIsModalOpen(false);
      }
    } catch {
      setIsModalOpen(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
          Cargando flota de maquinaria...
        </div>
      );
    }

    if (machines.length === 0) {
      return (
        <div className="py-8 text-center text-xs text-slate-500">
          No hay maquinarias registradas para esta entidad.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {machines.map((machine) => (
          <div 
            key={machine.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#00E699] bg-[#00E699]/10 px-2 py-0.5 rounded border border-[#00E699]/20 font-bold">
                  {machine.code}
                </span>
                <h4 className="text-xs font-bold text-white mt-1.5">{machine.nombre}</h4>
                <p className="text-[10px] text-slate-400">{machine.tipo}</p>
              </div>

              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                machine.estado === 'Operativo' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {machine.estado === 'Operativo' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {machine.estado}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{machine.horasUso} hs uso</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Fuel className="w-3.5 h-3.5 text-slate-500" />
                <span>{machine.combustiblePct}% comb.</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-[#00E699]">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
              Monitoreo de Maquinaria y Telemetría Pesada
            </h3>
            <p className="text-[11px] text-slate-400">Flota asignada a {entity?.name || 'Entidad'}</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#00E699]" />
          <span>Agregar Máquina</span>
        </button>
      </div>

      {renderContent()}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#00E699]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Registrar Maquinaria
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMachine} className="space-y-3">
              <div>
                <label htmlFor="machineryCode" className="text-[11px] text-slate-400 font-medium">Código Interno</label>
                <input 
                  id="machineryCode"
                  name="code" 
                  required 
                  placeholder="Ej: TRAC-02" 
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" 
                />
              </div>

              <div>
                <label htmlFor="machineryNombre" className="text-[11px] text-slate-400 font-medium">Nombre / Modelo</label>
                <input 
                  id="machineryNombre"
                  name="nombre" 
                  required 
                  placeholder="Ej: John Deere 7230R" 
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" 
                />
              </div>

              <div>
                <label htmlFor="machineryTipo" className="text-[11px] text-slate-400 font-medium">Tipo de Equipo</label>
                <select 
                  id="machineryTipo"
                  name="tipo" 
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Cosechadora">Cosechadora</option>
                  <option value="Pulverizadora">Pulverizadora</option>
                  <option value="Sembradora">Sembradora</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="machineryHorasUso" className="text-[11px] text-slate-400 font-medium">Horas de Uso</label>
                  <input 
                    id="machineryHorasUso"
                    name="horasUso" 
                    type="number" 
                    placeholder="Ej: 1200" 
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" 
                  />
                </div>
                <div>
                  <label htmlFor="machineryCombustible" className="text-[11px] text-slate-400 font-medium">% Combustible</label>
                  <input 
                    id="machineryCombustible"
                    name="combustiblePct" 
                    type="number" 
                    max="100" 
                    placeholder="Ej: 85" 
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="machineryLoteId" className="text-[11px] text-slate-400 font-medium">Asignar a Lote (Opcional)</label>
                <select 
                  id="machineryLoteId"
                  name="loteId" 
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                >
                  <option value="">Sin Lote Asignado</option>
                  {lotesList.map((lote) => (
                    <option key={lote.id} value={lote.id}>
                      {lote.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer mt-2"
              >
                Guardar Máquina
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}