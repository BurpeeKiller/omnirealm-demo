# 🚀 Guide Turborepo pour OmniTask

## ✅ Configuration actuelle

- **Turborepo** : Installé à la racine du monorepo (v2.5.5)
- **Turbopack** : Intégré dans Next.js (`--turbo`)
- **Isolation** : Automatique avec Turborepo

## 🎯 Commandes optimales

### Depuis la RACINE du monorepo (`/home/greg/projets/`)

```bash
# Développement avec Turborepo + Turbopack (RECOMMANDÉ)
pnpm turbo dev --filter=@omnirealm/omni-task -- --turbo

# Développement standard avec Turborepo
pnpm turbo dev --filter=@omnirealm/omni-task

# Build avec cache intelligent
pnpm turbo build --filter=@omnirealm/omni-task

# Lancer les tests
pnpm turbo test --filter=@omnirealm/omni-task

# Tout vérifier (lint, types, tests)
pnpm turbo quality --filter=@omnirealm/omni-task
```

### Depuis le dossier OmniTask (`/dev/apps/omni-task/`)

```bash
# Développement rapide (Turbopack activé par défaut)
pnpm dev

# Script optimal (Turborepo + Turbopack)
./start-optimal.sh

# Développement sans Turbopack (si problème)
pnpm dev:slow
```

## 🔥 Avantages de Turborepo

1. **Isolation automatique** : Ne surveille QUE les fichiers du projet
2. **Cache intelligent** : Re-build seulement ce qui a changé
3. **Parallélisation** : Lance plusieurs tâches en même temps
4. **Remote cache** : Partage le cache entre développeurs (à configurer)

## 📊 Comparaison des méthodes

| Méthode | Commande | Performance | Isolation |
|---------|----------|-------------|-----------|
| Turborepo + Turbopack | `pnpm turbo dev --filter=@omnirealm/omni-task -- --turbo` | ⚡⚡⚡⚡⚡ | ✅ |
| Turborepo seul | `pnpm turbo dev --filter=@omnirealm/omni-task` | ⚡⚡⚡⚡ | ✅ |
| Direct + Turbopack | `cd omni-task && pnpm dev` | ⚡⚡⚡ | ❌ |
| Direct standard | `cd omni-task && pnpm dev:slow` | ⚡ | ❌ |

## 🎯 Workflow recommandé

1. **Toujours utiliser Turborepo** depuis la racine
2. **Ajouter `-- --turbo`** pour Turbopack
3. **Utiliser `--filter`** pour cibler un projet
4. **Profiter du cache** pour les builds

## 💡 Tips

- `turbo run dev --graph` : Visualiser les dépendances
- `turbo run dev --dry-run` : Voir ce qui sera exécuté
- `turbo daemon status` : Vérifier le daemon Turborepo
- `turbo daemon clean` : Nettoyer le cache si problème

## ❌ Ce qu'on a supprimé

- `turbo.json` dans OmniTask (redondant)
- Script `start-turbo.sh` (remplacé par start-optimal.sh)
- Confusion entre Turbopack et Turborepo

## ✅ Configuration simplifiée

Maintenant tout est clair :
- **Turborepo** = Orchestrateur de build monorepo
- **Turbopack** = Compilateur Rust de Next.js
- **Les deux ensemble** = Performance maximale ! 🚀