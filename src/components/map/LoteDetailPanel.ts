// src/components/map/LoteDetailPanel.tsx
'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface LoteDetailPanelProps {
  selectedLoteId: string;
  onExport?: () => void;
}

interface LoteData {
  id: string;
  name: string;
  parcela: string;
  ubicacion: string;
  hectareas: number;
  score: number;
  estado: string;
  ndvi: string;
  saludEstado: string;
  rindeEstimado: string;
  bancoSugerido: string;
}

const LOTES_DATA: Record<string, LoteData> = {
  'ARG-SJ-2026': {
    id: 'ARG-SJ-2026',
    name: 'Lote Don Juan',
    parcela: 'Parcela 4',
    ubicacion: 'San Juan, Argentina',
    hectareas: 120,
    score: 92,
    estado: 'Apto Crédito & Seguro',
    ndvi: '0.82',
    saludEstado: 'Óptimo',
    rindeEstimado: '4.2 Tn / Ha',
    bancoSugerido: 'Banco San Juan (BSJ)',
  },
  'ARG-SJ-2027': {
    id: 'ARG-SJ-2027',
    name: 'Parcela 12',
    parcela: 'Sector Sur',
    ubicacion: 'San Juan, Argentina',
    hectareas: 85,
    score: 74,
    estado: 'Requiere Revisión Hídrica',
    ndvi: '0.65',
    saludEstado: 'Atención Requerida',
    rindeEstimado: '3.1 Tn / Ha',
    bancoSugerido: 'Banco Nación (BNA)',
  },
};

export const LoteDetailPanel: React.FC<LoteDetailPanelProps> = ({ selectedLoteId, onExport }) => {
  const lote = LOTES_DATA[selectedLoteId] || LOTES_DATA['ARG-SJ-2026'];

  return React.createElement(
    'div',
    { className: 'bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between h-full shadow-xl' },
    React.createElement(
      'div',
      { className: 'space-y-6' },
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-2' },
          React.createElement(
            'span',
            { className: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
            React.createElement(CheckCircle2, { className: 'w-3.5 h-3.5' }),
            ' VERIFICADO'
          ),
          React.createElement('span', { className: 'text-xs font-mono text-slate-500' }, 'ID: ', lote.id)
        ),
        React.createElement(
          'h2',
          { className: 'text-xl font-bold text-white tracking-tight' },
          lote.name,
          ' ',
          React.createElement('span', { className: 'text-slate-400 font-normal' }, '- ', lote.parcela)
        ),
        React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, lote.ubicacion, ' • ', lote.hectareas, ' Hectáreas')
      ),
      React.createElement(
        'div',
        { className: 'bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden' },
        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('p', { className: 'text-[10px] uppercase font-bold tracking-wider text-slate-400' }, 'PASSPORT SCORE'),
          React.createElement(
            'div',
            { className: 'flex items-baseline gap-1' },
            React.createElement('span', { className: 'text-3xl font-extrabold text-white' }, lote.score),
            React.createElement('span', { className: 'text-xs text-slate-500 font-medium' }, '/100')
          ),
          React.createElement(
            'p',
            { className: `text-xs font-medium ${lote.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}` },
            lote.estado
          )
        ),
        React.createElement(
          'div',
          { className: 'relative w-14 h-14 flex items-center justify-center' },
          React.createElement(
            'svg',
            { className: 'w-full h-full transform -rotate-90', viewBox: '0 0 36 36' },
            React.createElement('path', {
              className: 'text-slate-800',
              strokeWidth: '3',
              stroke: 'currentColor',
              fill: 'none',
              d: 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831',
            }),
            React.createElement('path', {
              className: lote.score >= 80 ? 'text-emerald-500' : 'text-amber-500',
              strokeDasharray: `${lote.score}, 100`,
              strokeWidth: '3',
              strokeLinecap: 'round',
              stroke: 'currentColor',
              fill: 'none',
              d: 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831',
            })
          ),
          React.createElement('span', { className: 'absolute text-xs font-bold text-white' }, `${lote.score}%`)
        )
      ),
      React.createElement(
        'div',
        { className: 'space-y-3 pt-2' },
        React.createElement(
          'div',
          { className: 'flex justify-between items-center text-xs pb-2 border-b border-slate-800/80' },
          React.createElement('span', { className: 'text-slate-400' }, 'Salud Vegetal (NDVI)'),
          React.createElement('span', { className: 'font-semibold text-white font-mono' }, lote.ndvi, ' (', lote.saludEstado, ')')
        ),
        React.createElement(
          'div',
          { className: 'flex justify-between items-center text-xs pb-2 border-b border-slate-800/80' },
          React.createElement('span', { className: 'text-slate-400' }, 'Rinde Estimado'),
          React.createElement('span', { className: 'font-semibold text-white font-mono' }, lote.rindeEstimado)
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'space-y-2 mt-6' },
      React.createElement(
        'button',
        { className: 'w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/10' },
        React.createElement(ShieldCheck, { className: 'w-4 h-4' }),
        `Pre-Aprobar Financiación (${lote.bancoSugerido})`
      ),
      React.createElement(
        'button',
        { 
          onClick: onExport,
          className: 'w-full bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer' 
        },
        React.createElement(Download, { className: 'w-3.5 h-3.5 text-slate-400' }),
        'Exportar Ficha Técnica (PDF)'
      )
    )
  );
};