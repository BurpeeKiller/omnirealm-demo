# Guide d'Intégration - Interface de Sélection de Zones OCR

## Installation et Intégration

### 1. Ajout à une page existante

Pour intégrer le composant complet dans une page existante :

```tsx
// pages/OCRWithZones.tsx
import { UploadWithZones } from '@/components/ocr'

export default function OCRWithZonesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">OCR avec Sélection de Zones</h1>
        <p className="text-gray-600">
          Sélectionnez des zones spécifiques dans votre document pour un OCR ciblé
        </p>
      </div>
      
      <UploadWithZones />
    </div>
  )
}
```

### 2. Intégration personnalisée

Pour un contrôle plus fin, utilisez les composants séparément :

```tsx
// components/CustomOCRWorkflow.tsx
import { useState } from 'react'
import { DropZone } from '@/components/upload/DropZone'
import { ImageZoneSelector } from '@/components/ocr'
import { ocrZonesService } from '@/components/ocr'
import type { SelectedZone, OCRWithZonesResult } from '@/components/ocr'

export function CustomOCRWorkflow() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [zones, setZones] = useState<SelectedZone[]>([])
  const [results, setResults] = useState<OCRWithZonesResult | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = (files: File[]) => {
    if (files[0]) {
      setFile(files[0])
      setImageUrl(URL.createObjectURL(files[0]))
    }
  }

  const processDocument = async () => {
    if (!file) return
    
    setProcessing(true)
    try {
      const result = await ocrZonesService.processWithZones(file, {
        zones,
        includeFullImage: zones.length === 0,
        mergeResults: true,
        language: 'auto',
        detailLevel: 'medium'
      })
      setResults(result)
    } catch (error) {
      console.error('Erreur OCR:', error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <DropZone onDrop={handleFileUpload} />
      ) : (
        <>
          <ImageZoneSelector
            imageUrl={imageUrl}
            onZonesChange={setZones}
            maxZones={8}
          />
          
          <div className="flex gap-2">
            <button 
              onClick={processDocument}
              disabled={processing}
              className="btn btn-primary"
            >
              {processing ? 'Traitement...' : 'Lancer OCR'}
            </button>
            
            <button 
              onClick={() => {setFile(null); setImageUrl(''); setZones([])}}
              className="btn btn-secondary"
            >
              Nouveau document
            </button>
          </div>
          
          {results && (
            <div className="mt-6">
              <h3 className="font-bold mb-3">Résultats :</h3>
              {results.zones.map(zone => (
                <div key={zone.zoneId} className="border p-3 mb-2 rounded">
                  <h4 className="font-medium">{zone.zone.label}</h4>
                  <p className="text-sm text-gray-600">{zone.extractedText}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

### 3. Ajout au router principal

```tsx
// App.tsx ou router principal
import { UploadWithZones } from '@/components/ocr'

// Dans vos routes
<Route path="/ocr-zones" element={<UploadWithZones />} />
```

### 4. Types personnalisés

Si vous avez besoin d'étendre les types :

```tsx
// types/custom-ocr.ts
import type { SelectedZone, OCRWithZonesResult } from '@/components/ocr'

export interface ExtendedZone extends SelectedZone {
  category?: 'text' | 'table' | 'image' | 'formula'
  priority?: number
  metadata?: Record<string, any>
}

export interface CustomOCRResult extends OCRWithZonesResult {
  documentType?: string
  confidence?: number
  suggestions?: string[]
}
```

## Configuration Backend

### 1. Endpoint requis

Créez l'endpoint `/api/v1/ocr/process-with-zones` dans votre backend :

```python
# backend/app/api/ocr_zones.py
from fastapi import APIRouter, File, Form, UploadFile
from typing import List, Optional
import json

router = APIRouter()

