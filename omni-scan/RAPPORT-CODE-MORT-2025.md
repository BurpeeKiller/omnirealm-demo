# Rapport d'Analyse du Code Mort - OmniScan

Date : 2025-08-09  
Analyse complète du code mort et des fichiers non utilisés dans OmniScan

## 🔴 Priorité HAUTE - À supprimer immédiatement

### Backend - Fichiers de test à la racine
Ces fichiers ne devraient pas être dans le repository :
- `/test_login.json` - Fichier de test pour les logins
- `/test_register.json` - Fichier de test pour l'enregistrement  
- `/test_sample.txt` - Échantillon de test
- `/backend/test_saas_flow.py` - Test non intégré dans la suite de tests
- `/backend/test_server.py` - Test isolé du serveur
- `/backend/test_upload.py` - Test isolé d'upload

### Frontend - Composants obsolètes
- `/frontend/src/App.tsx` - Remplacé par AppOptimized.tsx (USE_OPTIMIZED=true dans main.tsx)
- `/frontend/src/components/ResultsDisplay.tsx` - Remplacé par ResultsDisplayOptimized.tsx
- `/frontend/src/features/upload/UploadWithAuthRefactored.tsx` - Version non utilisée (UploadWithAuth est utilisé)

### Fichiers de test à la racine du projet
- `/test-cv.txt`
- `/test-document.txt`
- `/test-email.txt`
- `/test-francais.txt`
- `/test-invoice.txt`
- `/test-long-document.txt`
- `/test-medical.txt`
- `/test.txt`
- `/test-scan.png`

## 🟡 Priorité MOYENNE - À analyser et potentiellement supprimer

### Backend - Services avec versions multiples
- `/backend/app/services/ai_analysis_multi.py` - Utilisé uniquement dans test_ai.py
- `/backend/app/services/ai_analysis_ollama.py` - Utilisé uniquement dans upload_simple.py
- `/backend/app/services/auth_light.py` - Version allégée, vérifier si nécessaire
- `/backend/app/api/auth_light.py` - Route alternative d'authentification
- `/backend/app/services/ocr_simple.py` - Version simplifiée d'OCR

### Frontend - Composants Legacy (marqués dans AppOptimized)
- `/frontend/src/features/upload/UploadPage.tsx` - Route `/upload-old` (legacy)
- `/frontend/src/features/upload/UploadSimple.tsx` - Route `/simple` (legacy)
- `/frontend/src/features/home/SimpleLanding.tsx` - Route `/landing` (legacy)

### Backend - Fichiers obsolètes
- `/backend/app/models/__init__.py.bak` - Fichier de backup
- `/backend/requirements-backup.txt` - Backup des requirements

## 🟢 Priorité BASSE - À vérifier

### Dépendances potentiellement non utilisées

#### Frontend (package.json)
- `crypto-browserify` - Aucune utilisation directe trouvée dans le code
- `@types/jest` - Présent mais le projet utilise Vitest
- `react-dropzone` - Dans devDependencies mais utilisé en production (AccessibleDropzone)

#### Backend (requirements.txt)  
- `langchain` - Vérifier si utilisé avec les services AI
- `pandas` - Peut-être utilisé pour l'export, à vérifier

### Dossiers de coverage et tests
- `/backend/htmlcov/` - Dossier de coverage (peut être ajouté au .gitignore)
- `/backend/temp/` - Dossier temporaire avec fichiers
- `/backend/uploads/` - Contient des fichiers uploadés (vérifier .gitignore)

## 📊 Statistiques

- **Fichiers de test à supprimer** : 11 fichiers
- **Composants React obsolètes** : 5 composants
- **Services backend dupliqués** : 5 services
- **Routes API potentiellement redondantes** : 3 routes
- **Économie de code estimée** : ~2000 lignes

## 🎯 Actions recommandées

### Phase 1 - Nettoyage immédiat (Impact: Faible)
1. Supprimer tous les fichiers de test `.txt` et `.json` à la racine
2. Supprimer `/frontend/src/App.tsx` et `/frontend/src/components/ResultsDisplay.tsx`
3. Supprimer `/frontend/src/features/upload/UploadWithAuthRefactored.tsx`
4. Supprimer `/backend/app/models/__init__.py.bak`

### Phase 2 - Consolidation (Impact: Moyen)
1. Analyser l'utilisation de `ai_analysis_multi.py` et `ai_analysis_ollama.py`
2. Déterminer si `auth_light` est nécessaire ou peut être fusionné
3. Évaluer les routes legacy dans le frontend
4. Déplacer `react-dropzone` dans dependencies (pas devDependencies)

### Phase 3 - Optimisation (Impact: Variable)
1. Supprimer `crypto-browserify` si non utilisé
2. Remplacer `@types/jest` par les types Vitest appropriés
3. Nettoyer les dépendances Python non utilisées
4. Ajouter `/backend/htmlcov/`, `/backend/temp/`, `/backend/uploads/` au .gitignore

## ⚠️ Points d'attention

1. **react-dropzone** est mal placé dans devDependencies alors qu'il est utilisé en production
2. Les fichiers de test à la racine peuvent contenir des données sensibles
3. Certains services "simple" ou "light" peuvent être utilisés pour des cas spécifiques
4. Vérifier les imports dynamiques avant suppression

## 📝 Commandes de nettoyage suggérées

```bash
# Phase 1 - Suppression des fichiers de test
rm /home/greg/projets/dev/apps/omni-scan/test-*.txt
rm /home/greg/projets/dev/apps/omni-scan/test-scan.png
rm /home/greg/projets/dev/apps/omni-scan/backend/test_*.json
rm /home/greg/projets/dev/apps/omni-scan/backend/test_*.py

# Phase 1 - Suppression des composants obsolètes
rm /home/greg/projets/dev/apps/omni-scan/frontend/src/App.tsx
rm /home/greg/projets/dev/apps/omni-scan/frontend/src/components/ResultsDisplay.tsx
rm /home/greg/projets/dev/apps/omni-scan/frontend/src/features/upload/UploadWithAuthRefactored.tsx
rm /home/greg/projets/dev/apps/omni-scan/backend/app/models/__init__.py.bak

# Vérifier les imports après suppression
cd /home/greg/projets/dev/apps/omni-scan
grep -r "ResultsDisplay" frontend/src --exclude-dir=node_modules
grep -r "UploadWithAuthRefactored" frontend/src --exclude-dir=node_modules
```

## 🔍 Analyses complémentaires recommandées

1. Utiliser un outil comme `depcheck` pour le frontend npm
2. Utiliser `pipreqs` ou `pip-autoremove` pour analyser les dépendances Python
3. Faire un audit des routes API pour identifier les doublons fonctionnels
4. Analyser les logs de production pour voir quelles routes sont réellement utilisées