'use client';

import React from 'react';
import { Search, Building2, UserCircle, Bell, Calendar } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
      {/* Brand & Contexto */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
            AP
          </div>
          <span className="font-bold text-white tracking-wide text-base">
            AgroPassport <span className="text-emerald-400">AI</span>
          </span>
        </div>

        <span className="hidden md:inline-block h-4 w-[1px] bg-slate-800"></span>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-lg">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Entidad: <strong className="text-slate-200">Banco San Juan (BSJ)</strong></span>
        </div>
      </div>

      {/* Buscador Global por CUIT / Lote */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por CUIT, Razón Social o ID de Lote..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition"
          />
        </div>
      </div>

      {/* Acciones de Cuenta y Campaña */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Campaña 2025/2026</span>
        </div>

        <button className="relative p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <UserCircle className="w-7 h-7 text-slate-400" />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">Analista de Riesgo</p>
            <p className="text-[10px] text-slate-500">Riesgo Agropecuario</p>
          </div>
        </div>
      </div>
    </header>
  );
};