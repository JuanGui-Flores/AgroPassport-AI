// src/components/common/Can.tsx
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Permission } from '../../services/security/rbac';

interface CanProps {
  I: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ I, children, fallback = null }) => {
  const { checkPermission } = usePermissions();

  if (!checkPermission(I)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};