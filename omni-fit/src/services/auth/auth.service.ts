import { createClient, User, Session } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResponse<T> {
  data?: T;
  error?: AuthError;
}

class AuthService {
  // État actuel de l'utilisateur
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  constructor() {
    // Écouter les changements d'auth
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession = session;
      this.currentUser = session?.user || null;
      
      // Persister le token pour les autres services
      if (session?.access_token) {
        localStorage.setItem('omnifit_token', session.access_token);
      } else {
        localStorage.removeItem('omnifit_token');
      }
    });

    // Restaurer la session au démarrage
    this.restoreSession();
  }

  // Restaurer la session existante
  private async restoreSession() {
    const { data: { session } } = await supabase.auth.getSession();
    this.currentSession = session;
    this.currentUser = session?.user || null;
  }

  // Inscription
  async signUp(email: string, password: string): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            app: 'omnifit',
          }
        }
      });

      if (error) {
        return { error: { message: error.message, code: error.status?.toString() } };
      }

      if (data.user) {
        // Créer le profil utilisateur
        await this.createUserProfile(data.user.id, email);
      }

      return { data: data.user || undefined };
    } catch (error: any) {
      return { error: { message: error.message || 'Erreur lors de l\'inscription' } };
    }
  }

  // Connexion
  async signIn(email: string, password: string): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: { message: error.message, code: error.status?.toString() } };
      }

      return { data: data.user || undefined };
    } catch (error: any) {
      return { error: { message: error.message || 'Erreur lors de la connexion' } };
    }
  }

  // Connexion avec provider OAuth
  async signInWithProvider(provider: 'google' | 'github'): Promise<AuthResponse<boolean>> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { data: true };
    } catch (error: any) {
      return { error: { message: error.message || 'Erreur lors de la connexion' } };
    }
  }

  // Déconnexion
  async signOut(): Promise<AuthResponse<boolean>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: { message: error.message } };
      }

      // Nettoyer le localStorage
      localStorage.removeItem('omnifit_token');
      localStorage.removeItem('omnifit_user');

      return { data: true };
    } catch (error: any) {
      return { error: { message: error.message || 'Erreur lors de la déconnexion' } };
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(email: string): Promise<AuthResponse<boolean>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { data: true };
    } catch (error: any) {
      return { error: { message: error.message || 'Erreur lors de la réinitialisation' } };
    }
  }

  // Mettre à jour le mot de passe
  async updatePassword(newPassword: string): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { data: data.user || undefined };
    } catch (error: any) {
      return { error: { message: error.message || 'Erreur lors de la mise à jour' } };
    }
  }

  // Créer le profil utilisateur
  private async createUserProfile(userId: string, email: string) {
    try {
      await supabase.from('profiles').insert({
        id: userId,
        email,
        app: 'omnifit',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erreur création profil:', error);
    }
  }

  // Getters
  get user(): User | null {
    return this.currentUser;
  }

  get session(): Session | null {
    return this.currentSession;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}

// Export singleton
export const authService = new AuthService();