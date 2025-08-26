# 🚀 PLAN D'AMÉLIORATION QUALITÉ - OmniFit
**Roadmap technique détaillée avec solutions concrètes | Version 1.0**

---

## 📋 QUICK WINS (< 4 heures)

### 1. 🔧 Réparer ESLint (30min)
**Problème**: TypeError avec @next/next/no-duplicate-head
**Solution**: Downgrade ESLint plugin Next.js

```bash
# Terminal commands
cd /home/greg/projets/dev/apps/omni-fit
pnpm remove eslint-config-next
pnpm add eslint-config-next@14.2.15 --save-dev
```

**Configuration corrigée `eslint.config.mjs`**:
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
      "prefer-const": "error",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
```

### 2. 🎨 Configurer Prettier (20min)
**Créer `.prettierrc`**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

**Créer `.prettierignore`**:
```
node_modules/
.next/
out/
build/
coverage/
*.md
package-lock.json
pnpm-lock.yaml
```

**Installation**:
```bash
pnpm add --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

### 3. 🔒 Nettoyer Credentials Hardcodés (45min)
**Problème**: Database URL exposée dans `lib/prisma.ts`

**Solution `.env.local`**:
```bash
# Production database
DATABASE_URL="postgresql://postgres:***@91.108.113.252:5432/postgres"

# Development database
DATABASE_URL_DEV="file:./dev.db"
```

**Correction `src/lib/prisma.ts`**:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Remove sensitive data from logs
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Prisma connected to:', databaseUrl.includes('postgresql') ? 'PostgreSQL' : 'SQLite')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4. 🧹 Nettoyer Console.logs Production (30min)
**Rechercher tous les console.log**:
```bash
grep -r "console\." src/ --include="*.ts" --include="*.tsx"
```

**Remplacer par un logger adaptatif**:
```typescript
// src/lib/logger.ts
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDev) console.log(`ℹ️ ${message}`, ...args)
  },
  warn: (message: string, ...args: any[]) => {
    if (isDev) console.warn(`⚠️ ${message}`, ...args)
  },
  error: (message: string, ...args: any[]) => {
    console.error(`🚫 ${message}`, ...args)
  }
}
```

### 5. 📝 README Minimal (45min)
**Remplacer le README générique**:
```markdown
# OmniFit - Coach Fitness IA Premium

> Application PWA moderne pour le coaching fitness personnalisé avec IA

## 🚀 Quick Start

```bash
# Installation
pnpm install

# Configuration
cp .env.example .env.local
# Éditer .env.local avec vos clés

# Base de données
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# Développement
pnpm dev
```

## 📱 Fonctionnalités

- ✅ Coaching IA personnalisé
- ✅ Suivi d'exercices en temps réel
- ✅ Gamification et achievements
- ✅ Analytics avancées
- ✅ Mode offline PWA
- ✅ Sync multi-devices

## 🛠 Stack Technique

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (prod) / SQLite (dev)
- **Auth**: NextAuth.js
- **UI**: Tailwind CSS, Radix UI
- **State**: Zustand stores
- **Tests**: Playwright (E2E)

## 🔧 Scripts

- `pnpm dev` - Serveur développement
- `pnpm build` - Build production  
- `pnpm start` - Serveur production
- `pnpm lint` - Vérification code
- `pnpm test:e2e` - Tests E2E

## 📊 Métriques Qualité

- Tests Coverage: 45% (Target: 85%)
- Performance: Lighthouse 75+ (Target: 90+)
- Accessibilité: WCAG 2.1 AA
```

---

## 🧪 SETUP TESTS COMPLET (4-6 heures)

### 1. Configuration Vitest (1h)
**Installation**:
```bash
pnpm add --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Créer `vitest.config.ts`**:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '.next/', 'coverage/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**Créer `vitest.setup.ts`**:
```typescript
import '@testing-library/jest-dom'
import { beforeAll, vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

// Mock NextAuth
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn()
}))

