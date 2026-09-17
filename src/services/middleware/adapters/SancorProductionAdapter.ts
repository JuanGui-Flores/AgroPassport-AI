// src/services/middleware/adapters/SancorProductionAdapter.ts

import { HttpClient } from '../core/HttpClient';
import { InsurancePolicyCheck } from '@/types/integration';

interface SancorRawResponse {
  policyNumber: string;
  lotReference: string;
  validityStatus: 'active' | 'expired' | 'pending';
  coverageType: 'Granizo Total' | 'Multirriesgo' | 'Incendio';
  insuredSumUSD?: number;
  validUntil?: string;
}

export class SancorProductionAdapter {
  private static readonly baseUrl = 'https://ws.sancorseguros.com/agro/v3';

  public static async validateInsurance(lotId: string): Promise<InsurancePolicyCheck> {
    const rawData = await HttpClient.secureGet<SancorRawResponse>(
      'ins-sancor',
      `${this.baseUrl}/polizas/validar?lotId=${lotId}`
    );

    return {
      entityId: 'ins-sancor',
      lotId: rawData.lotReference,
      policyNumber: rawData.policyNumber,
      status: rawData.validityStatus === 'active' ? 'active' : 'expired',
      coverageType: rawData.coverageType || 'Granizo Total',
      insuredSumUSD: rawData.insuredSumUSD || 50000,
      validUntil: rawData.validUntil || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}