# Architecture des Stores - OmniFit

## Vue d'ensemble

Cette architecture de stores Zustand moderne est conçue pour Next.js 15 avec TypeScript, optimisée pour la performance, la scalabilité et la maintainabilité.

## Architecture Générale

```
src/stores/
├── index.ts              # Point d'entrée unique, hooks utilitaires
├── exercises.store.ts    # Gestion exercices, programmes, stats
├── gamification.store.ts # Points, niveaux, achievements, notifications
├── auth.store.ts         # Authentification, premium, limites usage
├── settings.store.ts     # Paramètres utilisateur, préférences
└── README.md            # Cette documentation
```

### Middleware Stack

Chaque store utilise cette pile de middleware optimisée :

```typescript
subscribeWithSelector(
  persist(
    immer(createStore),
    { persistenceConfig }
  )
)
```

- **`subscribeWithSelector`** : Écoute sélective pour optimiser les re-renders
- **`persist`** : Persistance automatique localStorage avec versioning
- **`immer`** : Mutations immutables simplifiées avec draft syntax

## Stores Détaillés

### 🏋️ ExercisesStore (`exercises.store.ts`)

**Responsabilité** : Gestion complète des exercices, programmes et statistiques

#### État Principal
```typescript
interface ExercisesState {
  // Data
  exerciseDefinitions: ExerciseDefinition[]  // Définitions des exercices
  exercises: Exercise[]                      // Historique des exercices
  dailyStats: DailyStats                     // Statistiques du jour
  weeklyStats: WeeklyStats                   // Statistiques hebdomadaires
  activeProgram: ActiveProgram               // Programme en cours
  
  // Computed (via getters)
  todayTotal: number                         // Total journalier
  completedToday: number                     // Exercices terminés aujourd'hui
  currentStreak: number                      // Série actuelle
}
```

#### Actions Principales
- `incrementExercise(type)` - Ajouter un exercice avec vérification premium
- `addCustomExercise()` - Exercice personnalisé
- `startProgram()` / `cancelProgram()` - Gestion programmes
- `loadDailyStats()` / `loadWeeklyStats()` - Chargement statistiques
- `syncToCloud()` - Synchronisation cloud
- `reset()` - Remise à zéro complète

#### Optimizations
- **Optimistic Updates** : Mise à jour immédiate + rollback en cas d'erreur
- **Persistance Hybride** : LocalStorage + sync PostgreSQL
- **Computed Values** : Getters pour éviter recalculs inutiles
- **Error Handling** : Gestion robuste des erreurs avec états de loading

### 🎮 GamificationStore (`gamification.store.ts`)

**Responsabilité** : Système de points, niveaux, achievements et notifications

#### État Principal
```typescript
interface GamificationState {
  userProgress: UserProgress     // Progrès utilisateur
  notifications: NotificationItem[]  // Notifications en attente
  unreadCount: number           // Nombre de notifications non lues
  showCelebration: boolean      // Modal de célébration
  celebrationData: NotificationItem  // Données de célébration
}
```

#### Système de Points
```typescript
// Points par action
EXERCISE_POINTS = 10
WORKOUT_COMPLETION = 50
PROGRAM_COMPLETION = 100
STREAK_BONUS = 25 * streak_days
ACHIEVEMENT_BONUS = variable selon rareté
```

#### Système de Niveaux
```typescript
const LEVEL_SYSTEM = [
  { level: 1, title: 'Débutant', requiredPoints: 0 },
  { level: 10, title: 'Intermédiaire', requiredPoints: 1500 },
  { level: 25, title: 'Expert', requiredPoints: 8000 },
  { level: 50, title: 'Divinité Fitness', requiredPoints: 35000 }
]
```

#### Actions Principales
- `addPoints(points, reason)` - Ajouter points avec notification
- `checkAchievements(stats)` - Vérification achievements automatique
- `unlockAchievement(id)` - Débloquer achievement avec célébration
- `recordExercise()` / `recordWorkout()` - Enregistrer activité
- `updateStreak(days)` - Mettre à jour série

### 🔐 AuthStore (`auth.store.ts`)

**Responsabilité** : Authentification NextAuth, premium, limites d'usage

#### État Principal
```typescript
interface AuthState {
  // Auth
  session: Session                 // Session NextAuth
  user: User                      // Utilisateur courant
  userProfile: UserProfile        // Profil utilisateur étendu
  isAuthenticated: boolean        // État authentification
  
  // Premium
  subscription: Subscription       // Abonnement Stripe
  isPremium: boolean              // Status premium
  planId: string                  // ID du plan actuel
  usageLimits: UsageLimits        // Limites d'usage
}
```

