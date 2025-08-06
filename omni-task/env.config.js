/**
 * Configuration des variables d'environnement avec mapping depuis les variables globales
 * Ce fichier permet d'utiliser les variables exportées depuis /shared/scripts/ports/.env.ports
 */

// Mapping des variables globales vers les variables Next.js
const envMapping = {
  // Si OMNITASK_SUPABASE_URL existe (depuis les variables globales), l'utiliser
  // Sinon, garder la valeur existante de NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_URL: process.env.OMNITASK_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.OMNITASK_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  
  // Port depuis la config globale
  PORT: process.env.OMNITASK_PORT || process.env.PORT || 3002,
  
  // URL de l'app
  NEXT_PUBLIC_APP_URL: process.env.OMNITASK_FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
}

// Appliquer le mapping
Object.entries(envMapping).forEach(([key, value]) => {
  if (value && !process.env[key]) {
    process.env[key] = value;
  }
});

// Logger les variables pour debug (seulement en dev)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 OmniTask Environment Configuration:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
  console.log('- PORT:', process.env.PORT);
  console.log('- Using global vars:', !!process.env.OMNITASK_SUPABASE_URL);
}

module.exports = {};