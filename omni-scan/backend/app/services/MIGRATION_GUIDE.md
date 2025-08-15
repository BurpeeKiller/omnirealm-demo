# Guide de Migration vers les Services Unifiés

## 🔄 Changements Importants

### 1. Service d'Authentification
- **Ancien** : `auth.py` + `auth_light.py`
- **Nouveau** : `auth_unified.py`

```python
# Avant
from app.services.auth_light import auth
from app.services.auth import some_function

# Après
from app.services.auth_unified import get_auth_service, AuthMode

# Utilisation
auth_service = get_auth_service(AuthMode.LIGHT)  # ou SUPABASE, DEMO
```

### 2. Service OCR
- **Ancien** : `ocr.py` + `ocr_simple.py`
- **Nouveau** : `ocr_unified.py`

```python
# Avant
from app.services.ocr_simple import process_document
from app.services.ocr import extract_text_from_file

# Après
from app.services.ocr_unified import UnifiedOCRService

# Utilisation
ocr_service = UnifiedOCRService()
text = await ocr_service.process_document(file_path, file_type)
```

### 3. Service AI Analysis
- **Ancien** : `ai_analysis.py` + `ai_analysis_multi.py` + `ai_analysis_ollama.py`
- **Nouveau** : `ai_analysis_unified.py`

```python
# Avant
from app.services.ai_analysis_multi import AIAnalyzer, AIProvider
os.environ["OPENAI_API_KEY"] = key  # DANGEREUX !

# Après
from app.services.ai_analysis_unified import AIAnalyzer, AIProvider, analyze_with_custom_key

# Utilisation sécurisée avec clé personnalisée
result = await analyze_with_custom_key(
    text=text,
    provider=AIProvider.OPENAI,
    api_key=custom_key
)
```

### 4. API Upload
- **Ancien** : `upload.py` + `upload_simple.py`
- **Nouveau** : `upload_unified.py`

Les routes restent les mêmes mais utilisent maintenant le service unifié en interne.

## ⚠️ Sécurité Critique

### Problème Corrigé
Le code suivant était une faille de sécurité majeure :
```python
# NE JAMAIS FAIRE CELA !
os.environ["OPENAI_API_KEY"] = x_ai_key
```

### Solution Sécurisée
Utilisation du gestionnaire de clés API :
```python
from app.core.api_key_manager import get_api_key_manager

# Utilisation temporaire sécurisée
async with api_key_manager.temporary_key("openai", custom_key):
    # La clé est utilisée uniquement dans ce contexte
    result = await analyzer.analyze_text(text)
```

## 📝 Étapes de Migration

1. **Mettre à jour les imports** dans tous les fichiers
2. **Tester** chaque endpoint après migration
3. **Supprimer** les anciens fichiers une fois validé
4. **Mettre à jour** la documentation

## 🚀 Avantages

- **Sécurité** : Plus de pollution des variables d'environnement
- **Maintenabilité** : Un seul fichier par service
- **Flexibilité** : Configuration par mode (SUPABASE, LIGHT, DEMO)
- **Performance** : Réutilisation du code, moins de duplication