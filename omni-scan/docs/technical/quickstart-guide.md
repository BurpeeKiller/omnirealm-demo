# 🚀 Guide de Démarrage Rapide - OmniScan v8.0

## Vue d'ensemble

OmniScan v8.0 est une plateforme intelligente de numérisation et d'analyse de documents avec IA locale et analytics avancés.

### ✨ Nouvelles Fonctionnalités v8.0

- **Dashboard Analytics** : Métriques utilisateur et globales en temps réel
- **IA Premium** : Analyse multilingue avancée avec Ollama
- **Interface Modernisée** : Navigation par onglets (Scanner/Analytics)
- **Graphiques Interactifs** : Visualisations avec Recharts
- **Exports Personnalisés** : Rapports CSV et analytics

## 🎯 Démarrage en 5 Minutes

### 1. Prérequis

```bash
# Vérifier Node.js (v18+)
node --version

# Vérifier Python (v3.8+)
python3 --version

# Installer Ollama (pour l'IA locale)
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral
```

### 2. Installation Backend

```bash
cd BACKEND

# Installer les dépendances (avec environnement virtuel recommandé)
pip3 install -r requirements.txt

# Démarrer le serveur
python3 core/app_secure.py
```

🌐 **Backend disponible sur**: http://localhost:5000

### 3. Installation Frontend

```bash
cd FRONTEND

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm run dev
```

🌐 **Frontend disponible sur**: http://localhost:3000

### 4. Première Utilisation

1. **Scanner** : Uploadez un document (PDF, DOCX, image)
2. **Analytics** : Consultez vos métriques d'utilisation
3. **IA Premium** : Analysez un document avec l'IA avancée

## 📊 Fonctionnalités Principales

### 🔍 Scanner de Documents

- **Formats supportés** : PDF, DOCX, TXT, JPG, PNG, EPUB
- **IA locale** : Analyse avec Ollama/Mistral
- **Temps réel** : Suivi de progression en direct
- **Résultats structurés** : JSON avec résumé, mots-clés, catégorie

### 📈 Dashboard Analytics

#### Vue Utilisateur

- Nombre total d'analyses
- Taux de succès personnalisé
- Score de productivité
- Temps de traitement moyen
- Types de fichiers traités
- Langues détectées

#### Vue Globale

- Utilisateurs actifs
- Métriques de la plateforme
- Tendances d'utilisation
- Performance système
- Répartition par heure

### 🤖 IA Premium

- **Résumé intelligent** : Multi-niveaux (exécutif, détaillé)
- **Extraction d'entités** : Personnes, organisations, lieux, dates
- **Classification** : Type de document et catégorie automatique
- **Analyse de sentiment** : Tonalité et émotions
- **Support multilingue** : 11 langues détectées
- **Métriques de lisibilité** : Score Flesch, temps de lecture

## 🛠️ Architecture Technique

### Backend (Python Flask)

```
BACKEND/
├── core/
│   ├── app.py              # Application principale
│   └── app_secure.py       # Application sécurisée
├── api/
│   ├── analytics.py        # 11 endpoints analytics
│   ├── ai_premium.py       # 7 endpoints IA premium
│   ├── upload.py           # Upload de fichiers
│   └── ...
├── shared/
│   ├── services/
│   │   ├── analytics.py    # Service SQLite analytics
│   │   └── ai_premium.py   # Service IA avec Ollama
│   └── utils/
└── requirements.txt
```

### Frontend (React + TypeScript)

```
FRONTEND/
├── src/
│   ├── pages/
│   │   └── Dashboard.tsx           # Page principale avec onglets
│   ├── components/
│   │   ├── analytics/
│   │   │   ├── UserAnalyticsDashboard.tsx
│   │   │   ├── GlobalAnalyticsDashboard.tsx
│   │   │   └── AnalyticsTabPanel.tsx
│   │   ├── ai/
│   │   │   ├── PremiumAnalysisPanel.tsx
│   │   │   └── PremiumFeatureButton.tsx
│   │   └── ...
└── package.json
```

## 🔧 Configuration

### Variables d'Environnement

Créer `.env` dans le dossier backend :

```env
# IA Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# Database
DATABASE_URL=sqlite:///omniscan.db

# Security
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000

# Analytics
ANALYTICS_DB_PATH=./core/db/analytics.db
```

### Configuration Ollama

```bash
# Démarrer Ollama
ollama serve

# Installer le modèle Mistral
ollama pull mistral

# Tester l'installation
curl http://localhost:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "Hello",
  "stream": false
}'
```

