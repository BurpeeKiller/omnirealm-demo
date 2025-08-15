"""Service de nettoyage et amélioration du texte OCR"""

import re
from typing import List, Dict
import unicodedata

class TextCleaner:
    """Nettoie et améliore la qualité du texte extrait par OCR"""
    
    def __init__(self):
        # Corrections courantes pour le français
        self.common_replacements = {
            # Caractères mal reconnus
            'ﬁ': 'fi',
            'ﬂ': 'fl',
            'œ': 'oe',
            'æ': 'ae',
            '©': 'e',
            '®': 'e',
            '€': 'e',
            
            # Espaces problématiques
            '  ': ' ',  # Double espace
            ' ,': ',',
            ' .': '.',
            ' ;': ';',
            ' :': ':',
            ' !': '!',
            ' ?': '?',
            '( ': '(',
            ' )': ')',
            
            # Apostrophes
            ''': "'",
            ''': "'",
            '´': "'",
            '`': "'",
        }
        
        # Mots français courants mal reconnus
        self.word_corrections = {
            'ler': '1er',
            '2eme': '2ème',
            '3eme': '3ème',
            'iere': 'ière',
            'ieme': 'ième',
            'Etat': 'État',
            'Ecole': 'École',
            'Etude': 'Étude',
            'a la': 'à la',
            'a l\'': 'à l\'',
        }
    
    def clean_text(self, text: str) -> str:
        """Nettoie le texte OCR complet"""
        if not text:
            return text
            
        # 1. Normaliser l'encodage Unicode
        text = unicodedata.normalize('NFKC', text)
        
        # 2. Remplacer les caractères problématiques
        for old, new in self.common_replacements.items():
            text = text.replace(old, new)
        
        # 3. Corriger les espaces multiples
        text = re.sub(r'\s+', ' ', text)
        
        # 4. Corriger les espaces autour de la ponctuation
        text = re.sub(r'\s+([.,;:!?])', r'\1', text)
        text = re.sub(r'([.,;:!?])\s*', r'\1 ', text)
        
        # 5. Corriger les mots courants
        for old, new in self.word_corrections.items():
            text = re.sub(r'\b' + old + r'\b', new, text, flags=re.IGNORECASE)
        
        # 6. Supprimer les lignes vides multiples
        text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
        
        # 7. Corriger les tirets et apostrophes
        text = self._fix_punctuation(text)
        
        # 8. Nettoyer les espaces en début/fin
        text = text.strip()
        
        return text
    
    def _fix_punctuation(self, text: str) -> str:
        """Corrige la ponctuation française"""
        # Guillemets français
        text = re.sub(r'"([^"]+)"', r'« \1 »', text)
        
        # Espaces insécables avant : ; ! ?
        text = re.sub(r'\s*:\s*', ' : ', text)
        text = re.sub(r'\s*;\s*', ' ; ', text)
        text = re.sub(r'\s*!\s*', ' ! ', text)
        text = re.sub(r'\s*\?\s*', ' ? ', text)
        
        # Apostrophes dans les contractions
        text = re.sub(r'\b([dlcjmts])\s+\'', r"\1'", text, flags=re.IGNORECASE)
        
        return text
    
    def detect_chapters(self, text: str) -> List[Dict[str, str]]:
        """Détecte les chapitres dans un document"""
        chapters = []
        
        # Patterns de détection de chapitres
        chapter_patterns = [
            r'^(Chapitre|CHAPITRE|Chap\.|CHAP\.)\s+(\d+|[IVX]+)',
            r'^(\d+)\.\s+([A-Z][^.]+)$',  # 1. Titre
            r'^(Section|SECTION)\s+(\d+)',
            r'^(Partie|PARTIE)\s+(\d+|[IVX]+)',
            r'^(Article|ARTICLE)\s+(\d+)',
        ]
        
        lines = text.split('\n')
        current_chapter = None
        current_content = []
        chapter_start = 0
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                if current_content:
                    current_content.append('')
                continue
            
            # Vérifier si c'est un titre de chapitre
            is_chapter = False
            for pattern in chapter_patterns:
                if re.match(pattern, line, re.MULTILINE):
                    is_chapter = True
                    break
            
            # Ou si c'est en majuscules et court (probable titre)
            if not is_chapter and line.isupper() and len(line) < 100 and not line.endswith('.'):
                is_chapter = True
            
            if is_chapter:
                # Sauvegarder le chapitre précédent
                if current_chapter:
                    chapters.append({
                        'title': current_chapter,
                        'content': '\n'.join(current_content).strip(),
                        'start_line': chapter_start,
                        'end_line': i - 1
                    })
                
                current_chapter = line
                chapter_start = i
                current_content = []
            else:
                current_content.append(line)
        
        # Ajouter le dernier chapitre
        if current_chapter:
            chapters.append({
                'title': current_chapter,
                'content': '\n'.join(current_content).strip(),
                'start_line': chapter_start,
                'end_line': len(lines) - 1
            })
        
        return chapters
    
    def merge_hyphenated_words(self, text: str) -> str:
        """Fusionne les mots coupés par des tirets en fin de ligne"""
        # Pattern: mot-\n suivi d'une lettre minuscule
        text = re.sub(r'(\w+)-\n(\w)', r'\1\2', text)
        return text
    
    def remove_page_numbers(self, text: str) -> str:
        """Supprime les numéros de page"""
        # Numéros seuls sur une ligne
        text = re.sub(r'^\s*\d{1,4}\s*$', '', text, flags=re.MULTILINE)
        # Pattern "Page X" ou "- X -"
        text = re.sub(r'^[\s-]*(?:Page|PAGE|page)?\s*\d{1,4}\s*[-]?\s*$', '', text, flags=re.MULTILINE)
        return text
    
    def clean_ocr_artifacts(self, text: str) -> str:
        """Nettoie les artefacts courants de l'OCR"""
        # Caractères isolés répétés
        text = re.sub(r'([^\w\s])\1{3,}', r'\1\1', text)
        
        # Séquences de caractères non-alphanumériques
        text = re.sub(r'[^\w\s,.;:!?\'"«»()-]{5,}', '', text)
        
        # Lignes avec trop peu de caractères alphanumériques
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            alnum_count = sum(c.isalnum() for c in line)
            if len(line) > 0 and alnum_count / len(line) > 0.3:
                cleaned_lines.append(line)
            elif not line.strip():  # Garder les lignes vides
                cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)


# Instance globale
text_cleaner = TextCleaner()