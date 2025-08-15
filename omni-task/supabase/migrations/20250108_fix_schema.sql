-- Migration pour corriger le schéma de la base de données OmniTask
-- Date: 2025-01-08

-- 1. S'assurer que l'extension UUID est activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Créer le schéma shared s'il n'existe pas
CREATE SCHEMA IF NOT EXISTS shared;

-- 3. Créer la fonction update_updated_at_column si elle n'existe pas
CREATE OR REPLACE FUNCTION shared.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. S'assurer que la table projects a toutes les colonnes nécessaires
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 5. S'assurer que la table tasks a la colonne tags comme array
DO $$ 
BEGIN
    -- Vérifier si la colonne tags existe et n'est pas un array
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tasks' 
        AND column_name = 'tags'
        AND data_type != 'ARRAY'
    ) THEN
        -- Supprimer l'ancienne colonne tags
        ALTER TABLE public.tasks DROP COLUMN tags;
    END IF;
    
    -- Ajouter la colonne tags comme array si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tasks' 
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE public.tasks ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- 6. Corriger les contraintes de vérification
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_status_check 
    CHECK (status IN ('todo', 'in_progress', 'review', 'done'));

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- 7. Corriger les valeurs par défaut
ALTER TABLE public.tasks 
ALTER COLUMN status SET DEFAULT 'todo',
ALTER COLUMN priority SET DEFAULT 'medium',
ALTER COLUMN position SET DEFAULT 0;

-- 8. S'assurer que RLS est activé
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 9. Recréer les policies RLS pour tasks (au cas où elles seraient incorrectes)
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;

CREATE POLICY "Users can create their own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);

-- 10. Recréer les policies RLS pour projects (déjà fait mais on s'assure)
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;

CREATE POLICY "Users can create their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

-- 11. Créer les index manquants
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- 12. S'assurer que les triggers sont en place
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION shared.update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION shared.update_updated_at_column();

-- 13. Créer la fonction user_has_access si elle n'existe pas
CREATE OR REPLACE FUNCTION public.user_has_access(p_application_id TEXT, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Pour l'instant, on autorise tous les utilisateurs authentifiés
    -- Plus tard on peut ajouter une logique de permissions par application
    RETURN p_user_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Nettoyer les colonnes inutilisées
ALTER TABLE public.tasks DROP COLUMN IF EXISTS status_id;

-- Fin de la migration