// src/services/security/securitySchemas.ts

import { z } from 'zod';

// Expresión regular limpia utilizando \d según las buenas prácticas de SonarLint
const cuitRegex = /^\b(20|23|24|27|30|33|34)(\D?\d){8}\D?\d$/;

// Expresión regular estándar para validación de UUIDs (v1 a v5)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const FinancialQuerySchema = z.object({
  cuit: z.string().regex(cuitRegex, 'El CUIT ingresado no es válido o tiene un formato incorrecto.'),
  entityId: z.enum(['bank-galicia', 'bank-macro', 'ins-sancor'], {
    message: 'Entidad financiera o aseguradora no autorizada.',
  }),
});

export const LotValidationSchema = z.object({
  lotId: z.string().regex(uuidRegex, 'El ID del lote debe ser un UUID válido.'),
  cuit: z.string().regex(cuitRegex, 'El CUIT del titular es inválido.'),
});