// src/app/data/entities.ts

export interface EntityOption {
  id: string;
  name: string;
  type: "branch" | "partner"; // Sucursal propia vs Aliado estratégico
  status?: "active" | "syncing" | "idle";
}

export const INITIAL_BANKS: EntityOption[] = [
  { id: "b-1", name: "Casa Matriz / Central", type: "branch", status: "active" },
  { id: "b-2", name: "Sucursal Zona Norte", type: "branch", status: "active" },
  { id: "b-3", name: "Centro de Distribución Sur", type: "branch", status: "idle" },
];

export const INITIAL_INSURANCES: EntityOption[] = [
  { id: "p-1", name: "AgroInsumos Cuyo S.A.", type: "partner", status: "active" },
  { id: "p-2", name: "Cooperativa Agrícola Regional", type: "partner", status: "active" },
];