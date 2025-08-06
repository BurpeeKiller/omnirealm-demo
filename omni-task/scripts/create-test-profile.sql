-- Script pour créer le profil de l'utilisateur de test
-- À exécuter dans Supabase Studio ou via psql

-- 1. Trouver l'utilisateur de test
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'test.playwright@example.com';

-- 2. Créer le profil (remplacer USER_ID par l'ID trouvé ci-dessus)
-- Si vous avez l'ID, décommentez et exécutez :
/*
INSERT INTO public.profiles (id, email, full_name)
VALUES (
  'USER_ID_ICI', 
  'test.playwright@example.com', 
  'Test User Playwright'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Créer les préférences utilisateur
INSERT INTO public.user_preferences (user_id)
VALUES ('USER_ID_ICI')
ON CONFLICT (user_id) DO NOTHING;
*/

-- 4. Vérifier que tout est créé
SELECT 
  u.id, 
  u.email, 
  p.full_name,
  up.theme
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_preferences up ON u.id = up.user_id
WHERE u.email = 'test.playwright@example.com';