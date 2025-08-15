# 🧪 Système A/B Testing OmniRealm - Guide de Démarrage Rapide

## 🚀 Quick Start

### Activer les tests A/B
```bash
npm run ab:enable
```

### Voir le statut
```bash
npm run ab:status  
```

### Dashboard
```bash
npm run dev
# Aller à http://localhost:3000/admin/ab-tests
```

## 📊 Tests Actifs pour OmniScan

| Test | Variants | Objectif |
|------|----------|----------|
| **Hero Messaging** | OCR Intelligent vs Extraction Automatique | Améliorer compréhension |
| **CTA Style** | Bleu vs Vert vs Orange+Urgence | Optimiser clics |
| **Pricing** | Standard vs Remise+Urgence | Augmenter conversions |
| **Social Proof** | Aucune vs Stats vs Témoignages | Renforcer confiance |

## 🎯 Métriques Trackées

### Conversions Principales
- `SIGNUP` - Inscription
- `SUBSCRIPTION` - Souscription  
- `TRIAL_START` - Début essai

### Micro-conversions
- `CTA_CLICK` - Clic bouton
- `PRICING_VIEW` - Vue prix
- `SCROLL_50` - Scroll 50%
- `TIME_ON_PAGE_60S` - 1min+ sur page

## 🔧 Architecture

```
src/
├── hooks/
│   └── useABTest.ts              # Hook principal
├── lib/
│   └── abTests.ts                # Configuration tests
├── components/ab-testing/
│   ├── ABTestProvider.tsx        # Contexte React
│   ├── ABOptimizedHero.tsx       # Hero optimisé
│   ├── ABOptimizedPricing.tsx    # Prix optimisés
│   └── ABOptimizedSocialProof.tsx # Preuve sociale
├── app/admin/ab-tests/
│   └── page.tsx                  # Dashboard
└── app/produits/omniscan/
    ├── page.tsx                  # Page actuelle
    └── page-ab-test.tsx         # Version A/B
```

## 📱 Utilisation

### Hook Simple
```tsx
const { variant, config, trackConversion } = useABTest(omniScanHeroTest);

// Utiliser la config
<h1>{config.headline}</h1>

// Tracker une conversion
<button onClick={() => trackConversion('cta_click')}>
  {config.ctaPrimary}
</button>
```

### Contexte Global
```tsx
<ABTestProvider product="omniscan">
  <ABOptimizedHero />
  <ABOptimizedPricing />
</ABTestProvider>
```

## 🎨 Variants Configurés

### Hero Test
- **Control**: "OCR Intelligent avec IA" + "Essayer Gratuitement"
- **Variant A**: "Extraction Automatique" + "Démarrer l'Extraction"

### CTA Test  
- **Control**: Bouton bleu standard
- **Variant A**: Bouton vert
- **Variant B**: Bouton orange + texte urgence

### Pricing Test
- **Control**: 49€/mois standard
- **Variant A**: 34€/mois (-30%) + bannière urgence

## 📈 Dashboard Features

- Vue temps réel des performances
- Calcul significativité statistique
- Sélection objectifs conversion
- Export des données
- Réinitialisation tests

## 🔐 Privacy & RGPD

- ✅ Consentement cookies requis
- ✅ Pas de tracking sans accord
- ✅ User ID pseudonymisé
- ✅ Données en localStorage uniquement
- ✅ Compatible Plausible (privacy-first)

## 🧪 Tests Unitaires

```bash
npm test hooks/useABTest.test.ts
```

Coverage:
- ✅ Assignation variants
- ✅ Persistance localStorage
- ✅ Respect poids distribution
- ✅ Gestion dates début/fin
- ✅ Tracking conversions

## 🚀 Déploiement

1. **Test local**: `npm run dev` → `/admin/ab-tests`
2. **Vérification**: Assigner différents variants manuellement
3. **Clear data**: Dashboard → "Clear All Data"
4. **Production**: Deploy normalement
5. **Monitoring**: Surveiller métriques Plausible

## 📊 Analyse Résultats

### Critères de Succès
- **Taille échantillon**: 1000+ vues par variant
- **Durée minimum**: 2 semaines
- **Signification**: p < 0.05
- **Lift minimum**: +10% conversion rate

### Métriques Business
- **Revenus** par variant
- **LTV** (Lifetime Value)
- **Retention** 30 jours
- **Qualité traffic** (temps sur site)

## 🔄 Workflow

1. **Hypothèse**: Définir ce qu'on teste
2. **Configuration**: Ajouter dans `abTests.ts`
3. **Implémentation**: Créer composants optimisés
4. **Test**: Vérifier en local
5. **Lancement**: Activer sur 50/50
6. **Monitoring**: Dashboard quotidien
7. **Décision**: Garder gagnant après 2 semaines
8. **Documentation**: Noter apprentissages

## 🛠️ Scripts Utiles

```bash
# Gestion A/B
npm run ab:enable     # Activer tests
npm run ab:disable    # Désactiver tests  
npm run ab:status     # Voir statut

# Développement
npm run dev          # Server développement
npm run test         # Tests unitaires
npm run lint         # Vérification code
```

## 📚 Ressources

- **Documentation complète**: [docs/AB_TESTING.md](docs/AB_TESTING.md)
- **Dashboard**: `/admin/ab-tests`
- **Tests**: `src/hooks/__tests__/`
- **Configuration**: `src/lib/abTests.ts`

## 🎯 Prochaines Étapes

1. **Analyser résultats** après 2 semaines
2. **Implémenter gagnants** définitivement  
3. **Nouveaux tests**: OmniTask et OmniFit
4. **Segmentation**: Tests par source traffic
5. **ML**: Auto-optimisation variants

---

**💡 Tip**: Utilisez `npm run ab:status` pour vérifier l'état à tout moment !

*Dernière mise à jour : 13 août 2025*