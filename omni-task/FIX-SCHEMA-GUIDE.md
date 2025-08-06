# 🔧 Guide de correction du schéma Supabase

## Problème
L'erreur `relation "public.omnitask.projects" does not exist` indique que Supabase cherche dans le mauvais schéma.

## Solution appliquée

### 1. Configuration du client Supabase
Le client utilise maintenant le schéma `omnitask` par défaut :

```typescript
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'omnitask'
    }
  }
)
```

### 2. APIs corrigées
- Utilisation de `from('tasks')` au lieu de `from('omnitask.tasks')`
- Utilisation de `from('projects')` au lieu de `from('omnitask.projects')`

## Actions à faire

### Option A : Si le schéma omnitask existe déjà

1. Connectez-vous à Supabase (local ou VPS)
2. Exécutez la migration :
```sql
-- Dans l'éditeur SQL de Supabase
GRANT USAGE ON SCHEMA omnitask TO anon;
GRANT USAGE ON SCHEMA omnitask TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA omnitask TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA omnitask TO anon;
```

### Option B : Si le schéma n'existe pas

1. Exécutez toutes les migrations dans l'ordre :
```bash
# Depuis le dossier du projet
cat supabase/migrations/001_create_schema.sql
cat supabase/migrations/002_seed_data.sql
cat supabase/migrations/003_fix_schema.sql
```

2. Copiez et exécutez dans Supabase SQL Editor

### Option C : Utiliser le schéma public (plus simple)

Si vous préférez utiliser le schéma public par défaut :

1. Modifiez `/lib/supabase/client.ts` :
```typescript
// Supprimez la configuration du schéma
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

2. Créez les tables dans le schéma public au lieu d'omnitask

## Test rapide

Pour vérifier que ça fonctionne :
1. Redémarrez l'application
2. Ouvrez la console (F12)
3. Si pas d'erreur sur `/dashboard` = ✅ Succès

## Commande de démarrage
```bash
# Arrêter le serveur actuel
pkill -f "next dev"

# Redémarrer
pnpm turbo dev --filter=@omnirealm/omni-task
```