import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Configuration de la base de données...')

  try {
    // Créer les tables
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Table des projets
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          color VARCHAR(7) DEFAULT '#3B82F6',
          icon VARCHAR(50),
          is_archived BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Table des tâches
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED')),
          priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
          position INTEGER NOT NULL DEFAULT 0,
          due_date TIMESTAMPTZ,
          completed_at TIMESTAMPTZ,
          estimated_hours DECIMAL(5,2),
          actual_hours DECIMAL(5,2),
          tags TEXT[],
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Index
        CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
      `
    })

    if (createError) {
      console.error('❌ Erreur lors de la création des tables:', createError)
      // Essayons de créer les tables directement si rpc n'existe pas
      console.log('Tentative alternative...')
      
      // Cette approche ne fonctionnera pas, mais montrera l'erreur exacte
      const { error: projectError } = await supabase
        .from('projects')
        .select('id')
        .limit(1)
      
      if (projectError?.message.includes('does not exist')) {
        console.log('\n📝 Les tables n\'existent pas encore.')
        console.log('\n✅ Solution : Exécutez ce SQL dans votre client PostgreSQL :')
        console.log('\npsql postgresql://postgres:your-db-password@localhost:54322/postgres')
        console.log('\nOu utilisez un outil comme DBeaver, TablePlus, ou pgAdmin')
        console.log('\nLe fichier SQL à exécuter : supabase/migrations/create_tables_public.sql')
      }
    } else {
      console.log('✅ Tables créées avec succès!')
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

setupDatabase()