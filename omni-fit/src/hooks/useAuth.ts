import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, supabase } from '@/services/auth/auth.service';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithGithub: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session initiale
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        await checkPremiumStatus(session.user.id);
      }
      
      setIsLoading(false);
    };

    initAuth();

    // Écouter les changements d'auth
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        await checkPremiumStatus(session.user.id);
      } else {
        setIsPremium(false);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const checkPremiumStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('omnifit.subscriptions')
        .select('plan, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setIsPremium(data.plan === 'premium' || data.plan === 'premium_yearly');
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.error) {
      return { error: result.error.message };
    }
    return {};
  };

  const signUp = async (email: string, password: string) => {
    const result = await authService.signUp(email, password);
    if (result.error) {
      return { error: result.error.message };
    }
    return {};
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const signInWithGoogle = async () => {
    const result = await authService.signInWithProvider('google');
    if (result.error) {
      return { error: result.error.message };
    }
    return {};
  };

  const signInWithGithub = async () => {
    const result = await authService.signInWithProvider('github');
    if (result.error) {
      return { error: result.error.message };
    }
    return {};
  };

  const resetPassword = async (email: string) => {
    const result = await authService.resetPassword(email);
    if (result.error) {
      return { error: result.error.message };
    }
    return {};
  };

  return {
    user,
    isAuthenticated: !!user,
    isPremium,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    resetPassword,
  };
}