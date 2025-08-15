# Intégration Backend - Sélection de Zones OCR

## Vue d'ensemble

Cette documentation décrit les modifications nécessaires au backend OmniScan pour supporter la fonctionnalité de sélection de zones interactives.

## Architecture Existante ✅

L'architecture OCR actuelle d'OmniScan est déjà prête pour les zones :

### `OCRConfig` - Support intégré
```python
# app/services/ocr/base.py - DÉJÀ IMPLÉMENTÉ
@dataclass
class OCRConfig:
    regions: Optional[List[BoundingBox]] = None  # ✅ Support zones
    extract_tables: bool = False
    extract_formulas: bool = False
    # ... autres paramètres
```

### `OCRManager` - Sélection intelligente
```python
# app/services/ocr/manager.py - DÉJÀ IMPLÉMENTÉ
def _select_engine(self, engine_name, config):
    if config.regions:
        required_features.append(OCRFeature.INTERACTIVE)  # ✅ Détection zones
    # ... logique de sélection moteur
```

## Modifications Requises

### 1. Nouvel Endpoint API

Créez le fichier `app/api/ocr_zones.py` :

```python
"""
API endpoints pour l'OCR avec sélection de zones
"""

from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from typing import List, Optional, Dict, Any
import json
import asyncio
from pathlib import Path
import uuid
import time
from PIL import Image
import io

from app.core.logging import get_logger
from app.services.ocr.manager import get_ocr_manager
from app.services.ocr.base import OCRConfig, BoundingBox, OCRResult
from app.core.exceptions import OCRError

logger = get_logger("api.ocr_zones")
router = APIRouter(prefix="/ocr", tags=["ocr-zones"])


@router.post("/process-with-zones")
async def process_with_zones(
    file: UploadFile = File(...),
    regions: str = Form(...),  # JSON string des BoundingBox
    language: str = Form("auto"),
    detail_level: str = Form("medium"),
    include_full_image: bool = Form(False),
    merge_results: bool = Form(True)
):
    """Traiter un document avec des zones spécifiques sélectionnées"""
    
    start_time = time.time()
    
    try:
        # Parser les régions JSON
        regions_data = json.loads(regions)
        logger.info(f"Traitement avec {len(regions_data)} zones")
        
        # Convertir en BoundingBox
        bounding_boxes = [
            BoundingBox(
                x=int(r["x"]), 
                y=int(r["y"]), 
                width=int(r["width"]), 
                height=int(r["height"])
            )
            for r in regions_data
        ]
        
        # Sauvegarder le fichier temporairement
        temp_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        temp_path = Path(f"temp/{temp_id}{file_extension}")
        temp_path.parent.mkdir(exist_ok=True)
        
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Obtenir le gestionnaire OCR
        ocr_manager = get_ocr_manager()
        await ocr_manager.initialize()
        
        # Traiter chaque zone individuellement
        zone_results = []
        
        if bounding_boxes:
            # Charger l'image pour cropping
            if file.content_type.startswith('image/'):
                image = Image.open(io.BytesIO(content))
            else:
                # Pour les PDFs, convertir la première page
                image = await convert_pdf_to_image(content)
            
            for i, bbox in enumerate(bounding_boxes):
                logger.info(f"Traitement zone {i+1}/{len(bounding_boxes)}")
                
                try:
                    # Cropper l'image selon la zone
                    cropped_image = image.crop((
                        bbox.x,
                        bbox.y, 
                        bbox.x + bbox.width,
                        bbox.y + bbox.height
                    ))
                    
                    # Sauvegarder l'image croppée temporairement
                    crop_path = Path(f"temp/{temp_id}_zone_{i}.jpg")
                    cropped_image.save(crop_path, 'JPEG')
                    
                    # Configuration pour cette zone
                    zone_config = OCRConfig(
                        languages=[language] if language != "auto" else ["fra", "eng"],
                        extract_tables=detail_level in ["detailed", "high"],
                        extract_formulas=detail_level == "high",
                        enable_preprocessing=True,
                        enable_postprocessing=True
                    )
                    
                    # Traiter la zone
                    zone_result = await ocr_manager.process_document(
                        crop_path,
                        "jpg",
                        zone_config
                    )
                    
                    zone_results.append({
                        "text": zone_result.text,
                        "confidence": zone_result.confidence,
                        "processing_time": zone_result.processing_time,
                        "ai_analysis": zone_result.json_data
                    })
                    
                    # Nettoyer le fichier temporaire de zone
                    crop_path.unlink(missing_ok=True)
                    
                except Exception as e:
                    logger.error(f"Erreur traitement zone {i}: {e}")
                    zone_results.append({
                        "text": f"Erreur lors du traitement de cette zone: {str(e)}",
                        "confidence": 0.0,
                        "processing_time": 0.0,
                        "ai_analysis": None
                    })
        
        # Traiter l'image complète si demandé
        full_result = None
        if include_full_image:
            logger.info("Traitement image complète")
            
            full_config = OCRConfig(
                languages=[language] if language != "auto" else ["fra", "eng"],
                extract_tables=detail_level in ["detailed", "high"],
                extract_formulas=detail_level == "high"
            )
            
            full_ocr_result = await ocr_manager.process_document(
                temp_path,
                file_extension.lstrip('.'),
                full_config
            )
            
            full_result = {
                "text": full_ocr_result.text,
                "ai_analysis": full_ocr_result.json_data,
                "confidence": full_ocr_result.confidence
            }
        
        # Fusionner les résultats si demandé
        merged_text = None
        if merge_results and zone_results:
            valid_texts = [zr["text"] for zr in zone_results if zr["text"] and not zr["text"].startswith("Erreur")]
            merged_text = "\n\n".join(valid_texts) if valid_texts else None
        
        total_time = time.time() - start_time
        
        # Nettoyer le fichier temporaire principal
        temp_path.unlink(missing_ok=True)
        
        return {
            "filename": file.filename,
            "zones": zone_results,
            "full_image_result": full_result,
            "total_processing_time": total_time,
            "merged_text": merged_text
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Format JSON invalide pour les régions")
    except Exception as e:
        logger.error(f"Erreur traitement zones: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement: {str(e)}")


@router.post("/preview-zones")  
async def preview_zones(
    file: UploadFile = File(...),
    regions: str = Form(...)
):
    """Prévisualiser les zones sélectionnées avant traitement"""
    
    try:
        regions_data = json.loads(regions)
        
        # Charger l'image
        content = await file.read()
        if file.content_type.startswith('image/'):
            image = Image.open(io.BytesIO(content))
        else:
            image = await convert_pdf_to_image(content)
        
        previews = []
        for i, region in enumerate(regions_data):
            # Cropper selon la région
            cropped = image.crop((
                region["x"],
                region["y"],
                region["x"] + region["width"], 
                region["y"] + region["height"]
            ))
            
            # Convertir en base64
            buffer = io.BytesIO()
            cropped.save(buffer, format='JPEG')
            import base64
            image_data = base64.b64encode(buffer.getvalue()).decode()
            
            # Estimation grossière de la longueur de texte
            # (basée sur la taille de l'image)
            estimated_length = min(max(cropped.width * cropped.height // 1000, 10), 500)
            
            previews.append({
                "image_data": f"data:image/jpeg;base64,{image_data}",
                "estimated_text_length": estimated_length
            })
        
        return {"previews": previews}
        
    except Exception as e:
        logger.error(f"Erreur preview zones: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggest-zones")
async def suggest_zones(
    file: UploadFile = File(...),
    detect_regions: bool = Form(True)
):
    """Suggérer automatiquement des zones d'intérêt"""
    
    try:
        content = await file.read()
        if file.content_type.startswith('image/'):
            image = Image.open(io.BytesIO(content))
        else:
            image = await convert_pdf_to_image(content)
        
        # Algorithme simple de détection de zones
        # (à améliorer avec de l'IA/ML plus tard)
        suggested_regions = detect_text_regions(image)
        
        return {"suggested_regions": suggested_regions}
        
    except Exception as e:
        logger.error(f"Erreur suggestion zones: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def convert_pdf_to_image(pdf_content: bytes) -> Image.Image:
    """Convertir la première page d'un PDF en image"""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open("pdf", pdf_content)
        page = doc.load_page(0)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom
        img_data = pix.tobytes("ppm")
        doc.close()
        return Image.open(io.BytesIO(img_data))
    except ImportError:
        logger.warning("PyMuPDF non disponible, utilisation de PIL")
        # Fallback basique (nécessite pillow-pdf)
        return Image.open(io.BytesIO(pdf_content))


def detect_text_regions(image: Image.Image) -> List[Dict[str, Any]]:
    """Détecter automatiquement les zones de texte dans une image"""
    
    # Algorithme simple basé sur la luminosité et les contours
    # TODO: Remplacer par une solution ML/IA plus avancée
    
    import numpy as np
    from PIL import ImageFilter
    
    # Convertir en niveaux de gris
    gray = image.convert('L')
    
    # Appliquer des filtres pour détecter les zones de texte
    edges = gray.filter(ImageFilter.FIND_EDGES)
    
    # Convertir en numpy pour traitement
    arr = np.array(edges)
    
    # Détecter les zones avec beaucoup de contours (probablement du texte)
    height, width = arr.shape
    
    # Diviser l'image en blocs et analyser chaque bloc
    block_size = min(width // 4, height // 4, 200)
    regions = []
    
    for y in range(0, height - block_size, block_size // 2):
        for x in range(0, width - block_size, block_size // 2):
            block = arr[y:y+block_size, x:x+block_size]
            
            # Compter les pixels de contour
            edge_pixels = np.sum(block > 50)
            edge_ratio = edge_pixels / (block_size * block_size)
            
            # Si ratio élevé, probablement du texte
            if edge_ratio > 0.1:  # Seuil arbitraire
                regions.append({
                    "x": int(x),
                    "y": int(y), 
                    "width": int(min(block_size, width - x)),
                    "height": int(min(block_size, height - y)),
                    "confidence": min(edge_ratio * 2, 1.0)  # Normaliser
                })
    
    # Limiter le nombre de suggestions
    regions.sort(key=lambda r: r["confidence"], reverse=True)
    return regions[:6]  # Max 6 suggestions
```