#### Limites Free vs Premium
```typescript
const FREE_LIMITS = {
  dailyExercises: { limit: 3, unlimited: false },
  programs: { limit: 1, unlimited: false },
  customExercises: { limit: 0, unlimited: false },
  aiCoaching: { limit: 0, unlimited: false }
}

const PREMIUM_LIMITS = {
  dailyExercises: { limit: -1, unlimited: true },
  programs: { limit: -1, unlimited: true },
  customExercises: { limit: 20, unlimited: false },
  aiCoaching: { limit: 100, unlimited: false }
}
```

#### Actions Principales
- `setSession(session)` - Mise à jour session NextAuth
- `loadSubscription()` - Charger abonnement Stripe
- `checkFeatureAccess(featureId)` - Vérifier accès fonctionnalité
- `checkUsageLimit(limitType)` - Vérifier limite usage
- `createCheckoutSession(planId)` - Créer session paiement Stripe
- `showUpgrade(reason)` - Afficher prompt upgrade

#### Intégration NextAuth
```typescript
// Utilisation avec NextAuth
const { data: session } = useSession()
useEffect(() => {
  useAuthStore.getState().setSession(session)
}, [session])
```

### ⚙️ SettingsStore (`settings.store.ts`)

**Responsabilité** : Paramètres utilisateur, préférences, configuration

#### Catégories de Paramètres
- **Notifications** : Sons, vibrations, rappels
- **Rappels** : Fréquence, horaires, jours actifs
- **Apparence** : Thème, couleurs, taille police
- **Exercices** : Incréments par défaut, repos, sons
- **Objectifs** : Objectifs journaliers/hebdomadaires
- **Confidentialité** : Analytics, sync données
- **Accessibilité** : Lecteur d'écran, contraste élevé
- **Sauvegarde** : Auto-backup, fréquence
- **Intégrations** : Google Fit, Apple Health, Strava

#### Actions Principales
- `updateSettings(category, updates)` - Mise à jour paramètres
- `toggleReminders()` - Toggle rappels
- `setTheme(theme)` - Changer thème avec application immédiate
- `exportSettings()` / `importSettings()` - Import/export configuration
- `resetToDefaults()` - Remise aux valeurs par défaut

#### Application en Temps Réel
```typescript
// Les changements d'apparence sont appliqués immédiatement
setTheme: (theme) => {
  set(draft => { draft.appearance.theme = theme })
  applyTheme(theme) // Application DOM immédiate
}
```

## Hooks d'Utilisation

### Hooks de Base
```typescript
// Stores complets
const exercisesStore = useExercisesStore()
const gamificationStore = useGamificationStore()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
```

### Sélecteurs Optimisés
```typescript
// Sélection granulaire pour éviter re-renders inutiles
const todayTotal = useTodayTotal()
const isPremium = useIsPremium()
const currentLevel = useCurrentLevel()
const themeSettings = useAppearanceSettings()
```

### Hooks Combinés
```typescript
// Données combinées de plusieurs stores
const progress = useExerciseProgress() // exercises + gamification
const featureAccess = useFeatureAccess() // auth + usage limits
const notifications = useNotificationState() // settings + gamification
const theme = useAppTheme() // settings + appearance
const goals = useGoalProgress() // settings + exercises + gamification
```

## Patterns d'Usage

### 1. Vérification Limites Premium
```typescript
const incrementExercise = async (type: ExerciseType) => {
  const canProceed = await checkPremiumLimit('daily_exercises')
  if (!canProceed) {
    showUpgrade('exercise_limit', 'daily_exercises')
    return
  }
  // Continuer avec l'exercice...
}
```

### 2. Optimistic Updates
```typescript
const addExercise = async (exercise: Exercise) => {
  // 1. Mise à jour optimiste
  set(draft => { draft.exercises.push(exercise) })
  
  try {
    // 2. Persistance
    await saveToDatabase(exercise)
  } catch (error) {
    // 3. Rollback en cas d'erreur
    set(draft => {
      draft.exercises = draft.exercises.filter(e => e.id !== exercise.id)
    })
  }
}
```

### 3. Gestion des Erreurs
```typescript
const action = async () => {
  set(draft => { draft.loading = true; draft.error = null })
  
  try {
    await operation()
    set(draft => { draft.loading = false })
  } catch (error) {
    set(draft => {
      draft.error = error.message
      draft.loading = false
    })
  }
}
```

