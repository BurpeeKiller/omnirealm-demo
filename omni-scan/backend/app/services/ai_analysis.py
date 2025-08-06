"""Service d'analyse IA avec OpenAI"""

import json
import openai
from typing import Dict, Optional
from app.core.config import settings
from app.templates.invoice_template import extract_invoice_data
from app.utils.document_classifier import classify_document
from app.services.ai_prompts import get_prompt_for_type

# Configurer OpenAI
openai.api_key = settings.openai_api_key


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
    
    config = detail_config.get(detail_level, detail_config["medium"])
    
    # Limiter la longueur du texte
    max_length = 4000
    if len(text) > max_length:
        text = text[:max_length] + "..."
    
    try:
        # Adapter le prompt selon l'indice de langue
        language_instruction = ""
        if language_hint:
            language_map = {
                'fr': 'français',
                'en': 'anglais',
                'es': 'espagnol',
                'de': 'allemand',
                'it': 'italien'
            }
            lang_name = language_map.get(language_hint, language_hint)
            language_instruction = f"\nIMPORTANT: Le document est en {lang_name}. Réponds dans cette même langue."
        
        # Obtenir les prompts spécialisés selon le type de document
        resume_prompt = get_prompt_for_type(doc_type, "resume")
        key_points_prompt = get_prompt_for_type(doc_type, "key_points")
        
        # Prompt système adapté
        system_prompt = f"""Tu es un assistant expert en analyse de documents multilingues.
        
        Type de document détecté : {doc_type} (confiance: {doc_confidence:.0%})
        
        INSTRUCTIONS POUR LE RÉSUMÉ:
        {resume_prompt}
        
        INSTRUCTIONS POUR LES POINTS CLÉS:
        {key_points_prompt}
        
        NIVEAU DE DÉTAIL DEMANDÉ:
        - Résumé : {config['summary_sentences']} phrases maximum
        - Points clés : {config['key_points']} points maximum
        
        AUTRES ÉLÉMENTS À EXTRAIRE:
        1. Les entités importantes (personnes, lieux, organisations, montants, dates)
        2. La langue principale du document (code ISO 639-1: 'fr', 'en', 'es', etc.)
        
        {language_instruction}
        
        IMPORTANT: 
        - Adapte ton analyse au type de document détecté
        - Sois précis et factuel
        - Extrait les informations vraiment importantes selon le contexte
        
        Réponds en JSON avec les clés: summary, key_points, entities, language, document_type"""
        
        # Appel à OpenAI
        response = await openai.ChatCompletion.acreate(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyse ce texte:\n\n{text}"}
            ],
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        # Parser la réponse de manière sécurisée
        analysis = response.choices[0].message.content
        result = json.loads(analysis)
        
        # Ajouter les données structurées et métadonnées
        result['structured_data'] = structured_data
        result['document_type'] = doc_type
        result['document_confidence'] = doc_confidence
        result['document_metadata'] = doc_metadata
        
        return result
        
    except Exception as e:
        print(f"Erreur analyse IA: {e}")
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