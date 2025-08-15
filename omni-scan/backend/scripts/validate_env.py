#!/usr/bin/env python3
"""
Script de validation de l'environnement OmniScan
Vérifie que toutes les variables d'environnement nécessaires sont présentes
et correctement configurées.
"""

import sys
from app.utils.logger import logger
from pathlib import Path
from typing import List
import httpx
import asyncio

# Ajouter le dossier parent au path pour importer l'app
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import settings


class Color:
    """Couleurs ANSI pour le terminal"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'


def print_header():
    """Afficher l'en-tête du script"""
    logger.info(f"\n{Color.CYAN}{Color.BOLD}🔍 VALIDATION ENVIRONNEMENT OMNISCAN{Color.END}")
    logger.info(f"{Color.CYAN}{'=' * 50}{Color.END}\n")


def print_section(title: str):
    """Afficher une section"""
    logger.info(f"{Color.BLUE}{Color.BOLD}📋 {title}{Color.END}")
    logger.info("-" * (len(title) + 4))


def print_success(message: str):
    """Afficher un message de succès"""
    logger.info(f"  {Color.GREEN}✅ {message}{Color.END}")


def print_error(message: str):
    """Afficher un message d'erreur"""
    logger.info(f"  {Color.RED}❌ {message}{Color.END}")


def print_warning(message: str):
    """Afficher un avertissement"""
    logger.info(f"  {Color.YELLOW}⚠️  {message}{Color.END}")


def print_info(message: str):
    """Afficher une information"""
    logger.info(f"  {Color.CYAN}ℹ️  {message}{Color.END}")


def validate_required_variables() -> List[str]:
    """Valider les variables d'environnement requises"""
    print_section("Variables d'environnement requises")
    
    errors = []
    
    # Variables critiques
    critical_vars = {
        'SECRET_KEY': settings.secret_key,
        'SUPABASE_URL': settings.supabase_url,
        'SUPABASE_ANON_KEY': settings.supabase_anon_key,
        'OPENAI_API_KEY': settings.openai_api_key,
    }
    
    for var_name, value in critical_vars.items():
        if not value or value in ['', 'your-secret-key-here', 'your-anon-key-here', 'sk-your-openai-key-here']:
            print_error(f"{var_name} n'est pas configurée ou utilise une valeur par défaut")
            errors.append(f"Variable {var_name} manquante ou invalide")
        else:
            # Masquer les valeurs sensibles
            if var_name in ['SECRET_KEY', 'SUPABASE_ANON_KEY', 'OPENAI_API_KEY']:
                masked_value = value[:8] + "..." + value[-4:] if len(value) > 12 else "***"
                print_success(f"{var_name} = {masked_value}")
            else:
                print_success(f"{var_name} = {value}")
    
    return errors


def validate_environment_specific() -> List[str]:
    """Valider les paramètres spécifiques à l'environnement"""
    print_section(f"Configuration environnement: {settings.environment}")
    
    errors = []
    
    if settings.environment == "production":
        # Validations spécifiques à la production
        if settings.debug:
            print_error("DEBUG ne devrait pas être activé en production")
            errors.append("DEBUG activé en production")
        else:
            print_success("DEBUG désactivé ✓")
        
        if settings.secret_key == "dev-secret-key-change-in-production":
            print_error("SECRET_KEY utilise encore la valeur par défaut")
            errors.append("SECRET_KEY par défaut en production")
        else:
            print_success("SECRET_KEY configurée ✓")
    
    elif settings.environment == "development":
        print_info("Mode développement détecté")
        if not settings.debug:
            print_warning("DEBUG désactivé en développement (inhabituel)")
        else:
            print_success("DEBUG activé ✓")
    
    return errors


def validate_paths() -> List[str]:
    """Valider les chemins de fichiers"""
    print_section("Chemins et dossiers")
    
    errors = []
    
    # Vérifier les dossiers
    paths_to_check = {
        'Upload': settings.get_upload_path(),
        'Temp': settings.get_temp_path(),
    }
    
    for name, path in paths_to_check.items():
        try:
            path.mkdir(parents=True, exist_ok=True)
            if path.exists() and path.is_dir():
                print_success(f"Dossier {name}: {path}")
            else:
                print_error(f"Impossible de créer le dossier {name}: {path}")
                errors.append(f"Dossier {name} inaccessible")
        except Exception as e:
            print_error(f"Erreur dossier {name}: {e}")
            errors.append(f"Erreur dossier {name}: {e}")
    
    return errors


