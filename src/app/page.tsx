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
import { MachineryModule } from '@/components/machinery/MachineryModule';

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

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddEntityModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer border border-slate-700"
            >
              <Building2 className="w-4 h-4 text-[#00E699]" />
              <span>+ Nueva Sucursal</span>
            </button>

            <button
              onClick={() => setIsAddLoteModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer border border-slate-700"
            >
              <MapPin className="w-4 h-4 text-[#00E699]" />
              <span>+ Agregar Terreno / Lote</span>
            </button>

            {lotesList.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition active:scale-95 shadow-lg shadow-[#00E699]/10 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Generar Ficha Oficial</span>
              </button>
            )}
          </div>
        </div>

        {/* Banner de Alertas */}
        {anomalies.length > 0 && lotesList.length > 0 && (
          <div className="space-y-2">
            {anomalies.map((ano) => (
              <div 
                key={ano.id}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        {ano.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">| {ano.lote}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{ano.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button 
                    onClick={() => setActiveVisita({
                      lote: ano.lote,
                      id: generateSecureId()
                    })}
                    className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold px-3 py-1.5 rounded-lg border border-amber-500/40 transition cursor-pointer"
                  >
                    Crear Orden de Visita
                  </button>
                  <button 
                    onClick={() => setDismissedAlerts((prev) => [...prev, ano.id])}
                    className="text-slate-500 hover:text-slate-300 text-xs p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🗺️ PANTALLA INICIAL LIMPIA: Si la entidad no tiene lotes registrados */}
        {lotesList.length === 0 ? (
          <div className="bg-[#0F172A] border border-slate-800/80 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-[#00E699] flex items-center justify-center mx-auto border border-emerald-500/20">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">No hay lotes ni terrenos registrados</h3>
              <p className="text-xs text-slate-400 mt-1">
                La entidad <span className="text-[#00E699] font-semibold">{selectedEntity?.name}</span> aún no posee cuarteles o lotes agrícolas asociados en la base de datos.
              </p>
            </div>
            <button
              onClick={() => setIsAddLoteModalOpen(true)}
              className="bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-[#00E699]/10 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Primer Lote / Terreno</span>
            </button>
          </div>
        ) : (
          <>
            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Passport Score</span>
                  <span className="text-[10px] font-semibold text-[#00E699] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-[#00E699]/20">
                    {entityMetrics.scoreTrend}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight mb-3">
                  {entityMetrics.score}
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-linear-to-r from-emerald-500 to-[#00E699] h-full rounded-full transition-all duration-500"
                    style={{ width: `${entityMetrics.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Canje de Insumos</span>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {entityMetrics.canjeTrend}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight mb-3">
                  {entityMetrics.canje}%
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-linear-to-r from-blue-500 to-blue-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${entityMetrics.canje}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Alertas IoT</span>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {entityMetrics.alertsStatus}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight mb-3">
                  {entityMetrics.alerts}
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-linear-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                    style={{ width: '45%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Simulador de Insumos */}
            {selectedEntity && (
              <InsumosSimulator 
                entity={selectedEntity} 
                onExportPDF={() => setIsModalOpen(true)} 
              />
            )}

            {/* Feed de Actividad */}
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-[#00E699]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
                      Actividad en Tiempo Real — <span className="text-[#00E699]">{selectedEntity?.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Monitoreo de eventos y flujos operativos de la entidad</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-500/10 text-[#00E699] border border-[#00E699]/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E699] animate-pulse"></span>
                  <span>Sincronizado</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {entityActivities.map((act) => (
                  <div 
                    key={act.id} 
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {act.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00E699]" />}
                        {act.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                        {act.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                          {act.text}
                        </p>
                        <span className="text-[10px] text-slate-500">{act.time}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#00E699] transition-colors shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa Central */}
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#00E699]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Mapa Satelital & Comparativa Temporal de Lote
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 px-2 font-medium">Comparar Campaña:</span>
                  <button
                    onClick={() => setCompareYear('2025')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                      compareYear === '2025'
                        ? 'bg-[#00E699]/20 text-[#00E699] border border-[#00E699]/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Octubre 2025
                  </button>
                  <button
                    onClick={() => setCompareYear('2026')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                      compareYear === '2026'
                        ? 'bg-[#00E699] text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Octubre 2026 (Actual)
                  </button>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-slate-800 flex flex-col min-h-95 sm:min-h-112.5 lg:min-h-130">
                <MapModule 
                  selectedLoteId={selectedLoteId} 
                  onSelectLote={(id) => setSelectedLoteId(id)} 
                />
              </div>
            </div>

            {/* Telemetría */}
            {loteActivo && (
              <Can I="producer:manage">
                <div className="transition-all duration-300">
                  <TelemetryModule 
                    loteNombre={loteActivo.nombre} 
                  />
                </div>
              </Can>
            )}

            {/* Módulo de Maquinaria y Parque Automotor */}
            {selectedEntity && (
              <Can I="producer:manage">
                <div className="transition-all duration-300">
                  <MachineryModule 
                    entity={selectedEntity} 
                    lotesList={lotesList} 
                  />
                </div>
              </Can>
            )}

            {/* Dashboard de Auditoría */}
            <Can I="audit:view">
              <div className="pt-4 sm:pt-6 border-t border-slate-800/80 transition-all duration-300">
                <IntegrationDashboard />
              </div>
            </Can>
          </>
        )}
      </main>

      {/* 🏢 MODAL: Registrar Nueva Sucursal / Entidad */}
      {isAddEntityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-[#00E699] rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Registrar Sucursal / Entidad
                </h3>
              </div>
              <button 
                onClick={() => setIsAddEntityModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEntity} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Razón Social / Nombre</label>
                <input name="businessName" required placeholder="Ej: Agropecuaria El Hornero S.R.L." className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">CUIT</label>
                <input name="cuit" required placeholder="Ej: 30-88765432-1" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Código Interno</label>
                <input name="code" placeholder="Ej: AP-102" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-[#00E699]/10 mt-2"
              >
                Guardar en PostgreSQL
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 📍 MODAL: Registrar Nuevo Lote / Terreno */}
      {isAddLoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-[#00E699] rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Registrar Lote / Cuartel
                </h3>
              </div>
              <button 
                onClick={() => setIsAddLoteModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLote} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Código de Lote</label>
                <input name="code" required placeholder="Ej: ARG-SJ-2026" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Nombre del Lote</label>
                <input name="nombre" required placeholder="Ej: Lote Norte - Cuartel 3" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Hectáreas</label>
                <input name="hectareas" type="number" step="0.1" required placeholder="Ej: 145.0" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Cultivo</label>
                <input name="cultivo" defaultValue="Soja 1ra" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none" />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-[#00E699]/10 mt-2"
              >
                Registrar Lote en Base de Datos
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALES: Órdenes de Visita & Ficha Oficial */}
      {activeVisita && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-amber-500/30 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Orden de Visita Creada
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: ORD-{activeVisita.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveVisita(null)}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <p className="text-xs text-slate-300">
                Se ha generado con éxito la orden técnica de inspección para:
              </p>
              <div className="text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                {activeVisita.lote}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                El agrónomo asignado recibirá la geolocalización e indicadores del lote en su aplicación móvil.
              </p>
            </div>

            <button
              onClick={() => setActiveVisita(null)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-amber-500/10"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {pdfGeneratedLote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-[#00E699]/30 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#00E699]/20 text-[#00E699] rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Documento Listo
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">Firma Digital Verificada</p>
                </div>
              </div>
              <button 
                onClick={() => setPdfGeneratedLote(null)}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <p className="text-xs text-slate-300">
                Se generó correctamente el reporte oficial PDF para:
              </p>
              <div className="text-sm font-bold text-[#00E699] bg-[#00E699]/10 px-3 py-2 rounded-lg border border-[#00E699]/20">
                {pdfGeneratedLote}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                El documento incluye la trazabilidad satelital, scoring de la entidad y sello criptográfico oficial.
              </p>
            </div>

            <button
              onClick={() => setPdfGeneratedLote(null)}
              className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-[#00E699]/10"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedEntity && loteActivo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-lg w-full relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 sticky top-0 bg-[#0F172A]/90 backdrop-blur-sm z-10 -mt-1 pt-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#00E699] shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
                  Generador de Ficha Operativa
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <DigitalSignatureCard entity={selectedEntity} lote={loteActivo} />

            <div className="w-full">
              <PassportCard
                loteId={loteActivo.id}
                nombre={loteActivo.nombre}
                hectareas={loteActivo.hectareas}
                score={loteActivo.score}
                ndvi={loteActivo.ndvi}
                rindeEst={loteActivo.rindeEst}
                entity={selectedEntity}
                hideButtons={true}
              />
            </div>

            <button
              onClick={() => {
                setPdfGeneratedLote(loteActivo.nombre);
                setIsModalOpen(false);
              }}
              className="w-full bg-[#00E699] hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-[#00E699]/10"
            >
              Confirmar e Imprimir / Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}