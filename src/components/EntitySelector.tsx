'use client';

import React, { useState, useSyncExternalStore, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Building2, ChevronDown, Plus, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
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

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
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
  
  // Estado para validaciones y notificaciones Toast
  const [errorText, setErrorText] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Auto-ocultar toast a los 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddEntity = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText(null);

    const trimmedName = newName.trim();
    if (!trimmedName) {
      setErrorText('El nombre de la entidad no puede estar vacío.');
      return;
    }

    if (trimmedName.length < 3) {
      setErrorText('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    // Verificar si ya existe en bancos o aseguradoras (case-insensitive)
    const exists = [...banks, ...insurances].some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase() && item.type === newType
    );

    if (exists) {
      setErrorText(`Ya existe un/a ${newType === 'bank' ? 'banco' : 'aseguradora'} con ese nombre.`);
      return;
    }

    const newEntity: EntityOption = {
      id: `custom-${crypto.randomUUID()}`,
      name: trimmedName,
      type: newType,
    };

    if (newType === 'bank') {
      setBanks((prev) => [...prev, newEntity]);
    } else {
      setInsurances((prev) => [...prev, newEntity]);
    }

    onSelectEntity(newEntity);
    setNewName('');
    setErrorText(null);
    setIsAddModalOpen(false);
    setIsOpen(false);

    // Lanzar toast de éxito
    setToast({
      type: 'success',
      message: `¡${trimmedName} agregada y seleccionada con éxito!`,
    });
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
                setErrorText(null);
                setNewName('');
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

      {/* Modal Flotante con Portal */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl shadow-black/90 my-auto animate-in fade-in zoom-in-95 duration-150">
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
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      if (errorText) setErrorText(null);
                    }}
                    placeholder="Ej. Banco Galicia / Sancor Seguros"
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                      errorText
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />
                  {errorText && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-rose-400 text-[11px] animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorText}</span>
                    </div>
                  )}
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
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setErrorText(null);
                    }}
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
          </div>,
          document.body
        )}

      {/* Toast Flotante de Notificación */}
      {toast &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-9999 flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-5 duration-200">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Operación Exitosa</p>
              <p className="text-slate-300">{toast.message}</p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};