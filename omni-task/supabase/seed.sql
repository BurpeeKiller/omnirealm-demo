-- Seed data for development
-- This file can be run after the migration to add test data

-- Create a test user (password: password123)
-- Note: In production, users should register through the app
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a',
  'test@example.com',
  '$2a$10$PkHMP2E.7SJbMTTRlpeM7OeEDYCCaHCLSdAL0JC4nwJTaByRlmFOK', -- password123
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test User"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create test projects
INSERT INTO public.projects (id, name, description, icon, color, user_id) VALUES
  ('p1', 'OmniTask MVP', 'Développement de la version MVP', '🚀', '#3B82F6', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a'),
  ('p2', 'Marketing', 'Campagnes et stratégie marketing', '📢', '#8B5CF6', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a'),
  ('p3', 'Documentation', 'Documentation technique et utilisateur', '📚', '#10B981', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a')
ON CONFLICT (id) DO NOTHING;

-- Create test tasks
INSERT INTO public.tasks (title, description, status, priority, position, project_id, user_id, due_date, estimated_hours, tags) VALUES
  ('Configurer l''environnement de développement', 'Installer Node.js, pnpm et les dépendances du projet', 'DONE', 'HIGH', 1, 'p1', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a', null, 2, ARRAY['setup', 'dev']),
  ('Créer les composants UI de base', 'Boutons, modals, formulaires avec Radix UI', 'IN_PROGRESS', 'MEDIUM', 1, 'p1', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a', null, 4, null),
  ('Intégrer l''authentification Supabase', 'Connexion, inscription, gestion de session', 'TODO', 'HIGH', 1, 'p1', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a', now() + interval '7 days', 6, ARRAY['auth', 'supabase']),
  ('Ajouter les tests unitaires', 'Tests pour les composants et les hooks', 'TODO', 'LOW', 2, 'p1', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a', null, 8, ARRAY['tests']),
  ('Créer la landing page', 'Page d''accueil avec les features', 'TODO', 'HIGH', 1, 'p2', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a', now() + interval '3 days', 4, ARRAY['marketing', 'landing']),
  ('Rédiger la documentation API', 'Documentation des endpoints REST', 'TODO', 'MEDIUM', 1, 'p3', 'f7b9c5e3-4c2a-4d8f-9e1b-3a5c7d8e9f1a', now() + interval '14 days', 3, ARRAY['docs', 'api'])
ON CONFLICT DO NOTHING;