## 📊 API Endpoints

### Analytics (`/api/analytics/`)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/user/metrics` | GET | Métriques utilisateur |
| `/global/metrics` | GET | Métriques globales |
| `/user/trends` | GET | Tendances d'usage |
| `/user/report` | GET | Rapport complet |
| `/export/csv` | GET | Export CSV |
| `/health` | GET | Santé du service |

### IA Premium (`/api/ai/`)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/analyze` | POST | Analyse complète |
| `/summary` | POST | Résumé intelligent |
| `/entities` | POST | Extraction d'entités |
| `/sentiment` | POST | Analyse de sentiment |
| `/classify` | POST | Classification |
| `/health` | GET | Santé du service |

## 🚀 Commandes de Développement

### Backend

```bash
# Démarrage rapide
python3 core/app_secure.py

# Tests
python3 -m pytest TESTS/

# Validation système
python3 SCRIPTS/validate-system-v8.py
```

### Frontend

```bash
# Développement
pnpm run dev

# Build production
pnpm run build

# Tests
pnpm run test

# Vérifications
pnpm run type-check
pnpm run lint
```

## 🔍 Dépannage Courant

### Problème: Ollama non disponible

```bash
# Vérifier le statut
curl http://localhost:11434/api/tags

# Redémarrer Ollama
ollama serve
```

### Problème: Erreur de CORS

- Vérifier `CORS_ORIGINS` dans `.env`
- S'assurer que le frontend tourne sur le bon port

### Problème: Base de données analytics

```bash
# Vérifier le fichier SQLite
ls -la BACKEND/core/db/analytics.db

# Recréer la base si nécessaire
rm BACKEND/core/db/analytics.db
# La base sera recréée automatiquement
```

## 📈 Métriques de Performance

### Benchmarks v8.0

- **Traitement document** : < 5s (moyenne)
- **Analyse IA Premium** : < 10s (selon complexité)
- **Interface utilisateur** : < 2s (temps de chargement)
- **Analytics** : Temps réel (< 500ms)

### Limites Système

- **Taille fichier** : 100MB max
- **Formats supportés** : PDF, DOCX, TXT, JPG, PNG, EPUB
- **Concurrent users** : Dépend de la configuration serveur
- **Base analytics** : SQLite (migration PostgreSQL possible)

## 🎯 Cas d'Usage Typiques

### 1. Analyste de Documents

1. Upload multiple de PDFs professionnels
2. Utilisation de l'IA Premium pour classification
3. Export des métriques en CSV
4. Suivi des tendances dans Analytics

### 2. Étudiant/Chercheur

1. Scanner de documents de recherche
2. Résumés intelligents automatiques
3. Extraction d'entités et mots-clés
4. Analyse de sentiment des textes

### 3. Enterprise

1. Traitement de documents en lot
2. Monitoring des performances
3. Rapports d'usage détaillés
4. Intégration API personnalisée

## 🔐 Sécurité

### Fonctionnalités Intégrées

- **CORS configuré** : Origines autorisées uniquement
- **Rate limiting** : Protection contre le spam
- **JWT Authentication** : Sessions sécurisées
- **IA locale** : Données ne quittent pas le serveur
- **Validation d'entrée** : Sanitisation des uploads

### Bonnes Pratiques

- Utiliser HTTPS en production
- Configurer un pare-feu approprié
- Monitorer les logs d'accès
- Sauvegarder régulièrement la base analytics

## 🆙 Mise à Niveau

### Depuis v7.x

1. Installer les nouvelles dépendances : `recharts`
2. Mettre à jour requirements.txt (ajouter `aiohttp`, `psutil`)
3. Copier les nouveaux composants analytics
4. Redémarrer les services

### Migration des Données

- Analytics : Nouveau système SQLite (démarrage propre)
- Documents : Compatible avec versions précédentes
- Configuration : Ajouter nouvelles variables d'environnement

---

## 💡 Support et Contribution

### Resources

- **Documentation complète** : `/DOCS/`
- **Scripts de validation** : `/SCRIPTS/validate-system-v8.py`
- **Tests** : `/TESTS/`
- **Exemples** : `/TESTS/samples/`

### Prochaines Fonctionnalités

- Intégration Stripe (en attente)
- Système de quotas
- API REST étendue
- Interface mobile
- Clustering de documents

**🎉 Félicitations ! Vous êtes maintenant prêt à utiliser OmniScan v8.0 !**
