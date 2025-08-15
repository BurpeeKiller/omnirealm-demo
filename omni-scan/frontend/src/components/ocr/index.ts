// Barrel export pour les composants OCR avec sélection de zones
export { ImageZoneSelector } from './ImageZoneSelector'
export { UploadWithZones } from './UploadWithZones'

// Types réexportés pour facilité d'utilisation
export type {
  SelectedZone,
  BoundingBox,
  ImageDimensions,
  OCRWithZonesOptions,
  ZoneSelectorState
} from '@/types/ocr'

// Hooks
export { useImageZoneSelector } from '@/hooks/useImageZoneSelector'

// Services
export { ocrZonesService } from '@/services/ocr-zones.service'
export type {
  OCRZoneResult,
  OCRWithZonesResult
} from '@/services/ocr-zones.service'