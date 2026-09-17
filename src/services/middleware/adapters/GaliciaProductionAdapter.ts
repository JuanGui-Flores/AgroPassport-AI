// src/services/middleware/adapters/GaliciaProductionAdapter.ts

import { HttpClient } from '../core/HttpClient';
import { FinancialCreditCheck } from '@/types/integration';

// Interfaz para tipar la respuesta cruda del banco y evitar el uso de 'any'
interface GaliciaRawResponse {
  taxId: string;
  creditLine?: {
    maxAmount: number;
  };
  evaluation?: {
    riskCategory: 'A' | 'B' | 'C' | 'D';
    approved: boolean;
  };
}

export class GaliciaProductionAdapter {
  private static readonly baseUrl = 'https://api.galicia.ar/agro/v2';

  public static async evaluateCredit(cuit: string): Promise<FinancialCreditCheck> {
    // El HttpClient se encarga de pedir el token y firmar la petición de forma transparente
    const rawData = await HttpClient.secureGet<GaliciaRawResponse>(
      'bank-galicia', 
      `${this.baseUrl}/scoring?cuit=${cuit}`
    );

    // Mapeas la respuesta propietaria del Galicia al formato estándar (normalizado) de AgroPassport
    return {
      entityId: 'bank-galicia',
      cuit: rawData.taxId,
      approvedLimit: rawData.creditLine?.maxAmount || 0,
      currency: 'ARS',
      riskScore: rawData.evaluation?.riskCategory || 'C',
      status: rawData.evaluation?.approved ? 'approved' : 'rejected',
      updatedAt: new Date().toISOString(),
    };
  }
}