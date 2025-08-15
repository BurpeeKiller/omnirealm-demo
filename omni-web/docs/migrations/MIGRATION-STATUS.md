# 📋 Migration OmniRealm.tech → OmniWeb

**Date**: 2025-08-09  
**Status**: ✅ COMPLÉTÉ

## 🎯 Objectif
Consolider et standardiser le projet omnirealm.tech dans le monorepo principal OmniRealm.

## ✅ Actions Réalisées

### 1. Consolidation Structure
- [x] Migration de `omnirealm-site-local` vers `/dev/apps/omni-web/`
- [x] Respect de la convention de nommage OmniRealm
- [x] Suppression des duplications (my-turborepo)
- [x] Nettoyage de l'ancien répertoire omnirealm.tech

### 2. Standardisation Technique
- [x] Migration npm → pnpm
- [x] Package name: `@omnirealm/web`
- [x] Configuration TypeScript corrigée
- [x] Tests fonctionnels (7/7 passent)

### 3. Configuration Déploiement
- [x] Dockerfile optimisé pour Coolify
- [x] docker-compose.yaml configuré
- [x] Script deploy-coolify.sh créé
- [x] Variables d'environnement documentées

## 🚀 Prochaines Étapes

### Déploiement Coolify
1. **Dans Coolify** :
   - Créer nouvelle application
   - Source: Git repository
   - Branch: main
   - Path: `/dev/apps/omni-web`
   - Build Pack: Dockerfile

2. **Variables d'environnement** :
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=<votre_clé>
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   N8N_NEWSLETTER_WEBHOOK_URL=https://n8n.omnirealm.tech/webhook/newsletter
   N8N_CONTACT_WEBHOOK_URL=https://n8n.omnirealm.tech/webhook/contact
   ```

3. **Domaine** :
   - Production: omnirealm.tech
   - VPS: 91.108.113.252

### Commandes Utiles
```bash
# Développement local
cd /home/greg/projets/dev/apps/omni-web
pnpm run dev

# Test build Docker
docker build -t omni-web .
docker run -p 3000:3000 omni-web

# Déploiement
./deploy-coolify.sh
```

## 📊 Métriques
- **Fichiers migrés**: 74
- **Taille totale**: ~5MB
- **Tests**: 7/7 ✅
- **Score qualité**: À valider avec `pnpm run validate`

## 🔗 Références
- Commit: `24bba7a1`
- PR: À créer si nécessaire
- Issue: N/A

---
*Migration effectuée par Claude avec Greg*