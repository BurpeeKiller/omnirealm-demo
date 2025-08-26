# 📊 OmniFit Analytics System - Guide Complet

## 🎯 Vue d'ensemble

Le système Analytics d'OmniFit est une solution révolutionnaire qui transforme les données de fitness en insights actionnables et recommandations personnalisées. Conçu avec l'IA au cœur, il offre une expérience analytics niveau SaaS professionnel.

## 🚀 Fonctionnalités Principales

### 📈 Dashboard Analytics Avancé
- **Graphiques Recharts** : Visualisations interactives (lignes, aires, barres, radial)
- **Métriques temps réel** : Calories, streaks, performances en direct
- **Comparaisons périodiques** : Analyse jour/semaine/mois/année
- **Heatmap calendrier** : Style GitHub pour visualiser l'activité quotidienne
- **Tendances prédictives** : Algorithmes IA pour projeter les performances

### 🧠 Insights IA Révolutionnaires
- **Analyse comportementale** : "Meilleure performance : Lundi 10h"
- **Recommandations adaptatives** : Suggestions personnalisées basées sur les patterns
- **Prédictions intelligentes** : "Tu atteindras 100 burpees le 15 mars"
- **Benchmarking communautaire** : Position vs utilisateurs anonymisés
- **Coach IA intégré** : Conseils contextuels automatiques

### 📊 Rapports Premium
- **Export PDF automatique** : Rapports professionnels formatés
- **Insights personnalisés** : "Tu progresses +15% en squats"
- **Templates multiples** : Performance, Achievements, Analytics détaillées
- **Programmation automatique** : Envoi par email, partage social
- **Historique complet** : Accès aux rapports précédents

### 🔒 Conformité & Sécurité
- **RGPD compliant** : Opt-out facile, anonymisation, chiffrement
- **Rate limiting** : Protection contre les abus
- **Authentification** : Sécurisé via NextAuth
- **Webhooks** : Notifications temps réel
- **Privacy by design** : Données minimales, durée limitée

## 📁 Architecture

```
src/
├── components/Analytics/
│   ├── AnalyticsDashboard.tsx     # Dashboard principal avec tabs
│   ├── ReportsPanel.tsx           # Système de rapports avancé
│   └── index.ts                   # Exports centralisés
├── services/
│   └── analytics.ts               # Service principal tracking + API
├── stores/
│   └── analytics.store.ts         # Store Zustand avec hooks
├── app/
│   ├── analytics/
│   │   └── page.tsx              # Page dédiée avec paramètres
│   └── api/analytics/
│       ├── daily/route.ts        # Métriques journalières
│       ├── weekly/route.ts       # Tendances hebdomadaires
│       ├── insights/route.ts     # IA insights & recommandations
│       └── export/route.ts       # Export CSV/PDF
```

## 🛠 Installation & Configuration

### 1. Dépendances
```bash
npm install recharts jspdf zustand date-fns framer-motion
```

### 2. Variables d'environnement
```env
# Base de données
DATABASE_URL="postgresql://..."

# Analytics (optionnel)
ANALYTICS_RATE_LIMIT=100
ANALYTICS_RETENTION_DAYS=365
```

### 3. Migration Prisma
```bash
npx prisma migrate dev --name add-analytics-tables
npx prisma generate
```

### 4. Import du service
```typescript
import { analytics } from '@/services/analytics';
import { useAnalyticsStore } from '@/stores/analytics.store';
```

## 📚 Utilisation

### Tracking d'événements basique
```typescript
// Dans un composant d'exercice
const { trackExerciseComplete } = useAnalyticsStore();

const handleExerciseComplete = async () => {
  await trackExerciseComplete({
    exerciseName: 'burpees',
    reps: 15,
    duration: 120, // secondes
  });
};
```

### Dashboard intégré
```tsx
import { AnalyticsDashboard } from '@/components/Analytics';

export default function AnalyticsPage() {
  return <AnalyticsDashboard className="min-h-screen" />;
}
```

### Rapports personnalisés
```typescript
const { exportData } = useAnalyticsStore();

// Export PDF du dernier mois
await exportData('pdf', 30);

// Export CSV des 90 derniers jours
await exportData('csv', 90);
```

### Hooks utilitaires
```typescript
// Métriques rapides pour widgets
const { todayExercises, currentStreak, goalProgress } = useQuickMetrics();

// Insights prioritaires pour notifications
const { insights, recommendations, prediction } = usePriorityInsights();

// Auto-refresh des données
useAnalyticsAutoRefresh();
```

## 🎨 Customisation UI

### Couleurs du système
```typescript
const COLORS = {
  primary: '#8B5CF6',      // Violet principal
  secondary: '#06B6D4',    // Cyan secondaire
  success: '#10B981',      // Vert succès
  warning: '#F59E0B',      // Orange attention
  danger: '#EF4444',       // Rouge erreur
  burpees: '#8B5CF6',      // Violet burpees
  pushups: '#06B6D4',      // Cyan pompes
  squats: '#10B981',       // Vert squats
  others: '#F59E0B',       // Orange autres
};
```

### Animation système
```typescript
// Animations Framer Motion configurées
const chartAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};
```

## 🔧 Configuration Avancée

