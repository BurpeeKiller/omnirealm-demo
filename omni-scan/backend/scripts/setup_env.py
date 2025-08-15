#!/usr/bin/env python3
"""
Script d'initialisation de l'environnement OmniScan
Aide à configurer les variables d'environnement nécessaires
"""

import os
from app.utils.logger import logger
import sys
import secrets
from pathlib import Path
from typing import Dict, Optional

# Couleurs pour le terminal
class Color:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'


def print_header():
    """Afficher l'en-tête"""
    logger.info(f"\n{Color.CYAN}{Color.BOLD}🚀 CONFIGURATION OMNISCAN{Color.END}")
    logger.info(f"{Color.CYAN}{'=' * 40}{Color.END}\n")


def generate_secret_key() -> str:
    """Générer une clé secrète sécurisée"""
    return secrets.token_hex(32)


def prompt_user(question: str, default: Optional[str] = None, required: bool = True) -> str:
    """Demander une valeur à l'utilisateur"""
    if default:
        prompt = f"{question} [{default}]: "
    else:
        prompt = f"{question}: "
    
    while True:
        value = input(prompt).strip()
        
        if not value and default:
            return default
        elif not value and required:
            logger.info(f"{Color.RED}❌ Cette valeur est requise{Color.END}")
            continue
        elif not value and not required:
            return ""
        else:
            return value


def prompt_boolean(question: str, default: bool = True) -> bool:
    """Demander une valeur booléenne"""
    default_str = "O/n" if default else "o/N"
    response = input(f"{question} [{default_str}]: ").strip().lower()
    
    if not response:
        return default
    return response in ['o', 'oui', 'y', 'yes', 'true', '1']


def create_env_file(config: Dict[str, str], env_file: Path):
    """Créer le fichier .env"""
    content = "# =========================================\n"
    content += "# OMNISCAN BACKEND - CONFIGURATION\n"
    content += "# =========================================\n"
    content += "# Généré automatiquement - NE PAS COMMITTER\n\n"
    
    sections = {
        "APPLICATION": ["ENVIRONMENT", "SECRET_KEY", "DEBUG", "BACKEND_URL"],
        "SUPABASE": ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_KEY"],
        "IA ET OCR": ["OPENAI_API_KEY", "OPENAI_MODEL", "OCR_LANGUAGES"],
        "UPLOADS": ["MAX_FILE_SIZE_MB", "UPLOAD_PATH", "TEMP_PATH"],
        "SÉCURITÉ": ["RATE_LIMIT_PER_MINUTE", "CORS_ORIGINS"],
        "LOGGING": ["LOG_LEVEL", "LOG_FORMAT"]
    }
    
    for section_name, keys in sections.items():
        content += f"# {section_name}\n"
        for key in keys:
            if key in config:
                content += f"{key}={config[key]}\n"
        content += "\n"
    
    with open(env_file, 'w', encoding='utf-8') as f:
        f.write(content)


def setup_development():
    """Configuration pour le développement"""
    logger.info(f"{Color.BLUE}📋 Configuration pour le développement{Color.END}\n")
    
    config = {}
    
    # Application
    config["ENVIRONMENT"] = "development"
    config["DEBUG"] = "true"
    config["BACKEND_URL"] = prompt_user("URL du backend", "http://localhost:8000")
    
    # Clé secrète
    if prompt_boolean("Générer une nouvelle clé secrète ?"):
        config["SECRET_KEY"] = generate_secret_key()
        logger.info(f"{Color.GREEN}✅ Clé secrète générée{Color.END}")
    else:
        config["SECRET_KEY"] = prompt_user("Clé secrète")
    
    # Supabase
    logger.info(f"\n{Color.YELLOW}🔐 Configuration Supabase{Color.END}")
    config["SUPABASE_URL"] = prompt_user("URL Supabase (ex: https://xxx.supabase.co)")
    config["SUPABASE_ANON_KEY"] = prompt_user("Clé anonyme Supabase")
    
    if prompt_boolean("Ajouter la clé de service ?", False):
        config["SUPABASE_SERVICE_KEY"] = prompt_user("Clé de service Supabase", required=False)
    
    # OpenAI
    logger.info(f"\n{Color.YELLOW}🤖 Configuration OpenAI{Color.END}")
    config["OPENAI_API_KEY"] = prompt_user("Clé API OpenAI (sk-...)")
    config["OPENAI_MODEL"] = prompt_user("Modèle OpenAI", "gpt-4o-mini")
    
    # Paramètres optionnels
    config["OCR_LANGUAGES"] = prompt_user("Langues OCR", "fra+eng")
    config["MAX_FILE_SIZE_MB"] = prompt_user("Taille max fichiers (MB)", "10")
    config["UPLOAD_PATH"] = prompt_user("Dossier uploads", "./uploads")
    config["TEMP_PATH"] = prompt_user("Dossier temporaire", "./temp")
    config["RATE_LIMIT_PER_MINUTE"] = prompt_user("Limite requêtes/minute", "60")
    config["CORS_ORIGINS"] = prompt_user("CORS Origins", "http://localhost:3000,http://localhost:5173")
    config["LOG_LEVEL"] = prompt_user("Niveau de log", "INFO")
    config["LOG_FORMAT"] = prompt_user("Format logs", "json")
    
    return config


