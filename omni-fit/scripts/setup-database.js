#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://api.supabase.omnirealm.tech';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY non définie');
  console.log('Utilisez: SUPABASE_SERVICE_ROLE_KEY=votre_clé node scripts/setup-database.js');
  process.exit(1);
}

// Créer le client Supabase avec la clé service_role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('🚀 Démarrage de la configuration de la base de données OmniFit...');
    
    // Lire le fichier SQL
    const migrationPath = join(__dirname, '../supabase/migrations/001_create_omnifit_schema.sql');
    const sql = readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Exécution du script SQL...');
    
    // Exécuter le SQL via RPC (nécessite une fonction Supabase pour exécuter du SQL brut)
    // Alternative : utiliser pg directement
    const { Pool } = await import('pg');
    
    // Parser l'URL de la base de données
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('❌ DATABASE_URL non définie');
      console.log('Utilisez: DATABASE_URL=postgresql://user:password@host:port/database node scripts/setup-database.js');
      console.log('Exemple: DATABASE_URL=postgresql://postgres:your_password@91.108.113.252:5432/postgres');
      process.exit(1);
    }
    
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: false // Votre VPS n'utilise pas SSL
    });
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Diviser le SQL en statements individuels
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        if (statement) {
          console.log(`⚡ Exécution: ${statement.substring(0, 50)}...`);
          await client.query(statement + ';');
        }
      }
      
      await client.query('COMMIT');
      console.log('✅ Migration appliquée avec succès!');
      
      // Vérifier les tables créées
      const { rows } = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'omnifit' 
        ORDER BY table_name;
      `);
      
      console.log('\n📊 Tables créées dans le schéma omnifit:');
      rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
      await pool.end();
    }
    
    console.log('\n✨ Configuration de la base de données terminée!');
    console.log('\n📌 Prochaines étapes:');
    console.log('1. Déployer les Edge Functions: supabase functions deploy --no-verify-jwt');
    console.log('2. Configurer les secrets Stripe dans Supabase');
    console.log('3. Tester le flow complet');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
runMigration();