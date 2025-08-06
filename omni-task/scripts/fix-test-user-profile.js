#!/usr/bin/env node

/**
 * Script pour créer le profil de l'utilisateur de test Playwright
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquant dans .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixTestUserProfile() {
  console.log('🔧 Recherche de l\'utilisateur test.playwright@example.com...')

  try {
    // Se connecter avec l'utilisateur de test
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test.playwright@example.com',
      password: 'TestPassword123!'
    })

    if (authError) {
      console.error('❌ Erreur de connexion:', authError.message)
      return
    }

    const user = authData.user
    console.log(`✅ Utilisateur trouvé: ${user.id}`)

    // Vérifier si le profil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code === 'PGRST116') {
      // Profil n'existe pas, le créer
      console.log('➕ Création du profil manquant...')
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Test User Playwright'
        })

      if (insertError) {
        console.error('❌ Erreur lors de la création du profil:', insertError)
      } else {
        console.log('✅ Profil créé avec succès')
        
        // Créer aussi les préférences
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .insert({ user_id: user.id })

        if (prefsError && prefsError.code !== '23505') {
          console.error('⚠️ Erreur lors de la création des préférences:', prefsError)
        } else {
          console.log('✅ Préférences créées')
        }
      }
    } else if (!profileError) {
      console.log('✅ Le profil existe déjà')
      console.log('Profil:', profile)
    }

    // Se déconnecter
    await supabase.auth.signOut()
    console.log('✅ Script terminé')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

fixTestUserProfile()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })