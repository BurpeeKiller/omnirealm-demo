# Rapport de nettoyage OmniFit - 2025-08-14

## Résumé
Nettoyage complet du projet OmniFit pour supprimer les fichiers inutiles, obsolètes et dupliqués.

## Fichiers supprimés à la racine (4 fichiers)

### Configuration incorrecte
- ✓ `next.config.mjs` - Configuration Next.js inutile (projet utilise Vite)

### Fichiers dupliqués
- ✓ `nginx-default.conf` - Doublon avec nginx.conf existant

### Fichiers obsolètes
- ✓ `coolify-compose.yml` - Référence Dockerfile.omnifit inexistant

### Cache volumineux
- ✓ `tsconfig.tsbuildinfo` - Cache TypeScript de 363KB

## Fichiers supprimés dans src/ (11 fichiers)

### Composants
- ✓ `src/components/IOSInstallPrompt.tsx`
- ✓ `src/components/PlausibleProvider.tsx`
- ✓ `src/components/Onboarding/OnboardingTrigger.tsx`
- ✓ `src/components/Onboarding/ContextualTips.tsx`
- ✓ `src/components/Onboarding/OnboardingModal.tsx`

### Services
- ✓ `src/services/ai-coach-local.ts`
- ✓ `src/services/openai-service.ts`

### Utilitaires et tests
- ✓ `src/utils/contextualTips.ts`
- ✓ `src/__tests__/hooks/useOnboarding.test.ts`

### Autres
- ✓ `coverage/` - Dossier de couverture de tests
- ✓ `.vscode/` - Configuration IDE

## Impact total
- **15 fichiers supprimés**
- **~400KB d'espace libéré**
- **Réduction de la complexité du projet**
- **25 fichiers restants à la racine** (contre 29 initialement)

## Sauvegardes créées
- `../omnifit-cleanup-backup-20250814-192310.tar.gz`
- `../omnifit-cleanup-backup-20250814-192323.tar.gz`
- `../omnifit-root-cleanup-20250814-*.tar.gz`

## Fichiers conservés (vérifiés comme légitimes)
- `tsconfig.node.json` - Nécessaire pour la configuration TypeScript de Vite
- Tous les fichiers de configuration essentiels (package.json, vite.config.ts, etc.)
- Documentation projet (README.md, ARCHITECTURE.md, etc.)
- Configuration d'environnement (.env.*)

## Prochaines étapes recommandées
1. Corriger les 138 erreurs TypeScript restantes
2. Optimiser les dépendances package.json
3. Mettre à jour la documentation si nécessaire