'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Building2, ChevronDown, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { EntityOption, INITIAL_BANKS, INITIAL_INSURANCES } from '@/app/data/entities';

// Hook para detectar el montaje sin violar las reglas de React Hooks
const emptySubscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
};

interface EntitySelectorProps {
  selectedEntity: EntityOption;
  onSelectEntity: (entity: EntityOption) => void;
}

export const EntitySelector: React.FC<EntitySelectorProps> = ({
  selectedEntity,
  onSelectEntity,
}) => {
  const isMounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [banks, setBanks] = useState<EntityOption[]>(INITIAL_BANKS);
  const [insurances, setInsurances] = useState<EntityOption[]>(INITIAL_INSURANCES);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'bank' | 'insurance'>('bank');

  const handleAddEntity = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newEntity: EntityOption = {
      id: `custom-${crypto.randomUUID()}`,
      name: newName.trim(),
      type: newType,
    };

    if (newType === 'bank') {
      setBanks((prev) => [...prev, newEntity]);
    } else {
      setInsurances((prev) => [...prev, newEntity]);
    }

    onSelectEntity(newEntity);
    setNewName('');
    setIsAddModalOpen(false);
    setIsOpen(false);
  };

  if (!isMounted) {
    return (
      <div className="bg-slate-900/80 border border-slate-800/80 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400">
        Cargando...
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      {/* Botón Principal con Estilo Moderno y Glow */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800/90 text-slate-100 border border-slate-700/60 hover:border-emerald-500/50 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shadow-lg shadow-black/20 cursor-pointer"
      >
        <div className={`p-1.5 rounded-lg ${selectedEntity.type === 'bank' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
          {selectedEntity.type === 'bank' ? (
            <Building2 className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {selectedEntity.type === 'bank' ? 'Entidad Financiera' : 'Aseguradora'}
          </span>
          <span className="font-semibold text-slate-200 tracking-tight">{selectedEntity.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ml-1 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {/* Menú Desplegable Estilizado */}
      {isOpen && (
        <div className="absolute left-0 mt-2.5 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 shadow-2xl shadow-black/60 z-50 p-2.5 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Sección Bancos */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Building2 className="w-3 h-3" /> Bancos / Crédito
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">{banks.length}</span>
            </div>
            {banks.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  onSelectEntity(b);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                  selectedEntity.id === b.id
                    ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${selectedEntity.id === b.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{b.name}</span>
                </div>
                {selectedEntity.id === b.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800/80 my-1"></div>

          {/* Sección Aseguradoras */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Aseguradoras
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">{insurances.length}</span>
            </div>
            {insurances.map((ins) => (
              <button
                key={ins.id}
                onClick={() => {
                  onSelectEntity(ins);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                  selectedEntity.id === ins.id
                    ? 'bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/30 shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${selectedEntity.id === ins.id ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{ins.name}</span>
                </div>
                {selectedEntity.id === ins.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsAddModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 font-medium transition-all group"
            >
              <div className="p-1 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>Agregar otra entidad...</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Flotante Corregido y Centrado */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl shadow-black/90 my-auto">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Registrar Nueva Entidad</h3>
                <p className="text-[11px] text-slate-400">Integra un nuevo banco o aseguradora al sistema</p>
              </div>
            </div>

            <form onSubmit={handleAddEntity} className="space-y-4">
              <div>
                <label htmlFor="entity-name" className="text-[11px] font-medium text-slate-300 block mb-1.5">
                  Nombre de la Entidad
                </label>
                <input
                  id="entity-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Banco Galicia / Sancor Seguros"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="entity-type" className="text-[11px] font-medium text-slate-300 block mb-1.5">
                  Clasificación de Tipo
                </label>
                <select
                  id="entity-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'bank' | 'insurance')}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="bank">Banco / Entidad Financiera</option>
                  <option value="insurance">Aseguradora</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-linear-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Guardar Entidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};