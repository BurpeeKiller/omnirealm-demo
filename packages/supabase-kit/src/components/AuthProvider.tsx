import type { User, Session } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';

import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (updates: Record<string, any>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification Supabase
 * Enveloppe l'application pour fournir le contexte d'authentification
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour utiliser le contexte d'authentification
 * Doit être utilisé dans un composant enfant de AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext doit être utilisé dans un AuthProvider');
  }

  return context;
}

/**
 * HOC pour protéger les routes nécessitant une authentification
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    fallback?: React.ComponentType;
  },
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) {
      return options?.fallback ? <options.fallback /> : <div>Chargement...</div>;
    }

    if (!isAuthenticated) {
      if (options?.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo;
      }
      return null;
    }

    return <Component {...props} />;
  };
}
