// src/services/security/RateLimiter.ts

interface RequestRecord {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static readonly ipRequests: Map<string, RequestRecord> = new Map();
  private static readonly MAX_REQUESTS = 15; // Máximo 15 peticiones
  private static readonly WINDOW_MS = 60 * 1000; // Por minuto

  public static isRateLimited(clientIp: string): boolean {
    const now = Date.now();
    const record = this.ipRequests.get(clientIp);

    if (!record || now > record.resetTime) {
      this.ipRequests.set(clientIp, { count: 1, resetTime: now + this.WINDOW_MS });
      return false;
    }

    if (record.count >= this.MAX_REQUESTS) {
      console.warn(`[Security Alert] IP bloqueada temporalmente por exceso de peticiones: ${clientIp}`);
      return true; // Bloqueado
    }

    record.count++;
    return false;
  }
}