-- Migration pour activer Supabase Realtime sur OmniTask
-- Date: 2025-08-13
-- Description: Active la réplication temps réel pour les tables tasks et projects

-- Activer la réplication temps réel pour la table tasks
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Activer la réplication temps réel pour la table projects  
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- Créer une table pour les préférences utilisateur (pour sync des préférences)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  default_view VARCHAR(20) DEFAULT 'kanban' CHECK (default_view IN ('kanban', 'list', 'calendar')),
  email_notifications BOOLEAN DEFAULT true,
  ai_assistance BOOLEAN DEFAULT true,
  working_hours JSONB DEFAULT '{"start": "09:00", "end": "18:00", "timezone": "Europe/Paris"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS pour user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_preferences
CREATE POLICY "Users can view their own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" 
  ON user_preferences FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger pour updated_at sur user_preferences
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer la réplication temps réel pour user_preferences
ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;

-- Fonction pour gérer les conflits de synchronisation (last-write-wins)
CREATE OR REPLACE FUNCTION handle_realtime_conflict()
RETURNS TRIGGER AS $$
DECLARE
  conflict_resolution_strategy TEXT := 'last_write_wins';
BEGIN
  -- Pour l'instant, on utilise la stratégie last-write-wins
  -- Dans le futur, on pourrait implémenter d'autres stratégies
  
  -- Mettre à jour le timestamp
  NEW.updated_at = NOW();
  
  -- Log du conflit potentiel pour debug
  INSERT INTO realtime_conflicts (
    table_name, 
    record_id, 
    user_id, 
    conflict_type,
    old_updated_at,
    new_updated_at,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    NEW.id,
    NEW.user_id,
    'update_conflict',
    OLD.updated_at,
    NEW.updated_at,
    NOW()
  ) ON CONFLICT DO NOTHING; -- Éviter les erreurs si la table n'existe pas encore
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table pour tracker les conflits de synchronisation (optionnel, pour debug)
CREATE TABLE IF NOT EXISTS realtime_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  user_id UUID NOT NULL,
  conflict_type VARCHAR(20) NOT NULL,
  old_updated_at TIMESTAMPTZ,
  new_updated_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances de la table de conflits
CREATE INDEX IF NOT EXISTS idx_realtime_conflicts_user_id ON realtime_conflicts(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_conflicts_table_record ON realtime_conflicts(table_name, record_id);

-- Activer RLS sur la table de conflits
ALTER TABLE realtime_conflicts ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs voient leurs propres conflits
CREATE POLICY "Users can view their own conflicts" 
  ON realtime_conflicts FOR SELECT 
  USING (auth.uid() = user_id);