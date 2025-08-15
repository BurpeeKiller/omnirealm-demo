# Interface de Sélection de Zones OCR pour OmniScan

## Vue d'ensemble

Cette implémentation ajoute la fonctionnalité de sélection interactive de zones pour l'OCR dans OmniScan. Les utilisateurs peuvent sélectionner des zones spécifiques dans une image avant le traitement OCR pour améliorer la précision et traiter uniquement les parties pertinentes du document.

## Composants

### 1. `ImageZoneSelector`

Composant principal permettant la sélection interactive de zones rectangulaires sur une image.

**Props :**
- `imageUrl: string` - URL de l'image à afficher
- `onZonesChange?: (zones: SelectedZone[]) => void` - Callback appelé quand les zones changent
- `maxZones?: number` - Nombre maximum de zones (défaut: 10)
- `className?: string` - Classes CSS additionnelles
- `disabled?: boolean` - Désactiver l'interaction

**Fonctionnalités :**
- Sélection par glisser-déposer avec canvas overlay
- Multi-zones avec couleurs distinctes
- Boutons de suppression individuels sur chaque zone
- Mode preview pour visualiser les zones sélectionnées
- Boutons "Tout sélectionner" et "Reset"
- Adaptation responsive aux dimensions de l'image

### 2. `UploadWithZones`

Composant intégré combinant upload de fichier et sélection de zones avec traitement OCR.

**Props :**
- `className?: string` - Classes CSS additionnelles

**Workflow :**
1. **Upload** : Sélection du document/image
2. **Zones** : Sélection interactive des zones d'intérêt
3. **Traitement** : OCR avec indicateur de progression
4. **Résultats** : Affichage des résultats par zone et globaux

## Hooks

### `useImageZoneSelector`

Hook personnalisé gérant la logique de sélection de zones.

**Paramètres :**
```typescript
{
  imageDimensions?: ImageDimensions
  maxZones?: number
  onZonesChange?: (zones: SelectedZone[]) => void
}
```

**Retour :**
```typescript
{
  // État
  isSelecting: boolean
  selectedZones: SelectedZone[]
  previewMode: boolean
  canAddZone: boolean
  hasZones: boolean
  
  // Actions
  startSelection: () => void
  stopSelection: () => void
  handleDragStart: (x: number, y: number) => void
  handleDragMove: (x: number, y: number) => void
  handleDragEnd: () => void
  removeZone: (zoneId: string) => void
  clearZones: () => void
  selectFullImage: () => void
  togglePreview: () => void
  
  // Calculé
  currentDragZone: BoundingBox | null
}
```

## Services

### `ocrZonesService`

Service gérant l'intégration avec l'API OCR pour le traitement par zones.

**Méthodes principales :**

```typescript
// Traitement OCR avec zones
processWithZones(file: File, options: OCRWithZonesOptions): Promise<OCRWithZonesResult>

// Prévisualisation des zones
previewZones(file: File, zones: SelectedZone[]): Promise<{
  success: boolean
  previews: Array<{
    zoneId: string
    imageData: string
    estimatedTextLength: number
  }>
}>

// Suggestion automatique de zones
suggestZones(file: File): Promise<{
  success: boolean
  suggestedZones: SelectedZone[]
}>
```

## Types TypeScript

### `SelectedZone`
```typescript
interface SelectedZone extends BoundingBox {
  id: string
  label?: string
  color?: string
}
```

### `BoundingBox`
```typescript
interface BoundingBox {
  x: number      // Position X en pixels (image originale)
  y: number      // Position Y en pixels (image originale)
  width: number  // Largeur en pixels
  height: number // Hauteur en pixels
  confidence?: number // Confiance de détection (0-1)
}
```

### `OCRWithZonesResult`
```typescript
interface OCRWithZonesResult {
  success: boolean
  filename: string
  zones: OCRZoneResult[]           // Résultats par zone
  fullImageResult?: {              // Résultat image complète
    extractedText: string
    aiAnalysis: any
    confidence: number
  }
  totalProcessingTime: number
  mergedText?: string              // Texte fusionné de toutes les zones
}
```

## Utilisation

### Utilisation basique

