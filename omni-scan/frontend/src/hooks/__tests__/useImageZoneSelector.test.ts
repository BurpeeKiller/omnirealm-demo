import { renderHook, act } from '@testing-library/react'
import { useImageZoneSelector } from '../useImageZoneSelector'
import { ImageDimensions } from '@/types/ocr'

describe('useImageZoneSelector', () => {
  const mockImageDimensions: ImageDimensions = {
    width: 400,
    height: 300,
    naturalWidth: 800,
    naturalHeight: 600,
    scale: 0.5
  }

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useImageZoneSelector())

    expect(result.current.isSelecting).toBe(false)
    expect(result.current.selectedZones).toEqual([])
    expect(result.current.previewMode).toBe(false)
    expect(result.current.canAddZone).toBe(true)
    expect(result.current.hasZones).toBe(false)
  })

  it('should start and stop selection mode', () => {
    const { result } = renderHook(() => useImageZoneSelector())

    act(() => {
      result.current.startSelection()
    })
    expect(result.current.isSelecting).toBe(true)

    act(() => {
      result.current.stopSelection()
    })
    expect(result.current.isSelecting).toBe(false)
  })

  it('should handle drag operations to create zones', () => {
    const onZonesChange = jest.fn()
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions,
        onZonesChange
      })
    )

    // Démarrer la sélection
    act(() => {
      result.current.startSelection()
    })

    // Commencer le drag
    act(() => {
      result.current.handleDragStart(50, 50)
    })

    // Continuer le drag
    act(() => {
      result.current.handleDragMove(150, 100)
    })

    expect(result.current.currentDragZone).toEqual({
      x: 50,
      y: 50,
      width: 100,
      height: 50
    })

    // Terminer le drag
    act(() => {
      result.current.handleDragEnd()
    })

    expect(result.current.selectedZones).toHaveLength(1)
    expect(result.current.selectedZones[0]).toMatchObject({
      x: 100, // 50/400 * 800
      y: 50,  // 50/300 * 600
      width: 200, // 100/400 * 800
      height: 100 // 50/300 * 600
    })
    expect(onZonesChange).toHaveBeenCalledWith(result.current.selectedZones)
  })

  it('should not create zone if drag area is too small', () => {
    const onZonesChange = jest.fn()
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions,
        onZonesChange
      })
    )

    act(() => {
      result.current.startSelection()
      result.current.handleDragStart(50, 50)
      result.current.handleDragMove(55, 55) // Trop petit
      result.current.handleDragEnd()
    })

    expect(result.current.selectedZones).toHaveLength(0)
    expect(onZonesChange).not.toHaveBeenCalled()
  })

  it('should respect max zones limit', () => {
    const maxZones = 2
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions,
        maxZones
      })
    )

    // Créer une zone
    act(() => {
      result.current.startSelection()
      result.current.handleDragStart(10, 10)
      result.current.handleDragMove(60, 60)
      result.current.handleDragEnd()
    })

    // Créer une seconde zone
    act(() => {
      result.current.handleDragStart(70, 70)
      result.current.handleDragMove(120, 120)
      result.current.handleDragEnd()
    })

    expect(result.current.selectedZones).toHaveLength(2)
    expect(result.current.canAddZone).toBe(false)

    // Essayer de créer une troisième zone (devrait échouer)
    act(() => {
      result.current.handleDragStart(130, 130)
      result.current.handleDragMove(180, 180)
      result.current.handleDragEnd()
    })

    expect(result.current.selectedZones).toHaveLength(2)
  })

  it('should remove zones correctly', () => {
    const onZonesChange = jest.fn()
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions,
        onZonesChange
      })
    )

    // Créer deux zones
    act(() => {
      result.current.startSelection()
      result.current.handleDragStart(10, 10)
      result.current.handleDragMove(60, 60)
      result.current.handleDragEnd()
      
      result.current.handleDragStart(70, 70)
      result.current.handleDragMove(120, 120)
      result.current.handleDragEnd()
    })

    expect(result.current.selectedZones).toHaveLength(2)
    const firstZoneId = result.current.selectedZones[0].id

    // Supprimer la première zone
    act(() => {
      result.current.removeZone(firstZoneId)
    })

    expect(result.current.selectedZones).toHaveLength(1)
    expect(result.current.selectedZones[0].id).not.toBe(firstZoneId)
    expect(onZonesChange).toHaveBeenCalledWith(result.current.selectedZones)
  })

  it('should clear all zones', () => {
    const onZonesChange = jest.fn()
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions,
        onZonesChange
      })
    )

    // Créer une zone
    act(() => {
      result.current.startSelection()
      result.current.handleDragStart(10, 10)
      result.current.handleDragMove(60, 60)
      result.current.handleDragEnd()
    })

    expect(result.current.selectedZones).toHaveLength(1)

    // Effacer toutes les zones
    act(() => {
      result.current.clearZones()
    })

    expect(result.current.selectedZones).toHaveLength(0)
    expect(result.current.hasZones).toBe(false)
    expect(onZonesChange).toHaveBeenCalledWith([])
  })

  it('should select full image', () => {
    const onZonesChange = jest.fn()
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions,
        onZonesChange
      })
    )

    act(() => {
      result.current.selectFullImage()
    })

    expect(result.current.selectedZones).toHaveLength(1)
    expect(result.current.selectedZones[0]).toMatchObject({
      x: 0,
      y: 0,
      width: mockImageDimensions.naturalWidth,
      height: mockImageDimensions.naturalHeight,
      label: 'Image complète'
    })
    expect(result.current.isSelecting).toBe(false)
    expect(onZonesChange).toHaveBeenCalledWith(result.current.selectedZones)
  })

  it('should toggle preview mode', () => {
    const { result } = renderHook(() => useImageZoneSelector())

    expect(result.current.previewMode).toBe(false)

    act(() => {
      result.current.togglePreview()
    })

    expect(result.current.previewMode).toBe(true)

    act(() => {
      result.current.togglePreview()
    })

    expect(result.current.previewMode).toBe(false)
  })

  it('should generate unique zone IDs', () => {
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions
      })
    )

    // Créer deux zones
    act(() => {
      result.current.startSelection()
      
      result.current.handleDragStart(10, 10)
      result.current.handleDragMove(60, 60)
      result.current.handleDragEnd()
      
      result.current.handleDragStart(70, 70)
      result.current.handleDragMove(120, 120)
      result.current.handleDragEnd()
    })

    const zone1Id = result.current.selectedZones[0].id
    const zone2Id = result.current.selectedZones[1].id

    expect(zone1Id).not.toBe(zone2Id)
    expect(zone1Id).toMatch(/^zone_\d+$/)
    expect(zone2Id).toMatch(/^zone_\d+$/)
  })

  it('should assign different colors to zones', () => {
    const { result } = renderHook(() => 
      useImageZoneSelector({
        imageDimensions: mockImageDimensions
      })
    )

    // Créer deux zones
    act(() => {
      result.current.startSelection()
      
      result.current.handleDragStart(10, 10)
      result.current.handleDragMove(60, 60)
      result.current.handleDragEnd()
      
      result.current.handleDragStart(70, 70)
      result.current.handleDragMove(120, 120)
      result.current.handleDragEnd()
    })

    const zone1Color = result.current.selectedZones[0].color
    const zone2Color = result.current.selectedZones[1].color

    expect(zone1Color).toBeTruthy()
    expect(zone2Color).toBeTruthy()
    expect(zone1Color).not.toBe(zone2Color)
  })
})