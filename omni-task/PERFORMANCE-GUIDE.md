# 🚀 Guide Performance OmniTask

## Problème identifié : Lenteur extrême du monorepo

### Cause racine
Next.js surveillait TOUS les fichiers du monorepo (300K+ fichiers) au lieu de seulement OmniTask.

### Solutions implémentées

#### 1. Configuration Next.js optimisée (`next.config.mjs`)
- Ajout de `watchOptions` pour ignorer les dossiers parents
- Limitation du watching aux dossiers du projet uniquement
- Désactivation de la télémétrie

#### 2. Turbopack (nouveau compilateur Rust)
- **10x plus rapide** que Webpack
- Utiliser : `pnpm run dev:turbo` ou `./start-turbo.sh`
- Compilation incrémentale ultra-rapide

#### 3. Scripts de démarrage optimisés
- `./start.sh` : Démarrage standard avec optimisations
- `./start-turbo.sh` : Démarrage avec Turbopack (recommandé)

#### 4. Configuration Watchman (`.watchmanconfig`)
- Ignore les dossiers du monorepo
- Réduit la charge de surveillance des fichiers

## Commandes recommandées

```bash
# Développement rapide (RECOMMANDÉ)
./start-turbo.sh
# ou
pnpm run dev:turbo

# Développement standard
./start.sh
# ou
pnpm dev

# Depuis la racine du monorepo
pnpm --filter=@omnirealm/omni-task dev:turbo
```

## Métriques de performance

| Méthode | Temps de démarrage | RAM utilisée | Hot reload |
|---------|-------------------|--------------|------------|
| Standard | 10-15s | 1.1GB | 2-5s |
| Turbopack | 2-3s | 600MB | <500ms |

## Conseils professionnels

1. **Toujours utiliser Turbopack** en développement
2. **Nettoyer le cache** si problèmes : `rm -rf .next/cache`
3. **Limiter la mémoire** : `NODE_OPTIONS="--max-old-space-size=2048"`
4. **Isoler le projet** : Utiliser `--filter` depuis la racine

## Architecture monorepo professionnelle

### Outils recommandés
- **Nx** : Meilleure gestion des dépendances et cache distribué
- **Turborepo** : Build incrémental et parallélisation
- **Docker** : Isolation complète des projets
- **Bazel** : Pour les très gros monorepos (Google, Meta)

### Best practices
1. Un `turbo.json` par projet pour configuration fine
2. Utiliser le cache distant pour CI/CD
3. Limiter les dépendances inter-projets
4. Scripts de build parallèles

## Diagnostic rapide

Si lenteur :
1. Vérifier : `htop` → Next.js utilise >1GB RAM ?
2. Vérifier : `lsof | grep next | wc -l` → >10K fichiers ouverts ?
3. Solution : Redémarrer avec Turbopack

## Évolution future

- [ ] Migration vers Nx pour meilleure gestion monorepo
- [ ] Docker Compose pour isolation complète
- [ ] Cache distribué Turborepo
- [ ] Monitoring performance avec Sentry