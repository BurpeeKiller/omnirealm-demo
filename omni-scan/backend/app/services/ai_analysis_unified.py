"""Service d'analyse IA unifié avec support multi-providers"""

import json
from typing import Dict, Optional
from enum import Enum
import httpx
from app.core.config import settings
from app.core.logging import get_logger
from app.core.api_key_manager import get_api_key_manager
from app.services.ai_prompts import get_prompt_for_type
from app.utils.document_classifier import DocumentClassifier
from app.services.document_analyzer import document_analyzer

logger = get_logger("ai_analysis")


class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    OPENROUTER = "openrouter"
    GROQ = "groq"
    OLLAMA = "ollama"


class AIAnalyzer:
    """Analyseur IA unifié avec support multi-providers et gestion sécurisée des clés"""
    
    def __init__(self, provider: AIProvider = AIProvider.OPENAI):
        self.provider = provider
        self.client = httpx.AsyncClient(timeout=30.0)
        self.key_manager = get_api_key_manager()
        
    async def __aenter__(self):
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
        
    async def analyze_text(
        self, 
        text: str, 
        detail_level: str = "medium", 
        language: Optional[str] = None, 
        include_structured_data: bool = True,
        chapter_summaries: bool = False,
        custom_api_key: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Analyser le texte avec le provider configuré.
        
        Args:
            text: Le texte à analyser
            detail_level: Niveau de détail (low, medium, high)
            language: Langue d'analyse
            include_structured_data: Inclure les données structurées
            chapter_summaries: Inclure les résumés par chapitre
            custom_api_key: Clé API personnalisée (optionnelle)
        """
        
        if not text or len(text.strip()) < 10:
            return self._empty_analysis("Texte trop court pour l'analyse")
        
        # Analyser d'abord la structure du document
        doc_analysis = document_analyzer.analyze_document(text, {
            'include_chapter_summaries': chapter_summaries or detail_level in ['high', 'detailed']
        })
        
        # Préparer le texte pour l'analyse
        analysis_text = self._prepare_text_for_analysis(text, doc_analysis)
        
        try:
            # Si une clé API personnalisée est fournie, l'utiliser dans un contexte isolé
            if custom_api_key:
                async with self.key_manager.temporary_key(self.provider.value, custom_api_key):
                    ai_result = await self._perform_analysis(analysis_text, detail_level, language, include_structured_data)
            else:
                ai_result = await self._perform_analysis(analysis_text, detail_level, language, include_structured_data)
            
            # Enrichir le résultat avec l'analyse de document
            return self._enrich_result(ai_result, doc_analysis)
                
        except Exception as e:
            logger.error(f"Erreur analyse IA ({self.provider.value}): {str(e)}", exc_info=True)
            return self._error_analysis(str(e))
    
    async def _perform_analysis(
        self,
        text: str,
        detail_level: str,
        language: Optional[str],
        include_structured_data: bool
    ) -> Dict:
        """Effectuer l'analyse selon le provider"""
        
        if self.provider == AIProvider.OPENAI:
            return await self._analyze_openai(text, detail_level, language, include_structured_data)
        elif self.provider == AIProvider.ANTHROPIC:
            return await self._analyze_anthropic(text, detail_level, language, include_structured_data)
        elif self.provider == AIProvider.OPENROUTER:
            return await self._analyze_openrouter(text, detail_level, language, include_structured_data)
        elif self.provider == AIProvider.GROQ:
            return await self._analyze_groq(text, detail_level, language, include_structured_data)
        elif self.provider == AIProvider.OLLAMA:
            return await self._analyze_ollama(text, detail_level, language, include_structured_data)
        else:
            return self._fallback_analysis(text, detail_level, language, include_structured_data)
    
    def _prepare_text_for_analysis(self, text: str, doc_analysis: Dict) -> str:
        """Préparer le texte pour l'analyse selon sa longueur"""
        
        if doc_analysis.get('is_long_document', False):
            # Pour les documents longs, utiliser le résumé global
            analysis_text = doc_analysis['global_summary']['text']
            # Ajouter quelques points clés pour le contexte
            if doc_analysis['global_summary'].get('key_points'):
                analysis_text += "\n\nPoints clés : " + " ".join(doc_analysis['global_summary']['key_points'][:3])
        else:
            # Pour les documents courts, limiter la longueur
            max_length = 4000
            if len(text) > max_length:
                analysis_text = text[:max_length] + "..."
            else:
                analysis_text = text
        
        return analysis_text
    
    def _enrich_result(self, ai_result: Dict, doc_analysis: Dict) -> Dict:
        """Enrichir le résultat avec l'analyse de document"""
        
        if doc_analysis.get('is_long_document', False):
            # Remplacer le résumé par le résumé global
            ai_result['summary'] = doc_analysis['global_summary']['text'][:500] + "..."
            
            # Ajouter les informations de structure
            if doc_analysis.get('has_structure'):
                ai_result['document_structure'] = {
                    'chapter_count': doc_analysis['chapter_count'],
                    'main_topics': doc_analysis.get('main_topics', []),
                    'key_themes': doc_analysis.get('key_themes', [])
                }
                
                # Si résumés par chapitre demandés
                if doc_analysis.get('chapter_summaries'):
                    ai_result['chapter_summaries'] = doc_analysis['chapter_summaries']
            
            # Ajouter les statistiques
            ai_result['document_stats'] = doc_analysis['stats']
            
            # Marquer comme document long
            ai_result['is_long_document'] = True
            ai_result['analysis_type'] = 'summarized'
        
        return ai_result
    
    async def _analyze_openai(self, text: str, detail_level: str, language: Optional[str], include_structured_data: bool) -> Dict:
        """Analyse avec OpenAI"""
        
        # Récupérer la clé API de manière sécurisée
        api_key = self.key_manager.get_key("openai")
        if not api_key:
            # Fallback sur la config par défaut
            api_key = settings.openai_api_key
        
        if not api_key or api_key == "disabled-for-testing":
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
    
    async def _analyze_anthropic(self, text: str, detail_level: str, language: Optional[str], include_structured_data: bool) -> Dict:
        """Analyse avec Anthropic Claude"""
        
        api_key = self.key_manager.get_key("anthropic")
        if not api_key:
            # Essayer OpenAI en fallback
            return await self._analyze_openai(text, detail_level, language, include_structured_data)
        
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "claude-3-haiku-20240307",
            "max_tokens": 1000,
            "messages": [
                {"role": "user", "content": f"{self._get_system_prompt(detail_level, language, include_structured_data, text)}\n\nAnalyse ce texte:\n\n{text}"}
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
    
    async def _analyze_groq(self, text: str, detail_level: str, language: Optional[str], include_structured_data: bool) -> Dict:
        """Analyse avec Groq"""
        
        api_key = self.key_manager.get_key("groq")
        if not api_key:
            return self._fallback_analysis(text, detail_level, language, include_structured_data)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "mixtral-8x7b-32768",
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
            except json.JSONDecodeError:
                # Si le JSON est invalide, créer une réponse structurée
                return self._parse_text_response(content)
        else:
            raise Exception(f"Groq error: {response.status_code}")
    
    async def _analyze_openrouter(self, text: str, detail_level: str, language: Optional[str], include_structured_data: bool) -> Dict:
        """Analyse avec OpenRouter"""
        
        api_key = self.key_manager.get_key("openrouter")
        if not api_key:
            return self._fallback_analysis(text, detail_level, language, include_structured_data)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://omniscan.app",
            "X-Title": "OmniScan OCR"
        }
        
        data = {
            "model": "meta-llama/llama-3.2-3b-instruct:free",
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
            try:
                # Nettoyer le contenu avant parsing
                content = content.strip()
                if content.startswith("```json"):
                    content = content[7:]
                if content.endswith("```"):
                    content = content[:-3]
                return json.loads(content.strip())
            except json.JSONDecodeError:
                return self._parse_text_response(content)
        else:
            raise Exception(f"OpenRouter error: {response.status_code}")
    
    async def _analyze_ollama(self, text: str, detail_level: str, language: Optional[str], include_structured_data: bool) -> Dict:
        """Analyse avec Ollama (local)"""
        
        try:
            response = await self.client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama2",
                    "prompt": f"{self._get_system_prompt(detail_level, language, include_structured_data, text)}\n\nAnalyse ce texte:\n\n{text}",
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("response", "")
                return self._parse_text_response(content)
            else:
                raise Exception(f"Ollama error: {response.status_code}")
        except httpx.ConnectError:
            logger.warning("Ollama non disponible, utilisation du fallback")
            return self._fallback_analysis(text, detail_level, language, include_structured_data)
    
    def _get_system_prompt(self, detail_level: str, language: Optional[str], include_structured_data: bool, text: str) -> str:
        """Générer le prompt système selon les paramètres"""
        
        # Classifier le document
        classifier = DocumentClassifier()
        doc_type, confidence, metadata = classifier.classify(text)
        base_prompt = get_prompt_for_type(doc_type)
        
        # Adapter selon le niveau de détail
        if detail_level == "low":
            base_prompt += "\nFournir une analyse très concise avec seulement les points essentiels."
        elif detail_level == "high":
            base_prompt += "\nFournir une analyse très détaillée avec tous les éléments importants."
        
        # Langue d'analyse
        if language:
            base_prompt += f"\nRépondre en {language}."
        
        # Données structurées
        if include_structured_data:
            base_prompt += "\nInclure les données structurées trouvées (dates, montants, références, etc.)."
        
        # Format de réponse
        base_prompt += """
        
Répondre UNIQUEMENT en JSON valide avec cette structure exacte:
{
    "summary": "résumé en 2-3 phrases",
    "key_points": ["point 1", "point 2", "point 3"],
    "entities": [{"type": "person|company|location|date|amount", "value": "valeur", "context": "contexte"}],
    "language": "fr|en|es|etc",
    "category": "cv|invoice|email|report|other",
    "confidence": 0.95,
    "structured_data": {}
}"""
        
        return base_prompt
    
    def _fallback_analysis(self, text: str, detail_level: str, language: Optional[str], include_structured_data: bool) -> Dict:
        """Analyse de secours sans IA"""
        
        # Classifier le document
        classifier = DocumentClassifier()
        doc_type, confidence, metadata = classifier.classify(text)
        
        # Extraire les premières phrases pour le résumé
        sentences = text.split('. ')[:3]
        summary = '. '.join(sentences) if sentences else text[:200]
        
        # Points clés basiques
        key_points = []
        text_lower = text.lower()
        
        if "experience" in text_lower or "cv" in text_lower:
            key_points.append("Document de type CV/Résumé")
        if "@" in text and "." in text:
            key_points.append("Contient des adresses email")
        if any(word in text_lower for word in ["facture", "invoice", "total", "prix"]):
            key_points.append("Document commercial")
        
        # Entités basiques
        entities = []
        
        # Recherche d'emails
        import re
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        for email in emails[:3]:
            entities.append({"type": "email", "value": email, "context": "Contact"})
        
        # Recherche de montants
        amounts = re.findall(r'[\d,]+\.?\d*\s*[€$£]', text)
        for amount in amounts[:3]:
            entities.append({"type": "amount", "value": amount, "context": "Montant"})
        
        # Langue détectée
        if any(word in text_lower for word in ["the", "and", "or", "with"]):
            detected_lang = "en"
        else:
            detected_lang = "fr"
        
        result = {
            "summary": summary,
            "key_points": key_points if key_points else ["Analyse basique effectuée", "IA non disponible"],
            "entities": entities,
            "language": language or detected_lang,
            "category": doc_type,
            "confidence": 0.5,
            "analysis_type": "fallback"
        }
        
        if include_structured_data:
            result["structured_data"] = {
                "emails": emails[:5],
                "amounts": amounts[:5],
                "word_count": len(text.split()),
                "char_count": len(text)
            }
        
        return result
    
    def _parse_text_response(self, content: str) -> Dict:
        """Parser une réponse texte en structure JSON"""
        
        # Essayer d'extraire les éléments clés du texte
        lines = content.strip().split('\n')
        
        result = {
            "summary": "",
            "key_points": [],
            "entities": [],
            "language": "fr",
            "category": "other",
            "confidence": 0.7
        }
        
        # Chercher un résumé
        for line in lines:
            if "résumé" in line.lower() or "summary" in line.lower():
                result["summary"] = line.split(':', 1)[1].strip() if ':' in line else line
                break
        
        # Si pas de résumé trouvé, prendre les premières lignes
        if not result["summary"] and lines:
            result["summary"] = ' '.join(lines[:2])
        
        # Extraire des points clés
        for i, line in enumerate(lines):
            if any(marker in line for marker in ['-', '•', '*', f'{i+1}.']):
                point = line.strip(' -•*0123456789.')
                if point and len(point) > 10:
                    result["key_points"].append(point)
        
        # Si pas de points trouvés, diviser le texte
        if not result["key_points"] and len(content) > 100:
            sentences = content.split('. ')
            result["key_points"] = [s.strip() for s in sentences[1:4] if len(s.strip()) > 20]
        
        return result
    
    def _empty_analysis(self, reason: str) -> Dict:
        """Analyse vide avec raison"""
        return {
            "summary": reason,
            "key_points": [],
            "entities": [],
            "language": "fr",
            "category": "empty",
            "confidence": 1.0,
            "analysis_type": "empty"
        }
    
    def _error_analysis(self, error: str) -> Dict:
        """Analyse d'erreur"""
        return {
            "summary": f"Erreur lors de l'analyse: {error[:200]}",
            "key_points": ["Erreur lors de l'analyse", f"Provider: {self.provider.value}"],
            "entities": [],
            "language": "fr",
            "category": "error",
            "confidence": 0.0,
            "analysis_type": "error"
        }


# Fonction helper pour créer un analyseur avec une clé temporaire
async def analyze_with_custom_key(
    text: str,
    provider: AIProvider,
    api_key: str,
    **kwargs
) -> Dict:
    """
    Analyser un texte avec une clé API personnalisée.
    
    Args:
        text: Le texte à analyser
        provider: Le provider AI à utiliser
        api_key: La clé API personnalisée
        **kwargs: Arguments additionnels pour analyze_text
    """
    analyzer = AIAnalyzer(provider)
    async with analyzer:
        return await analyzer.analyze_text(text, custom_api_key=api_key, **kwargs)


# Fonction de compatibilité avec l'ancienne interface
async def analyze_text(text: str, language_hint: str = None, detail_level: str = "medium") -> Dict[str, any]:
    """
    Fonction de compatibilité avec l'ancienne interface.
    Utilise OpenAI par défaut.
    """
    analyzer = AIAnalyzer(AIProvider.OPENAI)
    async with analyzer:
        return await analyzer.analyze_text(
            text,
            detail_level=detail_level,
            language=language_hint,
            include_structured_data=True
        )