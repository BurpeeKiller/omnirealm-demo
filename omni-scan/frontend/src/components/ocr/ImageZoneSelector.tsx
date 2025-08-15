import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Trash2, Square, Eye, EyeOff, RotateCcw, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useImageZoneSelector } from '@/hooks/useImageZoneSelector'
import { SelectedZone, ImageDimensions } from '@/types/ocr'
import { cn } from '@/lib/utils'

interface ImageZoneSelectorProps {
  imageUrl: string
  onZonesChange?: (zones: SelectedZone[]) => void
  maxZones?: number
  className?: string
  disabled?: boolean
}

export const ImageZoneSelector: React.FC<ImageZoneSelectorProps> = ({
  imageUrl,
  onZonesChange,
  maxZones = 10,
  className,
  disabled = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const {
    isSelecting,
    selectedZones,
    previewMode,
    canAddZone,
    startSelection,
    stopSelection,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    removeZone,
    clearZones,
    selectFullImage,
    togglePreview,
    currentDragZone,
    hasZones
  } = useImageZoneSelector({
    imageDimensions: imageDimensions || undefined,
    maxZones,
    onZonesChange
  })

  // Calculer les dimensions de l'image et sa taille d'affichage
  const updateImageDimensions = useCallback(() => {
    const image = imageRef.current
    const container = containerRef.current
    
    if (!image || !container || !image.naturalWidth || !image.naturalHeight) return

    const containerRect = container.getBoundingClientRect()
    const maxWidth = containerRect.width || 800
    const maxHeight = 600

    const scale = Math.min(
      maxWidth / image.naturalWidth,
      maxHeight / image.naturalHeight,
      1
    )

    const displayWidth = image.naturalWidth * scale
    const displayHeight = image.naturalHeight * scale

    setImageDimensions({
      width: displayWidth,
      height: displayHeight,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      scale
    })
  }, [])

  // Dessiner le canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (!canvas || !ctx || !imageDimensions) return

    // Réinitialiser le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dessiner les zones sélectionnées
    selectedZones.forEach((zone, index) => {
      // Convertir les coordonnées de l'image originale vers l'affichage
      const x = (zone.x / imageDimensions.naturalWidth) * imageDimensions.width
      const y = (zone.y / imageDimensions.naturalHeight) * imageDimensions.height
      const width = (zone.width / imageDimensions.naturalWidth) * imageDimensions.width
      const height = (zone.height / imageDimensions.naturalHeight) * imageDimensions.height

      // Contour de la zone
      ctx.strokeStyle = zone.color || '#3B82F6'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      // Fond semi-transparent en mode preview
      if (previewMode) {
        ctx.fillStyle = `${zone.color || '#3B82F6'}20`
        ctx.fillRect(x, y, width, height)
      }

      // Label de la zone
      if (!previewMode) {
        ctx.fillStyle = zone.color || '#3B82F6'
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif'
        ctx.fillText(zone.label || `Zone ${index + 1}`, x + 4, y - 8)

        // Bouton de suppression (petite croix)
        const closeX = x + width - 20
        const closeY = y + 4
        ctx.fillStyle = '#EF4444'
        ctx.fillRect(closeX, closeY, 16, 16)
        ctx.fillStyle = 'white'
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('×', closeX + 8, closeY + 12)
        ctx.textAlign = 'start'
      }
    })

    // Dessiner la zone en cours de sélection
    if (currentDragZone && isSelecting) {
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(
        currentDragZone.x,
        currentDragZone.y,
        currentDragZone.width,
        currentDragZone.height
      )
      ctx.setLineDash([])
    }
  }, [imageDimensions, selectedZones, currentDragZone, isSelecting, previewMode])

  // Gérer le clic sur le canvas
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (disabled || previewMode) return

    const canvas = canvasRef.current
    if (!canvas || !imageDimensions) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Vérifier si on clique sur le bouton de suppression d'une zone
    for (const zone of selectedZones) {
      const zoneX = (zone.x / imageDimensions.naturalWidth) * imageDimensions.width
      const zoneY = (zone.y / imageDimensions.naturalHeight) * imageDimensions.height
      const zoneWidth = (zone.width / imageDimensions.naturalWidth) * imageDimensions.width
      
      const closeX = zoneX + zoneWidth - 20
      const closeY = zoneY + 4
      
      if (x >= closeX && x <= closeX + 16 && y >= closeY && y <= closeY + 16) {
        removeZone(zone.id)
        return
      }
    }

    // Sinon, gérer la sélection normale si activée
    if (isSelecting) {
      if (!currentDragZone) {
        handleDragStart(x, y)
      }
    }
  }, [disabled, previewMode, imageDimensions, selectedZones, isSelecting, currentDragZone, removeZone, handleDragStart])

  // Gérer le mouvement de la souris
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (disabled || !isSelecting || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    handleDragMove(x, y)
  }, [disabled, isSelecting, handleDragMove])

  // Gérer le relâchement de la souris
  const handleMouseUp = useCallback(() => {
    if (disabled || !isSelecting) return
    handleDragEnd()
  }, [disabled, isSelecting, handleDragEnd])

  // Redessiner quand les dimensions ou zones changent
  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // Charger l'image
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    updateImageDimensions()
  }, [updateImageDimensions])

  // Redimensionner quand la fenêtre change
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateImageDimensions, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateImageDimensions])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Barre d'outils */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={isSelecting ? 'default' : 'outline'}
            size="sm"
            onClick={isSelecting ? stopSelection : startSelection}
            disabled={disabled || !canAddZone}
          >
            <Square className="w-4 h-4 mr-2" />
            {isSelecting ? 'Arrêter' : 'Sélectionner'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreview}
            disabled={disabled || !hasZones}
          >
            {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            Aperçu
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={selectFullImage}
            disabled={disabled}
          >
            <Maximize className="w-4 h-4 mr-2" />
            Tout
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearZones}
            disabled={disabled || !hasZones}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Informations */}
      <div className="text-sm text-gray-600 flex items-center justify-between">
        <span>
          {selectedZones.length} zone(s) sélectionnée(s) / {maxZones} max
        </span>
        {isSelecting && (
          <span className="text-blue-600">
            Cliquez et glissez pour sélectionner une zone
          </span>
        )}
      </div>

      {/* Container de l'image avec canvas overlay */}
      <div ref={containerRef} className="relative border rounded-lg overflow-hidden">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Document à analyser"
          className="block max-w-full h-auto"
          onLoad={handleImageLoad}
          style={imageDimensions ? {
            width: imageDimensions.width,
            height: imageDimensions.height
          } : undefined}
        />
        
        {imageLoaded && imageDimensions && (
          <canvas
            ref={canvasRef}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className={cn(
              'absolute top-0 left-0 cursor-crosshair',
              disabled && 'cursor-not-allowed'
            )}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        )}
        
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-500">Chargement de l'image...</div>
          </div>
        )}
      </div>

      {/* Liste des zones sélectionnées */}
      {hasZones && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Zones sélectionnées :</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedZones.map((zone, index) => (
              <div
                key={zone.id}
                className="flex items-center gap-2 p-2 rounded border bg-gray-50"
              >
                <div
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-sm flex-1 truncate">
                  {zone.label}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeZone(zone.id)}
                  disabled={disabled}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}