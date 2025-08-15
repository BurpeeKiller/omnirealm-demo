import { useState, useCallback, useRef } from 'react'
import { SelectedZone, ZoneSelectorState, ImageDimensions } from '@/types/ocr'

interface UseImageZoneSelectorProps {
  imageDimensions?: ImageDimensions
  maxZones?: number
  onZonesChange?: (zones: SelectedZone[]) => void
}

export const useImageZoneSelector = ({
  imageDimensions,
  maxZones = 10,
  onZonesChange
}: UseImageZoneSelectorProps = {}) => {
  const [state, setState] = useState<ZoneSelectorState>({
    isSelecting: false,
    selectedZones: [],
    previewMode: false
  })

  const zoneIdCounter = useRef(0)

  // Génération d'ID unique pour les zones
  const generateZoneId = useCallback((): string => {
    zoneIdCounter.current += 1
    return `zone_${zoneIdCounter.current}`
  }, [])

  // Génération de couleur pour une zone
  const generateZoneColor = useCallback((index: number): string => {
    const colors = [
      '#3B82F6', // blue
      '#EF4444', // red
      '#10B981', // emerald
      '#F59E0B', // amber
      '#8B5CF6', // violet
      '#06B6D4', // cyan
      '#F97316', // orange
      '#84CC16', // lime
      '#EC4899', // pink
      '#6B7280'  // gray
    ]
    return colors[index % colors.length]
  }, [])

  // Démarrer la sélection
  const startSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSelecting: true,
      dragStart: undefined,
      dragEnd: undefined
    }))
  }, [])

  // Arrêter la sélection
  const stopSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSelecting: false,
      dragStart: undefined,
      dragEnd: undefined
    }))
  }, [])

  // Commencer le drag
  const handleDragStart = useCallback((x: number, y: number) => {
    if (!state.isSelecting || state.selectedZones.length >= maxZones) return

    setState(prev => ({
      ...prev,
      dragStart: { x, y },
      dragEnd: { x, y }
    }))
  }, [state.isSelecting, state.selectedZones.length, maxZones])

  // Continuer le drag
  const handleDragMove = useCallback((x: number, y: number) => {
    if (!state.isSelecting || !state.dragStart) return

    setState(prev => ({
      ...prev,
      dragEnd: { x, y }
    }))
  }, [state.isSelecting, state.dragStart])

  // Terminer le drag et créer une zone
  const handleDragEnd = useCallback(() => {
    if (!state.isSelecting || !state.dragStart || !state.dragEnd || !imageDimensions) return

    const { dragStart, dragEnd } = state
    
    // Calculer les dimensions de la zone en coordonnées absolues
    const minX = Math.min(dragStart.x, dragEnd.x)
    const minY = Math.min(dragStart.y, dragEnd.y)
    const maxX = Math.max(dragStart.x, dragEnd.x)
    const maxY = Math.max(dragStart.y, dragEnd.y)
    
    // Minimum 10x10 pixels pour être valide
    if (maxX - minX < 10 || maxY - minY < 10) {
      setState(prev => ({
        ...prev,
        dragStart: undefined,
        dragEnd: undefined
      }))
      return
    }

    // Convertir en coordonnées relatives à l'image originale
    const x = Math.round((minX / imageDimensions.width) * imageDimensions.naturalWidth)
    const y = Math.round((minY / imageDimensions.height) * imageDimensions.naturalHeight)
    const width = Math.round(((maxX - minX) / imageDimensions.width) * imageDimensions.naturalWidth)
    const height = Math.round(((maxY - minY) / imageDimensions.height) * imageDimensions.naturalHeight)

    const newZone: SelectedZone = {
      id: generateZoneId(),
      x,
      y,
      width,
      height,
      color: generateZoneColor(state.selectedZones.length),
      label: `Zone ${state.selectedZones.length + 1}`
    }

    const newZones = [...state.selectedZones, newZone]
    
    setState(prev => ({
      ...prev,
      selectedZones: newZones,
      dragStart: undefined,
      dragEnd: undefined
    }))

    onZonesChange?.(newZones)
  }, [state.isSelecting, state.dragStart, state.dragEnd, state.selectedZones, imageDimensions, generateZoneId, generateZoneColor, onZonesChange])

  // Supprimer une zone
  const removeZone = useCallback((zoneId: string) => {
    const newZones = state.selectedZones.filter(zone => zone.id !== zoneId)
    setState(prev => ({ ...prev, selectedZones: newZones }))
    onZonesChange?.(newZones)
  }, [state.selectedZones, onZonesChange])

  // Supprimer toutes les zones
  const clearZones = useCallback(() => {
    setState(prev => ({ ...prev, selectedZones: [] }))
    onZonesChange?.([])
  }, [onZonesChange])

  // Sélectionner toute l'image
  const selectFullImage = useCallback(() => {
    if (!imageDimensions) return

    const fullImageZone: SelectedZone = {
      id: generateZoneId(),
      x: 0,
      y: 0,
      width: imageDimensions.naturalWidth,
      height: imageDimensions.naturalHeight,
      color: generateZoneColor(0),
      label: 'Image complète'
    }

    setState(prev => ({ 
      ...prev, 
      selectedZones: [fullImageZone],
      isSelecting: false
    }))
    onZonesChange?.([fullImageZone])
  }, [imageDimensions, generateZoneId, generateZoneColor, onZonesChange])

  // Toggle preview mode
  const togglePreview = useCallback(() => {
    setState(prev => ({ ...prev, previewMode: !prev.previewMode }))
  }, [])

  // Calculer la zone de drag actuelle pour l'affichage
  const getCurrentDragZone = useCallback(() => {
    if (!state.dragStart || !state.dragEnd) return null

    const minX = Math.min(state.dragStart.x, state.dragEnd.x)
    const minY = Math.min(state.dragStart.y, state.dragEnd.y)
    const maxX = Math.max(state.dragStart.x, state.dragEnd.x)
    const maxY = Math.max(state.dragStart.y, state.dragEnd.y)

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }, [state.dragStart, state.dragEnd])

  return {
    // State
    isSelecting: state.isSelecting,
    selectedZones: state.selectedZones,
    previewMode: state.previewMode,
    canAddZone: state.selectedZones.length < maxZones,
    
    // Actions
    startSelection,
    stopSelection,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    removeZone,
    clearZones,
    selectFullImage,
    togglePreview,
    
    // Computed
    currentDragZone: getCurrentDragZone(),
    hasZones: state.selectedZones.length > 0
  }
}