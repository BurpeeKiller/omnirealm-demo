# 🧪 Guide de Test - OmniFit

## Problèmes rencontrés et solutions

### 1. **Erreur de mémoire (JavaScript heap out of memory)**

**Problème** : Les tests consomment trop de mémoire dans l'environnement
monorepo.

**Solutions** :

```bash
# Option 1 : Utiliser le script avec limite de mémoire
pnpm run test:mem

# Option 2 : Lancer un seul test
pnpm run test:single src/__tests__/App.test.tsx

# Option 3 : Augmenter la mémoire Node
NODE_OPTIONS="--max-old-space-size=4096" pnpm test
```

### 2. **Tests qui échouent**

Les tests ont été corrigés pour :

- ✅ Utiliser les bons sélecteurs (data-testid)
- ✅ Mocker les stores Zustand
- ✅ Attendre les éléments asynchrones avec waitFor
- ✅ Utiliser les textes français corrects

### 3. **Lancer les tests localement**

```bash
# Depuis le dossier du projet
cd dev/apps/12-omni-fit

# Installer les dépendances si nécessaire
pnpm install

# Lancer les tests
pnpm test

# Lancer avec interface UI
pnpm test:ui

# Générer le coverage
pnpm test:coverage
```

## Structure des tests

```
src/
├── __tests__/
│   ├── App.test.tsx          # Tests principaux de l'app
│   ├── components/           # Tests des composants
│   └── services/             # Tests des services
├── test/
│   └── setup.ts             # Configuration des tests
└── hooks/
    └── useOnboarding.test.ts # Test du hook onboarding
```

## Mocks utilisés

### Stores Zustand

```typescript
vi.mock('../stores/exercises.store', () => ({
  useExercisesStore: () => ({
    exercises: [...],
    loadTodayStats: vi.fn(),
    incrementExercise: vi.fn(),
    loading: false
  })
}))
```

### Hooks

```typescript
vi.mock('../hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    shouldShowOnboarding: false,
  }),
}));
```

## Tests essentiels

1. **Rendu de l'application** : Vérifier que tous les composants s'affichent
2. **Navigation** : Tester les boutons Réglages et Stats
3. **Exercices** : Vérifier l'affichage et l'incrémentation
4. **Onboarding** : Tester le flow complet (désactivé dans les tests)

## Commandes utiles

```bash
# Tests en mode watch
pnpm test

# Tests une seule fois
pnpm test:single

# Tests avec UI interactive
pnpm test:ui

# Coverage complet
pnpm test:coverage

# Test d'un fichier spécifique
pnpm test src/__tests__/App.test.tsx
```

## Debugging

Si les tests échouent encore :

1. **Vérifier les logs** : Les console.log sont visibles dans la sortie
2. **Mode debug** : Ajouter `--reporter=verbose` pour plus de détails
3. **Isoler le test** : Utiliser `it.only()` pour tester un seul cas
4. **Vérifier les mocks** : S'assurer que tous les imports sont mockés

## CI/CD

Les tests sont exécutés automatiquement dans GitHub Actions avec :

- Node 20
- Limite mémoire augmentée
- Cache des dépendances
