# Product Requirements Document (PRD) - OmniFit

## 1. Vue d'ensemble

### Vision produit
OmniFit est une PWA de fitness gamifiée qui transforme l'entraînement physique en jeu vidéo addictif, ciblant les débutants intimidés par les salles de sport traditionnelles.

### Proposition de valeur unique
"Transformez votre corps en jouant - Le fitness devient aussi addictif qu'un jeu mobile"

### Objectifs business
- **Court terme (3 mois)** : 100 utilisateurs actifs, 20 abonnés payants
- **Moyen terme (6 mois)** : 500 utilisateurs actifs, 100 abonnés (2.9K€ MRR)
- **Long terme (12 mois)** : 2000 utilisateurs actifs, 500 abonnés (14.5K€ MRR)

## 2. Marché cible

### Persona principal : "Le Gamer Sédentaire"
- **Âge** : 25-35 ans
- **Profil** : Travaille dans le tech/bureau, joue 2h+/jour
- **Pain points** : 
  - Intimidé par les salles de sport
  - Manque de motivation pour s'entraîner
  - Cherche des résultats rapides et mesurables
- **Motivations** : 
  - Adore les systèmes de progression (XP, levels)
  - Compétition avec les amis
  - Récompenses instantanées

### Persona secondaire : "La Maman Débordée"
- **Âge** : 30-45 ans
- **Profil** : Peu de temps, s'entraîne à la maison
- **Pain points** : 
  - Pas le temps d'aller en salle
  - Besoin de flexibilité horaire
  - Veut des séances courtes efficaces

## 3. Fonctionnalités Core (MVP)

### 3.1 Système de gamification
- **XP & Niveaux** : Chaque exercice rapporte de l'XP
- **Streaks** : Bonus pour entraînements consécutifs
- **Badges** : Déblocables selon performances
- **Leaderboard** : Classement hebdomadaire entre amis

### 3.2 Entraînements
- **Quick Workouts** : Sessions 7-15 minutes
- **Programmes guidés** : Plans sur 4-8 semaines
- **Mode histoire** : Campagne narrative ("Sauver le royaume en devenant plus fort")
- **Exercices adaptés** : Avec/sans équipement, tous niveaux

### 3.3 Social & Communauté
- **Défis entre amis** : Challenges hebdomadaires
- **Guildes** : Groupes de 5-20 personnes
- **Feed d'activité** : Voir les progrès des amis
- **Encouragements** : Système de "high-five" virtuel

### 3.4 Tracking & Analytics
- **Dashboard personnel** : Progrès visualisés
- **Photos avant/après** : Comparaison automatique
- **Statistiques détaillées** : Calories, temps, consistency
- **Rappels intelligents** : Notifications personnalisées

## 4. Modèle de monétisation

### Freemium (29€/mois)
**Gratuit** :
- 3 workouts/semaine
- XP & levels basiques
- Accès communauté

**Premium** :
- Workouts illimités
- Programmes exclusifs
- Mode histoire complet
- Analytics avancés
- Badges premium
- Priority support

## 5. Stack technique

### Frontend
- **Framework** : Next.js 14 (App Router)
- **UI** : @omnirealm/ui + Tailwind CSS
- **State** : Zustand
- **PWA** : next-pwa
- **Animations** : Framer Motion

### Backend
- **BaaS** : Supabase
- **Auth** : Supabase Auth (Magic Link + Social)
- **Database** : PostgreSQL
- **Storage** : Supabase Storage (photos progrès)
- **Realtime** : Supabase Realtime (notifications)

### Infrastructure
- **Hosting** : Coolify sur VPS
- **Analytics** : Umami (self-hosted)
- **Monitoring** : Better Stack
- **Payments** : Stripe

## 6. Roadmap

### Phase 1 : MVP (4 semaines) ✓
- [x] Auth & onboarding
- [x] Workouts basiques
- [x] XP & levels
- [x] PWA setup

### Phase 2 : Gamification (4 semaines) - EN COURS
- [ ] Streaks & badges
- [ ] Leaderboard
- [ ] Défis sociaux
- [ ] Mode histoire (v1)

### Phase 3 : Monétisation (4 semaines)
- [ ] Stripe integration
- [ ] Paywall Premium
- [ ] Programmes exclusifs
- [ ] Analytics dashboard

### Phase 4 : Growth (Ongoing)
- [ ] Referral program
- [ ] Guildes & teams
- [ ] Intégrations (Strava, Apple Health)
- [ ] Coach IA personnalisé

## 7. Métriques de succès

### Acquisition
- **Téléchargements** : 100/mois minimum
- **Coût d'acquisition** : <10€/user
- **Conversion freemium** : 15%

### Engagement
- **DAU/MAU** : >40%
- **Session/jour** : 1.5 moyenne
- **Retention J30** : >30%

### Monétisation
- **ARPU** : 4.35€
- **LTV** : >150€
- **Churn** : <10%/mois

## 8. Risques & Mitigation

### Risques identifiés
1. **Saturation marché fitness** → Focus gamification unique
2. **Abandon utilisateurs** → Onboarding optimisé, quick wins
3. **Complexité technique** → MVP minimal, itérations rapides
4. **Acquisition coûteuse** → Growth organique, referral

## 9. Critères de validation MVP

- [ ] 100 utilisateurs inscrits
- [ ] 50% complètent onboarding
- [ ] 30% actifs après 7 jours
- [ ] NPS > 7
- [ ] Au moins 5 abonnés payants

## 10. Contraintes

### Techniques
- Performance PWA (Lighthouse >90)
- Offline-first
- Compatible mobile/desktop
- RGPD compliant

### Business
- Budget marketing : 500€/mois max
- Time to market : 3 mois
- Équipe : 1 dev (Greg)

---

**Score RICE+** : 85/100
- **Reach** : 18/20 (marché large)
- **Impact** : 17/20 (changement de vie)
- **Confidence** : 15/20 (nouveau domaine)
- **Effort** : 10/20 (3 mois dev)
- **Strategic Fit** : 25/30 (aligné vision OmniRealm)

**Décision** : GO ✅