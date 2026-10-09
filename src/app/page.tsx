// src/app/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowUpRight,
  ShieldCheck,
  History,
  ClipboardList,
  Building2,
} from "lucide-react";

import { Navbar } from "@/components/navbar/Navbar";
import { MapModule } from "@/components/map/MapModule";
import { PassportCard } from "@/components/passport/PassportCard";
import { TelemetryModule } from "@/components/telemetry/TelemetryModule";
import { IntegrationDashboard } from "@/components/IntegrationDashboard";
import { InsumosSimulator } from "@/components/InsumosSimulator";
import { DigitalSignatureCard } from "@/components/DigitalSignatureCard";
import { Can } from "@/components/security/Can";
import type { Lote } from "@/app/data/lotes";
import type { EntityOption } from "@/app/data/entities";
import { MachineryModule } from "@/components/machinery/MachineryModule";

interface DbEntity {
  id: string;
  businessName: string;
  cuit: string;
  code?: string;
  type?: "branch" | "partner";
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
    () => false,
  );
};

const DEFAULT_ENTITY: EntityOption = {
  id: "1",
  name: "Establecimiento Las Marías S.A.",
  code: "AP-101",
  type: "branch",
  metrics: {
    score: 88.2,
    scoreTrend: "+3.5% vs mes ant.",
    canje: 90,
    canjeTrend: "Activo",
    alerts: 0,
    alertsStatus: "Sin alertas críticas",
  },
  recentActivity: [
    {
      id: "act-1",
      text: "Conexión satelital y telemetría activas",
      time: "Hace un momento",
      type: "success",
    },
  ],
};

const DEFAULT_LOTES: Lote[] = [
  {
    id: "LOTE-01",
    nombre: "Lote Norte - Cuartel 3",
    hectareas: 145,
    score: 85,
    ndvi: 0.75,
    rindeEst: "4.0 Tn / Ha",
    estado: "Óptimo",
  },
  {
    id: "LOTE-02",
    nombre: "Lote Sur - Pivot 1",
    hectareas: 120,
    score: 82,
    ndvi: 0.71,
    rindeEst: "3.8 Tn / Ha",
    estado: "Óptimo",
  },
];

