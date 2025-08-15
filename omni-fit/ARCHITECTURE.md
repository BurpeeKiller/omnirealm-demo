# Architecture OmniFit

## Vue d'Ensemble

OmniFit est une Progressive Web App (PWA) construite avec React 18 et TypeScript, utilisant une architecture moderne orientée composants avec state management centralisé.

## 🏗️ Architecture Technique

### Stack Principal

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (PWA)                   │
├─────────────────────────────────────────────────────┤
│  React 18  │  TypeScript 5.8  │  Vite 6  │  PWA   │
├─────────────────────────────────────────────────────┤
│         State Management        │    Persistence    │
│         Zustand 4.5            │    IndexedDB      │
│         (persist middleware)    │    LocalStorage   │
├─────────────────────────────────────────────────────┤
│              UI/UX              │    Analytics      │
│  Tailwind CSS │ Framer Motion  │    Custom Events  │
│  Radix UI    │ Chart.js        │    Performance    │
└─────────────────────────────────────────────────────┘
```

### Flux de Données

```
User Input → React Component → Zustand Store → IndexedDB
     ↑              ↓               ↓              ↓
     └──────── UI Update ←─── State Change ←──────┘
```

## 📁 Structure des Dossiers

```
src/
├── components/          # Composants React
│   ├── Dashboard/      # Page principale
│   │   ├── Dashboard.tsx
│   │   ├── ExerciseCard.tsx
│   │   └── QuickActions.tsx
│   ├── Settings/       # Configuration
│   │   ├── Settings.tsx
│   │   └── sections/
│   ├── Stats/          # Statistiques
│   │   ├── Stats.tsx
│   │   └── ExportButton.tsx
│   ├── Landing/        # Page d'accueil
│   └── Onboarding/     # Premier usage
│
├── stores/             # State Management (Zustand)
│   ├── exercises.store.ts    # État des exercices
│   ├── reminder.store.ts     # Gestion des rappels
│   ├── settings.store.ts     # Préférences utilisateur
│   └── user.store.ts         # Profil & premium
│
├── services/           # Logique métier
│   ├── analytics.service.ts  # Tracking événements
│   ├── backup.service.ts     # Export/Import données
│   ├── reminder.service.ts   # Notifications
│   └── reminderWorker.service.ts
│
├── hooks/              # Hooks personnalisés
│   ├── useExercise.ts       # Logique exercices
│   ├── useNotification.ts   # Gestion notifications
│   └── useOnboarding.ts     # Flow onboarding
│
├── utils/              # Utilitaires
│   ├── sound.ts            # Audio feedback
│   ├── date.ts             # Formatage dates
│   └── storage.ts          # Helpers storage
│
├── types/              # Types TypeScript
│   ├── exercise.ts         # Types exercices
│   ├── stats.ts           # Types statistiques
│   └── user.ts            # Types utilisateur
│
└── db/                 # Base de données
    └── index.ts           # Configuration Dexie
```

## 🔄 State Management

### Stores Zustand

1. **exercises.store.ts**
   - Compteurs par exercice
   - Historique des séances
   - Statistiques calculées

2. **reminder.store.ts**
   - Configuration des rappels
   - Gestion des intervalles
   - État des notifications

3. **settings.store.ts**
   - Préférences utilisateur
   - Configuration sons/vibrations
   - Plage horaire rappels

4. **user.store.ts**
   - Profil utilisateur
   - État premium
   - Préférences personnelles

### Persistance

- **IndexedDB** (via Dexie) : Données structurées (workouts, stats)
- **LocalStorage** : État des stores Zustand (persist middleware)
- **Service Worker** : Cache assets et données offline

## 🎯 Patterns & Conventions

### Composants

```typescript
// Structure type d'un composant
export const ExerciseCard: React.FC<Props> = ({ exercise, onComplete }) => {
  // Hooks d'abord
  const { increment } = useExercise(exercise);
  
  // State local si nécessaire
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handlers
  const handleClick = () => {
    setIsAnimating(true);
    increment();
    onComplete?.();
  };
  
  // Render
  return <div>...</div>;
};
```

### Stores

```typescript
// Pattern Zustand avec persist
export const useSettingsStore = create<SettingsState>()(
  persist(
    devtools((set) => ({
      // State
      soundEnabled: true,
      
      // Actions
      toggleSound: () => set((state) => ({ 
        soundEnabled: !state.soundEnabled 
      })),
    })),
    {
      name: 'omnifit-settings',
    }
  )
);
```

### Services

```typescript
// Service pattern singleton
class AnalyticsService {
  private static instance: AnalyticsService;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new AnalyticsService();
    }
    return this.instance;
  }
  
  trackEvent(event: string, data?: any) {
    // Implementation
  }
}
```

## 🚀 Optimisations

### Performance

1. **Code Splitting**
   - Routes lazy loaded avec React.lazy()
   - Chunks séparés pour modals lourdes
   - Bundle principal < 25KB

2. **Memoization**
   - React.memo sur composants lourds
   - useMemo pour calculs coûteux
   - useCallback pour handlers stables

3. **Assets**
   - Images optimisées (WebP à venir)
   - Fonts préchargées
   - CSS critique inline

### PWA

1. **Service Worker**
   - Cache-first pour assets
   - Network-first pour API
   - Background sync pour offline

2. **Manifest**
   - Icons toutes tailles
   - Theme color adaptatif
   - Shortcuts rapides

## 🔒 Sécurité

1. **Données sensibles**
   - Aucune donnée personnelle stockée
   - Pas de connexion serveur
   - Export local uniquement

2. **Bonnes pratiques**
   - CSP headers (à implémenter)
   - Sanitization des inputs
   - Validation côté client

## 🧪 Tests

Structure cible pour les tests :

```
src/__tests__/
├── components/     # Tests composants
├── stores/        # Tests stores
├── services/      # Tests services
├── hooks/         # Tests hooks
└── e2e/          # Tests E2E Playwright
```

Coverage cible : 80% minimum

## 📈 Métriques

- **Bundle Size** : 23KB gzip (optimisé)
- **First Paint** : < 1s
- **TTI** : < 2s sur 3G
- **Lighthouse** : 95+ toutes catégories

## 🔮 Évolutions Futures

1. **Backend API** (si nécessaire)
   - Supabase pour sync multi-devices
   - Authentification sociale
   - Partage de programmes

2. **Features**
   - Plus d'exercices
   - Programmes personnalisés
   - Challenges sociaux
   - Intégration wearables

3. **Technique**
   - Migration vers App Directory (Next.js)
   - Server Components pour SEO
   - Edge Functions pour l'IA

---

*Architecture documentée le 2025-08-09*