### 2. Enregistrer le router

Dans `app/main.py`, ajoutez :

```python
# app/main.py
from app.api import ocr_zones

# Dans la fonction create_app()
app.include_router(ocr_zones.router, prefix="/api/v1")
```

### 3. Dépendances supplémentaires

Ajoutez au `requirements.txt` :

```txt
# Pour le traitement d'images avancé
Pillow>=10.0.0

# Pour la conversion PDF vers image (optionnel mais recommandé)
PyMuPDF>=1.23.0

# Pour la détection de zones (optionnel, pour amélioration future)
opencv-python>=4.8.0
```

### 4. Extension des moteurs OCR existants

Étendez vos moteurs pour mieux supporter les régions :

```python
# app/services/ocr/tesseract.py - Exemple d'extension

async def process_image_with_regions(
    self, 
    image_path: Path, 
    regions: List[BoundingBox]
) -> List[OCRResult]:
    """Traiter spécifiquement les régions d'une image"""
    
    if not regions:
        return [await self.process_image(image_path)]
    
    image = Image.open(image_path)
    results = []
    
    for i, region in enumerate(regions):
        # Cropper selon la région
        cropped = image.crop((
            region.x,
            region.y, 
            region.x + region.width,
            region.y + region.height
        ))
        
        # Sauvegarder temporairement
        temp_path = f"temp/region_{i}_{uuid.uuid4()}.jpg"
        cropped.save(temp_path)
        
        try:
            # Traiter la région
            result = await self.process_image(temp_path)
            results.append(result)
        finally:
            # Nettoyer
            Path(temp_path).unlink(missing_ok=True)
    
    return results
```

