# 🚀 Guide de Configuration Supabase Production pour OmniTask

## 📋 Prérequis

- VPS avec Supabase installé via Coolify
- Accès SSH au VPS
- PostgreSQL en cours d'exécution
- Domaine configuré (task.omnirealm.tech)

## 🔧 Étapes de Configuration

### 1. Préparer l'environnement local

```bash
# Copier le template de production
cp .env.production.example .env.production

# Éditer avec vos vraies valeurs
nano .env.production
```

### 2. Créer la base de données sur le VPS

```bash
# Se connecter au VPS
ssh greg@91.108.113.252

# Créer la base de données OmniTask
docker exec coolify-postgres psql -U postgres -c "CREATE DATABASE omnitask;"

# Créer un utilisateur dédié (optionnel mais recommandé)
docker exec coolify-postgres psql -U postgres -c "CREATE USER omnitask_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe_fort';"
docker exec coolify-postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE omnitask TO omnitask_user;"
```

### 3. Appliquer les migrations

```bash
# Depuis votre machine locale, dans le dossier omni-task
./scripts/deploy-production.sh
# Choisir option 1 pour déploiement complet
```

### 4. Configurer les politiques RLS

Les politiques RLS sont cruciales pour la sécurité. Elles sont déjà définies dans les migrations mais voici un rappel :

```sql
-- Chaque utilisateur ne peut voir/modifier que ses propres données
-- Les politiques sont dans : supabase/migrations/20250128000001_create_tables_public.sql
```

### 5. Obtenir les clés Supabase

```bash
# Sur le VPS
cd /home/greg/projets/dev/tools/vps/scripts
./supabase.manager.sh status

# Les clés seront affichées. Notez :
# - ANON_KEY (pour le client)
# - SERVICE_ROLE_KEY (pour le serveur)
```

### 6. Tester la connexion

```bash
# Test depuis votre machine locale
curl https://supabase.omnirealm.tech/rest/v1/projects \
  -H "apikey: VOTRE_ANON_KEY" \
  -H "Authorization: Bearer VOTRE_ANON_KEY"
```

## 🔒 Sécurité

### Variables d'environnement

**JAMAIS** commiter `.env.production` ! Il est dans `.gitignore`.

### Backups automatiques

Créer un cron job sur le VPS :

```bash
# Éditer le crontab
crontab -e

# Ajouter (backup quotidien à 3h du matin)
0 3 * * * docker exec coolify-postgres pg_dump -U postgres omnitask > /backup/omnitask_$(date +\%Y\%m\%d).sql
```

### Monitoring

1. **Logs PostgreSQL** :
```bash
docker logs coolify-postgres --tail 100 -f
```

2. **Métriques Supabase** :
```bash
docker exec coolify-postgres psql -U postgres -d omnitask -c "SELECT COUNT(*) FROM tasks;"
```

## 🚨 Troubleshooting

### Erreur de connexion

1. Vérifier que Supabase est accessible :
```bash
curl https://supabase.omnirealm.tech/rest/v1/
```

2. Vérifier les logs Kong :
```bash
docker logs coolify-supabase-kong --tail 50
```

### Problèmes de permissions

```bash
# Sur le VPS
./supabase.manager.sh fix
```

### Reset complet (DANGER)

```bash
# ⚠️ Supprime TOUTES les données
./supabase.manager.sh clean
./supabase.manager.sh fix
```

## 📊 Structure de la base de données

### Tables principales

1. **projects**
   - Gestion des projets utilisateur
   - Soft delete avec `is_archived`

2. **tasks**
   - Tâches avec statuts (TODO, IN_PROGRESS, DONE, ARCHIVED)
   - Priorités (LOW, MEDIUM, HIGH, URGENT)
   - Support des tags et dates d'échéance

3. **profiles** (géré par Supabase Auth)
   - Profils utilisateur
   - Synchronisé avec auth.users

### Indexes pour la performance

- `idx_tasks_user_id` : Requêtes par utilisateur
- `idx_tasks_project_id` : Requêtes par projet
- `idx_tasks_status` : Filtrage par statut

## 🔄 Workflow de mise à jour

1. **Développement local** :
```bash
# Créer une nouvelle migration
supabase migration new nom_de_la_migration

# Tester localement
supabase db reset
```

2. **Déploiement** :
```bash
# Utiliser le script de déploiement
./scripts/deploy-production.sh
```

## 📱 URLs de production

- **Application** : https://task.omnirealm.tech
- **Supabase API** : https://supabase.omnirealm.tech
- **PostgreSQL** : localhost:5432 (depuis le VPS uniquement)

## 🆘 Support

En cas de problème :

1. Consulter les logs : `pm2 logs omnitask`
2. Vérifier Supabase : `./supabase.manager.sh status`
3. Tester la connexion DB : `docker exec coolify-postgres psql -U postgres -d omnitask -c "\dt"`