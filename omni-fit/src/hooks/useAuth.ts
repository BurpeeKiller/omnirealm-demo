import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  plan: 'free' | 'pro' | 'team';
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    plan: 'free',
  });

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));

      // Si connecté, récupérer le plan
      if (session?.user) {
        fetchUserPlan(session.user.id);
      }
    });

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      // Mettre à jour le plan si connecté
      if (session?.user) {
        fetchUserPlan(session.user.id);
      } else {
        setAuthState((prev) => ({ ...prev, plan: 'free' }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setAuthState((prev) => ({ ...prev, plan: data.plan }));
      }
    } catch (error) {
      logger.error('Error fetching user plan:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    plan: authState.plan,
    isAuthenticated: !!authState.user,
    isPro: authState.plan === 'pro' || authState.plan === 'team',
    isTeam: authState.plan === 'team',
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
