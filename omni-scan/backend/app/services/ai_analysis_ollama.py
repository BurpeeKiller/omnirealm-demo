"""Service d'analyse IA avec Ollama (local)"""

import json
from app.utils.logger import logger
import httpx
from typing import Dict


async def analyze_text(text: str) -> Dict[str, any]:
    """Analyser le texte avec Ollama en local"""
    
    if not text or len(text.strip()) < 10:
        return {
            "summary": "Texte trop court pour l'analyse",
            "key_points": [],
            "entities": [],
            "language": "unknown"
        }
    
    # Limiter la longueur du texte
    max_length = 4000
    if len(text) > max_length:
        text = text[:max_length] + "..."
    
    try:
        # Prompt système
        system_prompt = """Tu es un assistant expert en analyse de documents.
        Analyse le texte fourni et retourne:
        1. Un résumé concis (2-3 phrases)
        2. Les points clés (maximum 5)
        3. Les entités importantes (personnes, lieux, organisations)
        4. La langue principale du document
        
        Réponds en JSON avec les clés: summary, key_points, entities, language"""
        
        # Appel à Ollama (API locale)
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "mistral",  # ou "llama2", "codellama", etc.
                    "prompt": f"{system_prompt}\n\nAnalyse ce texte:\n\n{text}\n\nRéponse en JSON:",
                    "stream": False,
                    "format": "json",
                    "options": {
                        "temperature": 0.3,
                        "num_predict": 1000
                    }
                },
                timeout=30.0
            )
        
        if response.status_code == 200:
            result = response.json()
            # Ollama retourne la réponse dans le champ "response"
            ai_response = result.get("response", "{}")
            
            # Parser le JSON
            try:
                analysis = json.loads(ai_response)
                
                # Valider et nettoyer la structure
                return {
                    "summary": analysis.get("summary", "Résumé non disponible"),
                    "key_points": analysis.get("key_points", [])[:5],
                    "entities": analysis.get("entities", []),
                    "language": analysis.get("language", "français")
                }
            except json.JSONDecodeError:
                # Si le JSON est invalide, extraire ce qu'on peut
                return {
                    "summary": ai_response[:200] if ai_response else "Analyse non disponible",
                    "key_points": [],
                    "entities": [],
                    "language": "unknown"
                }
        else:
            raise Exception(f"Erreur Ollama: {response.status_code}")
            
    except httpx.ConnectError:
        # Ollama n'est pas lancé
        return {
            "summary": "Service d'analyse IA non disponible (Ollama hors ligne)",
            "key_points": ["Lancez Ollama avec: ollama serve"],
            "entities": [],
            "language": "unknown",
            "error": "Ollama non connecté"
        }
    except Exception as e:
        logger.info(f"Erreur analyse IA: {e}")
        return {
            "summary": "Erreur lors de l'analyse",
            "key_points": [],
            "entities": [],
            "language": "unknown",
            "error": str(e)
        }


async def check_ollama_status() -> Dict[str, any]:
    """Vérifier si Ollama est disponible et lister les modèles"""
    try:
        async with httpx.AsyncClient() as client:
            # Vérifier la connexion
            response = await client.get("http://localhost:11434/api/tags", timeout=5.0)
            
            if response.status_code == 200:
                data = response.json()
                models = [model["name"] for model in data.get("models", [])]
                return {
                    "status": "online",
                    "models": models,
                    "default_model": models[0] if models else None
                }
            else:
                return {"status": "error", "message": f"Code {response.status_code}"}
                
    except httpx.ConnectError:
        return {"status": "offline", "message": "Ollama n'est pas lancé. Exécutez: ollama serve"}
    except Exception as e:
        return {"status": "error", "message": str(e)}