// src/services/security/__tests__/security.test.ts

import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../RateLimiter';
import { FinancialQuerySchema, LotValidationSchema } from '../securitySchemas';

describe('🛡️ AgroPassport - Suite de Pruebas de Seguridad', () => {
  
  describe('RateLimiter Service', () => {
    const testIp = '192.168.1.100';

    it('debe permitir peticiones dentro del límite establecido', () => {
      const firstCheck = RateLimiter.isRateLimited(testIp);
      const secondCheck = RateLimiter.isRateLimited(testIp);

      expect(firstCheck).toBe(false);
      expect(secondCheck).toBe(false);
    });

    it('debe bloquear al superar el límite de peticiones (Rate Limit Exceeded)', () => {
      const spammedIp = '192.168.99.99';

      for (let i = 0; i < 15; i++) {
        RateLimiter.isRateLimited(spammedIp);
      }

      const isBlocked = RateLimiter.isRateLimited(spammedIp);
      expect(isBlocked).toBe(true);
    });
  });

  describe('Zod Security Schemas Validation', () => {
    
    it('debe validar exitosamente un esquema financiero correcto', () => {
      const validPayload = {
        cuit: '20-35123456-9',
        entityId: 'bank-galicia',
      };

      const result = FinancialQuerySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('debe rechazar un esquema financiero con datos erróneos', () => {
      const invalidPayload = {
        cuit: 'INVALID_CUIT',
        entityId: 'banco-invalido',
      };

      const result = FinancialQuerySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('debe validar exitosamente un esquema de lote correcto (LotValidationSchema)', () => {
      const validLotPayload = {
        lotId: '123e4567-e89b-12d3-a456-426614174000',
        cuit: '27-28123456-4',
      };

      const result = LotValidationSchema.safeParse(validLotPayload);
      expect(result.success).toBe(true);
    });

    it('debe rechazar un esquema de lote con UUID o CUIT inválidos', () => {
      const invalidLotPayload = {
        lotId: 'uuid-no-valido',
        cuit: '11-11111111-1',
      };

      const result = LotValidationSchema.safeParse(invalidLotPayload);
      expect(result.success).toBe(false);
    });
  });

});