### Auto-refresh personnalisé
```typescript
const { setAutoRefresh, setRefreshInterval } = useAnalyticsStore();

// Activer refresh toutes les 5 minutes
setAutoRefresh(true);
setRefreshInterval(300); // secondes
```

### Rate limiting API
```typescript
// Dans /api/analytics/daily/route.ts
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests max
  message: 'Trop de requêtes analytics'
};
```

### Gestion de la confidentialité
```typescript
const { optOut, optIn, isOptedOut } = useAnalyticsStore();

// Désactiver complètement
optOut();

// Réactiver avec consentement
optIn();

// Vérifier le statut
if (!isOptedOut) {
  // Tracker seulement si l'utilisateur a consenti
  trackEvent('workout_start');
}
```

## 📊 Métriques Clés Trackées

### Engagement
- `workout_start` - Début de séance
- `workout_complete` - Fin de séance avec métriques
- `exercise_complete` - Exercice individuel terminé
- `streak_milestone` - Palier de série atteint
- `level_up` - Nouveau niveau débloqué

### Conversion (Freemium → Premium)
- `premium_view` - Vue page premium
- `upgrade_attempt` - Tentative d'upgrade
- `upgrade_success` - Upgrade réussi avec plan/montant

### A/B Testing
- `ab_test_view` - Exposition à un variant
- `ab_test_conversion` - Conversion sur variant

### Rétention & Engagement
- Sessions quotidiennes/hebdomadaires
- Durée moyenne des sessions  
- Fréquence d'utilisation
- Features les plus utilisées

## 🚦 Statuts & Métriques de Santé

### Performance Targets
- **Temps de réponse API** : < 200ms (p95)
- **Taille des rapports PDF** : < 5MB
- **Cache hit ratio** : > 90%
- **Error rate** : < 0.1%

### Monitoring
- Logs structurés avec niveaux (info, warn, error)
- Métriques temps réel dans dashboard admin
- Alertes sur seuils de performance
- Health checks automatiques

## 💡 Bonnes Pratiques

### Performance
- ✅ Utiliser les selectors Zustand pour éviter re-renders inutiles
- ✅ Lazy loading des graphiques lourds
- ✅ Pagination des données historiques
- ✅ Cache intelligent avec invalidation

### Sécurité
- ✅ Validation stricte des inputs API
- ✅ Sanitization des données utilisateur
- ✅ Rate limiting par utilisateur/IP
- ✅ Logs d'audit pour actions sensibles

### UX/UI
- ✅ États de loading avec skeletons
- ✅ Messages d'erreur contextuels
- ✅ Progressive disclosure de l'information
- ✅ Responsive design mobile-first

### Données
- ✅ Anonymisation automatique après 12 mois
- ✅ Opt-out granulaire par feature
- ✅ Exports RGPD en un clic
- ✅ Rétention configurée par type de donnée

## 🚀 Roadmap & Évolutions

### Phase 2 - IA Avancée
- [ ] **Cohort Analysis** : Analyse de cohortes utilisateurs
- [ ] **Machine Learning** : Modèles prédictifs personnalisés  
- [ ] **Computer Vision** : Reconnaissance automatique d'exercices
- [ ] **NLP** : Chat analytics en langage naturel

### Phase 3 - Social & Communauté
- [ ] **Leaderboards** : Classements communautaires anonymes
- [ ] **Challenges** : Défis collectifs temps réel
- [ ] **Social Analytics** : Comparaisons avec amis (opt-in)
- [ ] **Gamification** : Système de récompenses avancé

### Phase 4 - Enterprise
- [ ] **Multi-tenant** : Support organisations/équipes
- [ ] **API publique** : Intégrations tierces
- [ ] **Webhooks** : Notifications temps réel externes
- [ ] **Enterprise SSO** : Authentification entreprise

## 🆘 Support & Debugging

### Debug Analytics
```typescript
// Mode debug dans le service
localStorage.setItem('omnifit-analytics-debug', 'true');

// Voir les événements en temps réel
window.addEventListener('analytics-event', (e) => {
  console.log('Analytics Event:', e.detail);
});
```

### Logs utiles
```bash
# API logs
tail -f /var/log/omnifit/analytics.log

# Base de données
SELECT COUNT(*) FROM "AnalyticsEvent" WHERE "userId" = 'user_id';

# Performance
SELECT AVG("duration") FROM "Workout" WHERE "createdAt" > NOW() - INTERVAL '7 days';
```

### Résolution problèmes fréquents

**❌ Données manquantes**
- Vérifier le consentement utilisateur (`isOptedOut`)
- Contrôler les erreurs réseau dans Network tab
- Valider l'authentification utilisateur

**❌ Graphiques vides**
- Vérifier la plage de dates sélectionnée
- Contrôler les filtres appliqués
- Regarder les erreurs API dans Console

**❌ Exports échoués**
- Vérifier les quotas de génération
- Contrôler l'espace disque serveur
- Valider les permissions utilisateur

**❌ Performance dégradée**
- Monitorer la charge base de données
- Vérifier le cache Redis
- Analyser les requêtes lentes

---

💻 **Développé avec amour pour OmniFit** | 📈 **Analytics révolutionnaires** | 🚀 **Performance niveau SaaS**