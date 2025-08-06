"""
Prompts spécialisés pour l'analyse IA selon le type de document
"""

RESUME_PROMPTS = {
    "invoice": """
    Résume cette facture en mentionnant :
    - Le montant total TTC
    - La date et le numéro de facture
    - Le vendeur et le client
    - Les principaux articles/services facturés
    Format : Une phrase concise avec les infos clés.
    Exemple : "Facture n°2024-001 du 15/03/2024 émise par TechCorp pour ClientX d'un montant de 1500€ TTC pour des services de développement."
    """,
    
    "contract": """
    Résume ce contrat en mentionnant :
    - Les parties concernées
    - L'objet principal du contrat
    - La durée et les dates importantes
    - Les obligations principales
    - Les conditions financières si mentionnées
    Format : 2-3 phrases maximum.
    """,
    
    "cv": """
    Résume ce CV en mentionnant :
    - Nom et titre professionnel
    - Années d'expérience totales
    - Compétences principales (top 3)
    - Dernier poste occupé
    - Formation principale
    Format : Profil professionnel en 2 phrases.
    Exemple : "Jean Dupont, Développeur Full-Stack avec 5 ans d'expérience, spécialisé en React, Node.js et Python. Actuellement Lead Developer chez TechCorp, diplômé d'un Master en Informatique."
    """,
    
    "email": """
    Résume cet email en mentionnant :
    - L'expéditeur et le destinataire
    - L'objet principal du message
    - Les actions demandées ou informations clés
    Format : 1-2 phrases maximum.
    """,
    
    "report": """
    Résume ce rapport en mentionnant :
    - Le sujet principal analysé
    - Les conclusions principales
    - Les recommandations si présentes
    - Les chiffres clés
    Format : 2-3 phrases avec les points essentiels.
    """,
    
    "general": """
    Résume ce document en :
    - Identifiant le sujet principal
    - Extrayant les 3 informations les plus importantes
    - Gardant un ton neutre et factuel
    Format : 2-3 phrases maximum.
    """
}

KEY_POINTS_PROMPTS = {
    "invoice": """
    Extrais les points clés de cette facture :
    - Montant total et TVA
    - Conditions de paiement
    - Articles/services principaux
    - Dates importantes
    - Références (commande, client)
    Format : Liste de 3-5 points courts et précis.
    """,
    
    "contract": """
    Extrais les points clés de ce contrat :
    - Obligations de chaque partie
    - Durée et conditions de résiliation
    - Pénalités ou garanties
    - Modalités financières
    - Clauses importantes
    Format : Liste de 5-7 points essentiels.
    """,
    
    "cv": """
    Extrais les points clés de ce CV :
    - Expériences les plus pertinentes
    - Compétences techniques principales
    - Formations et certifications
    - Langues parlées
    - Réalisations notables
    Format : Liste de 5 points maximum.
    """,
    
    "general": """
    Extrais les points clés de ce document :
    - Informations principales
    - Données chiffrées importantes
    - Décisions ou actions mentionnées
    - Personnes ou organisations citées
    Format : Liste de 5 points maximum.
    """
}

def get_prompt_for_type(doc_type: str, prompt_type: str = "resume") -> str:
    """
    Retourne le prompt approprié selon le type de document
    
    Args:
        doc_type: Type de document détecté
        prompt_type: 'resume' ou 'key_points'
    """
    prompts = RESUME_PROMPTS if prompt_type == "resume" else KEY_POINTS_PROMPTS
    return prompts.get(doc_type, prompts["general"])