```tsx
import { ImageZoneSelector } from '@/components/ocr/ImageZoneSelector'
import { useState } from 'react'

function MyComponent() {
  const [zones, setZones] = useState([])
  
  return (
    <ImageZoneSelector
      imageUrl="/path/to/image.jpg"
      onZonesChange={setZones}
      maxZones={5}
    />
  )
}
```

### Utilisation complète avec traitement

```tsx
import { UploadWithZones } from '@/components/ocr/UploadWithZones'

function OCRPage() {
  return (
    <div className="container mx-auto p-4">
      <h1>OCR avec Sélection de Zones</h1>
      <UploadWithZones />
    </div>
  )
}
```

### Traitement programmatique

```tsx
import { ocrZonesService } from '@/services/ocr-zones.service'

async function processDocument(file: File, zones: SelectedZone[]) {
  try {
    const result = await ocrZonesService.processWithZones(file, {
      zones,
      includeFullImage: true,
      mergeResults: true,
      language: 'fra',
      detailLevel: 'detailed'
    })
    
    console.log('Zones traitées:', result.zones)
    console.log('Texte fusionné:', result.mergedText)
  } catch (error) {
    console.error('Erreur OCR:', error)
  }
}
```

## Configuration Backend

### Endpoint `/api/v1/ocr/process-with-zones`

Le service frontend s'attend à ce que le backend expose un endpoint qui accepte :

**FormData :**
- `file: File` - Document à traiter
- `regions: string` - JSON des zones sélectionnées (`BoundingBox[]`)
- `language: string` - Code langue ('auto', 'fra', 'eng', etc.)
- `detail_level: string` - Niveau de détail ('short', 'medium', 'detailed', 'high')
- `include_full_image: boolean` - Inclure le traitement de l'image complète
- `merge_results: boolean` - Fusionner les résultats des zones

**Réponse attendue :**
```json
{
  "filename": "document.pdf",
  "zones": [
    {
      "text": "Texte extrait de la zone",
      "confidence": 0.95,
      "processing_time": 1.2,
      "ai_analysis": {...}
    }
  ],
  "full_image_result": {
    "text": "Texte complet",
    "ai_analysis": {...}
  },
  "total_processing_time": 3.5,
  "merged_text": "Texte fusionné"
}
```

## Tests

Les tests couvrent :
- **Hook `useImageZoneSelector`** : Logique de sélection, drag & drop, gestion des zones
- **Service `ocrZonesService`** : Intégration API, gestion d'erreurs, fallback

Commandes de test :
```bash
# Tests unitaires
pnpm test src/hooks/__tests__/useImageZoneSelector.test.ts
pnpm test src/services/__tests__/ocr-zones.service.test.ts

# Tous les tests OCR
pnpm test -- --testPathPattern="ocr"
```

## Optimisations et Améliorations Futures

### Phase 2
- **Zones non-rectangulaires** : Support des polygones
- **Suggestion automatique** : IA pour détecter automatiquement les zones d'intérêt
- **Rotation des zones** : Support des zones orientées
- **Zoom et pan** : Navigation dans les grandes images

### Phase 3
- **Annotation collaborative** : Partage et révision des zones
- **Templates de zones** : Sauvegarde de modèles réutilisables
- **OCR en temps réel** : Prévisualisation du texte pendant la sélection
- **Intégration mobile** : Optimisation tactile

## Architecture

```
src/
├── components/ocr/
│   ├── ImageZoneSelector.tsx    # Composant principal de sélection
│   ├── UploadWithZones.tsx      # Workflow complet intégré
│   └── README.md                # Cette documentation
├── hooks/
│   ├── useImageZoneSelector.ts  # Logique de sélection
│   └── __tests__/
├── services/
│   ├── ocr-zones.service.ts     # Service API intégration
│   └── __tests__/
└── types/
    └── ocr.ts                   # Types TypeScript
```

## Dépendances

- **React** : Composants et hooks
- **Lucide React** : Icônes
- **@/components/ui** : Composants de base (Button, Card, Select)
- **Canvas API** : Dessin des overlays de sélection
- **File API** : Manipulation des fichiers uploadés

## Compatibilité

- **Navigateurs modernes** avec support Canvas et File API
- **Mobile** : Support tactile pour la sélection
- **Accessibilité** : Navigation clavier et lecteurs d'écran