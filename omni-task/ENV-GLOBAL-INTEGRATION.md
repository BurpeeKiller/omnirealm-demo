# 🔗 Intégration avec le Système de Variables Globales

**Status** : Configuration mise en place  
**Date** : 2025-07-28

## 🎯 Problème Initial

OmniTask utilise des variables Next.js standard :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Mais le système global exporte :
- `OMNITASK_SUPABASE_URL`
- `OMNITASK_SUPABASE_ANON_KEY`
- `OMNITASK_FRONTEND_URL`

## 🛠️ Solutions Implémentées

### 1. **Fichier de Mapping** (`env.config.js`)
Mappe automatiquement les variables globales vers celles attendues par Next.js :
```javascript
NEXT_PUBLIC_SUPABASE_URL = OMNITASK_SUPABASE_URL || NEXT_PUBLIC_SUPABASE_URL
```

### 2. **Import dans Next.js** (`next.config.mjs`)
```javascript
import './env.config.js'  // Charge le mapping au démarrage
```

### 3. **Script de Démarrage** (`start-with-global-env.sh`)
Alternative qui charge explicitement les variables globales :
```bash
./start-with-global-env.sh  # Au lieu de pnpm dev
```

## 📋 Comment Utiliser

### Option A : Via le Système Multi-Dev (Recommandé)
```bash
cd /home/greg/projets
omnidev-start
# Choisir option 2 (OmniTask seulement)
```
✅ Les variables sont automatiquement exportées et mappées

### Option B : Démarrage Direct avec Variables Globales
```bash
cd /home/greg/projets/dev/apps/omni-task
./start-with-global-env.sh
```
✅ Charge explicitement les variables globales

### Option C : Mode Classique (sans variables globales)
```bash
cd /home/greg/projets/dev/apps/omni-task
pnpm dev
```
⚠️ Utilise uniquement `.env.local` (pas les variables globales)

## 🔍 Vérification

Pour vérifier que les variables globales sont utilisées :
1. Démarrer avec `omnidev-start`
2. Observer les logs : "Using global vars: true"
3. Vérifier l'URL Supabase dans les DevTools

## 📝 Notes Techniques

### Priorité des Variables
1. `.env.local` (plus haute priorité)
2. Variables globales exportées (via mapping)
3. `.env` (template par défaut)

### Compatibilité
- ✅ Fonctionne avec l'ancien système (.env.local)
- ✅ Fonctionne avec le nouveau système (variables globales)
- ✅ Permet une migration progressive

## 🚀 Avantages

1. **Flexibilité** : Peut utiliser les deux systèmes
2. **Cohérence** : Ports et URLs centralisés
3. **Migration douce** : Pas besoin de tout changer d'un coup
4. **Debug facile** : Logs clairs sur l'origine des variables