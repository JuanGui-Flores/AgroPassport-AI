// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Role } from '../services/security/rbac';

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Productor Agropecuario',
    role: 'PRODUCER', 
  });

  const login = useCallback((newUser: User) => setUser(newUser), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({
    user,
    login,
    logout,
  }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}