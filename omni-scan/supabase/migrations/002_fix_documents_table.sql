-- Supprimer les contraintes existantes si nécessaire
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_user_id_fkey;

-- Modifier la table documents pour accepter des UUID strings
ALTER TABLE documents 
  ALTER COLUMN id TYPE VARCHAR(36),
  ALTER COLUMN user_id TYPE VARCHAR(36);

-- Recréer les index
DROP INDEX IF EXISTS idx_documents_user_id;
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- Désactiver temporairement RLS pour les tests
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;