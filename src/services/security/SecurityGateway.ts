// src/services/security/SecurityGateway.ts

import { FinancialQuerySchema } from './securitySchemas';
import { RateLimiter } from './RateLimiter';
import { AuditLogger } from './AuditLogger';
import nodeCrypto from 'node:crypto';

export class SecurityGateway {
  public static validateAndAuthorize(input: unknown, clientIp: string) {
    // 1. Verificar Rate Limiting
    if (RateLimiter.isRateLimited(clientIp)) {
      AuditLogger.log({
        action: 'SECURITY_VIOLATION',
        clientIp,
        cuitHash: 'N/A',
        status: 'BLOCKED',
        details: 'Rate limit excedido.',
      });
      throw new Error('Demasiadas solicitudes. Acceso bloqueado temporalmente por seguridad.');
    }

    // 2. Validar Esquema Estricto con Zod (Inyección / Formato)
    const validationResult = FinancialQuerySchema.safeParse(input);
    if (!validationResult.success) {
      AuditLogger.log({
        action: 'SECURITY_VIOLATION',
        clientIp,
        cuitHash: 'N/A',
        status: 'FAILED',
        details: validationResult.error.issues.map((err) => err.message).join(', '),
      });
      throw new Error('Parámetros de consulta inválidos o maliciosos detectados.');
    }

    const { cuit, entityId } = validationResult.data;
    const cuitHash = nodeCrypto.createHash('sha256').update(cuit).digest('hex');

    // 3. Registrar Auditoría Exitosa
    AuditLogger.log({
      action: 'CREDIT_QUERY',
      clientIp,
      cuitHash,
      status: 'SUCCESS',
      details: `Consulta autorizada hacia ${entityId}`,
    });

    return { cuit, entityId };
  }
}