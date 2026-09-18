// src/services/security/__tests__/rbac.test.ts

import { describe, it, expect } from 'vitest';
import { hasPermission, Role } from '../rbac';

describe('🛡️ AgroPassport - Control de Accesos (RBAC)', () => {
  
  it('debe permitir a un PRODUCER crear y leer lotes', () => {
    const role: Role = 'PRODUCER';
    
    expect(hasPermission(role, 'lotes:create')).toBe(true);
    expect(hasPermission(role, 'lotes:read')).toBe(true);
  });

  it('debe denegar a un FINANCIAL_ENTITY crear lotes o ver auditorías', () => {
    const role: Role = 'FINANCIAL_ENTITY';
    
    expect(hasPermission(role, 'lotes:create')).toBe(false);
    expect(hasPermission(role, 'security:audit')).toBe(false);
    expect(hasPermission(role, 'financial:query')).toBe(true);
  });

  it('debe otorgar todos los permisos a un ADMIN', () => {
    const role: Role = 'ADMIN';
    
    expect(hasPermission(role, 'security:audit')).toBe(true);
    expect(hasPermission(role, 'lotes:create')).toBe(true);
  });

  it('debe retornar falso para roles inexistentes o permisos no asignados', () => {
    const invalidRole = 'HACKER' as Role;
    
    expect(hasPermission(invalidRole, 'lotes:read')).toBe(false);
  });

});