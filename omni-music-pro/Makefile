.PHONY: help install test coverage lint format run build clean

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances avec Poetry
	poetry install

test: ## Lance les tests
	poetry run pytest

test-unit: ## Lance uniquement les tests unitaires
	poetry run pytest tests/unit/

test-integration: ## Lance uniquement les tests d'intégration
	poetry run pytest tests/integration/

coverage: ## Lance les tests avec couverture
	poetry run pytest --cov=omni_music --cov-report=html --cov-report=term

lint: ## Vérifie le code avec ruff
	poetry run ruff check src/ tests/

format: ## Formate le code avec black et ruff
	poetry run black src/ tests/
	poetry run ruff check --fix src/ tests/

mypy: ## Vérifie les types avec mypy
	poetry run mypy src/

run: ## Lance l'application
	poetry run python -m omni_music

build: ## Construit l'application avec PyInstaller
	poetry run pyinstaller \
		--name="OmniMusic Pro" \
		--windowed \
		--onedir \
		--icon=assets/icon.ico \
		--add-data="assets:assets" \
		src/omni_music/__main__.py

clean: ## Nettoie les fichiers temporaires
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name ".coverage" -delete
	rm -rf htmlcov/
	rm -rf dist/
	rm -rf build/
	rm -rf *.egg-info/

dev: ## Lance l'application en mode développement avec hot-reload
	poetry run python -m omni_music --debug

qa: lint mypy test ## Lance tous les checks de qualité

pre-commit: ## Installe les hooks pre-commit
	poetry run pre-commit install

commit: qa ## Vérifie la qualité avant de commit
	@echo "✅ Tous les checks sont passés !"