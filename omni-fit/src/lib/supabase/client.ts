import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// En dev, on permet de continuer sans Supabase
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables missing - auth features disabled');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // Pour le self-hosted, on utilise le namespace fitness_reminder
  db: {
    schema: 'fitness_reminder',
  },
});
