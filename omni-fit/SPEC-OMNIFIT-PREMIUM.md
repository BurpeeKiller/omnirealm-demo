# 🎯 Spécification EARS - OmniFit Premium avec Coach AI

## 📋 Informations Générales

**Feature** : Migration Fitness Reminder → OmniFit + Coach AI Premium  
**Projet** : OmniFit (ex-Fitness Reminder)  
**Date** : 2025-01-28  
**Auteur** : Greg & Claude  
**Score RICE+** : 92/100

## 🎯 Objectif Business

Transformer Fitness Reminder en OmniFit Premium avec coach AI intégré pour générer 29€/user/mois. Objectif : 150 abonnés premium = 52K€ ARR dépassant l'objectif Q4 2025.

## 📝 Requirements EARS

### Ubiquitous (Toujours actif)
- The system SHALL be branded as "OmniFit" across all interfaces and documentation
- The system SHALL maintain a clear distinction between free and premium features
- The system SHALL track all user interactions for analytics and AI training
- The system SHALL ensure AI suggestions are generated within 2 seconds
- The system SHALL respect RGPD/AI Act compliance for all data processing

### Event-Driven (Sur événement)
- WHEN a user completes a workout, the system SHALL trigger AI analysis for premium users
- WHEN a free user tries premium features, the system SHALL display upgrade prompt with value proposition
- WHEN AI quota (100 calls/month) is reached, the system SHALL switch to cached suggestions
- WHEN payment fails, the system SHALL grace period of 7 days before downgrading
- WHEN a user subscribes, the system SHALL send welcome email with onboarding guide

### State-Driven (Selon l'état)
- WHILE user is on free plan, the system SHALL show premium badges and CTAs
- WHILE user is premium, the system SHALL enable all AI coach features
- WHILE offline, the system SHALL use cached AI suggestions from last 7 days
- WHILE in trial period, the system SHALL show days remaining prominently
- WHILE subscription is past_due, the system SHALL show payment update prompt

### Optional Features (Fonctionnalités optionnelles)
- WHERE user has premium plan, the system SHALL provide personalized workout programs
- WHERE user has 30+ day streak, the system SHALL unlock achievement badges
- WHERE user exports data, the system SHALL include AI insights for premium users
- WHERE user enables notifications, the system SHALL send AI-powered motivational messages
- WHERE admin dashboard is accessed, the system SHALL show premium metrics

### Unwanted Behavior (Gestion d'erreurs)
- IF AI service is unavailable, THEN the system SHALL use pre-written motivational messages
- IF Stripe webhook fails, THEN the system SHALL retry 3 times with exponential backoff
- IF user data sync fails, THEN the system SHALL queue for later retry
- IF premium features are accessed without subscription, THEN the system SHALL redirect to upgrade
- IF AI generates inappropriate content, THEN the system SHALL filter and log for review

## 🏗️ Architecture Technique

```typescript
// Nouveaux types pour OmniFit Premium
interface OmniFitUser {
  id: string;
  email?: string;
  subscription: SubscriptionStatus;
  preferences: UserPreferences;
  aiQuota: {
    used: number;
    limit: number;
    resetDate: Date;
  };
}

interface SubscriptionStatus {
  type: 'free' | 'trial' | 'premium';
  status: 'active' | 'canceled' | 'past_due';
  expiresAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface AICoachResponse {
  id: string;
  type: 'motivation' | 'technique' | 'progression' | 'recovery';
  message: string;
  suggestions: string[];
  basedOn: {
    recentWorkouts: number;
    trend: 'improving' | 'stable' | 'declining';
    personalBest?: boolean;
  };
  generatedAt: Date;
  cached: boolean;
}

interface WorkoutProgram {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // weeks
  exercises: ProgramExercise[];
  aiGenerated: boolean;
}
```

### Structure des dossiers après renommage
```
/dev/apps/12-omnifit/  (renommé de fitness-reminder)
├── src/
│   ├── services/
│   │   ├── ai-coach.ts       (nouveau)
│   │   ├── subscription.ts   (nouveau)
│   │   ├── stripe.ts         (nouveau)
│   │   └── analytics.ts      (étendu)
│   ├── components/
│   │   ├── Premium/
│   │   │   ├── CoachAI.tsx
│   │   │   ├── UpgradePrompt.tsx
│   │   │   └── SubscriptionManager.tsx
│   │   └── Branding/
│   │       └── OmniFitLogo.tsx
│   └── hooks/
│       ├── useSubscription.ts
│       └── useAICoach.ts
```

