"""
Template pour l'extraction structurée de données de factures
"""
import re
from typing import Dict, Any, List, Optional
from datetime import datetime


class InvoiceTemplate:
    """Extrait les informations structurées d'une facture"""
    
    def __init__(self):
        # Patterns pour détecter les éléments clés
        self.patterns = {
            'invoice_number': [
                r'(?:facture|invoice|n°|num[eé]ro)\s*:?\s*([A-Z0-9\-/]+)',
                r'(?:ref|r[eé]f[eé]rence)\s*:?\s*([A-Z0-9\-/]+)',
            ],
            'date': [
                r'(?:date|[eé]mis le|du)\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
                r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            ],
            'amount': [
                r'(?:total|montant|ttc)\s*:?\s*([\d\s]+[,.]?\d*)\s*€',
                r'([\d\s]+[,.]?\d*)\s*€\s*(?:ttc|total)',
                r'€\s*([\d\s]+[,.]?\d*)',
            ],
            'tax': [
                r'(?:tva|tax)\s*:?\s*([\d\s]+[,.]?\d*)\s*€',
                r'(?:tva|tax)\s*(?:20|19\.6|10|5\.5)%?\s*:?\s*([\d\s]+[,.]?\d*)',
            ],
            'vendor': [
                r'(?:vendeur|fournisseur|[eé]metteur)\s*:?\s*([A-Za-zÀ-ÿ\s\-&]+)',
                r'^([A-Za-zÀ-ÿ\s\-&]+)$',  # Première ligne souvent = nom entreprise
            ],
            'client': [
                r'(?:client|destinataire|factur[eé] [aà])\s*:?\s*([A-Za-zÀ-ÿ\s\-&]+)',
                r'(?:livr[eé] [aà]|adresse de livraison)\s*:?\s*([A-Za-zÀ-ÿ\s\-&]+)',
            ],
            'payment_terms': [
                r'(?:conditions|[eé]ch[eé]ance|paiement)\s*:?\s*([^\n]+)',
                r'(?:net|payer avant|due)\s*:?\s*([^\n]+)',
            ]
        }
        
        # Mots-clés pour identifier une facture
        self.invoice_keywords = [
            'facture', 'invoice', 'total', 'ttc', 'ht', 'tva',
            'montant', 'prix', 'référence', 'date', 'échéance'
        ]
    
    def is_invoice(self, text: str) -> bool:
        """Détermine si le document est probablement une facture"""
        text_lower = text.lower()
        matches = sum(1 for keyword in self.invoice_keywords if keyword in text_lower)
        return matches >= 3
    
    def extract(self, text: str) -> Dict[str, Any]:
        """Extrait toutes les informations de la facture"""
        result = {
            'type': 'invoice',
            'confidence': 0.0,
            'data': {},
            'line_items': [],
            'summary': ''
        }
        
        # Vérifier si c'est une facture
        if not self.is_invoice(text):
            result['type'] = 'unknown'
            result['confidence'] = 0.2
            return result
        
        # Extraire les champs principaux
        result['data'] = {
            'invoice_number': self._extract_field(text, 'invoice_number'),
            'date': self._extract_date(text),
            'total_amount': self._extract_amount(text, 'amount'),
            'tax_amount': self._extract_amount(text, 'tax'),
            'vendor': self._extract_field(text, 'vendor'),
            'client': self._extract_field(text, 'client'),
            'payment_terms': self._extract_field(text, 'payment_terms'),
        }
        
        # Extraire les lignes d'articles
        result['line_items'] = self._extract_line_items(text)
        
        # Calculer la confiance
        result['confidence'] = self._calculate_confidence(result['data'])
        
        # Générer un résumé
        result['summary'] = self._generate_summary(result['data'])
        
        return result
    
    def _extract_field(self, text: str, field_name: str) -> Optional[str]:
        """Extrait un champ selon les patterns définis"""
        patterns = self.patterns.get(field_name, [])
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def _extract_date(self, text: str) -> Optional[str]:
        """Extrait et formate la date"""
        date_str = self._extract_field(text, 'date')
        if not date_str:
            return None
        
        # Essayer de parser la date
        for fmt in ['%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y', '%d-%m-%y']:
            try:
                date_obj = datetime.strptime(date_str, fmt)
                return date_obj.strftime('%Y-%m-%d')
            except ValueError:
                continue
        
        return date_str
    
    def _extract_amount(self, text: str, field_name: str) -> Optional[float]:
        """Extrait et convertit un montant"""
        amount_str = self._extract_field(text, field_name)
        if not amount_str:
            return None
        
        # Nettoyer et convertir
        try:
            # Enlever les espaces et remplacer virgule par point
            clean = amount_str.replace(' ', '').replace(',', '.')
            return float(clean)
        except ValueError:
            return None
    
    def _extract_line_items(self, text: str) -> List[Dict[str, Any]]:
        """Extrait les lignes d'articles de la facture"""
        items = []
        
        # Pattern pour détecter les lignes avec prix
        line_pattern = r'([^\n]+?)\s+([\d\s]+[,.]?\d*)\s*€'
        
        for match in re.finditer(line_pattern, text):
            description = match.group(1).strip()
            amount = match.group(2).strip()
            
            # Filtrer les totaux et sous-totaux
            if any(word in description.lower() for word in ['total', 'ttc', 'ht', 'tva']):
                continue
            
            try:
                amount_float = float(amount.replace(' ', '').replace(',', '.'))
                items.append({
                    'description': description,
                    'amount': amount_float
                })
            except ValueError:
                continue
        
        return items
    
    def _calculate_confidence(self, data: Dict[str, Any]) -> float:
        """Calcule un score de confiance basé sur les champs trouvés"""
        fields_found = sum(1 for v in data.values() if v is not None)
        total_fields = len(data)
        
        base_score = fields_found / total_fields if total_fields > 0 else 0
        
        # Bonus si on a les champs critiques
        critical_fields = ['invoice_number', 'date', 'total_amount']
        critical_found = sum(1 for f in critical_fields if data.get(f) is not None)
        
        if critical_found >= 2:
            base_score += 0.2
        
        return min(1.0, base_score)
    
    def _generate_summary(self, data: Dict[str, Any]) -> str:
        """Génère un résumé lisible des informations extraites"""
        parts = []
        
        if data['invoice_number']:
            parts.append(f"Facture n°{data['invoice_number']}")
        
        if data['date']:
            parts.append(f"du {data['date']}")
        
        if data['vendor']:
            parts.append(f"émise par {data['vendor']}")
        
        if data['total_amount']:
            parts.append(f"d'un montant de {data['total_amount']:.2f}€")
        
        if data['client']:
            parts.append(f"pour {data['client']}")
        
        return ' '.join(parts) if parts else "Facture détectée mais informations incomplètes"


def extract_invoice_data(text: str) -> Dict[str, Any]:
    """Fonction helper pour extraction facile"""
    template = InvoiceTemplate()
    return template.extract(text)