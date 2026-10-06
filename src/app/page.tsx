// src/app/page.tsx
'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowUpRight,
  ShieldCheck,
  History,
  AlertOctagon,
  Sparkles,
  ClipboardList,
  Building2,
  MapPin,
  Plus
} from 'lucide-react';
import { Navbar } from '@/components/navbar/Navbar';
import { MapModule } from '@/components/map/MapModule';
import { PassportCard } from '@/components/passport/PassportCard';
import { TelemetryModule } from '@/components/telemetry/TelemetryModule';
import { IntegrationDashboard } from '@/components/IntegrationDashboard';
import { InsumosSimulator } from '@/components/InsumosSimulator';
import { DigitalSignatureCard } from '@/components/DigitalSignatureCard';
import { Can } from '@/components/security/Can';
import { Lote } from '@/app/data/lotes';
import { EntityOption } from '@/app/data/entities';

interface DbEntity {
  id: string;
  businessName: string;
  cuit: string;
  code?: string;
  type?: 'branch' | 'partner';
}

interface DbLote {
  id: string;
  code: string;
  nombre: string;
  hectareas: number;
  cultivo?: string;
  score: number;
  ndvi: number;
  rindeEst: number;
  latitud?: number;
  longitud?: number;
  entityId: string;
  telemetrias?: Array<{
    id: string;
    humedadSuelo: number;
    temperaturaFoliar: number;
    bateriaNodo: number;
    timestamp: string;
  }>;
}

const generateSecureId = (): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return 1000 + (array[0] % 9000);
};

const subscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
};

