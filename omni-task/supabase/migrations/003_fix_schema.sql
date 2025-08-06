-- Migration pour s'assurer que le schéma omnitask existe et est configuré correctement

-- S'assurer que le schéma existe
CREATE SCHEMA IF NOT EXISTS omnitask;

-- Donner les permissions au rôle anon
GRANT USAGE ON SCHEMA omnitask TO anon;
GRANT USAGE ON SCHEMA omnitask TO authenticated;

-- Donner les permissions sur toutes les tables du schéma
GRANT ALL ON ALL TABLES IN SCHEMA omnitask TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA omnitask TO anon;

-- Donner les permissions sur les séquences
GRANT ALL ON ALL SEQUENCES IN SCHEMA omnitask TO authenticated;

-- Définir le search_path pour inclure omnitask
ALTER DATABASE postgres SET search_path TO omnitask, public;

-- Note: Si les tables n'existent pas encore dans le schéma omnitask,
-- utilisez les scripts de migration précédents pour les créer