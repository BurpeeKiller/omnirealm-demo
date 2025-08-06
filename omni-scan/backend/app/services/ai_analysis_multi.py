"""Service d'analyse IA multi-providers (OpenAI, Anthropic, OpenRouter)"""

import json
import os
from typing import Dict, Optional
from enum import Enum
import httpx
from app.core.config import settings
from app.core.logging import get_logger
from app.services.ai_prompts import get_prompt_for_type
from app.utils.document_classifier import DocumentClassifier

logger = get_logger("ai_analysis")


class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    OPENROUTER = "openrouter"
    GROQ = "groq"


class AIAnalyzer:
    """Analyseur IA avec support multi-providers"""
    
    def __init__(self, provider: AIProvider = AIProvider.OPENAI):
        self.provider = provider
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def analyze_text(self, text: str, detail_level: str = "medium", 
                          language: Optional[str] = None, 
                          include_structured_data: bool = True) -> Dict[str, any]:
        """Analyser le texte avec le provider configuré"""
        
        if not text or len(text.strip()) < 10:
            return self._empty_analysis("Texte trop court pour l'analyse")
        
        # Limiter la longueur
        max_length = 4000
        if len(text) > max_length:
            text = text[:max_length] + "..."
        
        try:
            if self.provider == AIProvider.OPENAI:
                return await self._analyze_openai(text, detail_level, language, include_structured_data)
            elif self.provider == AIProvider.ANTHROPIC:
                return await self._analyze_anthropic(text, detail_level, language, include_structured_data)
            elif self.provider == AIProvider.OPENROUTER:
                return await self._analyze_openrouter(text, detail_level, language, include_structured_data)
            elif self.provider == AIProvider.GROQ:
                return await self._analyze_groq(text, detail_level, language, include_structured_data)
            else:
                return self._fallback_analysis(text, detail_level, language, include_structured_data)
                
        except Exception as e:
            logger.error(f"Erreur analyse IA ({self.provider.value}): {str(e)}", exc_info=True)
            # Retourner l'erreur dans l'analyse pour debug
            return {
                "summary": f"Erreur IA: {str(e)[:200]}",
                "key_points": ["Erreur lors de l'analyse", f"Provider: {self.provider.value}", "Mode fallback activé"],
                "entities": [],
                "language": "fr",
                "category": "erreur"
            }
    
    async def _analyze_openai(self, text: str, detail_level: str = "medium", 
                             language: Optional[str] = None, 
                             include_structured_data: bool = True) -> Dict:
        """Analyse avec OpenAI"""
        api_key = os.getenv("OPENAI_API_KEY") or settings.openai_api_key
        logger.info(f"OpenAI: checking key, present: {bool(api_key)}, starts with sk-proj: {api_key.startswith('sk-proj-') if api_key else False}")
        if not api_key or api_key.startswith("sk-proj-") or api_key == "disabled-for-testing":
            logger.warning("OpenAI API key invalide, utilisation du fallback")
            return self._fallback_analysis(text, detail_level, language, include_structured_data)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": settings.openai_model or "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": self._get_system_prompt(detail_level, language, include_structured_data, text)},
                {"role": "user", "content": f"Analyse ce texte:\n\n{text}"}
            ],
            "temperature": 0.3,
            "max_tokens": 1000,
            "response_format": {"type": "json_object"}
        }
        
        response = await self.client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            return json.loads(result["choices"][0]["message"]["content"])
        else:
            raise Exception(f"OpenAI error: {response.status_code}")
    
    async def _analyze_anthropic(self, text: str, detail_level: str = "medium",
                                language: Optional[str] = None,
                                include_structured_data: bool = True) -> Dict:
        """Analyse avec Anthropic Claude"""
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return await self._analyze_openai(text, detail_level, language, include_structured_data)  # Fallback sur OpenAI
        
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "claude-3-haiku-20240307",  # Model rapide et économique
            "max_tokens": 1000,
            "messages": [
                {"role": "user", "content": f"{self._get_system_prompt()}\n\nAnalyse ce texte:\n\n{text}"}
            ]
        }
        
        response = await self.client.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result["content"][0]["text"]
            return json.loads(content)
        else:
            raise Exception(f"Anthropic error: {response.status_code}")
    
    async def _analyze_openrouter(self, text: str, detail_level: str = "medium",
                                 language: Optional[str] = None,
                                 include_structured_data: bool = True) -> Dict:
        """Analyse avec OpenRouter (accès à plusieurs modèles)"""
        api_key = os.getenv("OPENROUTER_API_KEY")
        logger.info(f"OpenRouter API key present: {bool(api_key)}, first chars: {api_key[:10] if api_key else 'None'}")
        if not api_key:
            logger.warning("No OpenRouter API key, using fallback analysis")
            return self._fallback_analysis(text, detail_level, language, include_structured_data)  # Fallback direct
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://omniscan.app",
            "X-Title": "OmniScan OCR"
        }
        
        # Modèles économiques disponibles sur OpenRouter
        models = [
            "mistralai/mistral-7b-instruct",
            "meta-llama/llama-3-8b-instruct",
            "google/gemma-7b-it"
        ]
        
        data = {
            "model": models[0],  # Mistral par défaut
            "messages": [
                {"role": "system", "content": self._get_system_prompt(detail_level, language, include_structured_data, text)},
                {"role": "user", "content": f"Analyse ce texte:\n\n{text}"}
            ],
            "temperature": 0.3,
            "max_tokens": 1000
        }
        
        response = await self.client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            # Parser le JSON de la réponse
            try:
                return json.loads(content)
            except:
                # Si pas du JSON, créer une structure
                return self._parse_text_response(content)
        else:
            error_detail = response.text
            logger.error(f"OpenRouter error {response.status_code}: {error_detail}")
            raise Exception(f"OpenRouter error: {response.status_code} - {error_detail}")
    
    async def _analyze_groq(self, text: str, detail_level: str = "medium",
                           language: Optional[str] = None,
                           include_structured_data: bool = True) -> Dict:
        """Analyse avec Groq (LPU ultra-rapide)"""
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return await self._analyze_openai(text, detail_level, language, include_structured_data)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "mixtral-8x7b-32768",  # Model Groq rapide
            "messages": [
                {"role": "system", "content": self._get_system_prompt(detail_level, language, include_structured_data, text)},
                {"role": "user", "content": f"Analyse ce texte:\n\n{text}"}
            ],
            "temperature": 0.3,
            "max_tokens": 1000
        }
        
        response = await self.client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            try:
                return json.loads(content)
            except:
                return self._parse_text_response(content)
        else:
            raise Exception(f"Groq error: {response.status_code}")
    
    def _get_system_prompt(self, detail_level: str = "medium", 
                          language: Optional[str] = None,
                          include_structured_data: bool = True,
                          text_preview: Optional[str] = None) -> str:
        """Prompt système pour l'analyse adapté selon les options"""
        
        # Détection préliminaire du type de document si un aperçu est fourni
        doc_type = "general"
        if text_preview:
            classifier = DocumentClassifier()
            doc_type, _, _ = classifier.classify(text_preview[:1000])
        
        # Configuration du niveau de détail avec prompts spécialisés
        detail_config = {
            "short": "1-2 phrases très concises avec uniquement l'essentiel",
            "medium": "2-3 phrases avec les informations principales", 
            "detailed": "analyse complète en 5+ phrases avec tous les détails importants"
        }
        
        summary_instruction = detail_config.get(detail_level, detail_config["medium"])
        
        # Récupération du prompt spécialisé pour ce type de document
        specialized_prompt = get_prompt_for_type(doc_type, "resume")
        key_points_prompt = get_prompt_for_type(doc_type, "key_points")
        
        # Configuration de la langue
        lang_instruction = ""
        if language and language != "auto":
            lang_names = {"fr": "français", "en": "anglais", "es": "espagnol"}
            lang_instruction = f"IMPORTANT: Réponds en {lang_names.get(language, language)}, peu importe la langue du document."
        else:
            lang_instruction = "Réponds dans LA MÊME LANGUE que le document analysé."
        
        # Base du prompt avec instructions spécialisées
        base_prompt = f"""Tu es un assistant expert en analyse de documents multilingues.
        
        INSTRUCTIONS POUR LE RÉSUMÉ:
        {specialized_prompt}
        
        Niveau de détail demandé: {summary_instruction}
        {lang_instruction}
        
        INSTRUCTIONS POUR LES POINTS CLÉS:
        {key_points_prompt}
        
        Retourne un JSON avec:
        - summary: résumé selon les instructions ci-dessus
        - key_points: liste des {'2-3' if detail_level == 'short' else '3-5' if detail_level == 'medium' else '5-7'} points clés les plus importants
        - entities: liste des entités importantes (personnes, lieux, organisations, dates, montants)
        - language: langue principale en code ISO 639-1 ('fr' pour français, 'en' pour anglais, 'es' pour espagnol, etc.)
        - document_type: type de document détecté (invoice, contract, cv, email, report, receipt, business_card, general)
        - document_confidence: confiance dans la détection du type (0.0 à 1.0)"""
        
        # Ajout des données structurées si demandé
        if include_structured_data:
            base_prompt += """
        - structured_data: objet JSON avec les données structurées extraites selon le type de document:
          * Pour invoice: {invoice_number, date, total_amount, tax_amount, vendor, client, line_items}
          * Pour contract: {parties, object, duration, start_date, end_date, amount}
          * Pour cv: {name, title, experience_years, skills, education, current_position}
          * Pour email: {from, to, subject, date, action_required}
          * Pour report: {title, author, date, conclusions, recommendations}
          * Pour general: {} (objet vide)"""
        
        base_prompt += """
        
        IMPORTANT: 
        - Sois PRÉCIS et CONCRET dans le résumé (évite les généralités)
        - Extrait les DONNÉES FACTUELLES (montants, dates, noms, références)
        - Détecte CORRECTEMENT la langue et le type de document
        - Le résumé doit être UTILE et ACTIONNABLE
        
        Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire."""
        
        return base_prompt
    
    def _parse_text_response(self, text: str) -> Dict:
        """Parser une réponse texte en structure JSON"""
        # Tentative d'extraction basique
        summary = text.split('\n')[0] if text else "Analyse disponible"
        return {
            "summary": summary[:200],
            "key_points": [line.strip() for line in text.split('\n')[1:4] if line.strip()],
            "entities": [],
            "language": "fr",
            "category": "autre"
        }
    
    def _fallback_analysis(self, text: str, detail_level: str = "medium",
                           language: Optional[str] = None,
                           include_structured_data: bool = True) -> Dict:
        """Analyse de secours sans IA"""
        # Détection améliorée de la langue
        sample = text.lower()[:500]
        
        # Mots français courants
        french_words = ['le', 'la', 'les', 'de', 'des', 'un', 'une', 'et', 'est', 'dans', 
                        'pour', 'que', 'qui', 'avec', 'sur', 'par', 'plus', 'ce', 'ne', 'pas']
        # Mots anglais courants
        english_words = ['the', 'is', 'are', 'was', 'were', 'been', 'have', 'has', 'had',
                         'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may']
        # Mots espagnols courants
        spanish_words = ['el', 'la', 'los', 'las', 'es', 'son', 'está', 'están', 'por', 'para']
        
        # Compter les occurrences
        french_count = sum(1 for word in french_words if f' {word} ' in sample or sample.startswith(f'{word} '))
        english_count = sum(1 for word in english_words if f' {word} ' in sample or sample.startswith(f'{word} '))
        spanish_count = sum(1 for word in spanish_words if f' {word} ' in sample or sample.startswith(f'{word} '))
        
        # Déterminer la langue
        if french_count > english_count and french_count > spanish_count:
            lang = "fr"
        elif english_count > french_count and english_count > spanish_count:
            lang = "en"
        elif spanish_count > 0:
            lang = "es"
        else:
            # Si égalité ou aucun mot trouvé, chercher des caractères spéciaux
            if any(char in sample for char in ['é', 'è', 'ê', 'ë', 'à', 'ç', 'ù', 'ô', 'î']):
                lang = "fr"
            else:
                lang = "en"  # Par défaut
        
        # Détection basique de catégorie
        category = "autre"
        text_lower = text.lower()
        if any(word in text_lower for word in ["facture", "invoice", "total", "€", "$"]):
            category = "facture"
        elif any(word in text_lower for word in ["contrat", "contract", "agreement", "accord"]):
            category = "contrat"
        elif any(word in text_lower for word in ["monsieur", "madame", "dear", "cordialement"]):
            category = "courrier"
        
        # Extraction des nombres (possibles entités)
        import re
        numbers = re.findall(r'\b\d{4,}\b', text)[:5]  # Années, codes, etc.
        
        # Adapter le résumé selon la langue détectée
        if lang == "fr":
            summary = f"Document de {len(text)} caractères en français"
            key_points = [
                f"Type détecté : {category}",
                f"Langue : français",
                f"{len(text.split())} mots environ"
            ]
        elif lang == "es":
            summary = f"Documento de {len(text)} caracteres en español"
            key_points = [
                f"Tipo detectado: {category}",
                f"Idioma: español",
                f"{len(text.split())} palabras aproximadamente"
            ]
        else:
            summary = f"Document of {len(text)} characters in English"
            key_points = [
                f"Detected type: {category}",
                f"Language: English",
                f"Approximately {len(text.split())} words"
            ]
        
        # Détection du type de document
        document_type = "general"
        document_confidence = 0.5
        
        if category == "facture":
            document_type = "invoice"
            document_confidence = 0.7
        elif category == "contrat":
            document_type = "contract"
            document_confidence = 0.7
        elif category == "courrier":
            document_type = "email"
            document_confidence = 0.6
            
        # Adapter selon le niveau de détail
        if detail_level == "short":
            summary = summary[:100] + "..." if len(summary) > 100 else summary
            key_points = key_points[:2]
        elif detail_level == "detailed":
            key_points.extend([
                f"Nombre de caractères: {len(text)}",
                f"Entités détectées: {len(numbers)}"
            ])
        
        result = {
            "summary": summary,
            "key_points": key_points,
            "entities": numbers,
            "language": lang,
            "category": category,
            "document_type": document_type,
            "document_confidence": document_confidence
        }
        
        # Ajouter des données structurées basiques si demandé
        if include_structured_data:
            result["structured_data"] = {
                "type": document_type,
                "confidence": document_confidence,
                "data": {}
            }
            
            # Tentative d'extraction basique pour les factures
            if document_type == "invoice":
                # Chercher des montants
                amount_patterns = re.findall(r'(\d+[.,]\d{2})\s*€', text)
                if amount_patterns:
                    amounts = [float(a.replace(',', '.')) for a in amount_patterns]
                    result["structured_data"]["data"]["total_amount"] = max(amounts)
                
                # Chercher une date
                date_patterns = re.findall(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', text)
                if date_patterns:
                    result["structured_data"]["data"]["date"] = date_patterns[0]
                    
        return result
    
    def _empty_analysis(self, reason: str) -> Dict:
        """Analyse vide avec raison"""
        return {
            "summary": reason,
            "key_points": [],
            "entities": [],
            "language": "unknown",
            "category": "autre",
            "document_type": "general",
            "document_confidence": 0.0,
            "structured_data": None
        }
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()


# Fonction helper pour compatibilité
async def analyze_text(text: str, provider: str = "openai") -> Dict[str, any]:
    """Analyser le texte avec le provider spécifié"""
    try:
        provider_enum = AIProvider(provider.lower())
    except ValueError:
        provider_enum = AIProvider.OPENAI
    
    async with AIAnalyzer(provider_enum) as analyzer:
        return await analyzer.analyze_text(text)