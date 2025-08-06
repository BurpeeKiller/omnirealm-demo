# 🔧 Configuration OmniScan Backend

Ce guide explique comment configurer correctement l'environnement backend d'OmniScan.

## 📋 Table des matières

- [🚀 Démarrage rapide](#-démarrage-rapide)
- [📝 Variables d'environnement](#-variables-denvironnement)
- [🔧 Configuration par environnement](#-configuration-par-environnement)
- [🔍 Validation](#-validation)
- [🐛 Dépannage](#-dépannage)
- [🔒 Sécurité](#-sécurité)

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
make install
```

### 2. Configuration automatique

```bash
make setup-env
```
Suivez le guide interactif pour configurer votre environnement.

### 3. Validation

```bash
make validate-env
```

### 4. Lancement

```bash
make dev
```

## 📝 Variables d'environnement

### 📋 Variables obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SECRET_KEY` | Clé secrète pour JWT | `openssl rand -hex 32` |
| `SUPABASE_URL` | URL de votre instance Supabase | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase | `eyJhbGci...` |
| `OPENAI_API_KEY` | Clé API OpenAI | `sk-proj-...` |

### ⚙️ Variables optionnelles

| Variable | Défaut | Description |
|----------|--------|-------------|
| `ENVIRONMENT` | `development` | Mode d'exécution |
| `DEBUG` | `true` | Mode debug |
| `BACKEND_URL` | `http://localhost:8000` | URL du backend |
| `OPENAI_MODEL` | `gpt-4o-mini` | Modèle OpenAI |
| `MAX_FILE_SIZE_MB` | `10` | Taille max fichiers |
| `OCR_LANGUAGES` | `fra+eng` | Langues OCR |
| `LOG_LEVEL` | `INFO` | Niveau de logging |
| `RATE_LIMIT_PER_MINUTE` | `60` | Limite requêtes/min |

### 🌐 CORS et sécurité

| Variable | Défaut | Description |
|----------|--------|-------------|
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | URLs autorisées |

## 🔧 Configuration par environnement

### 🧪 Développement

```bash
# Configuration automatique
make setup-env

# Ou manuellement
cp .env.example .env
# Modifier les valeurs dans .env
```

Configuration recommandée :
```env
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=dev-secret-key-change-in-production
LOG_LEVEL=DEBUG
```

### 🏭 Production

⚠️ **Important** : En production, utilisez les variables d'environnement système, **jamais de fichier .env** !

```bash
# Générer une clé secrète sécurisée
export SECRET_KEY=$(openssl rand -hex 32)

# Variables d'environnement système
export ENVIRONMENT=production
export DEBUG=false
export SUPABASE_URL=https://your-prod-instance.supabase.co
export SUPABASE_ANON_KEY=your-prod-anon-key
export OPENAI_API_KEY=your-prod-openai-key
export LOG_LEVEL=INFO
```

### 🧪 Tests

Les tests utilisent une configuration spéciale automatiquement :
```bash
ENVIRONMENT=test
# Configuration minimal pour les tests
```

## 🔍 Validation

### Script de validation complet

```bash
make validate-env
```

Le script vérifie :
- ✅ Variables d'environnement requises
- ✅ Configuration spécifique à l'environnement
- ✅ Chemins et dossiers
- ✅ Connectivité aux services externes
- ✅ Configuration de l'application

### Statut du système

```bash
make status
```

## 🐛 Dépannage

### Erreurs courantes

#### ❌ "SECRET_KEY must be set"
```bash
# Générer une nouvelle clé
export SECRET_KEY=$(openssl rand -hex 32)
```

#### ❌ "Supabase connection failed"
1. Vérifiez votre `SUPABASE_URL`
2. Vérifiez votre `SUPABASE_ANON_KEY`
3. Testez la connectivité : `curl https://your-url.supabase.co/rest/v1/`

#### ❌ "OpenAI API key invalid"
1. Vérifiez que la clé commence par `sk-`
2. Testez avec une requête simple
3. Vérifiez les quotas/limites

#### ❌ "Import errors"
```bash
# Réinstaller les dépendances
make clean-all
make install
```

### Debug mode

Pour activer les logs détaillés :
```bash
export LOG_LEVEL=DEBUG
make dev
```

### Nettoyage

```bash
# Nettoyage simple
make clean

# Nettoyage complet (inclut venv)
make clean-all
```

## 🔒 Sécurité

### 🔑 Gestion des secrets

#### ✅ Bonnes pratiques

- **Production** : Variables d'environnement système uniquement
- **Développement** : Fichier `.env` (ignoré par Git)
- **Rotation** : Changez les clés régulièrement
- **Stockage** : Utilisez un gestionnaire de secrets (AWS Secrets Manager, etc.)

#### ❌ À éviter

- Fichiers `.env` en production
- Secrets dans le code source
- Clés par défaut en production
- Partage de secrets par email/chat

### 🛡️ Validation de sécurité

```bash
# Analyse de vulnérabilités
make security-check

# Vérification des dépendances
safety check

# Analyse statique du code
bandit -r app/
```

### 🔐 Environnement de production

```bash
# Configuration minimale sécurisée
export ENVIRONMENT=production
export DEBUG=false
export SECRET_KEY=$(openssl rand -hex 32)
export LOG_LEVEL=WARNING
export RATE_LIMIT_PER_MINUTE=30

# Variables métier (à adapter)
export SUPABASE_URL=your-production-url
export SUPABASE_ANON_KEY=your-production-key
export OPENAI_API_KEY=your-production-openai-key
```

## 📚 Ressources

### Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [FastAPI Configuration](https://fastapi.tiangolo.com/advanced/settings/)
- [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)

### Outils

- [OpenSSL](https://www.openssl.org/) - Génération de clés
- [Safety](https://pyup.io/safety/) - Vérification vulnérabilités
- [Bandit](https://bandit.readthedocs.io/) - Analyse sécurité Python

### Support

- 📋 Issues : [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Documentation : `/docs/`
- 🔧 Configuration : `make help`

---

🎯 **Objectif** : Configuration sécurisée et fonctionnelle en moins de 5 minutes !