export type IntegrationProviderType = 'bank' | 'insurance' | 'satellites' | 'weather';

export type ConnectionStatus = 'connected' | 'syncing' | 'error' | 'disconnected';

export interface IntegrationEndpoint {
  id: string;
  name: string;
  type: IntegrationProviderType;
  status: ConnectionStatus;
  latencyMs: number;
  lastSync: string;
  version: string;
  endpointUrl: string;
}

export interface FinancialCreditCheck {
  entityId: string;
  cuit: string;
  approvedLimit: number;
  currency: 'ARS' | 'USD';
  riskScore: 'A' | 'B' | 'C' | 'D';
  status: 'pre-approved' | 'approved' | 'rejected' | 'pending_docs';
  updatedAt: string;
}

export interface InsurancePolicyCheck {
  entityId: string;
  lotId: string;
  policyNumber: string;
  coverageType: 'Granizo Total' | 'Multirriesgo' | 'Incendio';
  insuredSumUSD: number;
  status: 'active' | 'expired' | 'processing';
  validUntil: string;
}