// src/components/machinery/MachineryModule.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Truck, Plus, Wrench, Clock, ShieldAlert, X, Cpu } from "lucide-react";
import { EntityOption } from "@/app/data/entities";
import { Lote } from "@/app/data/lotes";

interface Machine {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  horasUso: number;
  estado: string;
  lote?: { nombre: string } | null;
}

interface MachineryModuleProps {
  entity: EntityOption;
  lotesList: Lote[];
}

export function MachineryModule({ entity, lotesList }: MachineryModuleProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Cargar maquinaria vinculada a la entidad actual
  const fetchMachinery = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/maquinaria?entityId=${entity.id}`);
      if (!res.ok) throw new Error("Error al cargar maquinaria");
      const data = await res.json();
      setMachines(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entity?.id) {
      void fetchMachinery();
    }
  }, [entity]);

  // Manejador para registrar nueva maquinaria
  const handleCreateMachine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      codigo: formData.get("codigo"),
      nombre: formData.get("nombre"),
      tipo: formData.get("tipo"),
      horasUso: Number(formData.get("horasUso")) || 0,
      entityId: entity.id,
      loteId: formData.get("loteId") || null,
    };

    try {
      const res = await fetch("/api/maquinaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchMachinery();
      } else {
        alert("Error al registrar la máquina.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-[#00E699]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
              Parque Automotor & Maquinaria —{" "}
              <span className="text-[#00E699]">{entity.name}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Control de horas, estado operativo y asignación a lotes
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#00E699]/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Maquinaria</span>
        </button>
      </div>

      {/* Listado de Maquinaria */}
      {loading ? (
        <div className="text-center py-6 text-xs text-slate-500 animate-pulse">
          Sincronizando flota...
        </div>
      ) : machines.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl space-y-2">
          <Cpu className="w-7 h-7 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">
            No hay maquinaria registrada para esta entidad
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] text-[#00E699] hover:underline font-semibold cursor-pointer"
          >
            + Agregar primer tractor, cosechadora o drone
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {machines.map((mach) => (
            <div
              key={mach.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#00E699] bg-[#00E699]/10 px-2 py-0.5 rounded border border-[#00E699]/20">
                    {mach.codigo}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">
                    {mach.nombre}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {mach.tipo}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    mach.estado === "Operativo"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {mach.estado}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mach.horasUso} hrs de uso</span>
                </div>
                <div className="font-mono text-slate-300">
                  {mach.lote
                    ? `Lote: ${mach.lote.nombre}`
                    : "Sin lote asignado"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Registrar Maquinaria */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Registrar Maquinaria / Vehículo
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMachine} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  Código Interno / Chasis
                </label>
                <input
                  name="codigo"
                  required
                  placeholder="Ej: TRAC-08R"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  Nombre / Modelo
                </label>
                <input
                  name="nombre"
                  required
                  placeholder="Ej: Tractor John Deere 8R"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  Tipo de Equipo
                </label>
                <select
                  name="tipo"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Cosechadora">Cosechadora</option>
                  <option value="Pulverizadora">Pulverizadora</option>
                  <option value="Drone Agrícola">Drone Agrícola</option>
                  <option value="Camioneta / Logística">
                    Camioneta / Logística
                  </option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  Horas de Uso Acumuladas
                </label>
                <input
                  name="horasUso"
                  type="number"
                  step="0.1"
                  defaultValue="1250"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  Asignar a Lote (Opcional)
                </label>
                <select
                  name="loteId"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                >
                  <option value="">Sin asignar (Base / Sede)</option>
                  {lotesList.map((lote) => (
                    <option key={lote.id} value={lote.id}>
                      {lote.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer mt-2 shadow-lg shadow-[#00E699]/10"
              >
                Guardar en PostgreSQL
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
