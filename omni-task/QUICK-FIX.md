# 🚀 Fix rapide pour l'erreur de schéma

## Problème
`Error: relation "public.omnitask.projects" does not exist`

## Solution appliquée
J'ai simplifié en utilisant le schéma public par défaut (plus standard).

## Actions à faire

### 1. Exécuter le SQL dans Supabase

Allez dans votre interface Supabase (http://localhost:54321 ou VPS) :
1. Cliquez sur **SQL Editor**
2. Copiez-collez le contenu de : `/supabase/migrations/create_tables_public.sql`
3. Cliquez sur **Run**

### 2. Redémarrer l'application

```bash
# Arrêter si nécessaire
pkill -f "next dev"

# Redémarrer
cd /home/greg/projets
pnpm turbo dev --filter=@omnirealm/omni-task
```

### 3. Tester

1. Aller sur http://localhost:3000/dashboard
2. L'erreur devrait avoir disparu
3. Créer une nouvelle tâche pour vérifier

## Alternative : Données de test

Si tu veux des données de test :

```sql
-- Insérer un projet de test
INSERT INTO projects (user_id, name, description, color)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Projet Demo',
  'Mon premier projet',
  '#3B82F6'
);

-- Insérer quelques tâches
INSERT INTO tasks (user_id, title, description, status, priority, position)
VALUES 
  ((SELECT id FROM auth.users LIMIT 1), 'Tâche 1', 'Description 1', 'TODO', 'HIGH', 0),
  ((SELECT id FROM auth.users LIMIT 1), 'Tâche 2', 'Description 2', 'IN_PROGRESS', 'MEDIUM', 0),
  ((SELECT id FROM auth.users LIMIT 1), 'Tâche 3', 'Description 3', 'DONE', 'LOW', 0);
```

C'est tout ! L'application devrait maintenant fonctionner correctement. 🎉