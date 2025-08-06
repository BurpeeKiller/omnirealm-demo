import type { User, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { getClient } from '../utils/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook personnalisé pour gérer l'authentification Supabase
 * Fournit l'état de l'utilisateur et les méthodes d'authentification
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const supabase = getClient();

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthState((prev) => ({ ...prev, error, loading: false }));
      } else {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        });
      }
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      return { error };
    }

    return { data };
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      return { error };
    }

    return { data };
  };

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      return { error };
    }

    setAuthState({
      user: null,
      session: null,
      loading: false,
      error: null,
    });

    return { error: null };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { data, error };
  };

  const updateProfile = async (updates: Record<string, any>) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (!error && data.user) {
      setAuthState((prev) => ({
        ...prev,
        user: data.user,
      }));
    }

    return { data, error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!authState.user,
  };
}
