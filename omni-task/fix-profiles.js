#!/usr/bin/env node

/**
 * Script pour créer les profils utilisateurs manquants
 * Corrige le problème de contrainte de clé étrangère
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquant dans .env')
  console.log('Ajoutez la clé service role de Supabase dans votre fichier .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixMissingProfiles() {
  console.log('🔧 Vérification et création des profils manquants...')

  try {
    // 1. Récupérer tous les utilisateurs
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', usersError)
      return
    }

    console.log(`📊 ${users.users.length} utilisateurs trouvés`)

    // 2. Pour chaque utilisateur, vérifier s'il a un profil
    for (const user of users.users) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profil manquant, le créer
        console.log(`➕ Création du profil pour ${user.email}`)
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Utilisateur'
          })

        if (insertError) {
          console.error(`❌ Erreur lors de la création du profil pour ${user.email}:`, insertError)
        } else {
          console.log(`✅ Profil créé pour ${user.email}`)
          
          // Créer aussi les préférences utilisateur
          const { error: prefsError } = await supabase
            .from('user_preferences')
            .insert({ user_id: user.id })

          if (prefsError && prefsError.code !== '23505') { // Ignorer si déjà existe
            console.error(`⚠️ Erreur lors de la création des préférences:`, prefsError)
          }
        }
      } else if (!profileError) {
        console.log(`✓ Profil déjà existant pour ${user.email}`)
      }
    }

    console.log('\n✅ Vérification terminée!')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Exécuter le script
fixMissingProfiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })