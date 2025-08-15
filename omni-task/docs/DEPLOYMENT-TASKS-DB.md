# Guide de déploiement - Base de données OmniTask

## 🚨 Problème résolu

L'erreur `relation "public.tasks" does not exist` est causée par l'absence des tables dans la base de données Supabase.

## 🔧 Solution - Étapes à suivre

### 1. Se connecter au VPS OmniRealm

```bash
ssh omni-admin@100.87.146.1 -p 2222
```

### 2. Aller dans le répertoire du projet

```bash
cd /home/omni-admin/omnirealm-system
```

### 3. Appliquer les migrations SQL

```bash
# Se connecter à la base de données Supabase
cd dev/tools/supabase

# Appliquer la migration multi-tenant (si pas déjà fait)
supabase db push --file migrations/001_multi_tenant_auth.sql

# Appliquer la migration OmniTask (NOUVELLE)
supabase db push --file migrations/002_omnitask_schema.sql
```

### 4. Vérifier que les tables sont créées

Connectez-vous à Supabase Studio ou utilisez psql :

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Devrait afficher :
-- projects
-- tags
-- task_attachments
-- task_comments
-- task_statuses
-- task_tags
-- tasks
```

### 5. Redéployer l'application OmniTask

Dans Coolify :
1. Aller sur l'application OmniTask
2. Cliquer sur "Redeploy"
3. Attendre que le déploiement soit terminé

Ou via webhook :
```bash
curl -X POST https://coolify.omnirealm.tech/webhook/omnitask-deploy
```

### 6. Tester l'application

1. Se connecter avec alex211226@yahoo.fr
2. Créer une nouvelle tâche
3. Vérifier que la tâche est bien enregistrée

## 📋 Schéma de base de données créé

### Tables principales

- **public.projects** - Projets des utilisateurs
- **public.tasks** - Tâches avec toutes les colonnes nécessaires
- **public.task_statuses** - Statuts personnalisés par projet
- **public.tags** - Tags réutilisables
- **public.task_tags** - Relation many-to-many tâches/tags
- **public.task_comments** - Commentaires sur les tâches
- **public.task_attachments** - Fichiers joints

### Fonctions utilitaires

- `create_default_task_statuses(project_id)` - Crée les 4 statuts par défaut
- `get_project_stats(project_id)` - Statistiques d'un projet

### Sécurité

- RLS (Row Level Security) activé sur toutes les tables
- Policies pour que chaque utilisateur ne voit que ses données
- Triggers pour `updated_at` automatique

## 🐛 Résolution de problèmes

### Si les migrations échouent

1. Vérifier la connexion Supabase :
```bash
supabase db remote list
```

2. Se connecter manuellement et appliquer :
```bash
psql $DATABASE_URL < migrations/002_omnitask_schema.sql
```

### Si les tâches ne s'affichent toujours pas

1. Vérifier les logs Coolify
2. Inspecter la console du navigateur
3. Vérifier que les variables d'environnement sont bien définies :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Validation

Une fois tout appliqué, ces fonctionnalités doivent marcher :

- ✅ Créer une nouvelle tâche
- ✅ Modifier une tâche existante
- ✅ Supprimer une tâche
- ✅ Déplacer une tâche entre colonnes (plus tard avec drag & drop)
- ✅ Créer des projets
- ✅ Ajouter des tags

---

**Note** : Ce guide résout le problème critique de l'absence de tables. Une fois appliqué, OmniTask sera pleinement fonctionnel pour la gestion des tâches !