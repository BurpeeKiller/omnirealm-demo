# 🚀 Guide de Déploiement OmniFit

## Production Actuelle

🌐 **URL** : https://fit.omnirealm.tech  
🖥️ **Infrastructure** : VPS Hostinger + Coolify  
🐳 **Container** : Docker avec Nginx  

## 📋 Prérequis

- Node.js 20+
- pnpm 10+
- Docker (pour Coolify)
- Accès au VPS (91.108.113.252)

## 🔧 Déploiement Coolify (Recommandé)

### 1. Configuration automatique via Git

Le déploiement est automatisé via webhook GitHub :

```bash
# 1. Commit et push
git add .
git commit -m "feat: your changes"
git push origin main

# 2. Coolify détecte le push et lance le build automatiquement
```

### 2. Configuration manuelle

Si besoin de déployer manuellement :

```yaml
# coolify-compose.yml
services:
  omni-fit:
    build: 
      context: ../../..
      dockerfile: Dockerfile.omnifit
    environment:
      - NODE_ENV=production
      - VITE_APP_URL=https://fit.omnirealm.tech
    labels:
      - coolify.domain=fit.omnirealm.tech
      - coolify.https=true
    ports:
      - '3003:80'
```

### 3. Variables d'environnement Coolify

Dans l'interface Coolify :

```env
NODE_ENV=production
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}
VITE_LEMONSQUEEZY_STORE_ID=${VITE_LEMONSQUEEZY_STORE_ID}
VITE_APP_URL=https://fit.omnirealm.tech
VITE_PLAUSIBLE_DOMAIN=fit.omnirealm.tech
```

## 🐳 Build Docker Local

### 1. Build de test

```bash
# Build l'image
docker build -f Dockerfile.omnifit -t omnifit:latest .

# Test local
docker run -p 3003:80 omnifit:latest

# Vérifier
curl http://localhost:3003
```

### 2. Dockerfile optimisé

```dockerfile
FROM node:20-alpine AS builder
# ... (voir Dockerfile.omnifit complet)

FROM nginx:alpine AS runner
COPY --from=builder /app/dev/apps/omni-fit/dist /usr/share/nginx/html
EXPOSE 3003
```

## 🚀 Autres Options de Déploiement

### Vercel (Alternative)

```bash
# Installation CLI
pnpm add -g vercel

# Déploiement
cd dev/apps/omni-fit
vercel --prod

# Configuration vercel.json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify (Alternative)

```bash
# Installation CLI
pnpm add -g netlify-cli

# Déploiement
netlify deploy --prod --dir=dist

# Configuration netlify.toml
[build]
  command = "pnpm run build"
  publish = "dist"
```

## ✅ Checklist Pré-Déploiement

- [ ] Variables d'environnement configurées
- [ ] Build local réussi (`pnpm run build`)
- [ ] Tests passants (`pnpm run test`)
- [ ] Bundle < 1MB
- [ ] PWA manifest validé
- [ ] Service Worker fonctionnel
- [ ] HTTPS configuré

## 📊 Métriques de Production

### Performance
- **Bundle** : 23KB gzip (optimisé avec code splitting)
- **TTI** : < 2s sur 3G
- **Lighthouse** : 95+ toutes catégories

### Monitoring
- **Uptime** : Moniteur Coolify
- **Analytics** : Plausible (privacy-first)
- **Errors** : Console navigateur (Sentry à venir)

## 🔍 Vérification Post-Déploiement

```bash
# 1. Vérifier l'accès
curl -I https://fit.omnirealm.tech

# 2. Tester PWA
# - Installer sur mobile
# - Tester mode offline
# - Vérifier notifications

# 3. Valider les features
# - Créer un compte
# - Faire un exercice
# - Exporter les stats
```

## 🚨 Troubleshooting

### Erreur de build Docker

```bash
# Nettoyer et reconstruire
docker system prune -a
docker build --no-cache -f Dockerfile.omnifit .
```

### Module not found

```bash
# Réinstaller les dépendances
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port déjà utilisé

```bash
# Trouver le processus
lsof -i :3003
# Ou changer le port dans vite.config.ts
```

## 🔄 Rollback

Si problème en production :

1. **Via Coolify** : Revenir au déploiement précédent
2. **Via Git** : 
   ```bash
   git revert HEAD
   git push origin main
   ```

## 📝 Notes

- Les déploiements sont automatiques sur push vers `main`
- Coolify garde 5 versions pour rollback rapide
- Les logs sont disponibles dans l'interface Coolify
- SSL/TLS géré automatiquement par Coolify

---

*Dernière mise à jour : 2025-08-09*