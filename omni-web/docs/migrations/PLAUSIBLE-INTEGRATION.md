# 🔒 Intégration Plausible Analytics - OmniRealm

## Pourquoi Plausible au lieu de PostHog ?

- **Privacy-first** : Pas de cookies, conforme RGPD par défaut
- **Ultra-léger** : Script < 1KB (vs 45KB Google Analytics, ~30KB PostHog)
- **Simple** : Métriques essentielles uniquement
- **Open source** : Transparence totale
- **Hébergement EU** : Données en Europe

## 📋 Plan d'intégration

### 1. Options d'hébergement

#### Option A : Plausible Cloud (Recommandé pour démarrer)

- **Coût** : 9€/mois pour 10k vues
- **Avantages** : Zéro maintenance, prêt en 2 minutes
- **URL** : https://plausible.io

#### Option B : Self-hosted sur VPS

- **Coût** : Inclus dans votre VPS
- **Avantages** : Données 100% chez vous
- **Guide** : https://plausible.io/docs/self-hosting

### 2. Installation rapide (Cloud)

```bash
# 1. Créer un compte sur plausible.io
# 2. Ajouter votre domaine : omnirealm.tech

# 3. Ajouter le script dans layout.tsx
```

### 3. Code d'intégration

#### Remplacer PostHog par Plausible

**Dans `src/app/layout.tsx` :**

```tsx
// Supprimer PostHog
// import { PHProvider } from './PostHogProvider';

// Ajouter Plausible (dans <head>)
<script
  defer
  data-domain="omnirealm.tech"
  src="https://plausible.io/js/script.js"
/>
```

#### Variables d'environnement

**`.env.local` :**

```env
# Supprimer PostHog
# NEXT_PUBLIC_POSTHOG_KEY=...
# NEXT_PUBLIC_POSTHOG_HOST=...

# Ajouter Plausible (optionnel, pour self-hosted)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=omnirealm.tech
NEXT_PUBLIC_PLAUSIBLE_URL=https://plausible.io # ou votre URL self-hosted
```

### 4. Tracking d'événements personnalisés (optionnel)

```tsx
// utils/analytics.ts
export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
};

// Utilisation
import { trackEvent } from '@/utils/analytics';

// Dans un composant
trackEvent('Contact Form Submit', {
  subject: formData.subject,
});
```

### 5. Conformité RGPD

Avec Plausible, vous n'avez PAS besoin de :

- ❌ Bannière de cookies
- ❌ Consentement utilisateur
- ❌ Politique de cookies

Vous devez seulement :

- ✅ Mentionner Plausible dans votre politique de confidentialité

**Exemple pour `privacy-policy/page.tsx` :**

```tsx
<section>
  <h2>Analytics respectueux de la vie privée</h2>
  <p>
    Nous utilisons Plausible Analytics pour comprendre comment nos visiteurs
    utilisent notre site. Plausible est une solution d'analyse web respectueuse
    de la vie privée qui ne collecte aucune donnée personnelle, n'utilise pas de
    cookies et est conforme au RGPD par défaut.
  </p>
  <p>
    Les données collectées incluent uniquement : - Pages vues - Sources de
    trafic - Pays d'origine (sans géolocalisation précise) - Type d'appareil
    (mobile/desktop)
  </p>
</section>
```

### 6. Dashboard et métriques

Une fois installé, vous aurez accès à :

- **Visiteurs uniques**
- **Pages vues**
- **Taux de rebond**
- **Durée moyenne**
- **Top pages**
- **Sources de trafic**
- **Pays**
- **Appareils**

Dashboard accessible sur : `https://plausible.io/omnirealm.tech`

### 7. Script de migration

```bash
#!/bin/bash
# migrate-to-plausible.sh

echo "🔄 Migration PostHog → Plausible"

# 1. Supprimer PostHog
echo "📦 Suppression de PostHog..."
npm uninstall posthog-js

# 2. Nettoyer les imports
echo "🧹 Nettoyage du code..."
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "posthog" | while read file; do
    echo "  Nettoyage: $file"
    # Commenter les lignes PostHog
    sed -i 's/.*posthog.*/#&/g' "$file"
done

# 3. Supprimer le provider
rm -f src/app/PostHogProvider.tsx

echo "✅ Migration terminée !"
echo "👉 N'oubliez pas d'ajouter le script Plausible dans layout.tsx"
```

### 8. Coûts comparatifs

| Solution         | Prix/mois | Données | RGPD        | Performance |
| ---------------- | --------- | ------- | ----------- | ----------- |
| Google Analytics | Gratuit\* | USA 🇺🇸  | ❌ Bannière | Lourd       |
| PostHog          | 0-450€    | USA 🇺🇸  | ⚠️ Cookies  | Moyen       |
| **Plausible**    | 9€        | EU 🇪🇺   | ✅ Natif    | Ultra-léger |

\*Gratuit = vous êtes le produit

### 9. Commandes d'installation

```bash
# Pour la landing page
cd /mnt/h/OmniRealm/omni-systeme/dev/apps/web/omnirealm.tech/production/omnirealm-site-local

# Créer le composant analytics
mkdir -p src/utils
touch src/utils/analytics.ts

# Mettre à jour layout.tsx
# (voir code ci-dessus)

# Tester
npm run dev
```

## 🎯 Résultat attendu

- ✅ Analytics fonctionnels sans cookies
- ✅ Conformité RGPD automatique
- ✅ Performance optimale (<1KB)
- ✅ Données hébergées en Europe
- ✅ Dashboard simple et efficace

## 🚀 Prochaines étapes

1. Créer compte Plausible.io
2. Ajouter le script dans layout.tsx
3. Supprimer PostHog
4. Mettre à jour la politique de confidentialité
5. Profiter d'analytics éthiques !

---

**Note** : Pour OmniFit et autres micro-SaaS, utilisez le même
processus.
