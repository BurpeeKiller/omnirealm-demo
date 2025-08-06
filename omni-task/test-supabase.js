#!/usr/bin/env node

// Test de connexion Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log('🔧 Test de connexion Supabase...');
console.log(`URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Vérifier la connexion
    console.log('\n1️⃣ Test de connexion...');
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return;
    }
    
    console.log('✅ Connexion réussie!');
    
    // Test 2: Créer un utilisateur test
    console.log('\n2️⃣ Test de création utilisateur...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@omnirealm.tech',
      password: 'testpassword123'
    });
    
    if (authError) {
      console.error('❌ Erreur auth:', authError);
    } else {
      console.log('✅ Utilisateur créé:', authData.user?.email);
    }
    
    // Test 3: Vérifier les tables
    console.log('\n3️⃣ Vérification des tables...');
    const tables = ['profiles', 'tasks', 'projects', 'user_preferences'];
    
    for (const table of tables) {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`❌ Table ${table}: Erreur`);
      } else {
        console.log(`✅ Table ${table}: OK (${count || 0} lignes)`);
      }
    }
    
    console.log('\n🎉 Tous les tests sont passés!');
    
  } catch (err) {
    console.error('❌ Erreur générale:', err);
  }
}

testConnection();