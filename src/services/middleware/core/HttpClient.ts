// src/services/middleware/core/HttpClient.ts

import { TokenManager } from './TokenManager';

export class HttpClient {
  /**
   * Ejecuta una petición GET firmada y autenticada hacia la API del banco
   */
  public static async secureGet<T>(entityId: string, url: string): Promise<T> {
    try {
      // 1. Obtener el token de acceso vigente
      const token = await TokenManager.getAccessToken(entityId);

      // 2. Realizar la petición HTTP con el Bearer Token y configuraciones mTLS
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(), // Trazabilidad bancaria obligatoria
        },
        // Nota: Aquí se configuran los agentes mTLS (certificados .pem / .key) en un entorno Node.js backend
      });

      if (!response.ok) {
        throw new Error(`Error en API externa [${entityId}]: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`[HttpClient Error] Fallo al consultar ${entityId} en ${url}:`, error);
      throw error;
    }
  }
}