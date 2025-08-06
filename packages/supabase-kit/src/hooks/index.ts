/**
 * Export centralisé des hooks Supabase réutilisables
 * Ces hooks sont conçus pour être utilisés dans tous les projets OmniRealm
 */

export { useAuth } from './useAuth';
export { useSupabaseQuery, useSupabaseMutation } from './useSupabase';
export { useRealtime, usePresence, useBroadcast } from './useRealtime';

// Alias pour compatibilité
export { useSupabaseQuery as useSupabase } from './useSupabase';

// Re-export des types utiles
export type { User, Session } from '@supabase/supabase-js';
