// src/app/data/entities.ts

export interface EntityOption {
  id: string;
  name: string;
  type: "bank" | "insurance";
  defaultTasa?: number;
}

export const INITIAL_BANKS: EntityOption[] = [
  { id: "bsj", name: "Banco San Juan (BSJ)", type: "bank", defaultTasa: 14.5 },
  { id: "galicia", name: "Banco Galicia", type: "bank", defaultTasa: 15.0 },
  { id: "nacion", name: "Banco Nación", type: "bank", defaultTasa: 13.8 },
  { id: "macro", name: "Banco Macro", type: "bank", defaultTasa: 14.2 },
];

export const INITIAL_INSURANCES: EntityOption[] = [
  { id: "lasegunda", name: "La Segunda Seguros", type: "insurance" },
  { id: "sancor", name: "Sancor Seguros", type: "insurance" },
  { id: "sancristobal", name: "San Cristóbal Seguros", type: "insurance" },
  { id: "allianz", name: "Allianz", type: "insurance" },
];