# 🧪 Stratégie de Tests OmniFit

## 📊 État Actuel
- **Couverture**: < 20%
- **Tests existants**: 9 fichiers
- **Framework**: Vitest + React Testing Library
- **Tests E2E**: Aucun

## 🎯 Objectifs
- **Court terme**: 50% de couverture (2 semaines)
- **Moyen terme**: 80% de couverture (1 mois)
- **Long terme**: 90%+ avec E2E (3 mois)

## 📋 Plan d'Action Prioritaire

### Phase 1: Tests Critiques (Semaine 1)

#### 1. Stores Zustand (Priorité: CRITIQUE)
```typescript
// src/__tests__/stores/exercises.store.test.ts
describe('ExercisesStore', () => {
  it('should add exercise correctly');
  it('should calculate daily stats');
  it('should persist data');
  it('should handle errors gracefully');
});

// src/__tests__/stores/reminder.store.test.ts
describe('ReminderStore', () => {
  it('should schedule reminders');
  it('should handle notification permissions');
  it('should persist reminder settings');
});

// src/__tests__/stores/api.store.test.ts
describe('ApiStore', () => {
  it('should manage API key lifecycle');
  it('should validate API keys');
  it('should handle network errors');
});
```

#### 2. Services Critiques
```typescript
// src/__tests__/services/auth.service.test.ts
describe('AuthService', () => {
  it('should handle login flow');
  it('should refresh tokens');
  it('should logout correctly');
  it('should handle OAuth providers');
});

// src/__tests__/services/backup.test.ts
describe('BackupService', () => {
  it('should create backups');
  it('should restore from backup');
  it('should handle sync conflicts');
  it('should encrypt sensitive data');
});
```

#### 3. Hooks Personnalisés
```typescript
// src/__tests__/hooks/useExercise.test.ts
describe('useExercise', () => {
  it('should handle exercise creation');
  it('should update exercise state');
  it('should calculate streaks');
});

// src/__tests__/hooks/useNotification.test.ts
describe('useNotification', () => {
  it('should request permissions');
  it('should schedule notifications');
  it('should handle permission denial');
});
```

### Phase 2: Composants UI (Semaine 2)

#### 1. Composants Critiques
```typescript
// src/__tests__/components/Dashboard.test.tsx
describe('Dashboard', () => {
  it('should render exercise cards');
  it('should handle exercise completion');
  it('should update stats in real-time');
  it('should show loading states');
});

// src/__tests__/components/Settings.test.tsx
describe('Settings', () => {
  it('should save user preferences');
  it('should handle data export');
  it('should manage notifications');
});
```

#### 2. Flows d'Interaction
```typescript
// src/__tests__/flows/onboarding.test.tsx
describe('Onboarding Flow', () => {
  it('should complete full onboarding');
  it('should handle skip actions');
  it('should persist onboarding state');
});

// src/__tests__/flows/premium-upgrade.test.tsx
describe('Premium Upgrade Flow', () => {
  it('should handle payment flow');
  it('should activate premium features');
  it('should handle payment failures');
});
```

### Phase 3: Tests E2E (Semaine 3-4)

#### 1. Configuration Playwright
```typescript
// e2e/playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }},
    { name: 'mobile', use: { ...devices['iPhone 13'] }},
  ],
});
```

#### 2. Scénarios E2E Critiques
```typescript
// e2e/user-journey.spec.ts
test.describe('User Journey', () => {
  test('new user completes first exercise');
  test('user upgrades to premium');
  test('user exports and imports data');
  test('offline mode functionality');
});

// e2e/pwa-features.spec.ts
test.describe('PWA Features', () => {
  test('install prompt appears');
  test('works offline');
  test('notifications work');
  test('background sync works');
});
```

## 🛠️ Outils et Configuration

### 1. Configuration Vitest Améliorée
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### 2. Helpers de Test
```typescript
// src/test/utils/render.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    ),
    ...options,
  });
}

// src/test/utils/mock-data.ts
export const mockExercise = {
  id: '1',
  name: 'Push-ups',
  count: 20,
  timestamp: new Date(),
};

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  isPremium: false,
};
```

### 3. Mocks Réutilisables
```typescript
// src/test/mocks/handlers.ts
export const handlers = [
  http.get('/api/exercises', () => {
    return HttpResponse.json(mockExercises);
  }),
  http.post('/api/auth/login', () => {
    return HttpResponse.json(mockUser);
  }),
];

// src/test/mocks/browser.ts
export const worker = setupWorker(...handlers);
```

## 📈 Métriques de Succès

### Couverture Minimum par Type
- **Stores**: 90%+
- **Services**: 85%+
- **Hooks**: 80%+
- **Components**: 75%+
- **Utils**: 95%+

### Temps d'Exécution
- **Tests unitaires**: < 30s
- **Tests intégration**: < 2min
- **Tests E2E**: < 5min

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:coverage
      - run: pnpm test:e2e
      - uses: codecov/codecov-action@v3
```

## 🚀 Scripts NPM

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "pnpm test:coverage && pnpm test:e2e"
  }
}
```

## 💡 Best Practices

### 1. Structure des Tests
- Un fichier de test par composant/service
- Tests groupés par fonctionnalité
- Descriptions claires et concises
- Arrange-Act-Assert pattern

### 2. Données de Test
- Utiliser des factories pour les objets complexes
- Éviter les magic numbers
- Données réalistes mais anonymisées
- Cleanup après chaque test

### 3. Assertions
- Une assertion principale par test
- Vérifier les états intermédiaires
- Tester les cas d'erreur
- Vérifier l'accessibilité

### 4. Performance
- Paralléliser les tests indépendants
- Utiliser beforeAll pour setup coûteux
- Mocker les appels réseau
- Éviter les setTimeout

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)

---

*Dernière mise à jour: 2025-08-14*