## Configuration et Variables d'Environnement

Ajoutez au `.env` :

```bash
# Configuration OCR Zones
ENABLE_OCR_ZONES=true
MAX_ZONES_PER_REQUEST=10
ZONE_PROCESSING_TIMEOUT=60
TEMP_FILES_CLEANUP_INTERVAL=3600

# Limites de performance
MAX_ZONE_SIZE_MB=10
MAX_TOTAL_ZONES_SIZE_MB=50
```

## Tests Backend

Créez `tests/api/test_ocr_zones.py` :

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

def test_process_with_zones():
    """Test du traitement avec zones"""
    
    # Fichier de test
    test_file = open("tests/fixtures/test_image.jpg", "rb")
    
    # Zones de test
    regions = [
        {"x": 100, "y": 100, "width": 200, "height": 150},
        {"x": 300, "y": 200, "width": 150, "height": 100}
    ]
    
    response = client.post(
        "/api/v1/ocr/process-with-zones",
        files={"file": test_file},
        data={
            "regions": json.dumps(regions),
            "language": "fra",
            "detail_level": "medium",
            "include_full_image": True,
            "merge_results": True
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "filename" in data
    assert "zones" in data
    assert len(data["zones"]) == 2
    assert data["zones"][0]["text"] is not None
    assert data["total_processing_time"] > 0


def test_preview_zones():
    """Test de la prévisualisation"""
    
    test_file = open("tests/fixtures/test_image.jpg", "rb") 
    regions = [{"x": 50, "y": 50, "width": 100, "height": 80}]
    
    response = client.post(
        "/api/v1/ocr/preview-zones",
        files={"file": test_file},
        data={"regions": json.dumps(regions)}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "previews" in data
    assert len(data["previews"]) == 1
    assert data["previews"][0]["image_data"].startswith("data:image/jpeg;base64,")


def test_suggest_zones():
    """Test de suggestion automatique"""
    
    test_file = open("tests/fixtures/test_image.jpg", "rb")
    
    response = client.post(
        "/api/v1/ocr/suggest-zones", 
        files={"file": test_file},
        data={"detect_regions": True}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "suggested_regions" in data
    assert isinstance(data["suggested_regions"], list)
```

## Monitoring et Logs

Ajoutez des logs spécifiques pour les zones :

```python
# app/core/logging.py - Extension

import logging
from typing import Dict, Any

def log_zone_processing(
    filename: str,
    zones_count: int, 
    processing_time: float,
    success: bool,
    error: str = None
):
    """Logger spécialisé pour le traitement de zones"""
    
    logger = logging.getLogger("ocr.zones")
    
    log_data = {
        "filename": filename,
        "zones_count": zones_count,
        "processing_time": processing_time,
        "success": success,
        "error": error
    }
    
    if success:
        logger.info(f"Zones processing completed: {log_data}")
    else:
        logger.error(f"Zones processing failed: {log_data}")
```

## Migration et Déploiement

### 1. Script de migration

```bash
#!/bin/bash
# scripts/deploy_zones_feature.sh

echo "Déploiement de la fonctionnalité zones OCR..."

# Sauvegarder la configuration actuelle
cp app/main.py app/main.py.bak

# Installer nouvelles dépendances
pip install -r requirements.txt

# Créer dossier temporaire pour zones
mkdir -p temp

# Redémarrer le service
systemctl restart omniscan-backend

echo "Déploiement terminé !"
```

### 2. Vérifications post-déploiement

```python
# scripts/verify_zones_deployment.py

import requests
import json

def verify_zones_endpoint():
    """Vérifier que l'endpoint zones fonctionne"""
    
    # Test avec un fichier minimal
    test_data = {
        "regions": json.dumps([{"x": 0, "y": 0, "width": 100, "height": 100}]),
        "language": "auto",
        "detail_level": "medium"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/ocr/process-with-zones",
            data=test_data,
            files={"file": ("test.jpg", b"fake_image_data", "image/jpeg")}
        )
        
        if response.status_code == 200:
            print("✅ Endpoint zones opérationnel")
            return True
        else:
            print(f"❌ Erreur endpoint: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur connexion: {e}")
        return False

if __name__ == "__main__":
    verify_zones_endpoint()
```

## Performance et Optimisations

### 1. Cache des régions

```python
# app/services/ocr/zone_cache.py

import hashlib
from typing import List, Optional
from app.services.ocr.base import BoundingBox, OCRResult

class ZoneCache:
    """Cache pour éviter de retraiter les mêmes zones"""
    
    def __init__(self):
        self._cache = {}
    
    def get_cache_key(self, file_hash: str, regions: List[BoundingBox]) -> str:
        """Générer clé de cache pour fichier + régions"""
        regions_str = json.dumps(sorted([
            {"x": r.x, "y": r.y, "w": r.width, "h": r.height}
            for r in regions
        ]))
        return hashlib.md5(f"{file_hash}_{regions_str}".encode()).hexdigest()
    
    def get(self, cache_key: str) -> Optional[List[OCRResult]]:
        """Récupérer du cache"""
        return self._cache.get(cache_key)
    
    def set(self, cache_key: str, results: List[OCRResult]):
        """Sauvegarder en cache"""
        self._cache[cache_key] = results
        
        # Nettoyer si trop gros (simple LRU)
        if len(self._cache) > 1000:
            # Supprimer les 200 plus anciens
            old_keys = list(self._cache.keys())[:200]
            for key in old_keys:
                del self._cache[key]
```

### 2. Traitement parallèle

```python
# Traitement parallèle des zones (dans ocr_zones.py)

import asyncio
from concurrent.futures import ThreadPoolExecutor

async def process_zones_parallel(zones: List[BoundingBox], image: Image.Image, config: OCRConfig):
    """Traiter plusieurs zones en parallèle"""
    
    loop = asyncio.get_event_loop()
    
    with ThreadPoolExecutor(max_workers=4) as executor:
        tasks = []
        
        for i, zone in enumerate(zones):
            task = loop.run_in_executor(
                executor,
                process_single_zone,
                image, zone, config, i
            )
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filtrer les exceptions
    valid_results = [r for r in results if not isinstance(r, Exception)]
    return valid_results
```

Cette implémentation backend s'intègre parfaitement avec l'architecture OCR existante et fournit tous les endpoints nécessaires pour la fonctionnalité frontend de sélection de zones.