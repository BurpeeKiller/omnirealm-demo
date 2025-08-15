import { analytics } from './analytics';
import { logger } from '@/utils/logger';

export interface SyncQueueItem {
  id: string;
  type: 'workout' | 'stats' | 'settings' | 'analytics';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retries: number;
}

class SyncService {
  private static instance: SyncService;
  private syncQueue: SyncQueueItem[] = [];
  private readonly SYNC_QUEUE_KEY = 'omni-fit-sync-queue';
  private readonly MAX_RETRIES = 3;

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  constructor() {
    this.loadSyncQueue();
    this.setupEventListeners();
    this.registerBackgroundSync();
  }

  // Charger la queue de synchronisation depuis localStorage
  private loadSyncQueue() {
    try {
      const saved = localStorage.getItem(this.SYNC_QUEUE_KEY);
      if (saved) {
        this.syncQueue = JSON.parse(saved);
      }
    } catch (error) {
      logger.warn('Erreur chargement queue sync:', error);
      this.syncQueue = [];
    }
  }

  // Sauvegarder la queue de synchronisation
  private saveSyncQueue() {
    try {
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      logger.error('Erreur sauvegarde queue sync:', error);
    }
  }

  // Ajouter un élément à la queue de synchronisation
  addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>) {
    const syncItem: SyncQueueItem = {
      ...item,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();

    // Tenter une synchronisation immédiate si online
    if (navigator.onLine) {
      this.processSyncQueue();
    }
  }

  // Configurer les écouteurs d'événements
  private setupEventListeners() {
    // Synchroniser quand on repasse online
    window.addEventListener('online', () => {
      logger.info('✅ Connexion rétablie - Synchronisation...');
      this.processSyncQueue();
    });

    // Notification quand on passe offline
    window.addEventListener('offline', () => {
      logger.info('⚠️ Mode hors ligne - Les données seront synchronisées au retour');
    });
  }

  // Enregistrer le Background Sync avec le Service Worker
  private async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('fitness-sync');
        logger.info('✅ Background Sync enregistré');
      } catch (error) {
        logger.warn('Background Sync non disponible:', error);
      }
    }
  }

  // Traiter la queue de synchronisation
  async processSyncQueue() {
    if (!navigator.onLine || this.syncQueue.length === 0) {
      return;
    }

    logger.info(`🔄 Traitement de ${this.syncQueue.length} éléments en attente...`);
    
    const itemsToProcess = [...this.syncQueue];
    const failedItems: SyncQueueItem[] = [];

    for (const item of itemsToProcess) {
      try {
        await this.processSyncItem(item);
        // Retirer de la queue si succès
        this.syncQueue = this.syncQueue.filter(i => i.id !== item.id);
      } catch (error) {
        logger.error(`Erreur sync ${item.type}:`, error);
        item.retries++;
        
        if (item.retries < this.MAX_RETRIES) {
          failedItems.push(item);
        } else {
          logger.error(`Abandon après ${this.MAX_RETRIES} essais:`, item);
          logger.error('Sync failed permanently:', { item });
        }
      }
    }

    // Réajouter les éléments échoués à la queue
    this.syncQueue = [...this.syncQueue, ...failedItems];
    this.saveSyncQueue();

    if (this.syncQueue.length === 0) {
      logger.info('✅ Synchronisation terminée avec succès');
    } else {
      logger.warn(`⚠️ ${this.syncQueue.length} éléments en attente de synchronisation`);
    }
  }

  // Traiter un élément de synchronisation
  private async processSyncItem(item: SyncQueueItem): Promise<void> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100));

    switch (item.type) {
      case 'workout':
        await this.syncWorkout(item);
        break;
      case 'stats':
        await this.syncStats(item);
        break;
      case 'settings':
        await this.syncSettings(item);
        break;
      case 'analytics':
        await this.syncAnalytics(item);
        break;
      default:
        throw new Error(`Type de sync inconnu: ${item.type}`);
    }
  }

  // Synchroniser un workout
  private async syncWorkout(item: SyncQueueItem) {
    // Ici on pourrait envoyer les données vers un serveur
    // Pour l'instant, on simule juste le succès
    logger.info('Sync workout:', item.data);
    
    // Si on avait un backend:
    // await fetch('/api/workouts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(item.data)
    // });
  }

  // Synchroniser les stats
  private async syncStats(item: SyncQueueItem) {
    logger.info('Sync stats:', item.data);
  }

  // Synchroniser les settings
  private async syncSettings(item: SyncQueueItem) {
    logger.info('Sync settings:', item.data);
  }

  // Synchroniser les analytics
  private async syncAnalytics(item: SyncQueueItem) {
    logger.info('Sync analytics:', item.data);
  }

  // Obtenir le statut de synchronisation
  getSyncStatus() {
    return {
      isOnline: navigator.onLine,
      pendingItems: this.syncQueue.length,
      queue: this.syncQueue,
    };
  }

  // Forcer une synchronisation manuelle
  async forceSync() {
    if (!navigator.onLine) {
      throw new Error('Impossible de synchroniser hors ligne');
    }
    await this.processSyncQueue();
  }

  // Vider la queue de synchronisation
  clearSyncQueue() {
    this.syncQueue = [];
    this.saveSyncQueue();
  }
}

export const syncService = SyncService.getInstance();