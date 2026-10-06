// src/components/navbar/Navbar.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Calendar,
  Shield,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { EntitySelector } from "@/components/EntitySelector";
import { EntityOption } from "@/app/data/entities";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/services/security/rbac";
import { Syne } from "next/font/google";

// Inicialización de la fuente fuera del componente
const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
});

interface NavbarProps {
  selectedEntity: EntityOption;
  onSelectEntity: (entity: EntityOption) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedEntity,
  onSelectEntity,
}) => {
  const { user, login } = useAuth();
  const router = useRouter();

  const handleRoleChange = (newRole: Role) => {
    let name = "Productor Agropecuario";
    if (newRole === "ADMIN") name = "Administrador General";

    login({
      id: "1",
      name: name,
      role: newRole,
    });

    router.refresh();
  };

  const getRoleInitials = (role?: Role) => {
    if (role === "ADMIN") return "AD";
    return "PR";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080C14]/90 backdrop-blur-md transition-all">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* LADO IZQUIERDO: Branding & Selector de Entidad */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10 group-hover:border-emerald-400 transition-all shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="hidden min-[420px]:flex flex-col">
              <span
                className={`${syne.className} text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1`}
              >
                AgroPassport{" "}
                <span className="text-emerald-400 font-mono text-xs font-semibold tracking-normal">
                  AI
                </span>
              </span>
            </div>
          </div>

          <span className="h-5 w-px bg-slate-800/80 hidden md:block" />

          <div className="flex items-center min-w-0">
            <EntitySelector
              selectedEntity={selectedEntity}
              onSelectEntity={onSelectEntity}
            />
          </div>
        </div>

        {/* CENTRO: Buscador Global Enterprise */}
        <div className="hidden md:block flex-1 max-w-xs md:max-w-md mx-2">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-400" />
            <input
              type="text"
              placeholder="Buscar por CUIT, Razón Social o ID..."
              className="w-full bg-slate-900/60 hover:bg-slate-900 focus:bg-slate-950 text-xs text-slate-200 placeholder:text-slate-500 pl-10 pr-12 py-2 rounded-xl border border-slate-800/90 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Selector de Rol, Campaña, Notificaciones y Perfil */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Selector de Rol */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 px-2 sm:px-3 py-1.5 rounded-xl text-xs transition relative">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 hidden min-[360px]:block" />
            <select
              value={user?.role || "PRODUCER"}
              onChange={(e) => handleRoleChange(e.target.value as Role)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer text-[11px] sm:text-xs pr-4 appearance-none"
            >
              <option value="PRODUCER" className="bg-slate-950 text-slate-200">
                Productor
              </option>
              <option value="ADMIN" className="bg-slate-950 text-slate-200">
                Admin
              </option>
            </select>
            <ChevronDown className="w-3 h-3 text-emerald-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Campaña */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Campaña 2025/2026</span>
          </div>

          {/* Botón Notificaciones */}
          <button
            aria-label="Notificaciones"
            className="relative p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition hidden sm:block cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#080C14] animate-pulse" />
          </button>

          <span className="h-5 w-px bg-slate-800/80 hidden sm:block" />

          {/* Perfil del Usuario */}
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700/80 group-hover:border-emerald-400/80 flex items-center justify-center font-bold text-emerald-400 text-xs transition-all shrink-0">
              {getRoleInitials(user?.role)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-tight">
                {user?.name || "Productor"}
              </p>
              <p className="text-[10px] text-slate-400">
                Operaciones Agrícolas
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
