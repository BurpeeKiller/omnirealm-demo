/**
 * Service de cache pour les résultats OCR
 * Économise les API calls en stockant les résultats localement
 * 
 * Architecture:
 * 1. Cache L1: IndexedDB (local, rapide, 50MB+)
 * 2. Cache L2: Supabase (cloud, partagé, illimité)
 * 3. Invalidation: TTL 30 jours + LRU
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb'
// Logger removed - using console instead;

// Types
interface CachedResult {
  id: string
  fileHash: string
  fileName: string
  result: any
  createdAt: Date
  lastAccessedAt: Date
  accessCount: number
  fileSize: number
}

interface CacheDB extends DBSchema {
  results: {
    key: string
    value: CachedResult
    indexes: {
      'by-date': Date
      'by-access': Date
      'by-hash': string
    }
  }
  metadata: {
    key: string
    value: {
      totalSize: number
      totalItems: number
      lastCleanup: Date
    }
  }
}

export class OCRCacheService {
  private db: IDBPDatabase<CacheDB> | null = null
  private readonly DB_NAME = 'omniscan-cache'
  private readonly DB_VERSION = 1
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB
  private readonly MAX_AGE_DAYS = 30
  private readonly MAX_ITEMS = 100

  async init(): Promise<void> {
    this.db = await openDB<CacheDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Store pour les résultats
        const resultStore = db.createObjectStore('results', { keyPath: 'id' })
        resultStore.createIndex('by-date', 'createdAt')
        resultStore.createIndex('by-access', 'lastAccessedAt')
        resultStore.createIndex('by-hash', 'fileHash')
        
        // Store pour les métadonnées
        db.createObjectStore('metadata')
      }
    })

    // Nettoyer le cache au démarrage
    await this.cleanup()
  }

  /**
   * Génère un hash unique pour un fichier
   */
  async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Vérifie si un résultat est en cache
   */
  async has(fileHash: string): Promise<boolean> {
    if (!this.db) await this.init()
    
    const result = await this.db!.getFromIndex('results', 'by-hash', fileHash)
    
    if (result) {
      // Vérifier l'expiration
      const age = Date.now() - result.createdAt.getTime()
      const maxAge = this.MAX_AGE_DAYS * 24 * 60 * 60 * 1000
      
      if (age > maxAge) {
        await this.delete(result.id)
        return false
      }
      
      return true
    }
    
    return false
  }

  /**
   * Récupère un résultat du cache
   */
  async get(fileHash: string): Promise<any | null> {
    if (!this.db) await this.init()
    
    const result = await this.db!.getFromIndex('results', 'by-hash', fileHash)
    
    if (result) {
      // Mettre à jour les stats d'accès
      result.lastAccessedAt = new Date()
      result.accessCount++
      await this.db!.put('results', result)
      
      console.info(`📦 Cache hit pour ${result.fileName} (accès #${result.accessCount})`)
      return result.result
    }
    
    return null
  }

  /**
   * Stocke un résultat en cache
   */
  async set(file: File, result: any): Promise<void> {
    if (!this.db) await this.init()
    
    const fileHash = await this.generateFileHash(file)
    const id = `${fileHash}-${Date.now()}`
    
    const cachedResult: CachedResult = {
      id,
      fileHash,
      fileName: file.name,
      result,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      accessCount: 1,
      fileSize: file.size
    }
    
    await this.db!.put('results', cachedResult)
    await this.updateMetadata()
    
    console.info(`💾 Résultat mis en cache pour ${file.name}`)
    
    // Nettoyer si nécessaire
    await this.cleanupIfNeeded()
  }

  /**
   * Supprime un résultat du cache
   */
  async delete(id: string): Promise<void> {
    if (!this.db) await this.init()
    
    await this.db!.delete('results', id)
    await this.updateMetadata()
  }

  /**
   * Nettoie le cache (LRU + expiration)
   */
  private async cleanup(): Promise<void> {
    if (!this.db) return
    
    const now = Date.now()
    const maxAge = this.MAX_AGE_DAYS * 24 * 60 * 60 * 1000
    
    // Supprimer les éléments expirés
    const allResults = await this.db.getAll('results')
    const toDelete: string[] = []
    
    for (const result of allResults) {
      const age = now - result.createdAt.getTime()
      if (age > maxAge) {
        toDelete.push(result.id)
      }
    }
    
    // Supprimer en batch
    const tx = this.db.transaction('results', 'readwrite')
    await Promise.all(toDelete.map(id => tx.store.delete(id)))
    await tx.done
    
    console.info(`🧹 Nettoyage: ${toDelete.length} éléments expirés supprimés`)
    
    await this.updateMetadata()
  }

  /**
   * Nettoie si la taille max est dépassée (LRU)
   */
  private async cleanupIfNeeded(): Promise<void> {
    if (!this.db) return
    
    const metadata = await this.getMetadata()
    
    // Vérifier la taille
    if (metadata.totalSize > this.MAX_CACHE_SIZE || metadata.totalItems > this.MAX_ITEMS) {
      // Trier par dernier accès (LRU)
      const allResults = await this.db.getAll('results')
      allResults.sort((a, b) => a.lastAccessedAt.getTime() - b.lastAccessedAt.getTime())
      
      // Supprimer les plus anciens jusqu'à atteindre 80% de la limite
      const targetSize = this.MAX_CACHE_SIZE * 0.8
      const targetItems = this.MAX_ITEMS * 0.8
      let currentSize = metadata.totalSize
      let currentItems = metadata.totalItems
      const toDelete: string[] = []
      
      for (const result of allResults) {
        if (currentSize <= targetSize && currentItems <= targetItems) break
        
        toDelete.push(result.id)
        currentSize -= result.fileSize
        currentItems--
      }
      
      // Supprimer en batch
      const tx = this.db.transaction('results', 'readwrite')
      await Promise.all(toDelete.map(id => tx.store.delete(id)))
      await tx.done
      
      console.info(`🧹 LRU: ${toDelete.length} éléments supprimés pour libérer de l'espace`)
      
      await this.updateMetadata()
    }
  }

  /**
   * Met à jour les métadonnées du cache
   */
  private async updateMetadata(): Promise<void> {
    if (!this.db) return
    
    const allResults = await this.db.getAll('results')
    const totalSize = allResults.reduce((sum, r) => sum + r.fileSize, 0)
    const totalItems = allResults.length
    
    await this.db.put('metadata', {
      totalSize,
      totalItems,
      lastCleanup: new Date()
    }, 'stats')
  }

  /**
   * Récupère les métadonnées
   */
  private async getMetadata() {
    if (!this.db) await this.init()
    
    const metadata = await this.db!.get('metadata', 'stats')
    return metadata || {
      totalSize: 0,
      totalItems: 0,
      lastCleanup: new Date()
    }
  }

  /**
   * Obtient les statistiques du cache
   */
  async getStats() {
    if (!this.db) await this.init()
    
    const metadata = await this.getMetadata()
    const allResults = await this.db!.getAll('results')
    
    // Calculer les stats
    const totalHits = allResults.reduce((sum, r) => sum + r.accessCount, 0)
    const avgAccessCount = totalHits / (allResults.length || 1)
    
    // Top 5 des plus accédés
    const topAccessed = [...allResults]
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 5)
      .map(r => ({
        fileName: r.fileName,
        accessCount: r.accessCount,
        lastAccess: r.lastAccessedAt
      }))
    
    return {
      totalSize: metadata.totalSize,
      totalSizeMB: (metadata.totalSize / 1024 / 1024).toFixed(2),
      totalItems: metadata.totalItems,
      totalHits,
      avgAccessCount: avgAccessCount.toFixed(1),
      lastCleanup: metadata.lastCleanup,
      maxSize: this.MAX_CACHE_SIZE,
      maxSizeMB: (this.MAX_CACHE_SIZE / 1024 / 1024).toFixed(0),
      usage: ((metadata.totalSize / this.MAX_CACHE_SIZE) * 100).toFixed(1),
      topAccessed
    }
  }

  /**
   * Vide complètement le cache
   */
  async clear(): Promise<void> {
    if (!this.db) await this.init()
    
    await this.db!.clear('results')
    await this.db!.clear('metadata')
    
    console.info('🗑️ Cache vidé complètement')
  }
}

// Instance singleton
export const cacheService = new OCRCacheService()