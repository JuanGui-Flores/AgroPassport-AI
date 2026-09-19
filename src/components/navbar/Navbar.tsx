// src/components/navbar/Navbar.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Calendar, Shield } from 'lucide-react';
import { EntitySelector } from '@/components/EntitySelector';
import { EntityOption } from '@/app/data/entities';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/services/security/rbac';

interface NavbarProps {
  selectedEntity: EntityOption;
  onSelectEntity: (entity: EntityOption) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ selectedEntity, onSelectEntity }) => {
  const { user, login } = useAuth();
  const router = useRouter();

  const handleRoleChange = (newRole: Role) => {
    let name = 'Productor Agropecuario';
    if (newRole === 'FINANCIAL_ENTITY') name = 'Entidad Financiera (Banco)';
    if (newRole === 'ADMIN') name = 'Administrador General';

    login({
      id: '1',
      name: name,
      role: newRole,
    });

    router.refresh();
  };

  const getRoleInitials = (role?: Role) => {
    if (role === 'ADMIN') return 'AD';
    if (role === 'FINANCIAL_ENTITY') return 'EF';
    return 'PR';
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-2 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden">
      {/* Brand & Selector de Entidad */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs sm:text-sm">
            AP
          </div>
          <span className="font-bold text-white tracking-wide text-xs sm:text-base hidden min-[400px]:inline">
            AgroPassport <span className="text-emerald-400">AI</span>
          </span>
        </div>

        <span className="h-4 w-px bg-slate-800 hidden md:block"></span>

<div className="flex items-center min-w-0 max-w-32.5 min-[380px]:max-w-42.5 sm:max-w-none">          <EntitySelector
            selectedEntity={selectedEntity}
            onSelectEntity={onSelectEntity}
          />
        </div>
      </div>

      {/* Buscador Global (se oculta en pantallas chicas) */}
      <div className="hidden md:block flex-1 max-w-xs md:max-w-md mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por CUIT, Razón Social o ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition"
          />
        </div>
      </div>

      {/* Acciones del Usuario & Selector de Roles */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* SELECTOR DE ROL */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 hidden min-[360px]:block" />
          <select
            value={user?.role || 'PRODUCER'}
            onChange={(e) => handleRoleChange(e.target.value as Role)}
            className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer text-[11px] sm:text-xs"
          >
            <option value="PRODUCER" className="bg-slate-950 text-slate-200">Productor</option>
            <option value="FINANCIAL_ENTITY" className="bg-slate-950 text-slate-200">Banco</option>
            <option value="ADMIN" className="bg-slate-950 text-slate-200">Admin</option>
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Campaña 2025/2026</span>
        </div>

        <button className="relative p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition hidden sm:block">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
        </button>

        {/* Perfil / Avatar (Se oculta el texto en móviles pequeños) */}
        <div className="flex items-center gap-2 sm:pl-2 sm:border-l sm:border-slate-800">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-[10px] sm:text-xs shrink-0">
            {getRoleInitials(user?.role)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.name || 'Analista'}</p>
            <p className="text-[10px] text-slate-500">Riesgo Agropecuario</p>
          </div>
        </div>
      </div>
    </header>
  );
};