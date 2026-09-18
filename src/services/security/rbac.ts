// src/services/security/rbac.ts

export type Role = 'PRODUCER' | 'FINANCIAL_ENTITY' | 'ADMIN';

export type Permission = 
  | 'lotes:create'
  | 'lotes:read'
  | 'lotes:update'
  | 'financial:query'
  | 'security:audit'
  | 'financial:evaluate'
  | 'producer:manage'
  | 'audit:view';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  PRODUCER: [
    'lotes:create',
    'lotes:read',
    'lotes:update',
    'financial:query',
    'producer:manage',    // <-- Telemetría visible para el Productor
    'financial:evaluate', // <-- Permite ver el Simulador de Créditos
  ],
  FINANCIAL_ENTITY: [
    'lotes:read',
    'financial:query',
    'financial:evaluate', // <-- Permite al Banco ver y operar el Simulador
    'producer:manage',    // <-- Permite al Banco revisar la Telemetría técnica
    'audit:view',         // <-- Muestra el Integration Dashboard/Middleware
  ],
  ADMIN: [
    'lotes:create',
    'lotes:read',
    'lotes:update',
    'financial:query',
    'security:audit',
    'financial:evaluate', // <-- Acceso total
    'producer:manage',
    'audit:view',
  ],
};

/**
 * Verifica si un rol cuenta con un permiso específico.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}