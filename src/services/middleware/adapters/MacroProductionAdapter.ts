// src/services/middleware/adapters/MacroProductionAdapter.ts

import { HttpClient } from '../core/HttpClient';
import { FinancialCreditCheck } from '@/types/integration';

interface MacroRawResponse {
  cuitNumber: string;
  scoringData?: {
    limitAvailable: number;
    riskRating: 'A' | 'B' | 'C' | 'D';
    isEligible: boolean;
  };
}

export class MacroProductionAdapter {
  private static readonly baseUrl = 'https://api.macro.com.ar/agro/v1';

  public static async evaluateCredit(cuit: string): Promise<FinancialCreditCheck> {
    const rawData = await HttpClient.secureGet<MacroRawResponse>(
      'bank-macro',
      `${this.baseUrl}/scoring?cuit=${cuit}`
    );

    return {
      entityId: 'bank-macro',
      cuit: rawData.cuitNumber,
      approvedLimit: rawData.scoringData?.limitAvailable || 0,
      currency: 'ARS',
      riskScore: rawData.scoringData?.riskRating || 'C',
      status: rawData.scoringData?.isEligible ? 'approved' : 'rejected',
      updatedAt: new Date().toISOString(),
    };
  }
}