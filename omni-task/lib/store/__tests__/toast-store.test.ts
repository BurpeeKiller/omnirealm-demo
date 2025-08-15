import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useToastStore } from '../toast-store'

describe('useToastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Reset store to initial state
    useToastStore.setState({ toasts: [] })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    // Clean up store
    useToastStore.setState({ toasts: [] })
  })

  describe('État initial', () => {
    it('devrait avoir un état initial vide', () => {
      const { result } = renderHook(() => useToastStore())
      expect(result.current.toasts).toEqual([])
    })
  })

  describe('addToast', () => {
    it('devrait ajouter un toast avec un ID unique', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.addToast({
          type: 'info',
          message: 'Test toast',
          duration: 5000
        })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]).toMatchObject({
        type: 'info',
        message: 'Test toast',
        id: expect.any(String)
      })
    })

    it('devrait supprimer automatiquement le toast après la durée spécifiée', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.addToast({
          type: 'info',
          message: 'Test toast',
          duration: 1000
        })
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.toasts).toHaveLength(0)
    })

    it('devrait utiliser une durée par défaut de 3 secondes', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.addToast({
          type: 'info',
          message: 'Test toast'
        })
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(2999)
      })
      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('removeToast', () => {
    it('devrait supprimer un toast spécifique', () => {
      const { result } = renderHook(() => useToastStore())
      
      // Ajouter plusieurs toasts avec une longue durée pour éviter l'auto-suppression
      act(() => {
        result.current.addToast({ type: 'info', message: 'Toast 1', duration: 60000 })
        result.current.addToast({ type: 'error', message: 'Toast 2', duration: 60000 })
        result.current.addToast({ type: 'success', message: 'Toast 3', duration: 60000 })
      })

      expect(result.current.toasts).toHaveLength(3)
      const toastToRemove = result.current.toasts[1]

      act(() => {
        result.current.removeToast(toastToRemove.id)
      })

      expect(result.current.toasts).toHaveLength(2)
      expect(result.current.toasts.find(t => t.id === toastToRemove.id)).toBeUndefined()
      expect(result.current.toasts[0].message).toBe('Toast 1')
      expect(result.current.toasts[1].message).toBe('Toast 3')
    })
  })

  describe('success', () => {
    it('devrait ajouter un toast de succès', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.success('Opération réussie!')
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]).toMatchObject({
        type: 'success',
        message: 'Opération réussie!',
        id: expect.any(String)
      })
    })

    it('devrait supprimer automatiquement après 3 secondes', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.success('Test')
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('error', () => {
    it('devrait ajouter un toast d\'erreur', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.error('Une erreur est survenue')
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]).toMatchObject({
        type: 'error',
        message: 'Une erreur est survenue',
        id: expect.any(String)
      })
    })

    it('devrait supprimer automatiquement après 5 secondes', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.error('Test')
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(4999)
      })
      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('info', () => {
    it('devrait ajouter un toast d\'info', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.info('Information importante')
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]).toMatchObject({
        type: 'info',
        message: 'Information importante',
        id: expect.any(String)
      })
    })

    it('devrait supprimer automatiquement après 3 secondes', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.info('Test')
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('warning', () => {
    it('devrait ajouter un toast d\'avertissement', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.warning('Attention requise')
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0]).toMatchObject({
        type: 'warning',
        message: 'Attention requise',
        id: expect.any(String)
      })
    })

    it('devrait supprimer automatiquement après 4 secondes', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.warning('Test')
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('Gestion de plusieurs toasts', () => {
    it('devrait gérer plusieurs toasts simultanément', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.success('Toast 1')
        result.current.error('Toast 2')
        result.current.info('Toast 3')
        result.current.warning('Toast 4')
      })

      expect(result.current.toasts).toHaveLength(4)
      expect(result.current.toasts.map(t => t.type)).toEqual(['success', 'error', 'info', 'warning'])
    })

    it('devrait supprimer les toasts dans le bon ordre', () => {
      const { result } = renderHook(() => useToastStore())
      
      act(() => {
        result.current.success('Success - 3s')
        result.current.warning('Warning - 4s')
        result.current.error('Error - 5s')
      })

      expect(result.current.toasts).toHaveLength(3)

      // Après 3 secondes, le success devrait disparaître
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(result.current.toasts).toHaveLength(2)
      expect(result.current.toasts.find(t => t.type === 'success')).toBeUndefined()

      // Après 1 seconde de plus (4s total), le warning devrait disparaître
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts.find(t => t.type === 'warning')).toBeUndefined()

      // Après 1 seconde de plus (5s total), l'error devrait disparaître
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('IDs uniques', () => {
    it('devrait générer des IDs uniques même pour des toasts créés rapidement', () => {
      const { result } = renderHook(() => useToastStore())
      
      // Mock Date.now pour retourner la même valeur
      const originalDateNow = Date.now
      Date.now = vi.fn(() => 1000)
      
      act(() => {
        result.current.success('Toast 1')
        result.current.success('Toast 2')
        result.current.success('Toast 3')
      })

      const ids = result.current.toasts.map(t => t.id)
      expect(new Set(ids).size).toBe(3) // Tous les IDs doivent être uniques
      
      // Vérifier que tous les IDs commencent par 1000 mais ont des suffixes différents
      ids.forEach(id => {
        expect(id).toMatch(/^1000-[a-z0-9]+$/)
      })

      // Restaurer Date.now
      Date.now = originalDateNow
    })
  })
})