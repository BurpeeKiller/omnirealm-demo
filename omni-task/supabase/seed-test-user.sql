-- Créer un utilisateur de test pour OmniTask
-- Email: test@omnirealm.tech
-- Password: Test123!

-- Insérer l'utilisateur dans auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'test@omnirealm.tech',
  crypt('Test123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test User"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Créer un projet par défaut
INSERT INTO projects (id, user_id, name, description, color)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Mon Premier Projet',
  'Projet de démonstration pour OmniTask',
  '#3B82F6'
) ON CONFLICT (id) DO NOTHING;

-- Créer quelques tâches de démonstration
INSERT INTO tasks (user_id, project_id, title, description, status, priority, position, tags)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Découvrir OmniTask',
    'Explorer toutes les fonctionnalités de l''application',
    'TODO',
    'HIGH',
    0,
    ARRAY['découverte', 'onboarding']
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Créer ma première tâche',
    'Utiliser le bouton "Nouvelle tâche" pour créer une tâche personnalisée',
    'TODO',
    'MEDIUM',
    1,
    ARRAY['tutorial']
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Tester le drag & drop',
    'Glisser cette tâche vers la colonne "En cours"',
    'TODO',
    'MEDIUM',
    2,
    ARRAY['tutorial', 'fonctionnalité']
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    NULL,
    'Tâche sans projet',
    'Cette tâche n''est assignée à aucun projet',
    'IN_PROGRESS',
    'LOW',
    0,
    ARRAY['exemple']
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Tâche terminée',
    'Un exemple de tâche complétée',
    'DONE',
    'HIGH',
    0,
    ARRAY['complété']
  )
ON CONFLICT DO NOTHING;

-- Afficher les informations de connexion
SELECT 'Utilisateur de test créé !' AS message
UNION ALL
SELECT '📧 Email: test@omnirealm.tech'
UNION ALL
SELECT '🔑 Password: Test123!'
UNION ALL
SELECT '🎯 Projet: Mon Premier Projet'
UNION ALL
SELECT '✅ 5 tâches de démonstration créées';