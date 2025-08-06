-- Création du namespace fitness_reminder pour Supabase self-hosted
-- Compatible avec l'architecture multi-tenant OmniRealm

-- Créer le schema si il n'existe pas
CREATE SCHEMA IF NOT EXISTS fitness_reminder;

-- Configurer les permissions
GRANT USAGE ON SCHEMA fitness_reminder TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA fitness_reminder TO postgres;

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS fitness_reminder.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  plan_expires_at TIMESTAMPTZ,
  lemon_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_fitness_reminder_profiles_email ON fitness_reminder.profiles(email);
CREATE INDEX idx_fitness_reminder_profiles_plan ON fitness_reminder.profiles(plan);

-- RLS (Row Level Security)
ALTER TABLE fitness_reminder.profiles ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs peuvent voir uniquement leur profil
CREATE POLICY "Users can view own profile" ON fitness_reminder.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy : Les utilisateurs peuvent mettre à jour leur profil
CREATE POLICY "Users can update own profile" ON fitness_reminder.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION fitness_reminder.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON fitness_reminder.profiles
  FOR EACH ROW
  EXECUTE FUNCTION fitness_reminder.update_updated_at();

-- Function pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION fitness_reminder.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO fitness_reminder.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fitness_reminder.handle_new_user();

-- Table pour les webhooks LemonSqueezy (audit trail)
CREATE TABLE IF NOT EXISTS fitness_reminder.lemon_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_id TEXT UNIQUE,
  user_email TEXT,
  data JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_fitness_reminder_lemon_webhooks_email ON fitness_reminder.lemon_webhooks(user_email);
CREATE INDEX idx_fitness_reminder_lemon_webhooks_event ON fitness_reminder.lemon_webhooks(event_name);

-- Commentaire sur le schema
COMMENT ON SCHEMA fitness_reminder IS 'Namespace pour l''application Fitness Reminder - Rappels d''exercices avec suivi';

-- Permissions pour les fonctions
GRANT EXECUTE ON FUNCTION fitness_reminder.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION fitness_reminder.update_updated_at() TO authenticated;