## ✅ Critères d'Acceptation

- [ ] Application renommée OmniFit dans tous les fichiers
- [ ] Logo et branding OmniFit implémentés
- [ ] Intégration Stripe fonctionnelle avec webhooks
- [ ] Coach AI génère suggestions en < 2 secondes
- [ ] Système de cache AI implémenté
- [ ] Dashboard analytics premium
- [ ] Tests E2E parcours souscription
- [ ] Score validation ≥ 75%
- [ ] Documentation mise à jour
- [ ] RGPD/AI Act compliant

## 📋 Tasks Breakdown

### Phase 1 : Rebranding OmniFit (1h)
1. [ ] Renommer dossier projet en `12-omnifit`
2. [ ] Mettre à jour package.json, manifest.json, index.html
3. [ ] Créer nouveau logo et favicon OmniFit
4. [ ] Adapter couleurs et thème visuel
5. [ ] Mettre à jour tous les textes d'interface

### Phase 2 : Infrastructure Premium (2h)
6. [ ] Intégrer Stripe avec variables d'environnement
7. [ ] Créer service subscription.ts avec logique métier
8. [ ] Implémenter webhooks Stripe (subscription.updated, etc.)
9. [ ] Ajouter middleware de vérification premium
10. [ ] Créer écran souscription avec 3 arguments clés

### Phase 3 : Coach AI Core (2h)
11. [ ] Créer service ai-coach.ts avec API Claude/OpenAI
12. [ ] Implémenter système de prompts optimisés fitness
13. [ ] Ajouter cache Redis/localStorage pour économiser API
14. [ ] Créer fallback avec messages pré-écrits
15. [ ] Implémenter quota management (100 calls/month)

### Phase 4 : UI Premium Features (2h)
16. [ ] Créer composant CoachAI.tsx avec animations
17. [ ] Badge "Premium" et indicateurs visuels
18. [ ] Zone suggestions personnalisées dashboard
19. [ ] Écran programmes d'entraînement
20. [ ] Notifications push suggestions AI

### Phase 5 : Analytics & Monitoring (1h)
21. [ ] Étendre analytics avec events premium
22. [ ] Dashboard admin avec métriques (MRR, churn, LTV)
23. [ ] Monitoring performance AI (latence, erreurs)
24. [ ] Alertes Telegram si problèmes

### Phase 6 : Tests & Validation (1h)
25. [ ] Tests unitaires nouveaux services
26. [ ] Tests E2E parcours complet free → premium
27. [ ] Tests de charge API coach
28. [ ] Validation score système ≥ 75%
29. [ ] Déploiement production

## 🎯 Impact Attendu

- **Métrique principale** : 5% conversion free → premium (industrie : 2-3%)
- **Métriques secondaires** : 
  - Rétention J30 : 85% (vs 60% gratuit)
  - Session duration : +40%
  - NPS : > 50
- **ROI estimé** : 
  - Mois 1 : 30 users × 29€ = 870€
  - Mois 3 : 100 users × 29€ = 2,900€
  - Mois 6 : 200 users × 29€ = 5,800€ = 69,600€ ARR

## 🔗 Références

- Stripe Docs : https://stripe.com/docs/billing/subscriptions
- Claude API : https://docs.anthropic.com/claude/reference/getting-started
- PWA Best Practices : https://web.dev/progressive-web-apps/
- RGPD Compliance : https://gdpr.eu/checklist/

---

## 🚀 Script de migration automatique

```bash
#!/bin/bash
# migrate-to-omnifit.sh

echo "🚀 Migration Fitness Reminder → OmniFit"

# 1. Renommer le dossier
mv dev/apps/12-fitness-reminder dev/apps/12-omnifit

# 2. Mettre à jour les références
find dev/apps/12-omnifit -type f -name "*.{js,ts,tsx,json,md}" -exec sed -i 's/fitness-reminder/omnifit/g' {} +
find dev/apps/12-omnifit -type f -name "*.{js,ts,tsx,json,md}" -exec sed -i 's/Fitness Reminder/OmniFit/g' {} +

# 3. Mettre à jour package.json
sed -i 's/@omnirealm\/fitness-reminder/@omnirealm\/omnifit/g' dev/apps/12-omnifit/package.json

echo "✅ Migration terminée ! N'oubliez pas de :"
echo "- Créer le nouveau logo"
echo "- Mettre à jour les variables Stripe"
echo "- Tester l'application"
```

*Spécification validée avec le template EARS - Prête pour implémentation*