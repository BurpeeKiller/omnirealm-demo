# 📋 TODO - Améliorations OmniScan

## 🔴 PRIORITÉ HAUTE - À finir immédiatement

### 1. **Correction des erreurs de configuration**
- [ ] Créer un `.env.example` complet avec toutes les variables
- [ ] Ajouter validation du `.env` au démarrage
- [ ] Message d'erreur clair si Tesseract n'est pas installé
- [ ] Vérifier que les dossiers `uploads/` et `temp/` existent

### 2. **Améliorer la fonction de résumé IA**
- [ ] Résumés adaptés au type de document détecté
- [ ] Longueur de résumé configurable (court/moyen/détaillé)
- [ ] Points clés extraits selon le contexte
- [ ] Support multi-langues pour les résumés

### 3. **Fix bugs critiques identifiés**
- [ ] Modal de connexion : fix bouton fermeture (X)
- [ ] Compteur de scans : ne pas décrémenter en cas d'erreur
- [ ] Validation formats fichiers AVANT upload
- [ ] Gestion erreur si backend non démarré

## 🟡 PRIORITÉ MOYENNE - Quick wins

### 4. **Améliorer l'affichage des résultats**
- [ ] Afficher les données structurées extraites (factures)
- [ ] Bouton "Copier" qui fonctionne vraiment
- [ ] Export en différents formats (TXT, JSON, CSV)
- [ ] Prévisualisation de l'image uploadée

### 5. **Ajouter plus de templates**
- [ ] Template CV/Résumé
- [ ] Template Contrat
- [ ] Template Carte de visite
- [ ] Template Ticket de caisse/Reçu

### 6. **Améliorer la performance**
- [ ] Progress bar réaliste pendant l'OCR
- [ ] Cache des résultats côté frontend
- [ ] Compression des images avant upload
- [ ] Limiter taille des previews

## 🟢 PRIORITÉ BASSE - Nice to have

### 7. **Features avancées**
- [ ] Historique des scans (localStorage)
- [ ] Mode batch (plusieurs fichiers)
- [ ] Détection automatique de la langue
- [ ] OCR sur zones sélectionnées

### 8. **Intégrations**
- [ ] Export vers Google Drive
- [ ] Envoi par email
- [ ] Webhooks pour automatisation
- [ ] API publique documentée

---

# 🎯 AMÉLIORATION DES FONCTIONS DE RÉSUMÉ

## Problèmes actuels :
1. Résumés génériques peu utiles
2. Pas d'adaptation au type de document
3. Points clés non pertinents
4. Longueur fixe non configurable

## Solution proposée :

### 1. **Créer des prompts spécialisés par type**

```python
# backend/app/services/ai_prompts.py

RESUME_PROMPTS = {
    "invoice": """
    Résume cette facture en mentionnant :
    - Le montant total TTC
    - La date et le numéro de facture
    - Le vendeur et le client
    - Les principaux articles/services facturés
    Format : Une phrase concise avec les infos clés.
    """,
    
    "contract": """
    Résume ce contrat en mentionnant :
    - Les parties concernées
    - L'objet principal du contrat
    - La durée et les dates importantes
    - Les obligations principales
    - Les conditions financières
    Format : 2-3 phrases maximum.
    """,
    
    "cv": """
    Résume ce CV en mentionnant :
    - Nom et titre professionnel
    - Années d'expérience totales
    - Compétences principales (top 3)
    - Dernier poste occupé
    - Formation principale
    Format : Profil en 2 phrases.
    """,
    
    "general": """
    Résume ce document en :
    - Identifiant le sujet principal
    - Extrayant les 3 informations les plus importantes
    - Gardant un ton neutre et factuel
    Format : 2-3 phrases maximum.
    """
}
```

### 2. **Améliorer la détection du type de document**

