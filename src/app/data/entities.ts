// src/app/data/entities.ts

export interface EntityOption {
  id: string;
  name: string;
  cuit?: string;
  code?: string;
  type: "branch" | "partner";
  status?: "active" | "syncing" | "idle";
  metrics?: {
    score: number;
    scoreTrend: string;
    canje: number;
    canjeTrend: string;
    alerts: number;
    alertsStatus: string;
  };
  recentActivity?: Array<{
    id: string;
    text: string;
    time: string;
    type: "success" | "warning" | "info";
  }>;
}

export const INITIAL_BANKS: EntityOption[] = [
  {
    id: "b-1",
    name: "Casa Matriz / Central",
    type: "branch",
    status: "active",
    metrics: {
      score: 86.4,
      scoreTrend: "+4.2% vs mes ant.",
      canje: 85,
      canjeTrend: "18 Lotes activos",
      alerts: 12,
      alertsStatus: "2 críticas pendientes",
    },
    recentActivity: [
      {
        id: "act-1",
        text: "Calibración satelital NDVI completada con éxito",
        time: "Hace 15 min",
        type: "success",
      },
      {
        id: "act-2",
        text: "Sincronización de telemetría IoT - Tractor Pauny 280A",
        time: "Hace 42 min",
        type: "info",
      },
      {
        id: "act-3",
        text: "Alerta térmica detectada en Cosechadora Mainero 3500",
        time: "Hace 2 horas",
        type: "warning",
      },
    ],
  },
  {
    id: "b-2",
    name: "Sucursal Zona Norte",
    type: "branch",
    status: "active",
    metrics: {
      score: 91.2,
      scoreTrend: "+6.8% vs mes ant.",
      canje: 92,
      canjeTrend: "24 Lotes activos",
      alerts: 4,
      alertsStatus: "Sistema estable",
    },
    recentActivity: [
      {
        id: "act-1",
        text: "Actualización de stock de insumos agrícolas",
        time: "Hace 1 hora",
        type: "success",
      },
      {
        id: "act-2",
        text: "Reporte de rendimiento de lote norte generado",
        time: "Hace 3 horas",
        type: "info",
      },
    ],
  },
  {
    id: "b-3",
    name: "Centro de Distribución Sur",
    type: "branch",
    status: "idle",
    metrics: {
      score: 78.5,
      scoreTrend: "-1.5% vs mes ant.",
      canje: 64,
      canjeTrend: "9 Lotes activos",
      alerts: 8,
      alertsStatus: "Requiere atención",
    },
    recentActivity: [
      {
        id: "act-1",
        text: "Revisión de logística de combustible pendiente",
        time: "Hace 4 horas",
        type: "warning",
      },
    ],
  },
];

export const INITIAL_INSURANCES: EntityOption[] = [
  {
    id: "p-1",
    name: "AgroInsumos Cuyo S.A.",
    type: "partner",
    status: "active",
    metrics: {
      score: 94.0,
      scoreTrend: "+8.1% vs alianza",
      canje: 98,
      canjeTrend: "Convenio Activo",
      alerts: 1,
      alertsStatus: "Óptimo",
    },
    recentActivity: [
      {
        id: "act-1",
        text: "Validación cruzada de certificados de canje",
        time: "Hace 30 min",
        type: "success",
      },
    ],
  },
  {
    id: "p-2",
    name: "Cooperativa Agrícola Regional",
    type: "partner",
    status: "active",
    metrics: {
      score: 88.9,
      scoreTrend: "+3.0% vs alianza",
      canje: 80,
      canjeTrend: "Convenio Activo",
      alerts: 3,
      alertsStatus: "Sincronizado",
    },
    recentActivity: [
      {
        id: "act-1",
        text: "Actualización de tasas preferenciales",
        time: "Hace 1 día",
        type: "info",
      },
    ],
  },
];
