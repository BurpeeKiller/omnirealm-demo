/**
 * Export centralisé des utilitaires Supabase
 */

export { createClient, getClient } from './client';
export { createClient as createServerClient } from './server';

// Middleware est spécifique à Next.js, export séparé si nécessaire
export { updateSession } from './middleware';
