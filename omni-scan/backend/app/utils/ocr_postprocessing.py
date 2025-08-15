"""
Post-processing pour améliorer la qualité du texte OCR
"""
import re
from typing import Dict, List
import unicodedata

class OCRPostProcessor:
    def __init__(self):
        # Dictionnaire de corrections courantes
        self.common_fixes = {
            # Espaces manquants
            r'(\w)([A-Z])': r'\1 \2',  # motMinuscule + Majuscule
            r'(\.)(\w)': r'\1 \2',      # point + mot
            r'(\d)([a-zA-Z])': r'\1 \2', # chiffre + lettre
            r'([a-zA-Z])(\d)': r'\1 \2', # lettre + chiffre
            
            # Corrections spécifiques français
            'ä': 'à',
            'ë': 'è', 
            'ï': 'î',
            'ö': 'ô',
            'ü': 'ù',
            'Ã©': 'é',
            'Ã¨': 'è',
            'Ã ': 'à',
            'Ã´': 'ô',
            
            # Mots collés fréquents
            'ceciest': 'ceci est',
            'ilya': 'il y a',
            'cest': "c'est",
            'nest': "n'est",
            'quil': "qu'il",
            'quand': "qu'and",
        }
        
        # Mots français courants pour validation
        self.french_words = {
            'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du',
            'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or',
            'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
            'être', 'avoir', 'faire', 'dire', 'aller', 'voir',
            'est', 'sont', 'était', 'sera', 'fait', 'dit',
            'dans', 'pour', 'avec', 'sans', 'sous', 'sur',
            'ce', 'ceci', 'cela', 'celui', 'celle', 'ceux',
            'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
            'notre', 'votre', 'leur', 'leurs',
            'qui', 'que', 'quoi', 'dont', 'où', 'quand', 'comment',
            'plus', 'moins', 'très', 'bien', 'mal', 'peu', 'beaucoup',
            'tout', 'tous', 'toute', 'toutes', 'autre', 'autres',
            'même', 'mêmes', 'tel', 'telle', 'tels', 'telles',
        }
    
    def process(self, text: str) -> str:
        """
        Applique toutes les corrections au texte
        """
        if not text:
            return text
            
        # 1. Normaliser les caractères Unicode
        text = self._normalize_unicode(text)
        
        # 2. Appliquer les corrections de base
        text = self._apply_basic_fixes(text)
        
        # 3. Corriger les espaces manquants
        text = self._fix_missing_spaces(text)
        
        # 4. Corriger la ponctuation
        text = self._fix_punctuation(text)
        
        # 5. Corriger les accents
        text = self._fix_accents(text)
        
        # 6. Nettoyer les espaces multiples
        text = self._clean_spaces(text)
        
        return text.strip()
    
    def _normalize_unicode(self, text: str) -> str:
        """Normalise les caractères Unicode"""
        return unicodedata.normalize('NFC', text)
    
    def _apply_basic_fixes(self, text: str) -> str:
        """Applique les corrections du dictionnaire"""
        for pattern, replacement in self.common_fixes.items():
            if pattern.startswith('r'):
                # C'est une regex
                continue
            text = text.replace(pattern, replacement)
        return text
    
    def _fix_missing_spaces(self, text: str) -> str:
        """Ajoute les espaces manquants"""
        # Espace après ponctuation
        text = re.sub(r'([.!?,:;])([A-Za-zÀ-ÿ])', r'\1 \2', text)
        
        # Espace entre minuscule et majuscule
        text = re.sub(r'([a-zà-ÿ])([A-ZÀ-Ÿ])', r'\1 \2', text)
        
        # Espace autour des chiffres
        text = re.sub(r'(\d)([A-Za-zÀ-ÿ])', r'\1 \2', text)
        text = re.sub(r'([A-Za-zÀ-ÿ])(\d)', r'\1 \2', text)
        
        # Détecter et séparer les mots collés
        text = self._split_concatenated_words(text)
        
        return text
    
    def _split_concatenated_words(self, text: str) -> str:
        """Sépare les mots collés en utilisant un dictionnaire"""
        words = text.split()
        new_words = []
        
        for word in words:
            if len(word) > 10:  # Mot suspect car trop long
                # Essayer de trouver des mots français dedans
                splits = self._find_word_splits(word.lower())
                if splits:
                    new_words.extend(splits)
                else:
                    new_words.append(word)
            else:
                new_words.append(word)
        
        return ' '.join(new_words)
    
    def _find_word_splits(self, word: str) -> List[str]:
        """Trouve les meilleurs points de séparation dans un mot"""
        if len(word) < 4:
            return None
            
        # Recherche de combinaisons de mots français
        for i in range(2, len(word) - 1):
            left = word[:i]
            right = word[i:]
            
            # Si les deux parties sont des mots français connus
            if (left in self.french_words or len(left) > 3) and \
               (right in self.french_words or len(right) > 3):
                # Récursion pour vérifier si on peut encore diviser
                left_splits = self._find_word_splits(left) or [left]
                right_splits = self._find_word_splits(right) or [right]
                return left_splits + right_splits
        
        return None
    
    def _fix_punctuation(self, text: str) -> str:
        """Corrige la ponctuation"""
        # Espaces avant et après les guillemets
        text = re.sub(r'\s*"\s*', ' " ', text)
        text = re.sub(r"\s*'\s*", " ' ", text)
        
        # Pas d'espace avant la ponctuation simple
        text = re.sub(r'\s+([.!?,;])', r'\1', text)
        
        # Espace après la ponctuation
        text = re.sub(r'([.!?,;:])(\S)', r'\1 \2', text)
        
        # Ponctuation française : espace avant ! ? : ;
        text = re.sub(r'(\S)([!?:;])', r'\1 \2', text)
        
        return text
    
    def _fix_accents(self, text: str) -> str:
        """Corrige les accents mal reconnus"""
        # Pour chaque mot
        words = text.split()
        corrected_words = []
        
        for word in words:
            # Si le mot contient des caractères bizarres, essayer de corriger
            if any(c in word for c in 'Ã¢Ã©Ã¨ÃªÃ´Ã»'):
                word = word.replace('Ã©', 'é')
                word = word.replace('Ã¨', 'è')
                word = word.replace('Ãª', 'ê')
                word = word.replace('Ã ', 'à')
                word = word.replace('Ã¢', 'â')
                word = word.replace('Ã´', 'ô')
                word = word.replace('Ã»', 'û')
                word = word.replace('Ã§', 'ç')
            
            corrected_words.append(word)
        
        return ' '.join(corrected_words)
    
    def _clean_spaces(self, text: str) -> str:
        """Nettoie les espaces multiples et trim"""
        # Remplacer les espaces multiples par un seul
        text = re.sub(r'\s+', ' ', text)
        
        # Supprimer les espaces en début et fin de ligne
        lines = text.split('\n')
        cleaned_lines = [line.strip() for line in lines]
        
        return '\n'.join(cleaned_lines)
    
    def get_confidence_score(self, text: str) -> float:
        """
        Calcule un score de confiance basé sur la qualité du texte
        """
        if not text:
            return 0.0
            
        score = 1.0
        
        # Pénalités
        weird_chars = len(re.findall(r'[Ã¢Ã©Ã¨ÃªÃ´Ã»]', text))
        score -= weird_chars * 0.02
        
        # Mots trop longs (probablement collés)
        words = text.split()
        long_words = sum(1 for w in words if len(w) > 20)
        score -= long_words * 0.05
        
        # Manque d'espaces après ponctuation
        no_space_after_punct = len(re.findall(r'[.!?,;:](?=[A-Za-z])', text))
        score -= no_space_after_punct * 0.03
        
        # Bonus pour mots français reconnus
        french_word_count = sum(1 for w in words if w.lower() in self.french_words)
        if len(words) > 0:
            french_ratio = french_word_count / len(words)
            score += french_ratio * 0.2
        
        return max(0.0, min(1.0, score))


# Fonction helper pour utilisation facile
def improve_ocr_text(text: str) -> Dict[str, any]:
    """
    Améliore le texte OCR et retourne le texte corrigé avec un score de confiance
    """
    processor = OCRPostProcessor()
    improved_text = processor.process(text)
    confidence = processor.get_confidence_score(improved_text)
    
    return {
        'original': text,
        'improved': improved_text,
        'confidence': confidence,
        'improvements_made': text != improved_text
    }


# Fonction wrapper pour compatibilité
def clean_ocr_text(text: str) -> str:
    """
    Fonction wrapper pour nettoyer le texte OCR
    
    Args:
        text: Texte brut de l'OCR
        
    Returns:
        Texte nettoyé
    """
    processor = OCRPostProcessor()
    return processor.process(text)