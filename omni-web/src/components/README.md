# Tests

Ce répertoire contient les tests unitaires pour les composants de l'application
OmniRealm.

## Configuration

- **Framework de test** : Jest avec Next.js
- **Bibliothèque de test** : React Testing Library
- **Configuration** : `jest.config.ts` et `jest.setup.js`

## Tests disponibles

### Composants testés

1. **Header** (`Header.test.tsx`)
   - Rendu du titre OmniRealm
   - Affichage des liens de navigation

2. **FooterSection** (`FooterSection.test.tsx`)
   - Informations de l'entreprise
   - Liens de navigation (Produits, Communauté, Ressources)
   - Informations de contact

3. **MetricCard** (`MetricCard.test.tsx`)
   - Rendu avec toutes les props
   - Rendu avec props minimales

## Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests avec coverage
npm run test:coverage
```

## Hooks Git

Un hook de pre-commit est configuré pour exécuter automatiquement les tests
avant chaque commit, garantissant la qualité du code.

## Prochaines étapes

- [ ] Ajouter des tests pour HeroSection
- [ ] Ajouter des tests pour les API routes
- [ ] Implémenter des tests d'intégration
- [ ] Ajouter la couverture de code
- [ ] Tests end-to-end avec Playwright/Cypress
