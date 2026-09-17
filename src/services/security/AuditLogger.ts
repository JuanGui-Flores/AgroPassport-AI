// src/services/security/AuditLogger.ts

interface AuditEntry {
  timestamp: string;
  action: 'CREDIT_QUERY' | 'INSURANCE_CHECK' | 'SECURITY_VIOLATION';
  clientIp: string;
  cuitHash: string; // Hash unidireccional para buscar sin exponer el CUIT real en texto plano
  status: 'SUCCESS' | 'BLOCKED' | 'FAILED';
  details: string;
}

export class AuditLogger {
  public static log(entry: Omit<AuditEntry, 'timestamp'>): void {
    const fullEntry: AuditEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    // En producción, esto se escribe en un archivo de logs protegido o se envía a un SIEM (Datadog / Splunk)
    console.log(`[AUDIT TRAIL]`, JSON.stringify(fullEntry));
  }
}