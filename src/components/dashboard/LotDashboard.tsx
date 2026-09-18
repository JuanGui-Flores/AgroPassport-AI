// src/components/dashboard/LotDashboard.tsx
import React from 'react';
import { Can } from '../common/Can';

export function LotDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de AgroPassport</h1>
      
      {/* Esta sección la ven todos los que puedan leer lotes */}
      <Can I="lotes:read">
        <div className="mt-4 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Listado de Lotes Agrícolas</h2>
          {/* Tabla de lotes... */}
        </div>
      </Can>

      {/* Este botón SOLO lo ve el PRODUCER o ADMIN, ocultándose automáticamente para un Banco */}
      <Can I="lotes:create">
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Registrar Nuevo Lote
        </button>
      </Can>

      {/* Sección exclusiva para entidades financieras o admins */}
      <Can I="financial:query">
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-md font-bold text-blue-800">Panel de Consulta Financiera</h3>
          <p>Módulos de validación de CUITs y estados crediticios habilitados.</p>
        </div>
      </Can>
    </div>
  );
}