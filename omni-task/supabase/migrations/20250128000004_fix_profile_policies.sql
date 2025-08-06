-- Migration pour corriger les politiques RLS sur les profils
-- Permet la création du profil immédiatement après l'inscription

-- Ajouter une politique pour permettre aux utilisateurs de créer leur propre profil
CREATE POLICY "Users can create their own profile on signup" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- S'assurer que la fonction handle_new_user a les bonnes permissions
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;

-- Ajouter une politique pour la création des préférences utilisateur
CREATE POLICY "Users can create their own preferences" ON public.user_preferences
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Créer les profils manquants pour les utilisateurs existants
INSERT INTO public.profiles (id, email, full_name)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Créer les préférences manquantes
INSERT INTO public.user_preferences (user_id)
SELECT p.id
FROM public.profiles p
LEFT JOIN public.user_preferences up ON p.id = up.user_id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;