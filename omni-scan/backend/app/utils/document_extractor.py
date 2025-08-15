"""
Extracteur de données structurées depuis les documents
"""
import re
from typing import Dict, Any


def extract_invoice_data(text: str) -> Dict[str, Any]:
    """
    Extrait les données structurées d'une facture
    
    Returns:
        Dict avec les données extraites et un score de confiance
    """
    data = {
        "invoice_number": None,
        "date": None,
        "total": None,
        "tax": None,
        "vendor": None,
        "confidence": 0.0
    }
    
    confidence_score = 0.0
    
    # Extraction du numéro de facture
    invoice_patterns = [
        r"facture\s*n°?\s*:?\s*(\w+)",
        r"invoice\s*#?\s*:?\s*(\w+)",
        r"n°\s*(?:de\s*)?facture\s*:?\s*(\w+)"
    ]
    
    for pattern in invoice_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["invoice_number"] = match.group(1)
            confidence_score += 0.2
            break
    
    # Extraction de la date
    date_patterns = [
        r"date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
        r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})"
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["date"] = match.group(1)
            confidence_score += 0.15
            break
    
    # Extraction du montant total
    total_patterns = [
        r"total\s*(?:ttc)?\s*:?\s*([\d\s,]+(?:[.,]\d{2})?)\s*€",
        r"montant\s*total\s*:?\s*([\d\s,]+(?:[.,]\d{2})?)\s*€",
        r"([\d\s,]+(?:[.,]\d{2})?)\s*€\s*ttc"
    ]
    
    for pattern in total_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            amount = match.group(1).replace(" ", "").replace(",", ".")
            try:
                data["total"] = float(amount)
                confidence_score += 0.25
                break
            except ValueError:
                pass
    
    # Extraction de la TVA
    tax_patterns = [
        r"tva\s*(?:\d+%?)?\s*:?\s*([\d\s,]+(?:[.,]\d{2})?)\s*€",
        r"taxe?\s*:?\s*([\d\s,]+(?:[.,]\d{2})?)\s*€"
    ]
    
    for pattern in tax_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            amount = match.group(1).replace(" ", "").replace(",", ".")
            try:
                data["tax"] = float(amount)
                confidence_score += 0.15
                break
            except ValueError:
                pass
    
    # Extraction du vendeur (première ligne non vide souvent)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        # Chercher une ligne qui ressemble à un nom d'entreprise
        for line in lines[:5]:  # Regarder dans les 5 premières lignes
            if len(line) > 3 and len(line) < 100 and not re.match(r"^\d", line):
                data["vendor"] = line
                confidence_score += 0.1
                break
    
    # Ajuster la confiance finale
    data["confidence"] = min(confidence_score, 1.0)
    
    return data


def extract_cv_data(text: str) -> Dict[str, Any]:
    """
    Extrait les données structurées d'un CV
    """
    data = {
        "name": None,
        "email": None,
        "phone": None,
        "skills": [],
        "experience_years": None,
        "confidence": 0.0
    }
    
    # TODO: Implémenter l'extraction pour les CVs
    
    return data


def extract_email_data(text: str) -> Dict[str, Any]:
    """
    Extrait les données structurées d'un email
    """
    data = {
        "sender": None,
        "recipient": None,
        "subject": None,
        "date": None,
        "confidence": 0.0
    }
    
    # TODO: Implémenter l'extraction pour les emails
    
    return data