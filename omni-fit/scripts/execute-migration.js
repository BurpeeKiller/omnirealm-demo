#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration - Remplacez par votre service_role_key
const SUPABASE_URL = 'https://supabase.omnirealm.tech';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY non défini');
  console.log('Exportez la variable: export SUPABASE_SERVICE_ROLE_KEY="votre-clé-service"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigration() {
  try {
    const sqlFile = path.join(__dirname, '../supabase/migrations/002_omnifit_schema_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('🚀 Exécution de la migration...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    });

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    console.log('✅ Migration exécutée avec succès!');
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

executeMigration();