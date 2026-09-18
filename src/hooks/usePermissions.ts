// src/hooks/usePermissions.ts
import { useAuth } from '../context/AuthContext'; // Asumiendo que manejas la sesión del usuario aquí
import { hasPermission, Permission, Role } from '../services/security/rbac';

export function usePermissions() {
  // Suponiendo que el usuario actual tiene un rol asignado (ej: 'PRODUCER', 'FINANCIAL_ENTITY', 'ADMIN')
  const { user } = useAuth(); 
  const currentRole = (user?.role as Role) || 'PRODUCER';

  const checkPermission = (permission: Permission) => {
    return hasPermission(currentRole, permission);
  };

  return { checkPermission, currentRole };
}