beforeAll(() => {
  // Global test setup
})
```

### 2. Tests Stores Prioritaires (2h)
**Test ExercisesStore `src/stores/__tests__/exercises.store.test.ts`**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useExercisesStore } from '../exercises.store'

describe('ExercisesStore', () => {
  beforeEach(() => {
    useExercisesStore.setState({
      exerciseTemplates: [],
      dailyStats: null,
      weeklyStats: null,
      isLoadingTemplates: false,
      isLoadingStats: false,
      error: null
    })
  })

  describe('loadExerciseTemplates', () => {
    it('should load exercise templates successfully', async () => {
      const store = useExercisesStore.getState()
      
      // Mock fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: 'Push-ups', type: 'strength' },
          { id: 2, name: 'Squats', type: 'strength' }
        ]
      })

      await store.loadExerciseTemplates()

      expect(useExercisesStore.getState().exerciseTemplates).toHaveLength(2)
      expect(useExercisesStore.getState().isLoadingTemplates).toBe(false)
      expect(useExercisesStore.getState().error).toBe(null)
    })

    it('should handle loading state correctly', async () => {
      const store = useExercisesStore.getState()
      
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )

      const loadPromise = store.loadExerciseTemplates()
      
      expect(useExercisesStore.getState().isLoadingTemplates).toBe(true)
      
      await loadPromise
      expect(useExercisesStore.getState().isLoadingTemplates).toBe(false)
    })
  })
})
```

### 3. Tests API Routes (1.5h)
**Test Register API `src/app/api/register/__tests__/route.test.ts`**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}))

describe('/api/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    // Mock Prisma responses
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const request = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('Utilisateur créé avec succès')
  })

  it('should return error for existing user', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Existing User'
    })

    const request = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Un utilisateur avec cet email existe déjà')
  })
})
```

### 4. Scripts Package.json (30min)
**Ajouter dans `package.json`**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "validate": "pnpm lint && pnpm test && pnpm build"
  }
}
```

---

## 🔄 CI/CD PIPELINE (3-4 heures)

### 1. GitHub Actions Basique (1h)
**Créer `.github/workflows/ci.yml`**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Setup test database
        run: |
          pnpm prisma generate
          pnpm prisma db push
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run linting
        run: pnpm lint

      - name: Run unit tests
        run: pnpm test --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Build application
        run: pnpm build
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  playwright-tests:
    runs-on: ubuntu-latest
    needs: lint-and-test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build and start app
        run: |
          pnpm build
          pnpm start &
          sleep 10
        env:
          DATABASE_URL: file:./test.db

      - name: Run Playwright tests
        run: pnpm test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 2. Pre-commit Hooks (1h)
**Installation Husky**:
```bash
pnpm add --save-dev husky lint-staged
pnpm exec husky init
```

**Créer `.husky/pre-commit`**:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

**Configuration `package.json`**:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 3. Quality Gates (1h)
**Créer `.github/workflows/quality-gate.yml`**:
```yaml
name: Quality Gate

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests with coverage
        run: pnpm test --coverage --reporter=verbose

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 70% threshold"
            exit 1
          fi
          echo "Coverage: $COVERAGE%"

      - name: Check bundle size
        run: |
          pnpm build
          BUNDLE_SIZE=$(du -sb .next/static/chunks | cut -f1)
          MAX_SIZE=2097152  # 2MB in bytes
          if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
            echo "Bundle size $BUNDLE_SIZE bytes exceeds limit"
            exit 1
          fi
          echo "Bundle size: $(($BUNDLE_SIZE / 1024))KB"

      - name: Security audit
        run: pnpm audit --audit-level moderate
```

---

## 📊 MONITORING & MÉTRIQUES (2-3 heures)

### 1. Bundle Analyzer (30min)
**Installation**:
```bash
pnpm add --save-dev @next/bundle-analyzer
```

