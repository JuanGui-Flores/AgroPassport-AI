'use client';

import React, { useState } from 'react';
import { Server, RefreshCw, Clock, Shield, Building2, Zap, Search, CheckCircle2 } from 'lucide-react';
import { IntegrationEndpoint, FinancialCreditCheck, InsurancePolicyCheck } from '@/types/integration';
import { IntegrationMiddlewareService } from '@/services/integrationMiddleware';

const INITIAL_ENDPOINTS: IntegrationEndpoint[] = [
  {
    id: 'bank-galicia',
    name: 'Banco Galicia (Agro API)',
    type: 'bank',
    status: 'connected',
    latencyMs: 145,
    lastSync: new Date().toISOString(),
    version: 'v2.4-rest',
    endpointUrl: 'https://api.galicia.ar/agro/v2',
  },
  {
    id: 'bank-macro',
    name: 'Banco Macro (AgroFin)',
    type: 'bank',
    status: 'connected',
    latencyMs: 210,
    lastSync: new Date().toISOString(),
    version: 'v1.8-rest',
    endpointUrl: 'https://api.macro.com.ar/v1/scoring',
  },
  {
    id: 'ins-sancor',
    name: 'Sancor Seguros API',
    type: 'insurance',
    status: 'connected',
    latencyMs: 98,
    lastSync: new Date().toISOString(),
    version: 'v3.0-soap-json',
    endpointUrl: 'https://ws.sancorseguros.com/agro/polizas',
  },
  {
    id: 'ins-federacion',
    name: 'Federación Patronal Seguros',
    type: 'insurance',
    status: 'syncing',
    latencyMs: 310,
    lastSync: new Date().toISOString(),
    version: 'v2.1-rest',
    endpointUrl: 'https://api.fedpat.com.ar/integration/v2',
  },
];

export const IntegrationDashboard: React.FC = () => {
  const [endpoints, setEndpoints] = useState<IntegrationEndpoint[]>(INITIAL_ENDPOINTS);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Estados para el Simulador de Consultas en Vivo
  const [selectedEntityForTest, setSelectedEntityForTest] = useState<string>('bank-galicia');
  const [testCuit, setTestCuit] = useState('20-35489123-4');
  const [testLotId, setTestLotId] = useState('LOT-104');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<FinancialCreditCheck | InsurancePolicyCheck | null>(null);

  const loadEndpoints = async () => {
    setIsLoadingList(true);
    try {
      const data = await IntegrationMiddlewareService.getEndpoints();
      setEndpoints(data);
    } catch (error) {
      console.error('Error cargando endpoints:', error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleSync = async (id: string) => {
    setLoadingId(id);
    try {
      const updated = await IntegrationMiddlewareService.syncEndpoint(id);
      setEndpoints((prev) => prev.map((ep) => (ep.id === id ? updated : ep)));
    } catch (error) {
      console.error('Error sincronizando endpoint:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRunLiveTest = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    try {
      const currentEndpoint = endpoints.find((ep) => ep.id === selectedEntityForTest);
      if (currentEndpoint?.type === 'bank') {
        const res = await IntegrationMiddlewareService.fetchCreditEvaluation(selectedEntityForTest, testCuit);
        setTestResult(res);
      } else {
        const res = await IntegrationMiddlewareService.fetchInsuranceValidation(selectedEntityForTest, testLotId);
        setTestResult(res);
      }
    } catch (error) {
      console.error('Error en prueba en vivo:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Middleware & Conectividad API</h2>
            <p className="text-xs text-slate-400">Monitoreo y pasarela de integración con entidades financieras y aseguradoras</p>
          </div>
        </div>
        <button
          onClick={loadEndpoints}
          disabled={isLoadingList}
          className="self-start sm:self-auto flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-700/60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? 'animate-spin' : ''}`} />
          <span>Actualizar Estado</span>
        </button>
      </div>

      {/* Grid de Conectores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {endpoints.map((ep) => {
          const isSyncing = loadingId === ep.id;
          const isBank = ep.type === 'bank';

          return (
            <div
              key={ep.id}
              className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 backdrop-blur-xl hover:border-slate-700 transition-all shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isBank ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {isBank ? <Building2 className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{ep.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {ep.version}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-950 border border-slate-800">
                  <span className={`w-2 h-2 rounded-full ${ep.status === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-amber-400'}`}></span>
                  <span className="text-slate-300 capitalize">{ep.status}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 grid grid-cols-3 gap-2 text-center border border-slate-800/50">
                <div>
                  <span className="text-[10px] text-slate-500 block">Latencia</span>
                  <span className="text-xs font-mono font-bold text-slate-200 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> {ep.latencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Protocolo</span>
                  <span className="text-xs font-mono font-semibold text-slate-300">REST / JSON</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Sincronización</span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {new Date(ep.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 truncate max-w-50 font-mono">{ep.endpointUrl}</span>
                <button
                  onClick={() => handleSync(ep.id)}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Probar Conexión'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección de Prueba en Vivo (Simulador de Consulta Middleware) */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 space-y-5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Banco de Pruebas Middleware (Simulador API)</h3>
            <p className="text-xs text-slate-400">Ejecuta consultas normalizadas en tiempo real contra los conectores externos</p>
          </div>
        </div>

        <form onSubmit={handleRunLiveTest} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="entity-select" className="text-[11px] font-medium text-slate-300 block mb-1.5">Entidad Destino</label>
            <select
              id="entity-select"
              value={selectedEntityForTest}
              onChange={(e) => setSelectedEntityForTest(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {endpoints.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name} ({ep.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="test-input" className="text-[11px] font-medium text-slate-300 block mb-1.5">
              {endpoints.find((ep) => ep.id === selectedEntityForTest)?.type === 'bank' ? 'CUIT del Productor' : 'ID del Lote Agropecuario'}
            </label>
            <input
              id="test-input"
              type="text"
              value={endpoints.find((ep) => ep.id === selectedEntityForTest)?.type === 'bank' ? testCuit : testLotId}
              onChange={(e) => {
                const val = e.target.value;
                if (endpoints.find((ep) => ep.id === selectedEntityForTest)?.type === 'bank') {
                  setTestCuit(val);
                } else {
                  setTestLotId(val);
                }
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isTesting}
            className="bg-linear-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer h-10.5"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Consultando API...' : 'Ejecutar Consulta'}</span>
          </button>
        </form>

        {/* Resultado de la Prueba */}
        {testResult && (
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Respuesta Normalizada por Middleware
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-3 rounded-lg overflow-x-auto border border-slate-800">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};