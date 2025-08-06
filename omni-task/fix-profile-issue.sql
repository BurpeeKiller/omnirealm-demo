-- Script pour vérifier et corriger le problème de profil utilisateur manquant

-- 1. Vérifier les utilisateurs sans profil
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 2. Créer les profils manquants
INSERT INTO public.profiles (id, email, full_name)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Utilisateur') as full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Créer les préférences utilisateur manquantes
INSERT INTO public.user_preferences (user_id)
SELECT p.id
FROM public.profiles p
LEFT JOIN public.user_preferences up ON p.id = up.user_id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 4. Vérifier que le trigger existe bien
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public' 
AND trigger_name = 'on_auth_user_created';

-- 5. Si le trigger n'existe pas, le recréer
-- (Le code est déjà dans les migrations)