**Configuration `next.config.ts`**:
```typescript
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = {
  // ... existing config
}

export default withBundleAnalyzer(nextConfig)
```

**Script `package.json`**:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build"
  }
}
```

### 2. Performance Monitoring (1h)
**Créer `src/lib/performance.ts`**:
```typescript
// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => Promise<any>) => {
  return async (...args: any[]) => {
    const start = performance.now()
    try {
      const result = await fn(...args)
      const duration = performance.now() - start
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
      }
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // Analytics service call
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }
}

// Web Vitals tracking
export const trackWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log('Web Vital:', metric)
  }
}
```

### 3. Error Tracking (1h)
**Installation Sentry ou équivalent**:
```bash
pnpm add @sentry/nextjs
```

**Configuration basique `sentry.client.config.js`**:
```javascript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  debug: false,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  sessionReplay: {
    sampleRate: 0.1,
    errorSampleRate: 1.0,
  }
})
```

---

## 🎯 VALIDATION & TESTS

### Checklist Qualité
```bash
# Tests de validation complets
pnpm validate           # Lint + Tests + Build
pnpm test:coverage      # Coverage > 70%
pnpm test:e2e          # Tests E2E passent
pnpm analyze           # Bundle < 2MB
pnpm audit             # Sécurité OK
```

### Métriques Cibles
- ✅ **ESLint**: 0 erreurs, < 5 warnings
- ✅ **Tests**: Coverage > 70%
- ✅ **Build**: Succès sans warnings
- ✅ **Bundle**: < 2MB total
- ✅ **Security**: 0 vulnérabilités High/Critical

---

## 📅 PLANNING DÉTAILLÉ

### Sprint 1 (Semaine 1) - Fondations
**Jour 1-2**: Quick Wins (ESLint, Prettier, Credentials)
**Jour 3-4**: Setup Tests Unitaires (Vitest + premiers tests)
**Jour 5**: CI/CD basique (GitHub Actions)

### Sprint 2 (Semaine 2) - Tests & Qualité  
**Jour 1-3**: Tests stores complets (70% coverage)
**Jour 4**: Tests API routes critiques
**Jour 5**: Pre-commit hooks + Quality gates

### Sprint 3 (Semaine 3) - Monitoring & Docs
**Jour 1-2**: Performance monitoring + Bundle analyzer
**Jour 3-4**: Documentation complète (API + README)
**Jour 5**: E2E tests étendus

### Sprint 4 (Semaine 4) - Finalisation
**Jour 1-2**: Security audit complet
**Jour 3-4**: Optimisations performance
**Jour 5**: Review finale + déploiement

---

## 💡 CONSEILS D'IMPLÉMENTATION

### Ordre de Priorité
1. **Réparer ce qui casse** (ESLint, credentials)
2. **Sécuriser la base** (tests unitaires critiques)
3. **Automatiser** (CI/CD + pre-commit)
4. **Optimiser** (performance + monitoring)
5. **Documenter** (README + API docs)

### Pièges à Éviter
- ❌ Vouloir tout faire en même temps
- ❌ Over-engineering des tests
- ❌ Configurer CI/CD sans tests solides
- ❌ Ignorer les métriques de performance

### Best Practices
- ✅ Commencer par les tests des stores (ROI max)
- ✅ Incremental coverage (petit à petit)
- ✅ Mesurer avant d'optimiser
- ✅ Documenter au fur et à mesure

---

## 🎪 PROCHAINES ÉTAPES

1. **Valider ce plan** avec l'équipe de développement
2. **Prioriser** selon les contraintes business
3. **Commencer** par les Quick Wins (impact immédiat)
4. **Mesurer** les améliorations semaine par semaine
5. **Itérer** selon les résultats et feedback

**Ready to start? 🚀**

---

*Plan d'amélioration généré par l'analyse qualité OmniRealm*  
*Version 1.0 | Date: 2025-08-26*