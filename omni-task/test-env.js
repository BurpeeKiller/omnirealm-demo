#!/usr/bin/env node

console.log('=== Test des variables d\'environnement OmniTask ===');
console.log('');
console.log('Variables NEXT_PUBLIC (disponibles côté client):');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NON DÉFINIE');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'DÉFINIE' : 'NON DÉFINIE');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'NON DÉFINIE');
console.log('');
console.log('Variables serveur (non disponibles côté client):');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'DÉFINIE' : 'NON DÉFINIE');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'DÉFINIE' : 'NON DÉFINIE');
console.log('');
console.log('Environnement:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NON DÉFINI');
console.log('PORT:', process.env.PORT || 'NON DÉFINI');
console.log('');
console.log('=== Fin du test ===');