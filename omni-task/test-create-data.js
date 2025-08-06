const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase
const supabaseUrl = 'http://localhost:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createDemoData(email, password) {
  try {
    console.log('🔐 Connexion avec:', email)
    
    // Se connecter
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.error('❌ Erreur connexion:', authError.message)
      return
    }

    console.log('✅ Connecté avec succès!')
    console.log('User ID:', authData.user.id)
    const userId = authData.user.id

    // Créer des projets
    console.log('\n📁 Création des projets...')
    
    const projects = [
      {
        name: 'OmniTask Migration',
        description: 'Migration de l\'ancien système vers la nouvelle architecture',
        color: '#3B82F6',
        icon: '🚀',
        user_id: userId
      },
      {
        name: 'Features Q1 2025',
        description: 'Nouvelles fonctionnalités pour le premier trimestre',
        color: '#10B981',
        icon: '✨',
        user_id: userId
      },
      {
        name: 'Bug Fixes',
        description: 'Corrections de bugs et améliorations',
        color: '#EF4444',
        icon: '🐛',
        user_id: userId
      }
    ]

    const createdProjects = []
    for (const project of projects) {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()

      if (error) {
        console.error(`❌ Erreur création projet ${project.name}:`, error.message)
      } else {
        console.log(`✅ Projet créé: ${project.name}`)
        createdProjects.push(data)
      }
    }

    // Créer des tâches
    console.log('\n📋 Création des tâches...')
    
    const tasks = [
      // Tâches pour le projet Migration
      {
        title: 'Analyser l\'architecture actuelle',
        description: 'Documenter tous les composants et dépendances du système actuel',
        status: 'DONE',
        priority: 'HIGH',
        project_id: createdProjects[0]?.id,
        user_id: userId,
        position: 0,
        estimated_hours: 8,
        actual_hours: 10,
        tags: ['analyse', 'documentation']
      },
      {
        title: 'Créer le nouveau schéma de base de données',
        description: 'Définir les tables, relations et contraintes pour OmniTask',
        status: 'DONE',
        priority: 'HIGH',
        project_id: createdProjects[0]?.id,
        user_id: userId,
        position: 1,
        estimated_hours: 4,
        actual_hours: 3,
        tags: ['database', 'architecture']
      },
      {
        title: 'Implémenter l\'authentification',
        description: 'Intégrer Supabase Auth avec gestion des sessions',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        project_id: createdProjects[0]?.id,
        user_id: userId,
        position: 0,
        estimated_hours: 6,
        tags: ['auth', 'security']
      },
      {
        title: 'Créer les composants Kanban',
        description: 'Développer les composants drag & drop pour le tableau',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        project_id: createdProjects[0]?.id,
        user_id: userId,
        position: 1,
        estimated_hours: 12,
        tags: ['ui', 'components']
      },
      {
        title: 'Tests unitaires',
        description: 'Écrire les tests pour les composants critiques',
        status: 'TODO',
        priority: 'MEDIUM',
        project_id: createdProjects[0]?.id,
        user_id: userId,
        position: 0,
        estimated_hours: 8,
        tags: ['testing', 'quality']
      },
      
      // Tâches pour Features Q1
      {
        title: 'Mode sombre',
        description: 'Implémenter un thème sombre pour l\'application',
        status: 'TODO',
        priority: 'LOW',
        project_id: createdProjects[1]?.id,
        user_id: userId,
        position: 1,
        estimated_hours: 4,
        tags: ['ui', 'feature']
      },
      {
        title: 'Export CSV des tâches',
        description: 'Permettre l\'export des tâches en format CSV',
        status: 'TODO',
        priority: 'MEDIUM',
        project_id: createdProjects[1]?.id,
        user_id: userId,
        position: 2,
        estimated_hours: 3,
        tags: ['feature', 'export']
      },
      {
        title: 'Notifications temps réel',
        description: 'Ajouter des notifications push pour les mises à jour',
        status: 'REVIEW',
        priority: 'HIGH',
        project_id: createdProjects[1]?.id,
        user_id: userId,
        position: 0,
        estimated_hours: 10,
        tags: ['feature', 'realtime']
      },
      
      // Tâches sans projet
      {
        title: 'Mettre à jour la documentation',
        description: 'Documenter les nouvelles fonctionnalités dans le README',
        status: 'TODO',
        priority: 'LOW',
        user_id: userId,
        position: 3,
        estimated_hours: 2,
        tags: ['documentation']
      },
      {
        title: 'Optimiser les performances',
        description: 'Analyser et améliorer les temps de chargement',
        status: 'TODO',
        priority: 'URGENT',
        user_id: userId,
        position: 4,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
        estimated_hours: 16,
        tags: ['performance', 'optimization']
      }
    ]

    let successCount = 0
    for (const task of tasks) {
      const { error } = await supabase
        .from('tasks')
        .insert(task)

      if (error) {
        console.error(`❌ Erreur création tâche "${task.title}":`, error.message)
      } else {
        console.log(`✅ Tâche créée: ${task.title}`)
        successCount++
      }
    }

    console.log(`\n📊 Résumé: ${successCount}/${tasks.length} tâches créées avec succès`)
    console.log('\n🎉 Données de démonstration créées ! Tu peux maintenant tester le drag & drop dans l\'application.')

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Utilise les identifiants de ton compte
const email = 'giraudgreg@hotmail.com'
const password = process.argv[2]

if (!password) {
  console.error('❌ Usage: node test-create-data.js <password>')
  process.exit(1)
}

createDemoData(email, password)