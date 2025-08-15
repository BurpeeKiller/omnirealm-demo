# 🚀 Guide de Configuration Coolify - OmniWeb

**Date**: 2025-08-09  
**Application**: @omnirealm/web  
**VPS**: 91.108.113.252 (Tailscale: 100.84.134.70)

## 📋 Prérequis

✅ Le projet est dans `/dev/apps/omni-web/`  
✅ Dockerfile et docker-compose.yaml configurés  
✅ Build de production testé (15 pages générées)  
✅ Tests passent (7/7)

## 🎯 Configuration dans Coolify

### Étape 1: Créer une Nouvelle Application

1. **Accédez à Coolify**
   - URL: https://coolify.votre-vps.com (ou IP directe)
   - Connectez-vous avec vos identifiants

2. **Créer une nouvelle application**
   - Cliquez sur "New Resource" > "Application"
   - Nom: `omnirealm-web` ou `omni-web`

### Étape 2: Configuration Source

```yaml
Source Type: Git Repository
Repository URL: [URL de votre repo Git]
Branch: main
Build Pack: Dockerfile
Dockerfile Location: Dockerfile.omniweb
Build Context: . (racine)
```

**⚠️ Important**: Le Dockerfile.omniweb est à la racine du monorepo, pas dans le dossier omni-web.

### Étape 3: Variables d'Environnement

Dans l'onglet "Environment Variables", ajoutez :

```env
# Analytics PostHog
NEXT_PUBLIC_POSTHOG_KEY=votre_clé_posthog_ici
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Webhooks n8n
N8N_NEWSLETTER_WEBHOOK_URL=https://n8n.omnirealm.tech/webhook/newsletter
N8N_CONTACT_WEBHOOK_URL=https://n8n.omnirealm.tech/webhook/contact

# Next.js Config
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
```

**Note**: Les variables `COOLIFY_*` sont automatiquement injectées par Coolify.

### Étape 4: Configuration Réseau

```yaml
Port: 3000
Protocol: HTTP
Health Check: /
Health Check Path: /api/health (optionnel)
```

### Étape 5: Domaine

```yaml
Domain: omnirealm.tech
SSL: Automatique (Let's Encrypt)
```

## 🔧 Configuration Docker

Le projet utilise ces fichiers (déjà configurés) :

**Dockerfile.omniweb** : Multi-stage build optimisé Next.js
- Stage 1: Installation des dépendances
- Stage 2: Build de l'application
- Stage 3: Runtime optimisé

**docker-compose.yaml** : Configuration pour Coolify
- Port 3000 exposé
- Variables d'environnement mappées
- Restart policy configuré

## 🚀 Déploiement

### 1. Premier Déploiement

1. Sauvegardez la configuration
2. Cliquez sur "Deploy"
3. Surveillez les logs de build

### 2. Vérification

```bash
# Logs de build
Coolify > Application > Logs > Build

# Logs d'exécution
Coolify > Application > Logs > Runtime

# Test de l'application
curl https://omnirealm.tech
```

### 3. Commandes de Debug (si nécessaire)

```bash
# SSH sur le VPS
ssh greg@91.108.113.252

# Vérifier les conteneurs
docker ps | grep omni-web

# Logs du conteneur
docker logs <container-id>

# Accès au conteneur
docker exec -it <container-id> sh
```

## 📊 Métriques de Build Attendues

```
✓ Dependencies installed: ~382 packages
✓ TypeScript compilation: Success
✓ Static pages generated: 15
✓ Bundle size: ~110kB First Load JS
✓ Build time: ~3-5 minutes
```

## 🛠️ Scripts de Maintenance

### Redéploiement automatique

```bash
# Depuis votre machine locale
cd /home/greg/projets/dev/apps/omni-web

# Build et test local
pnpm run build
pnpm test

# Commit et push (déclenche auto-déploiement)
git add -A
git commit -m "update: nouvelle version omni-web"
git push origin main
```

### Script de déploiement manuel

```bash
# Utiliser le script fourni
./deploy-coolify.sh
```

## 🔍 Troubleshooting

### Problème: Build échoue
```bash
# Vérifier les logs Coolify
# Cause commune: Variables d'environnement manquantes
```

### Problème: Application ne démarre pas
```bash
# Vérifier le port 3000
# Vérifier les variables NODE_ENV, PORT, HOSTNAME
```

### Problème: Domaine inaccessible
```bash
# Vérifier la configuration DNS
# Vérifier le certificat SSL Let's Encrypt
```

## 📝 Checklist de Déploiement

- [ ] Application créée dans Coolify
- [ ] Source Git configurée (branch: main)
- [ ] Build Path: `/dev/apps/omni-web`
- [ ] Variables d'environnement définies
- [ ] Port 3000 configuré
- [ ] Domaine omnirealm.tech configuré
- [ ] Premier déploiement lancé
- [ ] Build réussi (logs verts)
- [ ] Application accessible sur https://omnirealm.tech
- [ ] SSL fonctionnel
- [ ] Tests fonctionnels sur le site live

## 🎯 URLs de Test

Une fois déployé, testez ces URLs :

```
https://omnirealm.tech/          # Page d'accueil
https://omnirealm.tech/about     # À propos
https://omnirealm.tech/contact   # Contact
https://omnirealm.tech/api/contact # API (POST test)
```

---

**Support** : En cas de problème, consultez les logs Coolify et ce guide.  
**Maintenance** : Redéploiement automatique à chaque push sur main.