# =========================================
# OMNISCAN BACKEND - MAKEFILE
# =========================================
# Commandes pour gérer le backend OmniScan

.PHONY: help install dev test lint format clean validate-env setup-env build docker

# Variables
PYTHON := python3
PIP := pip3
VENV := venv
SOURCE := . $(VENV)/bin/activate

# Couleurs pour les messages
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
BLUE := \033[34m
RESET := \033[0m

# Aide par défaut
help: ## Afficher cette aide
	@echo "$(BLUE)🚀 OMNISCAN BACKEND - COMMANDES DISPONIBLES$(RESET)"
	@echo "$(BLUE)================================================$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-15s$(RESET) %s\\n", $$1, $$2}'

# Installation et configuration
install: ## Installer les dépendances
	@echo "$(YELLOW)📦 Installation des dépendances...$(RESET)"
	$(PYTHON) -m venv $(VENV)
	$(SOURCE) && $(PIP) install --upgrade pip
	$(SOURCE) && $(PIP) install -r requirements.txt
	@echo "$(GREEN)✅ Installation terminée$(RESET)"

setup-env: ## Configurer l'environnement (.env)
	@echo "$(YELLOW)🔧 Configuration de l'environnement...$(RESET)"
	$(SOURCE) && $(PYTHON) scripts/setup_env.py

validate-env: ## Valider la configuration environnement
	@echo "$(YELLOW)🔍 Validation de la configuration...$(RESET)"
	$(SOURCE) && $(PYTHON) scripts/validate_env.py

# Développement
dev: validate-env ## Lancer le serveur de développement
	@echo "$(YELLOW)🚀 Démarrage du serveur de développement...$(RESET)"
	$(SOURCE) && uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

dev-docker: ## Lancer via Docker Compose
	@echo "$(YELLOW)🐳 Démarrage avec Docker...$(RESET)"
	docker-compose up --build

# Tests et qualité
test: ## Lancer les tests
	@echo "$(YELLOW)🧪 Exécution des tests...$(RESET)"
	$(SOURCE) && python -m pytest tests/ -v --cov=app --cov-report=html --cov-report=term

test-unit: ## Lancer uniquement les tests unitaires
	@echo "$(YELLOW)🧪 Tests unitaires...$(RESET)"
	$(SOURCE) && python -m pytest tests/unit/ -v

test-integration: ## Lancer les tests d'intégration
	@echo "$(YELLOW)🧪 Tests d'intégration...$(RESET)"
	$(SOURCE) && python -m pytest tests/integration/ -v

test-watch: ## Lancer les tests en mode watch
	@echo "$(YELLOW)👀 Tests en mode surveillance...$(RESET)"
	$(SOURCE) && python -m pytest tests/ --watch

lint: ## Vérifier le code avec ruff
	@echo "$(YELLOW)🔍 Analyse du code...$(RESET)"
	$(SOURCE) && ruff check app/ tests/ --fix

lint-check: ## Vérifier le code sans correction
	@echo "$(YELLOW)🔍 Vérification du code...$(RESET)"
	$(SOURCE) && ruff check app/ tests/

format: ## Formater le code avec black
	@echo "$(YELLOW)✨ Formatage du code...$(RESET)"
	$(SOURCE) && black app/ tests/ scripts/

format-check: ## Vérifier le formatage sans modification
	@echo "$(YELLOW)✨ Vérification du formatage...$(RESET)"
	$(SOURCE) && black --check app/ tests/ scripts/

type-check: ## Vérifier les types avec mypy
	@echo "$(YELLOW)🎯 Vérification des types...$(RESET)"
	$(SOURCE) && mypy app/ || true

quality: format lint type-check test ## Vérification complète de la qualité
	@echo "$(GREEN)✅ Vérifications qualité terminées$(RESET)"

# Base de données
db-migrate: ## Appliquer les migrations (Supabase)
	@echo "$(YELLOW)🗃️  Application des migrations...$(RESET)"
	supabase db push

db-reset: ## Réinitialiser la base de données
	@echo "$(YELLOW)🗃️  Réinitialisation de la base...$(RESET)"
	supabase db reset

db-types: ## Générer les types TypeScript depuis la DB
	@echo "$(YELLOW)📝 Génération des types...$(RESET)"
	supabase gen types typescript --local > ../frontend/src/types/database.ts

# Nettoyage
clean: ## Nettoyer les fichiers temporaires
	@echo "$(YELLOW)🧹 Nettoyage...$(RESET)"
	rm -rf __pycache__/
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf uploads/*.pdf uploads/*.jpg uploads/*.png
	rm -rf temp/*
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete
	@echo "$(GREEN)✅ Nettoyage terminé$(RESET)"

clean-all: clean ## Nettoyage complet (inclut venv)
	@echo "$(YELLOW)🧹 Nettoyage complet...$(RESET)"
	rm -rf $(VENV)/
	@echo "$(GREEN)✅ Nettoyage complet terminé$(RESET)"

# Build et déploiement
build: quality ## Build pour la production
	@echo "$(YELLOW)🏗️  Build de production...$(RESET)"
	$(SOURCE) && $(PIP) freeze > requirements-prod.txt
	@echo "$(GREEN)✅ Build terminé$(RESET)"

docker-build: ## Build de l'image Docker
	@echo "$(YELLOW)🐳 Build de l'image Docker...$(RESET)"
	docker build -t omniscan-backend .

docker-run: ## Lancer le container Docker
	@echo "$(YELLOW)🐳 Démarrage du container...$(RESET)"
	docker run -p 8000:8000 --env-file .env omniscan-backend

# Outils de développement
shell: ## Ouvrir un shell Python avec l'app chargée
	@echo "$(YELLOW)🐍 Shell Python interactif...$(RESET)"
	$(SOURCE) && python -c "from app.main import app; from app.core.config import settings; print('OmniScan shell ready!'); import IPython; IPython.start_ipython(argv=[])"

logs: ## Voir les logs de l'application
	@echo "$(YELLOW)📋 Logs de l'application...$(RESET)"
	tail -f logs/omniscan.log 2>/dev/null || echo "Aucun fichier de log trouvé"

# Sécurité
security-check: ## Vérifier les vulnérabilités
	@echo "$(YELLOW)🔒 Analyse de sécurité...$(RESET)"
	$(SOURCE) && safety check
	$(SOURCE) && bandit -r app/

# Métriques et monitoring
metrics: ## Afficher les métriques du code
	@echo "$(YELLOW)📊 Métriques du code...$(RESET)"
	$(SOURCE) && radon cc app/ -a
	$(SOURCE) && radon mi app/

coverage: ## Générer le rapport de couverture
	@echo "$(YELLOW)📊 Rapport de couverture...$(RESET)"
	$(SOURCE) && python -m pytest tests/ --cov=app --cov-report=html
	@echo "$(BLUE)📄 Rapport HTML généré dans htmlcov/index.html$(RESET)"

# Utilitaires
reload: ## Redémarrer le serveur de développement
	@echo "$(YELLOW)🔄 Redémarrage...$(RESET)"
	pkill -f "uvicorn app.main:app" || true
	make dev

status: validate-env ## Afficher le statut du système
	@echo "$(BLUE)📊 STATUT OMNISCAN BACKEND$(RESET)"
	@echo "$(BLUE)========================$(RESET)"
	@echo "Environment: $$(grep ENVIRONMENT .env 2>/dev/null | cut -d'=' -f2 || echo 'Non configuré')"
	@echo "Python: $$(python3 --version)"
	@echo "Dossier: $$(pwd)"
	@echo "Virtual env: $$([ -d $(VENV) ] && echo 'Installé' || echo 'Non installé')"
	@echo "Port 8000: $$(lsof -ti:8000 && echo 'Utilisé' || echo 'Libre')"

# Commandes par défaut
.DEFAULT_GOAL := help