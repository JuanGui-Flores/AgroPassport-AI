import { IntegrationEndpoint, FinancialCreditCheck, InsurancePolicyCheck } from '@/types/integration';

// Registro inicial de conexiones mockeadas del ecosistema AgroPassport
let mockEndpoints: IntegrationEndpoint[] = [
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
  }
];

export const IntegrationMiddlewareService = {
  /**
   * Obtiene el estado de todos los conectores del ecosistema
   */
  async getEndpoints(): Promise<IntegrationEndpoint[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEndpoints;
  },

  /**
   * Fuerza la resincronización de un endpoint específico
   */
  async syncEndpoint(id: string): Promise<IntegrationEndpoint> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    mockEndpoints = mockEndpoints.map((ep) => {
      if (ep.id === id) {
        return {
          ...ep,
          status: 'connected',
          latencyMs: Math.floor(Math.random() * 150) + 70, // NOSONAR - Mock pseudo-random for simulation latency only
          lastSync: new Date().toISOString(),
        };
      }
      return ep;
    });

    const updated = mockEndpoints.find((ep) => ep.id === id);
    if (!updated) throw new Error(`Endpoint ${id} no encontrado.`);
    return updated;
  },

  /**
   * Middleware normalizador: Consulta línea de crédito en un Banco externo
   */
  async fetchCreditEvaluation(entityId: string, cuit: string): Promise<FinancialCreditCheck> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return {
      entityId,
      cuit,
      approvedLimit: 45000000, // $45.000.000 ARS
      currency: 'ARS',
      riskScore: 'A',
      status: 'approved',
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Middleware normalizador: Consulta póliza activa en Aseguradora externa
   */
  async fetchInsuranceValidation(entityId: string, lotId: string): Promise<InsurancePolicyCheck> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      entityId,
      lotId,
      policyNumber: `POL-${Math.floor(Math.random() * 89999 + 10000)}`, // NOSONAR - Mock pseudo-random for test policy numbers
      coverageType: 'Granizo Total',
      insuredSumUSD: 125000,
      status: 'active',
      validUntil: '2027-06-30T23:59:59Z',
    };
  },
};