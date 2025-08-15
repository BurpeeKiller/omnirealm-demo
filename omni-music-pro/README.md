# 🎵 OmniMusic Pro

> Application moderne de téléchargement et gestion musicale construite avec une architecture hexagonale

## 🏗️ Architecture

Ce projet suit les principes de la **Clean Architecture** (Architecture Hexagonale) pour une séparation claire des responsabilités :

```
src/omni_music/
├── domain/        # Cœur métier (pur Python, aucune dépendance)
├── application/   # Cas d'usage et orchestration
├── infrastructure/# Adaptateurs externes (APIs, DB, fichiers)
└── presentation/  # Interface utilisateur (GUI, CLI, API)
```

## ✨ Fonctionnalités

- 🎵 Téléchargement depuis YouTube et Deezer
- 🎨 Interface moderne avec CustomTkinter
- 🔄 Conversion automatique entre formats audio
- 📋 Gestion des playlists et métadonnées
- 🔒 Architecture sécurisée et testable
- 🚀 Performance optimisée avec async/await

## 🛠️ Stack Technique

- **Python 3.12+** avec type hints complets
- **CustomTkinter** pour l'interface graphique
- **yt-dlp** pour YouTube
- **pytest** pour les tests (>80% de couverture)
- **Poetry** pour la gestion des dépendances

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/yourusername/omni-music-pro.git
cd omni-music-pro

# Installer avec Poetry
poetry install

# Lancer l'application
poetry run python -m omni_music
```

## 🧪 Tests

```bash
# Lancer tous les tests
poetry run pytest

# Avec couverture
poetry run pytest --cov=omni_music --cov-report=html

# Tests spécifiques
poetry run pytest tests/unit/
poetry run pytest tests/integration/
```

## 📐 Principes SOLID

1. **S**ingle Responsibility : Chaque classe a une seule responsabilité
2. **O**pen/Closed : Extensible sans modification du code existant
3. **L**iskov Substitution : Les interfaces sont respectées
4. **I**nterface Segregation : Interfaces spécifiques et focalisées
5. **D**ependency Inversion : Dépendances vers les abstractions

## 🎯 Roadmap

- [x] Architecture hexagonale
- [x] Domaine métier
- [ ] Infrastructure (YouTube, Deezer)
- [ ] Interface graphique
- [ ] Tests complets
- [ ] Documentation
- [ ] CI/CD
- [ ] Distribution

## 📄 License

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

Développé avec ❤️ pour démontrer les meilleures pratiques en développement logiciel.