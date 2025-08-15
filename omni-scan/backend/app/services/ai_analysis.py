"""Service d'analyse IA unifié avec support multi-providers"""

from typing import Dict
from enum import Enum
from app.core.logging import get_logger
from app.services.ai_prompts import get_prompt_for_type
from app.utils.document_classifier import classify_document
from app.utils.document_extractor import extract_invoice_data

logger = get_logger("ai_analysis")


class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    OPENROUTER = "openrouter"
    GROQ = "groq"
    OLLAMA = "ollama"


def detect_language_fallback(text: str) -> str:
    """Détection basique de la langue en cas d'échec de l'IA"""
    # Prendre les 500 premiers caractères pour l'analyse
    sample = text.lower()[:500]
    
    # Mots français courants
    french_words = ['le', 'la', 'les', 'de', 'des', 'un', 'une', 'et', 'est', 'dans', 
                    'pour', 'que', 'qui', 'avec', 'sur', 'par', 'plus', 'ce', 'ne', 'pas',
                    'vous', 'nous', 'ils', 'elle', 'être', 'avoir', 'faire', 'dire', 'aller']
    
    # Mots anglais courants
    english_words = ['the', 'is', 'are', 'was', 'were', 'been', 'have', 'has', 'had',
                     'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
                     'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those']
    
    # Compter les occurrences
    french_count = sum(1 for word in french_words if f' {word} ' in sample or sample.startswith(f'{word} '))
    english_count = sum(1 for word in english_words if f' {word} ' in sample or sample.startswith(f'{word} '))
    
    # Décider selon le score
    if french_count > english_count:
        return 'fr'
    elif english_count > french_count:
        return 'en'
    else:
        # Si égalité, chercher des caractères spéciaux français
        if any(char in sample for char in ['é', 'è', 'ê', 'ë', 'à', 'ç', 'ù', 'ô', 'î']):
            return 'fr'
        return 'en'


async def analyze_text(
    text: str, 
    language_hint: str = None,
    detail_level: str = "medium"
) -> Dict[str, any]:
    """Analyser le texte avec l'IA
    
    Args:
        text: Le texte à analyser
        language_hint: Indice de langue optionnel ('fr', 'en', etc.)
    """
    
    if not text or len(text.strip()) < 10:
        return {
            "summary": "Texte trop court pour l'analyse",
            "key_points": [],
            "entities": [],
            "language": "unknown",
            "structured_data": None
        }
    
    # Classifier le document
    doc_type, doc_confidence, doc_metadata = classify_document(text)
    
    # Essayer d'extraire les données structurées selon le type de document
    structured_data = None
    if doc_type == "invoice":
        invoice_data = extract_invoice_data(text)
        if invoice_data['confidence'] > 0.5:
            structured_data = invoice_data
    
    # Configuration selon le niveau de détail
    detail_config = {
        "short": {
            "summary_sentences": 1,
            "key_points": 3,
            "max_tokens": 150
        },
        "medium": {
            "summary_sentences": 3,
            "key_points": 5,
            "max_tokens": 300
        },
        "detailed": {
            "summary_sentences": 5,
            "key_points": 10,
            "max_tokens": 500
        }
    }
    
    detail_config.get(detail_level, detail_config["medium"])
    
    # Limiter la longueur du texte
    max_length = 4000
    if len(text) > max_length:
        text = text[:max_length] + "..."
    
    try:
        # Adapter le prompt selon l'indice de langue
        if language_hint:
            language_map = {
                'fr': 'français',
                'en': 'anglais',
                'es': 'espagnol',
                'de': 'allemand',
                'it': 'italien'
            }
            language_map.get(language_hint, language_hint)
        
        # Obtenir les prompts spécialisés selon le type de document
        get_prompt_for_type(doc_type, "resume")
        get_prompt_for_type(doc_type, "key_points")
        
        # Cette méthode est obsolète - utiliser ai_analysis_unified.py à la place
        raise NotImplementedError("Utiliser AIAnalyzer de ai_analysis_unified.py")
        
    except Exception as e:
        logger.info(f"Erreur analyse IA: {e}")
        # Fallback basique
        return {
            "summary": "Analyse IA temporairement indisponible",
            "key_points": ["Document de {} caractères".format(len(text))],
            "entities": [],
            "language": language_hint or detect_language_fallback(text),
            "structured_data": structured_data,
            "document_type": doc_type,
            "document_confidence": doc_confidence,
            "document_metadata": doc_metadata
        }