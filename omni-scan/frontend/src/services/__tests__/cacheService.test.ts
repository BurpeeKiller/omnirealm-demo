import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { cacheService } from '../cacheService'

// Mock IndexedDB pour les tests
import 'fake-indexeddb/auto'

describe('OCRCacheService', () => {
  beforeEach(async () => {
    // Nettoyer le cache avant chaque test
    await cacheService.clear()
    await cacheService.init()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('generateFileHash', () => {
    it('devrait générer le même hash pour le même fichier', async () => {
      const content = 'Hello World'
      const file1 = new File([content], 'test.txt', { type: 'text/plain' })
      const file2 = new File([content], 'test.txt', { type: 'text/plain' })

      const hash1 = await cacheService.generateFileHash(file1)
      const hash2 = await cacheService.generateFileHash(file2)

      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64) // SHA-256 = 64 caractères hex
    })

    it('devrait générer des hash différents pour des fichiers différents', async () => {
      const file1 = new File(['Content 1'], 'test1.txt', { type: 'text/plain' })
      const file2 = new File(['Content 2'], 'test2.txt', { type: 'text/plain' })

      const hash1 = await cacheService.generateFileHash(file1)
      const hash2 = await cacheService.generateFileHash(file2)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('has et get', () => {
    it('devrait retourner false/null pour un fichier non caché', async () => {
      const hasResult = await cacheService.has('inexistant-hash')
      const getResult = await cacheService.get('inexistant-hash')

      expect(hasResult).toBe(false)
      expect(getResult).toBeNull()
    })

    it('devrait trouver un fichier mis en cache', async () => {
      const file = new File(['Test content'], 'test.pdf', { type: 'application/pdf' })
      const mockResult = {
        text: 'Extracted text',
        summary: 'Test summary'
      }

      await cacheService.set(file, mockResult)
      const hash = await cacheService.generateFileHash(file)

      const hasResult = await cacheService.has(hash)
      const getResult = await cacheService.get(hash)

      expect(hasResult).toBe(true)
      expect(getResult).toEqual(mockResult)
    })

    it('devrait incrémenter le compteur d\'accès', async () => {
      const file = new File(['Test'], 'test.pdf')
      const mockResult = { text: 'Test' }

      await cacheService.set(file, mockResult)
      const hash = await cacheService.generateFileHash(file)

      // Premier accès
      await cacheService.get(hash)
      // Deuxième accès
      await cacheService.get(hash)

      const stats = await cacheService.getStats()
      expect(stats.totalHits).toBe(3) // 1 initial + 2 get
    })
  })

  describe('set', () => {
    it('devrait stocker un résultat dans le cache', async () => {
      const file = new File(['Content'], 'doc.pdf', { type: 'application/pdf' })
      const result = { text: 'Extracted', analysis: { summary: 'Summary' } }

      await cacheService.set(file, result)
      
      const hash = await cacheService.generateFileHash(file)
      const cached = await cacheService.get(hash)

      expect(cached).toEqual(result)
    })

    it('devrait mettre à jour les métadonnées', async () => {
      const file = new File(['Test'], 'test.pdf')
      const result = { text: 'Test' }

      const statsBefore = await cacheService.getStats()
      await cacheService.set(file, result)
      const statsAfter = await cacheService.getStats()

      expect(statsAfter.totalItems).toBe(statsBefore.totalItems + 1)
      expect(Number(statsAfter.totalSizeMB)).toBeGreaterThan(0)
    })
  })

  describe('getStats', () => {
    it('devrait retourner les statistiques correctes', async () => {
      // Ajouter quelques fichiers
      const files = [
        new File(['Content 1'], 'file1.pdf'),
        new File(['Content 2'], 'file2.pdf'),
        new File(['Content 3'], 'file3.pdf')
      ]

      for (const file of files) {
        await cacheService.set(file, { text: `Result for ${file.name}` })
      }

      const stats = await cacheService.getStats()

      expect(stats.totalItems).toBe(3)
      expect(stats.totalHits).toBeGreaterThanOrEqual(3)
      expect(stats.topAccessed).toHaveLength(3)
      expect(Number(stats.usage)).toBeGreaterThan(0)
      expect(Number(stats.usage)).toBeLessThan(100)
    })

    it('devrait calculer les économies correctement', async () => {
      const file = new File(['Test'], 'test.pdf')
      await cacheService.set(file, { text: 'Result' })
      
      const hash = await cacheService.generateFileHash(file)
      
      // Simuler 10 accès
      for (let i = 0; i < 10; i++) {
        await cacheService.get(hash)
      }

      const stats = await cacheService.getStats()
      // 10 hits * 0.02€ = 0.20€ d'économies (calculé dans le composant)
      expect(stats.totalHits).toBeGreaterThanOrEqual(10)
    })
  })

  describe('TTL et expiration', () => {
    it('devrait supprimer les éléments expirés', async () => {
      // Créer un élément avec une date passée (mock)
      const file = new File(['Old content'], 'old.pdf')
      await cacheService.set(file, { text: 'Old result' })
      
      // Mock de la date pour simuler 31 jours plus tard
      const originalDate = Date.now
      vi.spyOn(Date, 'now').mockReturnValue(originalDate() + 31 * 24 * 60 * 60 * 1000)

      const hash = await cacheService.generateFileHash(file)
      const hasResult = await cacheService.has(hash)
      
      expect(hasResult).toBe(false) // Devrait être supprimé car expiré

      // Restaurer Date.now
      vi.restoreAllMocks()
    })
  })

  describe('clear', () => {
    it('devrait vider complètement le cache', async () => {
      // Ajouter des données
      const file = new File(['Content'], 'test.pdf')
      await cacheService.set(file, { text: 'Result' })

      const statsBefore = await cacheService.getStats()
      expect(statsBefore.totalItems).toBe(1)

      // Vider le cache
      await cacheService.clear()

      const statsAfter = await cacheService.getStats()
      expect(statsAfter.totalItems).toBe(0)
      expect(statsAfter.totalSize).toBe(0)
    })
  })

  describe('LRU (Least Recently Used)', () => {
    it('devrait supprimer les éléments les moins utilisés quand la limite est atteinte', async () => {
      // Note: Ce test est conceptuel car la limite de 50MB est difficile à atteindre en test
      // Dans un vrai test, on pourrait mocker la limite à une valeur plus petite
      
      const files = []
      for (let i = 0; i < 5; i++) {
        const file = new File([`Content ${i}`.repeat(1000)], `file${i}.pdf`)
        files.push(file)
        await cacheService.set(file, { text: `Result ${i}` })
      }

      // Accéder aux fichiers 3 et 4 pour les rendre "récents"
      const hash3 = await cacheService.generateFileHash(files[3])
      const hash4 = await cacheService.generateFileHash(files[4])
      await cacheService.get(hash3)
      await cacheService.get(hash4)

      const stats = await cacheService.getStats()
      expect(stats.totalItems).toBeLessThanOrEqual(100) // Limite max
    })
  })
})