async def validate_external_services() -> List[str]:
    """Valider la connectivité aux services externes"""
    print_section("Services externes")
    
    errors = []
    
    # Test Supabase
    if settings.supabase_url:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{settings.supabase_url}/rest/v1/")
                if response.status_code in [200, 401]:  # 401 = pas d'auth mais service OK
                    print_success(f"Supabase accessible: {settings.supabase_url}")
                else:
                    print_error(f"Supabase non accessible (HTTP {response.status_code})")
                    errors.append("Supabase non accessible")
        except Exception as e:
            print_error(f"Erreur connexion Supabase: {e}")
            errors.append(f"Erreur Supabase: {e}")
    else:
        print_warning("SUPABASE_URL non configurée, impossible de tester la connexion")
    
    # Test OpenAI (juste validation de la clé)
    if settings.openai_api_key and settings.openai_api_key.startswith('sk-'):
        print_success("Format clé OpenAI valide")
    elif settings.openai_api_key:
        print_error("Format clé OpenAI invalide (doit commencer par 'sk-')")
        errors.append("Format clé OpenAI invalide")
    else:
        print_warning("OPENAI_API_KEY non configurée")
    
    return errors


def validate_configuration() -> List[str]:
    """Valider la configuration générale"""
    print_section("Configuration application")
    
    errors = []
    
    # Valider les paramètres
    config_checks = [
        ("Version", settings.app_version, lambda x: bool(x)),
        ("Nom", settings.app_name, lambda x: bool(x)),
        ("Taille max fichier", f"{settings.max_file_size_mb}MB", lambda x: x > 0),
        ("Extensions autorisées", f"{len(settings.allowed_extensions)} types", lambda x: len(x) > 0),
        ("Modèle OpenAI", settings.openai_model, lambda x: bool(x)),
        ("Langues OCR", settings.ocr_languages, lambda x: bool(x)),
    ]
    
    for name, value, validator in config_checks:
        if validator(value if name != "Taille max fichier" else settings.max_file_size_mb):
            print_success(f"{name}: {value}")
        else:
            print_error(f"{name}: {value} (invalide)")
            errors.append(f"{name} invalide")
    
    # CORS
    print_success(f"CORS Origins: {len(settings.cors_origins)} URLs configurées")
    for origin in settings.cors_origins:
        print_info(f"  - {origin}")
    
    return errors


def print_summary(all_errors: List[str]):
    """Afficher le résumé final"""
    logger.info(f"\n{Color.MAGENTA}{Color.BOLD}📊 RÉSUMÉ DE LA VALIDATION{Color.END}")
    logger.info(f"{Color.MAGENTA}{'=' * 30}{Color.END}")
    
    if not all_errors:
        logger.info(f"\n{Color.GREEN}{Color.BOLD}🎉 Configuration valide !{Color.END}")
        logger.info(f"{Color.GREEN}✅ Tous les tests passent, OmniScan est prêt à démarrer{Color.END}")
        return True
    else:
        logger.info(f"\n{Color.RED}{Color.BOLD}⚠️  {len(all_errors)} erreur(s) détectée(s){Color.END}")
        logger.info(f"{Color.RED}❌ Veuillez corriger les problèmes suivants:{Color.END}\n")
        
        for i, error in enumerate(all_errors, 1):
            logger.info(f"{Color.RED}  {i}. {error}{Color.END}")
        
        logger.info(f"\n{Color.YELLOW}💡 Consultez .env.example pour la configuration complète{Color.END}")
        return False


async def main():
    """Fonction principale"""
    print_header()
    
    all_errors = []
    
    try:
        # Valider les différents aspects
        all_errors.extend(validate_required_variables())
        logger.info()
        
        all_errors.extend(validate_environment_specific())
        logger.info()
        
        all_errors.extend(validate_paths())
        logger.info()
        
        all_errors.extend(await validate_external_services())
        logger.info()
        
        all_errors.extend(validate_configuration())
        logger.info()
        
        # Résumé final
        success = print_summary(all_errors)
        
        # Code de sortie
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print_error(f"Erreur critique lors de la validation: {e}")
        logger.info(f"{Color.YELLOW}💡 Vérifiez que toutes les dépendances sont installées{Color.END}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())