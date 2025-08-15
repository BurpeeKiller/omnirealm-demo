import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { logger } from '@/utils/logger';
import { publicConfig } from '../config';

const supabaseUrl = publicConfig.supabaseUrl;
const supabaseAnonKey = publicConfig.supabaseAnonKey;

// En dev, on permet de continuer sans Supabase
if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('Supabase environment variables missing - auth features disabled');
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