export default function Home() {
  const isMounted = useIsMounted();
  const [selectedLoteId, setSelectedLoteId] = useState<string>('');
  
  // Estados iniciales vacíos (sin hardcodeo de respaldo)
  const [entitiesList, setEntitiesList] = useState<EntityOption[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(null);
  const [loadingEntities, setLoadingEntities] = useState<boolean>(true);

  // Lotes dinámicos desde PostgreSQL
  const [lotesList, setLotesList] = useState<Lote[]>([]);
  const [loadingLotes, setLoadingLotes] = useState<boolean>(false);

  // Modales de control
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddEntityModalOpen, setIsAddEntityModalOpen] = useState<boolean>(false);
  const [isAddLoteModalOpen, setIsAddLoteModalOpen] = useState<boolean>(false);

  const [activeVisita, setActiveVisita] = useState<{ lote: string; id: number } | null>(null);
  const [pdfGeneratedLote, setPdfGeneratedLote] = useState<string | null>(null);

  const [compareYear, setCompareYear] = useState<'2025' | '2026'>('2026');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const getLoteEstado = (score: number): string => {
    if (score >= 80) return 'Óptimo';
    if (score >= 70) return 'Atención Requerida';
    return 'Bajo';
  };

  // 🔄 Carga de entidades desde PostgreSQL
  const fetchEntities = async () => {
    try {
      setLoadingEntities(true);
      const response = await fetch('/api/entities');
      if (!response.ok) throw new Error('Error al consultar entidades');
      const dbEntities: DbEntity[] = await response.json();

      if (Array.isArray(dbEntities) && dbEntities.length > 0) {
        const formattedEntities: EntityOption[] = dbEntities.map((ent) => ({
          id: ent.id,
          name: ent.businessName,
          cuit: ent.cuit,
          code: ent.code || 'AP-GEN',
          type: ent.type || 'partner',
          metrics: {
            score: 88.2,
            scoreTrend: '+3.5% vs mes ant.',
            canje: 90,
            canjeTrend: 'Activo',
            alerts: 0,
            alertsStatus: 'Sin alertas críticas'
          },
          recentActivity: [
            {
              id: `act-${ent.id}`,
              text: `Conexión verificada para ${ent.businessName}`,
              time: 'Hace un momento',
              type: 'success'
            }
          ]
        }));

        setEntitiesList(formattedEntities);
        if (!selectedEntity || !formattedEntities.some(e => e.id === selectedEntity.id)) {
          setSelectedEntity(formattedEntities[0]);
        }
      } else {
        setEntitiesList([]);
        setSelectedEntity(null);
      }
    } catch (error) {
      console.warn('Error al cargar entidades:', error);
      setEntitiesList([]);
      setSelectedEntity(null);
    } finally {
      setLoadingEntities(false);
    }
  };

  useEffect(() => {
    void fetchEntities();
  }, []);

  // 🔄 Carga de Lotes desde PostgreSQL al cambiar de Entidad
  useEffect(() => {
    if (!selectedEntity) {
      setLotesList([]);
      setSelectedLoteId('');
      return;
    }

    const fetchLotes = async () => {
      try {
        setLoadingLotes(true);
        const response = await fetch(`/api/lotes?entityId=${selectedEntity.id}`);
        if (!response.ok) throw new Error('Error al obtener lotes');
        const dbLotes: DbLote[] = await response.json();

        if (Array.isArray(dbLotes) && dbLotes.length > 0) {
          const formattedLotes: Lote[] = dbLotes.map((l) => ({
            id: l.code || l.id,
            nombre: l.nombre,
            hectareas: l.hectareas,
            score: l.score,
            ndvi: l.ndvi,
            rindeEst: typeof l.rindeEst === 'number' ? `${l.rindeEst.toFixed(1)} Tn / Ha` : String(l.rindeEst),
            estado: getLoteEstado(l.score),
          }));

          setLotesList(formattedLotes);
          setSelectedLoteId(formattedLotes[0].id);
        } else {
          setLotesList([]);
          setSelectedLoteId('');
        }
      } catch (error) {
        console.warn('Error al obtener lotes de PostgreSQL:', error);
        setLotesList([]);
        setSelectedLoteId('');
      } finally {
        setLoadingLotes(false);
      }
    };

    void fetchLotes();
  }, [selectedEntity]);

  // Manejador para crear nueva Sucursal / Entidad
  const handleCreateEntity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const businessName = formData.get('businessName') as string;
    const cuit = formData.get('cuit') as string;
    const code = formData.get('code') as string;

    try {
      const res = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, cuit, code })
      });

      if (res.ok) {
        setIsAddEntityModalOpen(false);
        await fetchEntities();
      } else {
        alert('Error al registrar la entidad en la base de datos.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Manejador para crear nuevo Lote / Terreno
  const handleCreateLote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEntity) return;

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;
    const nombre = formData.get('nombre') as string;
    const hectareas = formData.get('hectareas') as string;
    const cultivo = formData.get('cultivo') as string;

    try {
      const res = await fetch('/api/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          nombre,
          hectareas: parseFloat(hectareas),
          cultivo,
          score: 88.0,
          ndvi: 0.75,
          rindeEst: 4.2,
          entityId: selectedEntity.id
        })
      });

      if (res.ok) {
        setIsAddLoteModalOpen(false);
        // Refrescar listado de lotes
        const response = await fetch(`/api/lotes?entityId=${selectedEntity.id}`);
        const dbLotes: DbLote[] = await response.json();
        const formattedLotes: Lote[] = dbLotes.map((l) => ({
          id: l.code || l.id,
          nombre: l.nombre,
          hectareas: l.hectareas,
          score: l.score,
          ndvi: l.ndvi,
          rindeEst: typeof l.rindeEst === 'number' ? `${l.rindeEst.toFixed(1)} Tn / Ha` : String(l.rindeEst),
          estado: getLoteEstado(l.score),
        }));
        setLotesList(formattedLotes);
        if (formattedLotes.length > 0) {
          setSelectedLoteId(formattedLotes[formattedLotes.length - 1].id);
        }
      } else {
        alert('Error al registrar el lote.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center text-slate-400 text-xs sm:text-sm">
        Cargando AgroPassport AI...
      </div>
    );
  }

  // 🏛️ ESTADO VACÍO GLOBAL: Si no hay entidades registradas en PostgreSQL
  if (!loadingEntities && entitiesList.length === 0) {
    return (
      <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-[#00E699] flex items-center justify-center mx-auto border border-emerald-500/20">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">No hay entidades registradas</h2>
            <p className="text-xs text-slate-400 mt-1">
              Comienza registrando tu primera sucursal, empresa o entidad aliada conectada a tu base de datos PostgreSQL.
            </p>
          </div>
          <button
            onClick={() => setIsAddEntityModalOpen(true)}
            className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-[#00E699]/10 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Primera Sucursal / Entidad</span>
          </button>
        </div>

        {/* Modal de Creación de Entidad Inicial */}
        {isAddEntityModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Nueva Sucursal / Entidad</h3>
                <button onClick={() => setIsAddEntityModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateEntity} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Razón Social / Nombre</label>
                  <input name="businessName" required placeholder="Ej: Establecimiento Las Marías S.A." className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">CUIT</label>
                  <input name="cuit" required placeholder="Ej: 30-71234567-8" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Código Interno</label>
                  <input name="code" placeholder="Ej: AP-101" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
                </div>
                <button type="submit" className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer mt-2">
                  Guardar Entidad
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const entityMetrics = selectedEntity?.metrics || {
    score: 86.4,
    scoreTrend: '+4.2% vs mes ant.',
    canje: 85,
    canjeTrend: '18 Lotes activos',
    alerts: 12,
    alertsStatus: '2 críticas pendientes'
  };

  const entityActivities = selectedEntity?.recentActivity || [
    { id: '1', text: 'Sincronización satelital y de nodos completada', time: 'Hace 15 min', type: 'success' as const }
  ];

  const anomalies = [
    {
      id: 'ano-1',
      lote: 'Lote Norte - Cuartel 3',
      type: 'Estrés Hídrico',
      detail: 'Variación de NDVI -18% detectada en las últimas 72hs.',
      severity: 'high'
    },
    {
      id: 'ano-2',
      lote: 'Lote Sur - Pivot 1',
      type: 'Anomalía Térmica',
      detail: 'Temperatura foliar +3.2°C por encima de la media histórica.',
      severity: 'medium'
    }
  ].filter((a) => !dismissedAlerts.includes(a.id));

  const loteActivo: Lote = lotesList.find((l) => l.id === selectedLoteId) || lotesList[0];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar 
        selectedEntity={selectedEntity} 
        onSelectEntity={(entity) => setSelectedEntity(entity)} 
      />

      <main className="p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 lg:space-y-8 flex-1 max-w-[1920px] mx-auto w-full">
        
        {/* Encabezado Principal & Botones de Gestión Dinámica */}
        <div className="border-b border-slate-800/80 pb-3 sm:pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
                Evaluación de Riesgo & Scoring Agrícola
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-[#00E699]/10 text-[#00E699] border border-[#00E699]/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> PostgreSQL Activo
              </span>
              {(loadingEntities || loadingLotes) && (
                <span className="text-[10px] text-amber-400 font-mono animate-pulse">
                  (Sincronizando...)
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-0.5">
              Monitoreo satelital y scoring crediticio consolidado para{" "}
              <span className="text-[#00E699] font-semibold">{selectedEntity?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-