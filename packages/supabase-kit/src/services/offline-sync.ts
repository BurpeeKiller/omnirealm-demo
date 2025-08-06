import type { SupabaseClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

import { getClient } from '../utils/client';

export interface SyncQueueItem {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

export interface SyncConfig {
  tables: string[];
  syncInterval?: number; // en millisecondes
  maxRetries?: number;
  onSyncStart?: () => void;
  onSyncComplete?: (synced: number, failed: number) => void;
  onSyncError?: (error: Error, item: SyncQueueItem) => void;
}

/**
 * Service de synchronisation offline/online pour Supabase
 * Gère la queue des opérations hors ligne et la synchronisation automatique
 */
export class OfflineSyncService {
  private supabase: SupabaseClient;
  private syncQueue: SyncQueueItem[] = [];
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private config: Required<SyncConfig>;
  private readonly STORAGE_KEY = 'omnirealm_sync_queue';

  constructor(config: SyncConfig, supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || getClient();
    this.config = {
      tables: config.tables,
      syncInterval: config.syncInterval || 30000, // 30 secondes par défaut
      maxRetries: config.maxRetries || 3,
      onSyncStart: config.onSyncStart || (() => {}),
      onSyncComplete: config.onSyncComplete || (() => {}),
      onSyncError: config.onSyncError || (() => {}),
    };

    this.loadQueueFromStorage();
    this.setupNetworkListener();
    this.startAutoSync();
  }

  /**
   * Charge la queue depuis le localStorage
   */
  private loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la queue de sync:', error);
    }
  }

  /**
   * Sauvegarde la queue dans le localStorage
   */
  private saveQueueToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la queue de sync:', error);
    }
  }

  /**
   * Écoute les changements de connectivité
   */
  private setupNetworkListener() {
    window.addEventListener('online', () => {
      console.log('Connexion rétablie, synchronisation...');
      this.sync();
    });

    window.addEventListener('offline', () => {
      console.log('Mode hors ligne activé');
    });
  }

  /**
   * Démarre la synchronisation automatique
   */
  private startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (navigator.onLine && this.syncQueue.length > 0) {
        this.sync();
      }
    }, this.config.syncInterval);
  }

  /**
   * Ajoute une opération à la queue
   */
  async queueOperation(table: string, operation: 'insert' | 'update' | 'delete', data: any) {
    if (!this.config.tables.includes(table)) {
      throw new Error(`Table ${table} non configurée pour la synchronisation`);
    }

    const item: SyncQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      table,
      operation,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.syncQueue.push(item);
    this.saveQueueToStorage();

    // Si en ligne, tenter de synchroniser immédiatement
    if (navigator.onLine) {
      this.sync();
    }

    return item.id;
  }

  /**
   * Synchronise la queue avec Supabase
   */
  async sync() {
    if (this.isSyncing || !navigator.onLine) {
      return;
    }

    this.isSyncing = true;
    this.config.onSyncStart();

    let synced = 0;
    let failed = 0;

    // Copie de la queue pour éviter les modifications pendant la sync
    const itemsToSync = [...this.syncQueue];

    for (const item of itemsToSync) {
      try {
        await this.syncItem(item);

        // Retirer de la queue si succès
        this.syncQueue = this.syncQueue.filter((i) => i.id !== item.id);
        synced++;
      } catch (error) {
        item.retries++;

        if (item.retries >= this.config.maxRetries) {
          // Retirer de la queue après trop d'échecs
          this.syncQueue = this.syncQueue.filter((i) => i.id !== item.id);
          this.config.onSyncError(error as Error, item);
          failed++;
        }
      }
    }

    this.saveQueueToStorage();
    this.isSyncing = false;
    this.config.onSyncComplete(synced, failed);
  }

  /**
   * Synchronise un élément spécifique
   */
  private async syncItem(item: SyncQueueItem) {
    const { table, operation, data } = item;

    switch (operation) {
      case 'insert':
        await this.supabase.from(table).insert(data);
        break;

      case 'update':
        if (!data.id) {
          throw new Error('ID requis pour update');
        }
        await this.supabase.from(table).update(data).eq('id', data.id);
        break;

      case 'delete':
        if (!data.id) {
          throw new Error('ID requis pour delete');
        }
        await this.supabase.from(table).delete().eq('id', data.id);
        break;
    }
  }

  /**
   * Récupère le statut de la synchronisation
   */
  getStatus() {
    return {
      isOnline: navigator.onLine,
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      oldestItem: this.syncQueue[0]?.timestamp || null,
    };
  }

  /**
   * Vide la queue de synchronisation
   */
  clearQueue() {
    this.syncQueue = [];
    this.saveQueueToStorage();
  }

  /**
   * Arrête le service
   */
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

/**
 * Hook React pour utiliser le service de synchronisation
 */
export function useOfflineSync(config: SyncConfig) {
  const [syncService] = useState(() => new OfflineSyncService(config));
  const [status, setStatus] = useState(syncService.getStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(syncService.getStatus());
    }, 1000);

    return () => {
      clearInterval(interval);
      syncService.destroy();
    };
  }, [syncService]);

  return {
    queueOperation: syncService.queueOperation.bind(syncService),
    sync: syncService.sync.bind(syncService),
    clearQueue: syncService.clearQueue.bind(syncService),
    status,
  };
}