```python
# backend/app/utils/document_classifier.py

class DocumentClassifier:
    def __init__(self):
        self.patterns = {
            "invoice": ["facture", "invoice", "total ttc", "tva", "montant", "référence commande"],
            "contract": ["contrat", "agreement", "parties", "obligations", "durée", "résiliation"],
            "cv": ["expérience", "formation", "compétences", "curriculum", "profil", "diplôme"],
            "email": ["de:", "à:", "objet:", "from:", "to:", "subject:", "cordialement"],
            "report": ["rapport", "analyse", "conclusion", "recommandation", "synthèse"],
        }
    
    def classify(self, text: str) -> tuple[str, float]:
        """Retourne (type, confidence)"""
        text_lower = text.lower()
        scores = {}
        
        for doc_type, keywords in self.patterns.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            scores[doc_type] = score / len(keywords)
        
        best_type = max(scores, key=scores.get)
        confidence = scores[best_type]
        
        if confidence < 0.3:
            return ("general", confidence)
        
        return (best_type, confidence)
```

### 3. **Implémenter des niveaux de détail**

```python
# backend/app/services/ai_analysis.py

async def analyze_text(
    text: str, 
    language_hint: str = None,
    detail_level: str = "medium"  # short, medium, detailed
) -> Dict[str, any]:
    
    # Adapter la longueur selon le niveau
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
```

### 4. **Améliorer l'extraction des points clés**

```python
# backend/app/utils/key_points_extractor.py

class KeyPointsExtractor:
    def extract_by_type(self, text: str, doc_type: str) -> list[str]:
        """Extrait les points clés selon le type de document"""
        
        if doc_type == "invoice":
            return self._extract_invoice_points(text)
        elif doc_type == "contract":
            return self._extract_contract_points(text)
        elif doc_type == "cv":
            return self._extract_cv_points(text)
        else:
            return self._extract_general_points(text)
    
    def _extract_invoice_points(self, text: str) -> list[str]:
        points = []
        
        # Extraire montant
        amount_match = re.search(r'(\d+[\s,.]?\d*)\s*€', text)
        if amount_match:
            points.append(f"Montant : {amount_match.group(1)}€")
        
        # Extraire date
        date_match = re.search(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', text)
        if date_match:
            points.append(f"Date : {date_match.group(0)}")
        
        # Etc...
        return points
```

### 5. **Ajouter des options dans l'UI**

```tsx
// frontend/src/components/AnalysisOptions.tsx

export function AnalysisOptions({ onOptionsChange }) {
  const [detailLevel, setDetailLevel] = useState('medium')
  const [includeStructuredData, setIncludeStructuredData] = useState(true)
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Options d'analyse</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Niveau de détail */}
          <div>
            <label className="text-sm font-medium">Niveau de détail</label>
            <RadioGroup value={detailLevel} onValueChange={setDetailLevel}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short">Court (1-2 phrases)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Moyen (3-5 phrases)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="detailed" />
                <Label htmlFor="detailed">Détaillé (rapport complet)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Extraction structurée */}
          <div className="flex items-center space-x-2">
            <Switch 
              id="structured" 
              checked={includeStructuredData}
              onCheckedChange={setIncludeStructuredData}
            />
            <Label htmlFor="structured">
              Extraire les données structurées (factures, CV...)
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 6. **Améliorer l'affichage des résultats structurés**

```tsx
// frontend/src/components/StructuredDataDisplay.tsx

export function StructuredDataDisplay({ data }) {
  if (!data || data.confidence < 0.5) return null
  
  if (data.type === 'invoice') {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Données de facture extraites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {data.data.invoice_number && (
              <div>
                <span className="text-gray-500">N° Facture :</span>
                <span className="ml-2 font-medium">{data.data.invoice_number}</span>
              </div>
            )}
            {data.data.date && (
              <div>
                <span className="text-gray-500">Date :</span>
                <span className="ml-2 font-medium">{data.data.date}</span>
              </div>
            )}
            {data.data.total_amount && (
              <div>
                <span className="text-gray-500">Montant TTC :</span>
                <span className="ml-2 font-medium">{data.data.total_amount}€</span>
              </div>
            )}
            {/* ... autres champs ... */}
          </div>
          
          {/* Lignes d'articles */}
          {data.line_items?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Articles</h4>
              <div className="space-y-1">
                {data.line_items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.description}</span>
                    <span className="font-medium">{item.amount}€</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
  
  // Autres types de documents...
}
```

## 🎯 Plan d'action recommandé

1. **Jour 1** : Finir la configuration et les bugs critiques
2. **Jour 2** : Implémenter les résumés améliorés et templates
3. **Jour 3** : UI/UX et tests complets

Avec ces améliorations, OmniScan passera de 6/10 à 9/10 ! 🚀