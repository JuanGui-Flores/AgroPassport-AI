// src/services/security/rbac.ts

export type Role = 'PRODUCER' | 'FINANCIAL_ENTITY' | 'ADMIN';

export type Permission = 
  | 'lotes:create'
  | 'lotes:read'
  | 'lotes:update'
  | 'financial:query'
  | 'security:audit';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  PRODUCER: [
    'lotes:create',
    'lotes:read',
    'lotes:update',
    'financial:query',
  ],
  FINANCIAL_ENTITY: [
    'lotes:read',
    'financial:query',
  ],
  ADMIN: [
    'lotes:create',
    'lotes:read',
    'lotes:update',
    'financial:query',
    'security:audit',
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