@router.post("/process-with-zones")
async def process_with_zones(
    file: UploadFile = File(...),
    regions: str = Form(...),  # JSON string des BoundingBox
    language: str = Form("auto"),
    detail_level: str = Form("medium"),
    include_full_image: bool = Form(False),
    merge_results: bool = Form(True)
):
    # Parser les régions
    regions_data = json.loads(regions)
    
    # Utiliser l'OCRManager existant avec les régions
    from app.services.ocr.manager import get_ocr_manager
    from app.services.ocr.base import OCRConfig, BoundingBox
    
    # Convertir en BoundingBox
    bounding_boxes = [
        BoundingBox(x=r["x"], y=r["y"], width=r["width"], height=r["height"])
        for r in regions_data
    ]
    
    config = OCRConfig(
        languages=[language] if language != "auto" else ["fra", "eng"],
        regions=bounding_boxes,
        extract_tables=True,
        extract_formulas=True
    )
    
    ocr_manager = get_ocr_manager()
    
    # Traitement par zones
    zone_results = []
    for i, bbox in enumerate(bounding_boxes):
        # Créer une config pour cette zone spécifique
        zone_config = OCRConfig(
            languages=config.languages,
            regions=[bbox]  # Une seule région
        )
        
        result = await ocr_manager.process_document(
            file.filename, 
            file.content_type.split('/')[-1], 
            zone_config
        )
        
        zone_results.append({
            "text": result.text,
            "confidence": result.confidence,
            "processing_time": result.processing_time,
            "ai_analysis": result.json_data
        })
    
    # Traitement image complète si demandé
    full_result = None
    if include_full_image:
        full_config = OCRConfig(languages=config.languages)
        full_result = await ocr_manager.process_document(
            file.filename,
            file.content_type.split('/')[-1],
            full_config
        )
    
    # Fusionner les résultats si demandé
    merged_text = None
    if merge_results and zone_results:
        merged_text = "\n\n".join([zr["text"] for zr in zone_results])
    
    return {
        "filename": file.filename,
        "zones": zone_results,
        "full_image_result": {
            "text": full_result.text,
            "ai_analysis": full_result.json_data
        } if full_result else None,
        "total_processing_time": sum(zr["processing_time"] for zr in zone_results),
        "merged_text": merged_text
    }
```

### 2. Mise à jour de l'OCRConfig existant

Vérifiez que votre `OCRConfig` supporte les régions (déjà fait dans votre base.py) :

```python
# backend/app/services/ocr/base.py - Déjà implémenté
@dataclass
class OCRConfig:
    # ...
    regions: Optional[List[BoundingBox]] = None  # ✅ Déjà présent
    # ...
```

### 3. Extension des moteurs OCR

Si vos moteurs ne supportent pas encore les régions, ajoutez le support :

```python
# backend/app/services/ocr/tesseract.py (exemple)
async def process_image_with_regions(
    self, 
    image: Image.Image, 
    regions: List[BoundingBox]
) -> List[OCRResult]:
    results = []
    for region in regions:
        # Cropper l'image selon la région
        cropped = image.crop((
            region.x, 
            region.y, 
            region.x + region.width, 
            region.y + region.height
        ))
        
        # Traiter la zone croppée
        result = await self.process_image(cropped)
        results.append(result)
    
    return results
```

## Tests d'Intégration

### 1. Tests E2E avec Playwright

```typescript
// tests/e2e/ocr-zones.spec.ts
import { test, expect } from '@playwright/test'

test.describe('OCR avec Zones', () => {
  test('workflow complet de sélection et traitement', async ({ page }) => {
    await page.goto('/ocr-zones')
    
    // Upload d'un fichier
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-fixtures/sample-document.jpg')
    
    // Attendre le chargement de l'image
    await expect(page.locator('canvas')).toBeVisible()
    
    // Cliquer sur "Sélectionner" pour activer le mode sélection
    await page.click('button:has-text("Sélectionner")')
    
    // Simuler une sélection de zone (drag)
    const canvas = page.locator('canvas')
    await canvas.dragTo(canvas, {
      sourcePosition: { x: 50, y: 50 },
      targetPosition: { x: 200, y: 150 }
    })
    
    // Vérifier qu'une zone a été créée
    await expect(page.locator('text=1 zone(s) sélectionnée(s)')).toBeVisible()
    
    // Lancer le traitement OCR
    await page.click('button:has-text("Démarrer l\'OCR")')
    
    // Attendre les résultats
    await expect(page.locator('text=Résultats de l\'extraction')).toBeVisible()
    
    // Vérifier qu'il y a du texte extrait
    await expect(page.locator('.text-sm.bg-gray-50')).toContainText(/\w+/)
  })
  
  test('gestion des erreurs', async ({ page }) => {
    // Mock d'une erreur API
    await page.route('/api/v1/ocr/process-with-zones', route => 
      route.abort('failed')
    )
    
    await page.goto('/ocr-zones')
    
    // Upload et sélection...
    // Vérifier que le fallback fonctionne
    await expect(page.locator('text=Erreur')).toBeVisible()
  })
})
```

### 2. Tests d'intégration API

```typescript
// tests/integration/api-integration.test.ts
import { ocrZonesService } from '@/services/ocr-zones.service'

