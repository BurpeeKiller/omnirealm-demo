import { createClient } from '@supabase/supabase-js'

// Configuration Supabase locale
const supabaseUrl = 'http://localhost:54321'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixProfiles() {
  console.log('Récupération des utilisateurs...')
  
  // Récupérer tous les utilisateurs
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError) {
    console.error('Erreur lors de la récupération des utilisateurs:', usersError)
    return
  }
  
  console.log(`${users.users.length} utilisateur(s) trouvé(s)`)
  
  for (const user of users.users) {
    console.log(`\nTraitement de l'utilisateur: ${user.email}`)
    
    // Vérifier si le profil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError && profileError.code === 'PGRST116') {
      // Le profil n'existe pas, on le crée
      console.log('Création du profil...')
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        })
      
      if (insertError) {
        console.error('Erreur lors de la création du profil:', insertError)
      } else {
        console.log('✅ Profil créé avec succès')
      }
    } else if (!profileError) {
      console.log('✅ Le profil existe déjà')
    }
    
    // Vérifier les préférences
    const { data: prefs, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (prefsError && prefsError.code === 'PGRST116') {
      // Les préférences n'existent pas, on les crée
      console.log('Création des préférences...')
      const { error: insertPrefsError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id
        })
      
      if (insertPrefsError) {
        console.error('Erreur lors de la création des préférences:', insertPrefsError)
      } else {
        console.log('✅ Préférences créées avec succès')
      }
    } else if (!prefsError) {
      console.log('✅ Les préférences existent déjà')
    }
  }
  
  console.log('\n✨ Correction terminée')
}

fixProfiles().catch(console.error)