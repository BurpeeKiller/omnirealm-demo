# OmniScan - OCR & AI Document Analysis

Application de numérisation et d'analyse intelligente de documents avec OCR et IA.

## 🚀 Démarrage rapide

```bash
# Installation
pnpm install

# Développement
pnpm dev

# Tests
pnpm test

# Build
pnpm build
```

## 📁 Structure

```
omni-scan/
├── backend/        # API FastAPI
├── frontend/       # React + Vite
├── supabase/       # Base de données
└── docs/          # Documentation
```

## 🛠️ Stack technique

- **Backend**: FastAPI, Python 3.11+
- **Frontend**: React 18, Vite, TypeScript
- **Database**: Supabase (PostgreSQL)
- **OCR**: Tesseract
- **AI**: OpenAI GPT-4

## 📋 Fonctionnalités

- ✅ Upload de documents (PDF, images)
- ✅ OCR multi-langues
- ✅ Analyse IA du contenu
- ✅ Export des résultats
- ✅ Historique des scans

## 🔧 Configuration

Copier `.env.example` vers `.env` et configurer :

```bash
cp .env.example .env
```

Variables requises :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## 📝 Documentation

- [Guide API](./docs/API.md)
- [Déploiement](./docs/DEPLOYMENT.md)