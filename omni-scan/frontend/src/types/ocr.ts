/**
 * Types pour le système OCR et sélection de zones
 */

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  confidence?: number
}

export interface SelectedZone extends BoundingBox {
  id: string
  label?: string
  color?: string
}

export interface OCRRegionConfig {
  regions: BoundingBox[]
  extractTables?: boolean
  extractFormulas?: boolean
  language?: string
  detailLevel?: 'short' | 'medium' | 'detailed' | 'high'
}

export interface ImageDimensions {
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
  scale: number
}

export interface ZoneSelectorState {
  isSelecting: boolean
  selectedZones: SelectedZone[]
  previewMode: boolean
  dragStart?: { x: number; y: number }
  dragEnd?: { x: number; y: number }
}

export interface OCRWithZonesOptions {
  zones?: SelectedZone[]
  includeFullImage?: boolean
  mergeResults?: boolean
  language?: string
  detailLevel?: 'short' | 'medium' | 'detailed' | 'high'
}