# 🌟 OmniRealm Web (@omnirealm/web)

Application web principale d'OmniRealm - Une landing page moderne construite avec Next.js 15.3.2 et React 19.

🚀 **Déployable sur VPS avec Coolify**

## ✨ Fonctionnalités

- **🎨 Design moderne** avec animations Framer Motion
- **📱 Responsive** optimisé pour tous les appareils
- **⚡ Performance** optimisée avec Next.js Image et Turbopack
- **♿ Accessibilité** conforme aux standards WCAG
- **🛡️ Sécurité** validation côté client et serveur
- **📊 Analytics** intégration PostHog
- **🌐 SEO** optimisé avec métadonnées complètes

## 🚀 Démarrage rapide

```bash
# Installation des dépendances (pnpm requis)
pnpm install

# Mode développement avec Turbopack
pnpm run dev

# Construction pour la production
pnpm run build

# Démarrage du serveur de production
pnpm start

# Validation avant commit
pnpm run validate
```

## 📁 Structure du projet

```
src/
├── app/                    # App Router Next.js
│   ├── api/               # Routes API
│   │   ├── contact/       # API formulaire de contact
│   │   └── newsletter/    # API inscription newsletter
│   ├── about/             # Page À propos
│   ├── contact/           # Page Contact
│   ├── dashboard/         # Tableau de bord utilisateur
│   └── ...
├── components/            # Composants React réutilisables
│   ├── HeaderNoContext.tsx
│   ├── HeroSection.tsx
│   ├── ProblemSolutionSection.tsx
│   ├── EngagementsSection.tsx
│   └── ...
├── context/              # Contextes React (AuthContext, etc.)
└── lib/                  # Utilitaires et helpers
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# n8n Webhooks (Production)
N8N_NEWSLETTER_WEBHOOK_URL=https://n8n.omnirealm.tech/webhook/newsletter
N8N_CONTACT_WEBHOOK_URL=https://n8n.omnirealm.tech/webhook/contact
```

## 🧪 Tests

```bash
# Lancer les tests
pnpm test

# Lancer ESLint
pnpm run lint

# Formatter le code
pnpm run format

# Validation complète (lint + tests)
pnpm run validate
```

## 📊 Performances

- **Bundle size**: ~101 kB First Load JS
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Core Web Vitals**: Optimisé pour LCP, FID, CLS

## 🛡️ Sécurité

- ✅ Validation des formulaires côté client et serveur
- ✅ Protection CSRF avec Next.js
- ✅ Sanitisation des entrées utilisateur
- ✅ Headers de sécurité configurés
- ✅ Pas de vulnérabilités dans les dépendances

## 🎯 Optimisations appliquées

### Récemment corrigé ✅

- **Icônes SVG** : Créés des visuels custom pour "Le Problème" et "La Solution"
- **Configuration Turbopack** : Migration complète vers Turbopack
- **Cohérence visuelle** : Uniformisation des hauteurs de cartes
- **Images optimisées** : Conversion vers Next.js Image components
- **API complète** : Ajout de l'API route pour le formulaire de contact
- **Type de module** : Configuration ES modules

### Points forts 💪

- **TypeScript** strict pour la sécurité de type
- **Composants modulaires** bien structurés
- **Gestion d'erreur** robuste
- **Hooks personnalisés** pour la logique métier
- **Design system** cohérent avec Tailwind CSS

## 🚀 Déploiement

### Déploiement avec Coolify (VPS)

Le projet est configuré pour un déploiement automatique sur VPS via Coolify.

```bash
# Construction Docker locale (test)
docker build -t omnirealm-web .

# Test en local
docker run -p 3000:3000 omnirealm-web
```

### Configuration Coolify

1. **Source** : Connecter le repository Git
2. **Build Pack** : Docker (Dockerfile présent)
3. **Variables d'environnement** : Configurer dans Coolify
4. **Domaine** : omnirealm.tech

### Script de déploiement manuel

```bash
# Construction optimisée
pnpm run build

# Le sitemap est généré automatiquement
# Les assets sont optimisés par Next.js
```

## 📝 API Routes

### POST /api/newsletter

Inscription à la newsletter via webhook n8n

```typescript
{
  email: string;
}
```

### POST /api/contact

Envoi de message de contact via webhook n8n

```typescript
{
  name: string;
  email: string;
  subject: string;
  message: string;
}
```

## 🤝 Contribution

1. Fork du projet
2. Créer une branche feature (`git checkout -b feature/awesome-feature`)
3. Commit des changements (`git commit -m 'Add awesome feature'`)
4. Push vers la branche (`git push origin feature/awesome-feature`)
5. Ouvrir une Pull Request

## 📄 License

Projet privé - OmniRealm © 2024

---

**Tech Stack**: Next.js 15.3.2 • React 19 • TypeScript • Tailwind CSS • Framer
Motion • PostHog