describe('Intégration API OCR Zones', () => {
  test('traitement réel avec backend', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const zones = [{
      id: 'test-zone',
      x: 100, y: 100, width: 200, height: 150,
      label: 'Zone test',
      color: '#3B82F6'
    }]
    
    const result = await ocrZonesService.processWithZones(file, { zones })
    
    expect(result.success).toBe(true)
    expect(result.zones).toHaveLength(1)
    expect(result.zones[0].extractedText).toBeTruthy()
  })
})
```

## Monitoring et Analytics

### 1. Tracking des utilisations

```typescript
// utils/analytics.ts
export function trackOCRZoneUsage(eventData: {
  zonesCount: number
  documentType: string
  processingTime: number
  success: boolean
}) {
  // Votre système d'analytics (Plausible, GA, etc.)
  if (window.plausible) {
    window.plausible('OCR Zone Selection', {
      props: {
        zones_count: eventData.zonesCount,
        document_type: eventData.documentType,
        processing_time: eventData.processingTime,
        success: eventData.success.toString()
      }
    })
  }
}

// Dans UploadWithZones.tsx
const processDocument = async () => {
  // ... traitement ...
  
  trackOCRZoneUsage({
    zonesCount: selectedZones.length,
    documentType: file.type,
    processingTime: results.totalProcessingTime,
    success: results.success
  })
}
```

### 2. Métriques de performance

```typescript
// utils/performance.ts
export class OCRPerformanceMonitor {
  private startTime: number = 0
  
  start() {
    this.startTime = performance.now()
  }
  
  end(stage: string) {
    const duration = performance.now() - this.startTime
    console.log(`OCR ${stage}: ${duration.toFixed(2)}ms`)
    
    // Envoyer à votre système de monitoring
    this.sendMetric(stage, duration)
  }
  
  private sendMetric(stage: string, duration: number) {
    // Implémenter selon votre système de monitoring
  }
}
```

## Déploiement

### 1. Variables d'environnement

```bash
# .env
VITE_OCR_ZONES_ENABLED=true
VITE_MAX_ZONES_PER_IMAGE=10
VITE_OCR_TIMEOUT=30000
```

### 2. Feature flags

```typescript
// lib/features.ts
export const features = {
  ocrZones: process.env.VITE_OCR_ZONES_ENABLED === 'true',
  maxZones: parseInt(process.env.VITE_MAX_ZONES_PER_IMAGE || '10'),
  ocrTimeout: parseInt(process.env.VITE_OCR_TIMEOUT || '30000')
}

// Utilisation conditionnelle
if (features.ocrZones) {
  // Afficher l'interface de zones
}
```

## Migration depuis l'OCR Simple

Pour migrer une page existante utilisant l'OCR simple :

```tsx
// Avant
import { Upload } from '@/components/upload/Upload'

// Après
import { UploadWithZones } from '@/components/ocr'

// Ou pour un remplacement progressif
import { Upload } from '@/components/upload/Upload'
import { UploadWithZones } from '@/components/ocr'
import { features } from '@/lib/features'

function OCRPage() {
  return features.ocrZones ? <UploadWithZones /> : <Upload />
}
```

Ceci assure une migration progressive et permet de tester la nouvelle fonctionnalité avec un sous-ensemble d'utilisateurs.