export default function Home() {
  const isMounted = useIsMounted();
  const [selectedLoteId, setSelectedLoteId] = useState<string>("LOTE-01");

  // Estados iniciales
  const [entitiesList, setEntitiesList] = useState<EntityOption[]>([
    DEFAULT_ENTITY,
  ]);
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(
    DEFAULT_ENTITY,
  );
  const [loadingEntities, setLoadingEntities] = useState<boolean>(false);

  // Lotes dinámicos
  const [lotesList, setLotesList] = useState<Lote[]>(DEFAULT_LOTES);
  const [loadingLotes, setLoadingLotes] = useState<boolean>(false);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditLoteModalOpen, setIsEditLoteModalOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);
  const [isAddEntityModalOpen, setIsAddEntityModalOpen] =
    useState<boolean>(false);

  const [activeVisita, setActiveVisita] = useState<{
    lote: string;
    id: number;
  } | null>(null);

  const [compareYear, setCompareYear] = useState<"2025" | "2026">("2026");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => [...prev, alertId]);
  };

  const getLoteEstado = (score: number): string => {
    if (score >= 80) return "Óptimo";
    if (score >= 70) return "Atención Requerida";
    return "Bajo";
  };

  // --- HANDLER SIMULACIÓN DE INSUMOS ---
  const handleCalculateSimulation = (result: {
    itemId: string;
    totalCost: number;
    quantity: number;
  }) => {
    setSelectedEntity((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recentActivity: [
          {
            id: generateSecureId().toString(),
            text: `Simulación aplicada: Costo estimado USD ${result.totalCost.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
            time: "Hace un momento",
            type: "success",
          },
          ...(prev.recentActivity || []),
        ],
      };
    });
  };

  // 🔄 Carga de Entidades
  const fetchEntities = useCallback(async () => {
    try {
      setLoadingEntities(true);
      const response = await fetch("/api/entities");
      if (!response.ok) throw new Error("Error al consultar entidades");
      const dbEntities: DbEntity[] = await response.json();

      if (Array.isArray(dbEntities) && dbEntities.length > 0) {
        const formattedEntities: EntityOption[] = dbEntities.map((ent) => ({
          id: ent?.id,
          name: ent?.businessName || "Sin Nombre",
          code: ent?.code || "AP-GEN",
          type:
            ent?.type && (ent.type === "branch" || ent.type === "partner")
              ? ent.type
              : "partner",
          metrics: {
            score: 88.2,
            scoreTrend: "+3.5% vs mes ant.",
            canje: 90,
            canjeTrend: "Activo",
            alerts: 0,
            alertsStatus: "Sin alertas críticas",
          },
          recentActivity: [
            {
              id: `act-${ent?.id}`,
              text: `Conexión verificada para ${ent?.businessName || "Entidad"}`,
              time: "Hace un momento",
              type: "success",
            },
          ],
        }));

        setEntitiesList(formattedEntities);
        setSelectedEntity(formattedEntities[0]);
      }
    } catch (error) {
      console.warn(
        "Servidor sin respuesta de BD, manteniendo fallback local:",
        error,
      );
    } finally {
      setLoadingEntities(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const load = async () => {
      if (isSubscribed) {
        await fetchEntities();
      }
    };

    void load();

    return () => {
      isSubscribed = false;
    };
  }, [fetchEntities]);

  // 🔄 Carga de Lotes por Entidad
  useEffect(() => {
    const entityId = selectedEntity?.id;
    if (!entityId) return;

    let isSubscribed = true;

    const fetchLotes = async () => {
      try {
        setLoadingLotes(true);
        const response = await fetch(`/api/lotes?entityId=${entityId}`);
        if (!response.ok) throw new Error("Error al obtener lotes");
        const dbLotes: DbLote[] = await response.json();

        if (isSubscribed && Array.isArray(dbLotes) && dbLotes.length > 0) {
          const formattedLotes: Lote[] = dbLotes.map((l) => ({
            id: l?.code || l?.id,
            nombre: l?.nombre || "Lote sin nombre",
            hectareas: l?.hectareas || 0,
            score: l?.score || 0,
            ndvi: l?.ndvi || 0,
            rindeEst:
              typeof l?.rindeEst === "number"
                ? `${l.rindeEst.toFixed(1)} Tn / Ha`
                : String(l?.rindeEst || "0"),
            estado: getLoteEstado(l?.score || 0),
          }));

          setLotesList(formattedLotes);
          setSelectedLoteId(formattedLotes[0]?.id || "");
        }
      } catch (error) {
        if (isSubscribed) {
          console.warn("Error al obtener lotes, usando lote demo:", error);
        }
      } finally {
        if (isSubscribed) {
          setLoadingLotes(false);
        }
      }
    };

    void fetchLotes();

    return () => {
      isSubscribed = false;
    };
  }, [selectedEntity]);

  // 🟢 1. CREAR ENTIDAD
  // 🟢 CREAR ENTIDAD
  const handleCreateEntity = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const businessName =
      (formData.get("businessName") as string) || "Nueva Entidad Demo";
    const code = (formData.get("code") as string) || "AP-NEW";
    const type = (formData.get("type") as "branch" | "partner") || "branch"; // 👈 Capturar el tipo del formulario

    const newEntity: EntityOption = {
      id: `ent-${Date.now()}`,
      name: businessName,
      code,
      type, // 👈 Asignar el tipo dinámico ('branch' o 'partner')
      metrics: {
        score: 85.0,
        scoreTrend: "+1.0%",
        canje: 80,
        canjeTrend: "Activo",
        alerts: 0,
        alertsStatus: "Sin alertas",
      },
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          text: `Entidad ${businessName} registrada correctamente`,
          time: "Hace un momento",
          type: "success",
        },
      ],
    };

    try {
      await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, code, type }),
      });
    } catch (err) {
      console.warn("Guardado local por falta de BD:", err);
    }

    setEntitiesList((prev) => [...prev, newEntity]);
    setSelectedEntity(newEntity);
    setIsAddEntityModalOpen(false);
  };

  // 🟢 HANDLER DE ACTUALIZACIÓN DE LOTE
  const handleUpdateLote = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLote) return;

    const formData = new FormData(e.currentTarget);
    const nombre = (formData.get("nombre") as string) || editingLote.nombre;
    const hectareas =
      Number(formData.get("hectareas")) || editingLote.hectareas;

    setLotesList((prev) =>
      prev.map((item) =>
        item.id === editingLote.id
          ? {
              ...item,
              nombre,
              hectareas,
            }
          : item,
      ),
    );

    setIsEditLoteModalOpen(false);
    setEditingLote(null);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center text-slate-400 text-xs sm:text-sm">
        Cargando AgroPassport AI...
      </div>
    );
  }

  const entityMetrics = selectedEntity?.metrics || {
    score: 86.4,
    scoreTrend: "+4.2% vs mes ant.",
    canje: 85,
    canjeTrend: "18 Lotes activos",
    alerts: 12,
    alertsStatus: "2 críticas pendientes",
  };

  const entityActivities = selectedEntity?.recentActivity || [
    {
      id: "1",
      text: "Sincronización satelital y de nodos completada",
      time: "Hace 15 min",
      type: "success" as const,
    },
  ];

  const anomalies = [
    {
      id: "ano-1",
      lote: "Lote Norte - Cuartel 3",
      type: "Estrés Hídrico",
      detail: "Variación de NDVI -18% detectada en las últimas 72hs.",
      severity: "high",
    },
    {
      id: "ano-2",
      lote: "Lote Sur - Pivot 1",
      type: "Anomalía Térmica",
      detail: "Temperatura foliar +3.2°C por encima de la media histórica.",
      severity: "medium",
    },
  ].filter((a) => !dismissedAlerts.includes(a.id));

  const loteActivo: Lote =
    lotesList.find((l) => l?.id === selectedLoteId) || lotesList[0];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar
        selectedEntity={selectedEntity as EntityOption}
        onSelectEntity={(entity) => setSelectedEntity(entity)}
        entities={entitiesList} // 👈 Pasa la lista completa para que se actualice el desplegable
        onAddEntity={() => setIsAddEntityModalOpen(true)}
      />

      <main className="p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 lg:space-y-8 flex-1 max-w-[1920px] mx-auto w-full">
        <div className="border-b border-slate-800/80 pb-28 sm:pb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
                Evaluación de Riesgo & Scoring Agrícola
              </h1>
              {(loadingEntities || loadingLotes) && (
                <span className="text-[10px] text-amber-400 font-mono animate-pulse">
                  (Sincronizando...)
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-0.5">
              Monitoreo satelital y scoring crediticio consolidado para{" "}
              <span className="text-[#00E699] font-semibold">
                {selectedEntity?.name}
              </span>{" "}
              ({entitiesList.length}{" "}
              {entitiesList.length === 1
                ? "entidad registrada"
                : "entidades registradas"}
              )
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
            {/* Botones secundarios en cuadrícula de 2 columnas en mobile */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsAddEntityModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700 w-full"
              >
                <Building2 className="w-3.5 h-3.5 text-[#00E699] shrink-0" />
                <span className="truncate">+ Nueva Sucursal</span>
              </button>
            </div>

            {/* Botón de Ficha Oficial a ancho completo en mobile */}
            {lotesList.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-[#00E699]/10 cursor-pointer w-full sm:w-auto"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Generar Ficha Oficial</span>
              </button>
            )}
          </div>
        </div>

        {anomalies.length > 0 && lotesList.length > 0 && (
          <div className="space-y-3 w-full mb-6">
            {anomalies
              ?.filter((ano) => !dismissedAlerts.includes(ano.id || ano.lote))
              .map((ano) => (
                <div
                  key={ano.id || ano.lote}
                  className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full"
                >
                  {/* Sección de Icono + Texto */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-amber-400 flex flex-wrap items-center gap-1">
                        {ano.type || "ESTRÉS HÍDRICO"}{" "}
                        <span className="text-slate-400 font-normal">
                          | {ano.lote}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {ano.detail ||
                          "Variación detectada en las últimas 72hs."}
                      </p>
                    </div>
                  </div>

                  {/* Contenedor de Botón de Acción + Descartar */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t border-amber-500/10 sm:border-t-0 shrink-0">
                    <button
                      onClick={() =>
                        setActiveVisita({
                          lote: ano.lote,
                          id: generateSecureId(),
                        })
                      }
                      className="w-full sm:w-auto text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold px-3 py-2 rounded-xl border border-amber-500/40 transition cursor-pointer text-center"
                    >
                      Crear Orden de Visita
                    </button>
                    <button
                      onClick={() => handleDismissAlert(ano.id || ano.lote)}
                      aria-label="Descartar alerta"
                      className="text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer shrink-0 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Passport Score
              </span>
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
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Canje de Insumos
              </span>
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
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Alertas IoT
              </span>
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
                style={{ width: "45%" }}
              ></div>
            </div>
          </div>
        </div>

        {selectedEntity && (
          <InsumosSimulator
            entity={selectedEntity}
            onExportPDF={() => setIsModalOpen(true)}
            onCalculate={handleCalculateSimulation}
          />
        )}

        <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-[#00E699]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
                  Actividad en Tiempo Real —{" "}
                  <span className="text-[#00E699]">{selectedEntity?.name}</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Monitoreo de eventos y flujos operativos de la entidad
                </p>
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
                    {act.type === "success" && (
                      <CheckCircle2 className="w-4 h-4 text-[#00E699]" />
                    )}
                    {act.type === "warning" && (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    {act.type === "info" && (
                      <Info className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                      {act.text}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {act.time}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#00E699] transition-colors shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#00E699]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Mapa Satelital & Comparativa Temporal de Lote
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 px-2 font-medium">
                Comparar Campaña:
              </span>
              <button
                onClick={() => setCompareYear("2025")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  compareYear === "2025"
                    ? "bg-[#00E699]/20 text-[#00E699] border border-[#00E699]/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Octubre 2025
              </button>
              <button
                onClick={() => setCompareYear("2026")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  compareYear === "2026"
                    ? "bg-[#00E699] text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Octubre 2026 (Actual)
              </button>
            </div>
          </div>
          {/* Pill Informativo & Botonera Dinámica de Lotes */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            {/* Pill del Lote Seleccionado */}
            {(() => {
              const currentLote =
                lotesList.find((l) => l.id === selectedLoteId) || lotesList[0];
              return (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#00E699] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#00E699] animate-pulse" />
                  <span>
                    {currentLote?.nombre || "Lote Seleccionado"} (
                    {currentLote?.hectareas || 0} Ha)
                  </span>
                </div>
              );
            })()}

            {/* Botonera Dinámica con scroll horizontal suave */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
              {lotesList.map((lote) => {
                const isSelected = selectedLoteId === lote.id;
                return (
                  <button
                    key={lote.id}
                    onClick={() => setSelectedLoteId(lote.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      isSelected
                        ? "bg-slate-800 text-[#00E699] border border-[#00E699]/40 font-bold shadow-sm"
                        : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {lote.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-slate-800 flex flex-col min-h-95 sm:min-h-112.5 lg:min-h-130">
            <MapModule
              selectedLoteId={selectedLoteId}
              onSelectLote={(id) => setSelectedLoteId(id)}
              lotesList={lotesList}
              onAddLote={() => setIsModalOpen(true)}
              onEditLote={(lote) => {
                setEditingLote(lote as Lote);
                setIsEditLoteModalOpen(true);
              }}
            />
          </div>
        </div>

        {loteActivo && (
          <Can I="producer:manage">
            <div className="transition-all duration-300">
              <TelemetryModule loteNombre={loteActivo.nombre} />
            </div>
          </Can>
        )}

        {selectedEntity && (
          <Can I="producer:manage">
            <div className="transition-all duration-300">
              <MachineryModule entity={selectedEntity} lotesList={lotesList} />
            </div>
          </Can>
        )}

        <Can I="audit:view">
          <div className="pt-4 sm:pt-6 border-t border-slate-800/80 transition-all duration-300">
            <IntegrationDashboard />
          </div>
        </Can>
      </main>

      {/* MODAL: Registrar Entidad */}
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
                <label
                  htmlFor="modalBusinessName"
                  className="text-[11px] text-slate-400 font-medium"
                >
                  Razón Social / Nombre
                </label>
                <input
                  id="modalBusinessName"
                  name="businessName"
                  required
                  placeholder="Ej: Agropecuaria El Hornero S.R.L."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modalCuit"
                  className="text-[11px] text-slate-400 font-medium"
                >
                  CUIT
                </label>
                <input
                  id="modalCuit"
                  name="cuit"
                  required
                  placeholder="Ej: 30-88765432-1"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modalCode"
                  className="text-[11px] text-slate-400 font-medium"
                >
                  Código Interno
                </label>
                <input
                  id="modalCode"
                  name="code"
                  placeholder="Ej: AP-102"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="modalType"
                  className="text-[11px] text-slate-400 font-medium"
                >
                  Tipo de Entidad
                </label>
                <select
                  id="modalType"
                  name="type"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E699] outline-none"
                >
                  <option value="branch">Sucursal Propia</option>
                  <option value="partner">Red de Aliados / Productor</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#00E699] hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer mt-2"
              >
                Guardar Entidad
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR LOTE */}
      {isEditLoteModalOpen && editingLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Editar Terreno / Lote
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditLoteModalOpen(false);
                  setEditingLote(null);
                }}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateLote} className="space-y-4">
              <div>
                <label
                  htmlFor="edit-lote-nombre"
                  className="block text-xs font-medium text-slate-400 mb-1"
                >
                  Nombre del Lote
                </label>
                <input
                  id="edit-lote-nombre"
                  type="text"
                  name="nombre"
                  defaultValue={editingLote.nombre}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#00E699]"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-lote-hectareas"
                  className="block text-xs font-medium text-slate-400 mb-1"
                >
                  Superficie (Hectáreas)
                </label>
                <input
                  id="edit-lote-hectareas"
                  type="number"
                  name="hectareas"
                  defaultValue={editingLote.hectareas}
                  required
                  min="1"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#00E699]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditLoteModalOpen(false);
                    setEditingLote(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00E699] text-slate-950 hover:bg-[#00E699]/90 transition cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ficha Oficial & Firma Digital */}
      {isModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 max-w-3xl w-full relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-500/20 text-[#00E699] rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Ficha Oficial AgroPassport
                  </h3>
                  <p className="text-xs text-slate-400">
                    Certificación respaldada e integrada con PostgreSQL
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 pt-2">
              <PassportCard entity={selectedEntity} />
              <DigitalSignatureCard entity={selectedEntity} lote={loteActivo} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Orden de Visita */}
      {activeVisita && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Orden de Visita Generada
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Se ha registrado la inspección técnica para{" "}
                <span className="text-amber-300 font-semibold">
                  {activeVisita.lote}.
                </span>
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">ID Orden:</span>
                <span className="font-mono text-amber-400 font-bold">
                  #{activeVisita.id}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Estado:</span>
                <span className="text-emerald-400 font-semibold">
                  Pendiente de campo
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveVisita(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer border border-slate-700"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
