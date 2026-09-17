'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Building2, ChevronDown, Plus, ShieldCheck } from 'lucide-react';
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
      <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400">
        Cargando...
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      {/* Botón Principal del Selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800/80 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
      >
        {selectedEntity.type === 'bank' ? (
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
        )}
        <span>{selectedEntity.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Menú Desplegable Completo de Bancos y Aseguradoras */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-100">
          <div>
            <p className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Bancos
            </p>
            {banks.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  onSelectEntity(b);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition ${
                  selectedEntity.id === b.id
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{b.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-1">
            <p className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Aseguradoras
            </p>
            {insurances.map((ins) => (
              <button
                key={ins.id}
                onClick={() => {
                  onSelectEntity(ins);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition ${
                  selectedEntity.id === ins.id
                    ? 'bg-blue-500/10 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{ins.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsAddModalOpen(true);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1.5 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar otra entidad...
            </button>
          </div>
        </div>
      )}

      {/* Modal flotante para alta de nueva entidad */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Agregar Entidad</h3>
            <form onSubmit={handleAddEntity} className="space-y-3">
              <div>
                <label htmlFor="entity-name" className="text-[11px] text-slate-400 block mb-1">
                  Nombre
                </label>
                <input
                  id="entity-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Banco Galicia / Sancor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="entity-type" className="text-[11px] text-slate-400 block mb-1">
                  Tipo
                </label>
                <select
                  id="entity-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'bank' | 'insurance')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="bank">Banco / Entidad Financiera</option>
                  <option value="insurance">Aseguradora</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 rounded-xl transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};