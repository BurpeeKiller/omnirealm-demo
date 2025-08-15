"""Service d'analyse avancée de documents longs"""

from typing import Dict, List
import re
from app.services.text_cleaner import text_cleaner
from app.core.logging import get_logger

logger = get_logger("document_analyzer")


class DocumentAnalyzer:
    """Analyse avancée pour documents longs avec détection de structure"""
    
    def __init__(self):
        self.min_chapter_length = 500  # Caractères minimum pour un chapitre
        self.max_summary_length = 2000  # Longueur max d'un résumé
    
    def analyze_document(self, text: str, options: Dict = None) -> Dict:
        """Analyse complète d'un document"""
        options = options or {}
        
        # Statistiques de base
        stats = self._get_text_stats(text)
        
        # Détecter la structure du document
        chapters = text_cleaner.detect_chapters(text)
        
        # Déterminer le type d'analyse
        is_long_document = stats['word_count'] > 1000
        has_chapters = len(chapters) > 1
        
        result = {
            'stats': stats,
            'has_structure': has_chapters,
            'chapter_count': len(chapters),
            'document_type': self._detect_document_type(text, stats),
        }
        
        # Pour les documents longs
        if is_long_document:
            result['is_long_document'] = True
            
            # Toujours créer un résumé global
            result['global_summary'] = self._create_global_summary(text, stats)
            
            # Si structuré, ajouter l'analyse par chapitre
            if has_chapters and options.get('include_chapter_summaries', True):
                result['structure_analysis'] = self._analyze_structure(chapters)
                result['chapter_summaries'] = self._create_chapter_summaries(chapters)
            
            # Extraire les points clés du document entier
            result['key_themes'] = self._extract_key_themes(text)
            result['main_topics'] = self._extract_main_topics(text)
        else:
            result['is_long_document'] = False
        
        return result
    
    def _get_text_stats(self, text: str) -> Dict:
        """Calcule les statistiques du texte"""
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        paragraphs = text.split('\n\n')
        
        return {
            'char_count': len(text),
            'word_count': len(words),
            'sentence_count': len([s for s in sentences if s.strip()]),
            'paragraph_count': len([p for p in paragraphs if p.strip()]),
            'avg_word_length': sum(len(w) for w in words) / len(words) if words else 0,
            'avg_sentence_length': len(words) / len(sentences) if sentences else 0,
        }
    
    def _detect_document_type(self, text: str, stats: Dict) -> str:
        """Détecte le type de document"""
        text_lower = text.lower()
        
        # Patterns de détection
        if any(word in text_lower for word in ['facture', 'invoice', 'total ttc', 'montant']):
            return 'invoice'
        elif any(word in text_lower for word in ['curriculum', 'expérience professionnelle', 'compétences']):
            return 'cv'
        elif any(word in text_lower for word in ['chapitre', 'section', 'partie']) and stats['word_count'] > 1000:
            return 'book_or_report'
        elif re.search(r'article \d+|loi|décret|arrêté', text_lower):
            return 'legal'
        elif any(word in text_lower for word in ['diagnostic', 'prescription', 'patient', 'traitement']):
            return 'medical'
        elif '@' in text and any(word in text_lower for word in ['bonjour', 'cordialement', 'objet']):
            return 'email'
        elif stats['avg_sentence_length'] > 20 and stats['word_count'] > 500:
            return 'academic'
        else:
            return 'general'
    
    def _create_global_summary(self, text: str, stats: Dict) -> Dict:
        """Crée un résumé global du document complet"""
        # Extraire les phrases les plus importantes
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if len(s.strip()) > 20]
        
        # Limiter le nombre de phrases pour le résumé
        max_sentences = min(10, len(sentences) // 10 + 1)
        
        # Sélectionner les phrases clés (début, milieu, fin + importantes)
        key_sentences = []
        if sentences:
            # Première phrase
            key_sentences.append(sentences[0])
            
            # Phrases du milieu avec mots clés importants
            important_words = ['conclusion', 'résumé', 'important', 'principal', 'essentiel', 'total', 'final']
            for sentence in sentences[1:-1]:
                if any(word in sentence.lower() for word in important_words):
                    key_sentences.append(sentence)
                    if len(key_sentences) >= max_sentences - 1:
                        break
            
            # Dernière phrase significative
            if len(sentences) > 1:
                key_sentences.append(sentences[-1])
        
        # Créer le résumé structuré
        summary_text = ' '.join(key_sentences[:max_sentences])
        
        return {
            'text': summary_text[:self.max_summary_length],
            'length': len(summary_text),
            'coverage': f"{(len(key_sentences) / len(sentences) * 100):.1f}%" if sentences else "0%",
            'key_points': self._extract_key_points(text)[:5],  # Top 5 points
        }
    
    def _extract_key_points(self, text: str) -> List[str]:
        """Extrait les points clés du texte"""
        key_points = []
        
        # Patterns pour identifier les points importants
        patterns = [
            r'(?:(?:il est|c\'est)\s+)?(?:important|essentiel|crucial|nécessaire)\s+(?:de|que)\s+([^.]+)',
            r'(?:en conclusion|pour conclure|finalement)\s*[,:]\s*([^.]+)',
            r'(?:le but|l\'objectif|la finalité)\s+(?:est|était)\s+(?:de\s+)?([^.]+)',
            r'(?:\d+\.\s+)([A-Z][^.]+)',  # Points numérotés
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                point = match.strip()
                if len(point) > 20 and len(point) < 200:
                    key_points.append(point)
        
        # Dédupliquer et limiter
        seen = set()
        unique_points = []
        for point in key_points:
            if point.lower() not in seen:
                seen.add(point.lower())
                unique_points.append(point)
        
        return unique_points
    
    def _analyze_structure(self, chapters: List[Dict]) -> Dict:
        """Analyse la structure du document"""
        if not chapters:
            return {'type': 'unstructured'}
        
        structure = {
            'type': 'structured',
            'depth': 1,  # Profondeur de la hiérarchie
            'chapters': []
        }
        
        for chapter in chapters:
            chapter_info = {
                'title': chapter['title'],
                'word_count': len(chapter['content'].split()),
                'position': f"Lignes {chapter['start_line']}-{chapter['end_line']}",
            }
            
            # Détecter les sous-sections
            subsections = self._detect_subsections(chapter['content'])
            if subsections:
                chapter_info['subsection_count'] = len(subsections)
                structure['depth'] = max(structure['depth'], 2)
            
            structure['chapters'].append(chapter_info)
        
        return structure
    
    def _detect_subsections(self, text: str) -> List[str]:
        """Détecte les sous-sections dans un chapitre"""
        subsection_patterns = [
            r'^\s*\d+\.\d+\.?\s+(.+)$',  # 1.1, 1.2, etc.
            r'^\s*[a-z]\)\s+(.+)$',  # a), b), etc.
            r'^\s*[A-Z]\.\s+(.+)$',  # A., B., etc.
        ]
        
        subsections = []
        for line in text.split('\n'):
            for pattern in subsection_patterns:
                match = re.match(pattern, line.strip())
                if match:
                    subsections.append(match.group(1))
                    break
        
        return subsections
    
    def _create_chapter_summaries(self, chapters: List[Dict]) -> List[Dict]:
        """Crée des résumés pour chaque chapitre"""
        summaries = []
        
        for chapter in chapters:
            if len(chapter['content']) < self.min_chapter_length:
                continue
            
            # Résumer le chapitre
            chapter_sentences = [s.strip() for s in re.split(r'[.!?]+', chapter['content']) 
                               if len(s.strip()) > 20]
            
            # Prendre les 3 premières phrases significatives
            summary_sentences = chapter_sentences[:3]
            
            summaries.append({
                'chapter_title': chapter['title'],
                'summary': ' '.join(summary_sentences),
                'word_count': len(chapter['content'].split()),
                'key_concepts': self._extract_key_concepts(chapter['content'])
            })
        
        return summaries
    
    def _extract_key_concepts(self, text: str) -> List[str]:
        """Extrait les concepts clés d'un texte"""
        # Mots à ignorer
        stop_words = {'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'à', 'dans', 'pour', 'sur', 'avec', 'par', 'ce', 'cette', 'ces', 'qui', 'que', 'dont', 'où'}
        
        # Extraire les mots significatifs
        words = re.findall(r'\b[A-Za-zÀ-ÿ]{4,}\b', text.lower())
        word_freq = {}
        
        for word in words:
            if word not in stop_words:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        # Trier par fréquence et prendre le top 5
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_words[:5] if freq > 2]
    
    def _extract_key_themes(self, text: str) -> List[str]:
        """Extrait les thèmes principaux du document"""
        themes = []
        
        # Détecter les thèmes par patterns
        theme_patterns = {
            'finance': ['budget', 'coût', 'prix', 'euro', 'montant', 'facture', 'paiement'],
            'juridique': ['article', 'loi', 'décret', 'règlement', 'juridique', 'légal'],
            'technique': ['système', 'processus', 'méthode', 'technique', 'développement', 'logiciel'],
            'commercial': ['client', 'vente', 'marché', 'produit', 'service', 'offre'],
            'ressources_humaines': ['employé', 'recrutement', 'compétence', 'formation', 'équipe'],
            'santé': ['patient', 'traitement', 'médical', 'diagnostic', 'santé'],
        }
        
        text_lower = text.lower()
        for theme, keywords in theme_patterns.items():
            count = sum(1 for keyword in keywords if keyword in text_lower)
            if count >= 3:  # Au moins 3 mots clés du thème
                themes.append(theme.replace('_', ' ').title())
        
        return themes
    
    def _extract_main_topics(self, text: str) -> List[str]:
        """Extrait les sujets principaux basés sur les titres et répétitions"""
        topics = []
        
        # Chercher les lignes qui ressemblent à des titres
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            # Titre probable : court, commence par majuscule, pas de ponctuation finale
            if (10 < len(line) < 100 and 
                line[0].isupper() and 
                not line.endswith('.') and
                not line.endswith(',') and
                ':' not in line):
                topics.append(line)
        
        # Limiter et dédupliquer
        seen = set()
        unique_topics = []
        for topic in topics[:10]:  # Max 10 topics
            topic_lower = topic.lower()
            if topic_lower not in seen:
                seen.add(topic_lower)
                unique_topics.append(topic)
        
        return unique_topics


# Instance globale
document_analyzer = DocumentAnalyzer()