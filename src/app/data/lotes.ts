export interface Lote {
  id: string;
  nombre: string;
  hectareas: number;
  score: number;
  ndvi: number;
  rindeEst: string;
  estado: string;
}

export const LOTES_DATA: Record<string, Lote> = {
  'ARG-SJ-2026': {
    id: 'ARG-SJ-2026',
    nombre: 'Lote Don Juan - Parcela 4',
    hectareas: 120,
    score: 92,
    ndvi: 0.82,
    rindeEst: '4.2 Tn / Ha',
    estado: 'Óptimo',
  },
  'ARG-SJ-2027': {
    id: 'ARG-SJ-2027',
    nombre: 'Parcela 12 - Sector Sur',
    hectareas: 85,
    score: 74,
    ndvi: 0.65,
    rindeEst: '3.1 Tn / Ha',
    estado: 'Atención Requerida',
  },
};