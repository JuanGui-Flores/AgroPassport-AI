// src/components/EntitySelector.tsx
'use client';

import React, { useState, useSyncExternalStore, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Network, ChevronDown, Plus, Sparkles, AlertCircle, CheckCircle2, X, Store, Globe, Search } from 'lucide-react';
import { EntityOption, INITIAL_BANKS, INITIAL_INSURANCES } from '@/app/data/entities';

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
  const [branches, setBranches] = useState<EntityOption[]>(INITIAL_BANKS);
  const [partners, setPartners] = useState<EntityOption[]>(INITIAL_INSURANCES);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'branch' | 'partner'>('branch');
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const [errorText, setErrorText] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 280),
      });
    }
    setIsOpen(!isOpen);
    setSearchQuery('');
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleClose = () => setIsOpen(false);

  const handleAddEntity = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText(null);

    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length < 3) {
      setErrorText('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    const exists = [...branches, ...partners].some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase() && item.type === newType
    );

    if (exists) {
      setErrorText('Ya existe un registro con este nombre en la categoría.');
      return;
    }

    const newEntity: EntityOption = {
      id: `custom-${crypto.randomUUID()}`,
      name: trimmedName,
      type: newType,
      status: 'active',
    };

    if (newType === 'branch') {
      setBranches((prev) => [...prev, newEntity]);
    } else {
      setPartners((prev) => [...prev, newEntity]);
    }

    onSelectEntity(newEntity);
    setNewName('');
    setIsAddModalOpen(false);
    setIsOpen(false);

    setToast({
      type: 'success',
      message: `¡${trimmedName} vinculado correctamente!`,
    });
  };

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) {
    return (
      <div className="bg-slate-900/85 border border-slate-800/80 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400">
        Cargando espacio...
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left w-full min-w-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="group w-full flex items-center justify-between gap-2 bg-slate-900/90 hover:bg-slate-800/90 text-slate-100 border border-slate-700/60 hover:border-emerald-500/50 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shadow-lg shadow-black/20 cursor-pointer min-w-0"
      >
        <div className={`p-1.5 rounded-lg shrink-0 ${selectedEntity.type === 'branch' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
          {selectedEntity.type === 'branch' ? <Store className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
        </div>
        
        <div className="flex flex-col text-left min-w-0 flex-1 px-0.5">
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider leading-none hidden sm:block">
            {selectedEntity.type === 'branch' ? 'Sucursal Operativa' : 'Aliado Estratégico'}
          </span>
          <span className="font-semibold text-slate-200 tracking-tight truncate leading-tight text-xs">
            {selectedEntity.name}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div className="absolute inset-0 z-50 pointer-events-none">
            <button
              type="button"
              onClick={handleClose}
              className="fixed inset-0 bg-slate-950/40 z-40 pointer-events-auto cursor-default border-none w-full h-full text-left p-0"
              aria-label="Cerrar menú"
            />

            <div 
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
              }}
              className="absolute z-50 pointer-events-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/90 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-emerald-400" /> Selector de Contexto
                  </span>
                  <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar sucursales o aliados..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {filteredBranches.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-0.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Store className="w-3 h-3" /> Sucursales Propias
                    </span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">{filteredBranches.length}</span>
                  </div>
                  {filteredBranches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectEntity(b);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        selectedEntity.id === b.id
                          ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-inner'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Store className={`w-3.5 h-3.5 shrink-0 ${selectedEntity.id === b.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="truncate">{b.name}</span>
                      </div>
                      {selectedEntity.id === b.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {filteredBranches.length > 0 && filteredPartners.length > 0 && (
                <div className="border-t border-slate-800/80 my-1"></div>
              )}

              {filteredPartners.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-0.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Red de Aliados
                    </span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">{filteredPartners.length}</span>
                  </div>
                  {filteredPartners.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectEntity(p);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        selectedEntity.id === p.id
                          ? 'bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/30 shadow-inner'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Globe className={`w-3.5 h-3.5 shrink-0 ${selectedEntity.id === p.id ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span className="truncate">{p.name}</span>
                      </div>
                      {selectedEntity.id === p.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-800/80 pt-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setErrorText(null);
                    setNewName('');
                    setIsAddModalOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 font-medium transition-all group cursor-pointer"
                >
                  <div className="p-1 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Vincular nueva entidad...</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl shadow-black/90 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Vincular Nueva Entidad</h3>
                  <p className="text-[11px] text-slate-400">Agrega un nuevo nodo operativo o socio comercial</p>
                </div>
              </div>

              <form onSubmit={handleAddEntity} className="space-y-4">
                <div>
                  <label htmlFor="new-entity-name" className="text-[11px] font-medium text-slate-300 block mb-1.5">
                    Nombre del Registro
                  </label>
                  <input
                    id="new-entity-name"
                    type="text"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      if (errorText) setErrorText(null);
                    }}
                    placeholder="Ej. Sucursal Este / Distribuidora Global"
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                      errorText
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  {errorText && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-rose-400 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorText}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="new-entity-type" className="text-[11px] font-medium text-slate-300 block mb-1.5">
                    Clasificación
                  </label>
                  <select
                    id="new-entity-type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'branch' | 'partner')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="branch">Sucursal Operativa</option>
                    <option value="partner">Aliado Estratégico</option>
                  </select>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-linear-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    Vincular
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {toast &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-emerald-500/30 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-5 duration-200">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Éxito</p>
              <p className="text-slate-300">{toast.message}</p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};