"""
Classificateur de documents pour déterminer le type
"""
import re
from typing import Tuple, Dict, List


class DocumentClassifier:
    """Détermine le type d'un document basé sur son contenu"""
    
    def __init__(self):
        # Mots-clés pondérés par type de document
        self.weighted_patterns = {
            "invoice": {
                "strong": ["facture", "invoice", "total ttc", "montant ttc", "n° de facture", "numéro de facture"],
                "medium": ["tva", "ht", "remise", "montant", "total", "sous-total"],
                "weak": ["référence", "date", "échéance", "paiement", "client", "fournisseur"]
            },
            "contract": {
                "strong": ["contrat", "agreement", "convention", "entre les parties", "ci-après dénommé"],
                "medium": ["obligations", "durée", "résiliation", "article", "clause"],
                "weak": ["parties", "engagement", "conditions", "modalités", "signature"]
            },
            "cv": {
                "strong": ["curriculum vitae", "cv", "expérience professionnelle", "formation", "parcours professionnel"],
                "medium": ["compétences", "diplôme", "expérience", "poste", "emploi"],
                "weak": ["langues", "loisirs", "références", "objectif", "profil"]
            },
            "email": {
                "strong": ["de:", "à:", "objet:", "from:", "to:", "subject:", "re:", "fw:"],
                "medium": ["cordialement", "bien cordialement", "salutations", "regards"],
                "weak": ["bonjour", "madame", "monsieur", "merci", "réponse"]
            },
            "report": {
                "strong": ["rapport", "report", "analyse", "étude", "synthèse", "compte-rendu"],
                "medium": ["conclusion", "recommandation", "résultat", "méthodologie", "introduction"],
                "weak": ["objectif", "contexte", "annexe", "référence", "source"]
            },
            "receipt": {
                "strong": ["ticket", "reçu", "receipt", "caisse", "tpe"],
                "medium": ["article", "quantité", "prix unitaire", "total", "espèces", "carte"],
                "weak": ["merci", "à bientôt", "tva", "montant"]
            },
            "business_card": {
                "strong": ["mobile", "portable", "tel", "email", "linkedin", "@"],
                "medium": ["directeur", "manager", "responsable", "ceo", "président"],
                "weak": ["société", "entreprise", "sarl", "sas", "adresse"]
            }
        }
        
        # Expressions régulières spécifiques
        self.regex_patterns = {
            "invoice": [
                r"facture\s*n°\s*\w+",
                r"invoice\s*#?\s*\w+",
                r"total\s*ttc\s*:?\s*[\d\s,]+",
                r"\d+[,.]?\d*\s*€\s*ttc"
            ],
            "email": [
                r"^de\s*:\s*.+$",
                r"^from\s*:\s*.+$",
                r"^objet\s*:\s*.+$",
                r"^subject\s*:\s*.+$"
            ],
            "phone": [
                r"(?:0|\+33)\s*[1-9](?:\s*\d{2}){4}",  # Numéro français
                r"\+\d{1,3}\s*\d{6,14}",  # International
            ],
            "date": [
                r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}",
                r"\d{4}[/-]\d{1,2}[/-]\d{1,2}"
            ],
            "amount": [
                r"\d+[,.]?\d*\s*€",
                r"€\s*\d+[,.]?\d*"
            ]
        }
    
    def classify(self, text: str) -> Tuple[str, float, Dict[str, any]]:
        """
        Classifie le document et retourne le type avec la confiance
        
        Returns:
            Tuple[type, confidence, metadata]
        """
        if not text or len(text.strip()) < 20:
            return ("unknown", 0.0, {})
        
        text_lower = text.lower()
        scores = {}
        metadata = {}
        
        # Calculer les scores pour chaque type
        for doc_type, patterns in self.weighted_patterns.items():
            score = 0.0
            
            # Patterns avec poids
            for keyword in patterns.get("strong", []):
                if keyword in text_lower:
                    score += 3.0
            
            for keyword in patterns.get("medium", []):
                if keyword in text_lower:
                    score += 1.5
            
            for keyword in patterns.get("weak", []):
                if keyword in text_lower:
                    score += 0.5
            
            # Bonus pour patterns regex
            if doc_type in self.regex_patterns:
                for pattern in self.regex_patterns[doc_type]:
                    if re.search(pattern, text, re.IGNORECASE | re.MULTILINE):
                        score += 2.0
            
            # Normaliser par le nombre de mots du document
            word_count = len(text.split())
            scores[doc_type] = score / (word_count ** 0.3)  # Racine cubique pour réduire l'impact
        
        # Trouver le meilleur type
        if not scores:
            return ("general", 0.0, metadata)
        
        best_type = max(scores, key=scores.get)
        best_score = scores[best_type]
        
        # Calculer la confiance (0-1)
        # Si le score est > 1, c'est très confiant
        confidence = min(1.0, best_score)
        
        # Seuil minimum de confiance
        if confidence < 0.2:
            best_type = "general"
        
        # Extraire des métadonnées supplémentaires
        metadata = self._extract_metadata(text, best_type)
        
        return (best_type, confidence, metadata)
    
    def _extract_metadata(self, text: str, doc_type: str) -> Dict[str, any]:
        """Extrait des métadonnées selon le type de document"""
        metadata = {
            "has_amounts": bool(re.search(r"\d+[,.]?\d*\s*€", text)),
            "has_dates": bool(re.search(r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}", text)),
            "has_email": bool(re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)),
            "has_phone": bool(re.search(r"(?:0|\+33)\s*[1-9](?:\s*\d{2}){4}", text)),
            "word_count": len(text.split()),
            "line_count": len(text.split('\n'))
        }
        
        # Métadonnées spécifiques par type
        if doc_type == "invoice":
            # Chercher le numéro de facture
            invoice_match = re.search(r"(?:facture|invoice)\s*(?:n°|#)?\s*(\w+)", text, re.IGNORECASE)
            if invoice_match:
                metadata["invoice_number"] = invoice_match.group(1)
        
        elif doc_type == "email":
            # Extraire expéditeur/destinataire
            from_match = re.search(r"(?:de|from)\s*:\s*(.+)$", text, re.IGNORECASE | re.MULTILINE)
            if from_match:
                metadata["sender"] = from_match.group(1).strip()
        
        return metadata
    
    def get_document_structure(self, text: str, doc_type: str) -> Dict[str, any]:
        """
        Analyse la structure du document pour mieux l'interpréter
        """
        lines = text.split('\n')
        structure = {
            "has_header": False,
            "has_table": False,
            "has_list": False,
            "sections": []
        }
        
        # Détecter un en-tête (premières lignes courtes)
        if len(lines) > 3:
            header_lines = [l for l in lines[:5] if l.strip() and len(l.strip()) < 50]
            structure["has_header"] = len(header_lines) >= 2
        
        # Détecter des tableaux (alignement de nombres/montants)
        amount_lines = [l for l in lines if re.search(r"\d+[,.]?\d*\s*€", l)]
        if len(amount_lines) > 3:
            structure["has_table"] = True
        
        # Détecter des listes (lignes commençant par -, *, •, ou numéros)
        list_lines = [l for l in lines if re.match(r"^\s*[-*•·]\s+", l) or re.match(r"^\s*\d+[\.)]\s+", l)]
        structure["has_list"] = len(list_lines) > 2
        
        return structure


# Fonction helper
def classify_document(text: str) -> Tuple[str, float, Dict[str, any]]:
    """Classifie un document et retourne le type avec métadonnées"""
    classifier = DocumentClassifier()
    return classifier.classify(text)