### 4. Subscriptions Cross-Store
```typescript
// Écouter les changements d'exercices pour mettre à jour la gamification
useExercisesStore.subscribe(
  (state) => state.completedToday,
  (completedToday) => {
    useGamificationStore.getState().recordExercise('daily_goal', completedToday)
  }
)
```

## Performance

### Optimisations Mises en Place

1. **Sélecteurs Granulaires** : Évitent les re-renders inutiles
2. **Immer Integration** : Mutations simples et performantes
3. **Persistance Partielle** : Seules les données importantes sont persistées
4. **Debounced Updates** : Évitent les sauvegardes trop fréquentes
5. **Computed Values** : Getters cachés pour calculs coûteux

### Métriques Cibles

- **Time to Interactive** : < 100ms pour changements d'état
- **Memory Usage** : < 10MB pour l'ensemble des stores
- **Bundle Size** : < 50KB après compression
- **Render Optimization** : < 5 re-renders par action utilisateur

## Persistance

### Stratégie Hybride
- **LocalStorage** : Cache local immédiat, offline-first
- **PostgreSQL** : Persistance serveur, sync multi-device
- **Optimistic Sync** : Mise à jour locale immédiate + sync background

### Versioning
```typescript
const persistConfig = {
  name: 'omnifit-exercises',
  version: 1,
  migrate: (persistedState: any, version: number) => {
    if (version === 0) {
      // Migration v0 -> v1
      return migrateToV1(persistedState)
    }
    return persistedState
  }
}
```

## Sécurité

### Validation des Données
- **Input Validation** : Tous les paramètres utilisateur validés
- **Type Safety** : TypeScript strict mode activé
- **Sanitization** : Nettoyage des données avant persistance

### Gestion des Erreurs
- **Error Boundaries** : Isolation des erreurs par store
- **Fallback States** : États de secours en cas d'erreur
- **User Feedback** : Notifications d'erreur utilisateur-friendly

## Tests

### Stratégie de Tests
```typescript
// Test d'un store
describe('ExercisesStore', () => {
  beforeEach(() => {
    useExercisesStore.getState().reset()
  })
  
  it('should increment exercise correctly', async () => {
    const { incrementExercise } = useExercisesStore.getState()
    await incrementExercise('pushups')
    
    expect(useExercisesStore.getState().todayTotal).toBe(10)
  })
})
```

### Types de Tests
- **Unit Tests** : Actions individuelles (Vitest)
- **Integration Tests** : Interactions entre stores (Vitest)
- **E2E Tests** : Flux utilisateur complets (Playwright)

## Migration depuis l'Ancien Système

### Mapping des Données
```typescript
// Migration exercices.store.ts ancien -> nouveau
const migrateExercisesData = (oldData: OldExercisesState): Exercise[] => {
  return oldData.exercises.map(exercise => ({
    id: exercise.id || crypto.randomUUID(),
    type: exercise.type,
    count: exercise.count,
    timestamp: new Date(exercise.timestamp),
    synced: false,
    completed: true
  }))
}
```

### Plan de Migration
1. **Phase 1** : Implémentation des nouveaux stores en parallèle
2. **Phase 2** : Migration progressive des composants
3. **Phase 3** : Suppression de l'ancien système
4. **Phase 4** : Optimisations et nettoyage

## Déploiement et Monitoring

### Métriques à Surveiller
- **Store Size** : Taille mémoire des stores
- **Action Frequency** : Fréquence des actions utilisateur
- **Error Rates** : Taux d'erreur par store
- **Sync Performance** : Performance de synchronisation

### Outils de Debug
```typescript
// Debug store en développement
if (process.env.NODE_ENV === 'development') {
  useExercisesStore.subscribe(console.log)
}
```

## Conclusion

Cette architecture de stores moderne offre :

- ✅ **Performance** : Optimisations pour 100k+ utilisateurs
- ✅ **Scalabilité** : Architecture modulaire extensible
- ✅ **Type Safety** : TypeScript strict pour zéro erreur runtime
- ✅ **DX** : Hooks intuitifs et debugging facile
- ✅ **Maintainabilité** : Code organisé et documenté
- ✅ **Next.js 15 Ready** : Compatible SSR/RSC

L'architecture est prête pour une montée en charge massive tout en maintenant une excellente expérience développeur.