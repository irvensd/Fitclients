import { Client, Session, Payment, WorkoutPlan, ProgressEntry } from "./types";

// IndexedDB configuration
const DB_NAME = 'FitClientDB';
const DB_VERSION = 1;
const STORES = {
  clients: 'clients',
  sessions: 'sessions',
  payments: 'payments',
  workoutPlans: 'workoutPlans',
  progressEntries: 'progressEntries',
  syncQueue: 'syncQueue',
} as const;

interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  docId?: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  userId: string;
}

class OfflineStorageService {
  private db: IDBDatabase | null = null;
  private readonly maxRetries = 3;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.startSyncProcess();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            
            // Create indexes based on store type
            switch (storeName) {
              case STORES.clients:
                store.createIndex('userId', 'userId');
                store.createIndex('dateJoined', 'dateJoined');
                break;
              case STORES.sessions:
                store.createIndex('userId', 'userId');
                store.createIndex('clientId', 'clientId');
                store.createIndex('date', 'date');
                break;
              case STORES.payments:
                store.createIndex('userId', 'userId');
                store.createIndex('clientId', 'clientId');
                store.createIndex('date', 'date');
                break;
              case STORES.workoutPlans:
                store.createIndex('userId', 'userId');
                store.createIndex('clientId', 'clientId');
                break;
              case STORES.progressEntries:
                store.createIndex('userId', 'userId');
                store.createIndex('clientId', 'clientId');
                store.createIndex('date', 'date');
                break;
              case STORES.syncQueue:
                store.createIndex('userId', 'userId');
                store.createIndex('timestamp', 'timestamp');
                break;
            }
          }
        });
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Generic CRUD operations
  async create<T extends { id: string }>(storeName: string, data: T): Promise<T> {
    const store = await this.getStore(storeName, 'readwrite');
    const request = store.add(data);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  async read<T>(storeName: string, id: string): Promise<T | null> {
    const store = await this.getStore(storeName);
    const request = store.get(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T extends { id: string }>(storeName: string, data: T): Promise<T> {
    const store = await this.getStore(storeName, 'readwrite');
    const request = store.put(data);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string, userId?: string): Promise<T[]> {
    const store = await this.getStore(storeName);
    let request: IDBRequest;

    if (userId) {
      const index = store.index('userId');
      request = index.getAll(userId);
    } else {
      request = store.getAll();
    }
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async query<T>(
    storeName: string,
    indexName: string,
    value: any,
    limit?: number
  ): Promise<T[]> {
    const store = await this.getStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value, limit);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync queue operations
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const syncItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await this.create(STORES.syncQueue, syncItem);
  }

  async getSyncQueue(userId: string): Promise<SyncQueueItem[]> {
    return this.query<SyncQueueItem>(STORES.syncQueue, 'userId', userId);
  }

  async removeSyncItem(id: string): Promise<void> {
    await this.delete(STORES.syncQueue, id);
  }

  async updateSyncItem(item: SyncQueueItem): Promise<void> {
    await this.update(STORES.syncQueue, item);
  }

  // Collection-specific operations
  async getClients(userId: string): Promise<Client[]> {
    return this.query<Client>(STORES.clients, 'userId', userId);
  }

  async getSessions(userId: string): Promise<Session[]> {
    return this.query<Session>(STORES.sessions, 'userId', userId);
  }

  async getPayments(userId: string): Promise<Payment[]> {
    return this.query<Payment>(STORES.payments, 'userId', userId);
  }

  async getWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
    return this.query<WorkoutPlan>(STORES.workoutPlans, 'userId', userId);
  }

  async getProgressEntries(userId: string): Promise<ProgressEntry[]> {
    return this.query<ProgressEntry>(STORES.progressEntries, 'userId', userId);
  }

  // Bulk operations for sync
  async bulkCreate<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    
    return new Promise((resolve, reject) => {
      let completed = 0;
      let hasError = false;

      if (items.length === 0) {
        resolve();
        return;
      }

      items.forEach(item => {
        const request = store.add(item);
        
        request.onsuccess = () => {
          completed++;
          if (completed === items.length && !hasError) {
            resolve();
          }
        };
        
        request.onerror = () => {
          if (!hasError) {
            hasError = true;
            reject(request.error);
          }
        };
      });
    });
  }

  async bulkUpdate<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    
    return new Promise((resolve, reject) => {
      let completed = 0;
      let hasError = false;

      if (items.length === 0) {
        resolve();
        return;
      }

      items.forEach(item => {
        const request = store.put(item);
        
        request.onsuccess = () => {
          completed++;
          if (completed === items.length && !hasError) {
            resolve();
          }
        };
        
        request.onerror = () => {
          if (!hasError) {
            hasError = true;
            reject(request.error);
          }
        };
      });
    });
  }

  // Sync process
  private startSyncProcess(): void {
    // Sync every 30 seconds when online
    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.processSyncQueue().catch(console.error);
      }
    }, 30000);
  }

  private async processSyncQueue(): Promise<void> {
    // This would integrate with Firebase to sync pending changes
    // For now, we'll just log the sync process
    console.log('Processing sync queue...');
    
    // In a real implementation, this would:
    // 1. Get all pending sync items
    // 2. Try to sync them with Firebase
    // 3. Remove successful items from queue
    // 4. Increment retry count for failed items
    // 5. Remove items that exceed max retries
  }

  // Data management
  async clearUserData(userId: string): Promise<void> {
    const storeNames = [STORES.clients, STORES.sessions, STORES.payments, STORES.workoutPlans, STORES.progressEntries];
    
    for (const storeName of storeNames) {
      const items = await this.query<any>(storeName, 'userId', userId);
      for (const item of items) {
        await this.delete(storeName, item.id);
      }
    }
  }

  async getStorageStats(): Promise<{
    totalSize: number;
    storeStats: Record<string, number>;
  }> {
    const storeStats: Record<string, number> = {};
    
    for (const storeName of Object.values(STORES)) {
      const items = await this.getAll(storeName);
      storeStats[storeName] = items.length;
    }
    
    return {
      totalSize: Object.values(storeStats).reduce((sum, count) => sum + count, 0),
      storeStats,
    };
  }

  // Cleanup
  cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();

// Export types
export type { SyncQueueItem }; 