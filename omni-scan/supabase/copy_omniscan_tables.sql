-- Script pour copier les tables du schéma omniscan vers public
-- pour permettre au backend OmniScan de fonctionner

-- Vérifier d'abord si les tables existent déjà dans public
DO $$ 
BEGIN
    -- Supprimer les tables existantes dans public si elles existent
    DROP TABLE IF EXISTS public.documents CASCADE;
    DROP TABLE IF EXISTS public.user_profiles CASCADE;
END $$;

-- Copier la structure de la table documents
CREATE TABLE public.documents AS 
SELECT * FROM omniscan.documents WHERE 1=0;

-- Recréer les contraintes et index pour documents
ALTER TABLE public.documents 
    ADD PRIMARY KEY (id),
    ALTER COLUMN id SET DEFAULT gen_random_uuid(),
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET DEFAULT NOW();

-- Créer les index
CREATE INDEX idx_public_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_public_documents_status ON public.documents(status);
CREATE INDEX idx_public_documents_created_at ON public.documents(created_at DESC);

-- Créer la table user_profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    subscription_plan TEXT DEFAULT 'free',
    documents_quota INTEGER DEFAULT 5,
    documents_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Activer RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Créer les policies pour documents
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid()::text = user_id);

-- Créer les policies pour user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Grant permissions
GRANT ALL ON public.documents TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;

-- Afficher les tables créées
SELECT 'Tables créées dans le schéma public:' as message;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('documents', 'user_profiles');