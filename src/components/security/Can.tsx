// src/components/security/Can.tsx
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Permission, hasPermission } from '@/services/security/rbac';

interface CanProps {
  I: Permission;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ I, children }) => {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role, I)) {
    return null;
  }

  return <>{children}</>;
};