def setup_production():
    """Configuration pour la production"""
    logger.info(f"{Color.RED}🏭 Configuration pour la production{Color.END}\n")
    logger.info(f"{Color.YELLOW}⚠️  En production, utilisez les variables d'environnement système{Color.END}")
    logger.info(f"{Color.YELLOW}⚠️  Ne stockez JAMAIS de secrets dans un fichier .env{Color.END}\n")
    
    config = {}
    
    config["ENVIRONMENT"] = "production"
    config["DEBUG"] = "false"
    config["SECRET_KEY"] = generate_secret_key()
    
    logger.info(f"{Color.GREEN}✅ Clé secrète générée: {config['SECRET_KEY'][:16]}...{Color.END}")
    logger.info(f"{Color.YELLOW}💾 Sauvegardez cette clé dans votre gestionnaire de secrets{Color.END}\n")
    
    # Le reste doit être configuré via variables d'environnement
    config["SUPABASE_URL"] = "# À configurer via variable d'environnement"
    config["SUPABASE_ANON_KEY"] = "# À configurer via variable d'environnement"
    config["OPENAI_API_KEY"] = "# À configurer via variable d'environnement"
    
    return config


def main():
    print_header()
    
    # Déterminer le dossier du projet
    backend_dir = Path(__file__).parent.parent
    env_file = backend_dir / ".env"
    env_example = backend_dir / ".env.example"
    
    # Vérifier si .env existe déjà
    if env_file.exists():
        logger.info(f"{Color.YELLOW}⚠️  Le fichier .env existe déjà{Color.END}")
        if not prompt_boolean("Voulez-vous le remplacer ?"):
            logger.info(f"{Color.BLUE}ℹ️  Configuration annulée{Color.END}")
            return
    
    # Choix du type d'environnement
    logger.info("Quel type d'environnement voulez-vous configurer ?\n")
    logger.info("1. 🧪 Développement (recommandé)")
    logger.info("2. 🏭 Production")
    logger.info("3. 📋 Copier depuis .env.example")
    
    choice = input("\nVotre choix [1]: ").strip() or "1"
    
    if choice == "1":
        config = setup_development()
    elif choice == "2":
        config = setup_production()
    elif choice == "3":
        if env_example.exists():
            import shutil
            shutil.copy(env_example, env_file)
            logger.info(f"{Color.GREEN}✅ Fichier .env créé depuis .env.example{Color.END}")
            logger.info(f"{Color.YELLOW}📝 Modifiez {env_file} avec vos valeurs{Color.END}")
            return
        else:
            logger.info(f"{Color.RED}❌ Fichier .env.example introuvable{Color.END}")
            return
    else:
        logger.info(f"{Color.RED}❌ Choix invalide{Color.END}")
        return
    
    # Créer le fichier .env
    try:
        create_env_file(config, env_file)
        logger.info(f"\n{Color.GREEN}🎉 Configuration terminée !{Color.END}")
        logger.info(f"{Color.GREEN}✅ Fichier .env créé: {env_file}{Color.END}")
        
        # Proposer de valider
        if prompt_boolean("Voulez-vous valider la configuration ?"):
            logger.info(f"\n{Color.BLUE}🔍 Validation de l'environnement...{Color.END}")
            os.system(f"cd {backend_dir} && python scripts/validate_env.py")
        
    except Exception as e:
        logger.info(f"{Color.RED}❌ Erreur lors de la création du fichier: {e}{Color.END}")
        sys.exit(1)


if __name__ == "__main__":
    main()