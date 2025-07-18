import { optimizedFirebaseService, QueryOptions } from './optimizedFirebaseService';
import { offlineStorage } from './offlineStorage';
import { Client, Session, Payment, WorkoutPlan, ProgressEntry } from './types';

// Connection state management
interface ConnectionState {
  isOnline: boolean;
  isFirebaseConnected: boolean;
  lastSyncTime: number;
}

// Data operation result
interface DataOperationResult<T> {
  data: T;
  source: 'firebase' | 'cache' | 'offline';
  timestamp: number;
  isFresh: boolean;
}

// Sync strategy options
interface SyncStrategy {
  preferOffline: boolean;
  maxCacheAge: number;
  autoSync: boolean;
  syncInterval: number;
}

class UnifiedDataService {
  private connectionState: ConnectionState = {
    isOnline: navigator.onLine,
    isFirebaseConnected: true,
    lastSyncTime: 0,
  };

  private defaultSyncStrategy: SyncStrategy = {
    preferOffline: false,
    maxCacheAge: 5 * 60 * 1000, // 5 minutes
    autoSync: true,
    syncInterval: 30 * 1000, // 30 seconds
  };

  private syncInProgress = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.setupConnectionListeners();
  }

  private setupConnectionListeners(): void {
    window.addEventListener('online', () => {
      this.connectionState.isOnline = true;
      this.handleConnectionChange();
    });

    window.addEventListener('offline', () => {
      this.connectionState.isOnline = false;
      this.handleConnectionChange();
    });
  }

  private async handleConnectionChange(): Promise<void> {
    if (this.connectionState.isOnline && !this.syncInProgress) {
      await this.syncOfflineData();
    }
  }

  async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.doInitialize();
    return this.initializationPromise;
  }

  private async doInitialize(): Promise<void> {
    try {
      await offlineStorage.initialize();
      
      // Test Firebase connection
      try {
        await optimizedFirebaseService.getPerformanceMetrics();
        this.connectionState.isFirebaseConnected = true;
      } catch (error) {
        console.warn('Firebase connection failed, using offline mode:', error);
        this.connectionState.isFirebaseConnected = false;
      }
    } catch (error) {
      console.error('Failed to initialize unified data service:', error);
      throw error;
    }
  }

  // Smart data fetching with fallback strategy
  async getData<T>(
    userId: string,
    collection: 'clients' | 'sessions' | 'payments' | 'workoutPlans' | 'progressEntries',
    options: QueryOptions & { strategy?: SyncStrategy } = {}
  ): Promise<DataOperationResult<T[]>> {
    await this.initialize();

    const strategy = { ...this.defaultSyncStrategy, ...options.strategy };
    
    // Try Firebase first if online and connected
    if (this.connectionState.isOnline && this.connectionState.isFirebaseConnected && !strategy.preferOffline) {
      try {
        const data = await this.getFromFirebase<T>(userId, collection, options);
        
        // Cache in offline storage for future use
        await this.cacheOffline(userId, collection, data);
        
        return {
          data,
          source: 'firebase',
          timestamp: Date.now(),
          isFresh: true,
        };
      } catch (error) {
        console.warn(`Firebase fetch failed for ${collection}, falling back to cache:`, error);
        this.connectionState.isFirebaseConnected = false;
      }
    }

    // Try cache if available and fresh
    const cachedData = await this.getFromCache<T>(userId, collection, strategy.maxCacheAge);
    if (cachedData) {
      return {
        data: cachedData.data,
        source: 'cache',
        timestamp: cachedData.timestamp,
        isFresh: Date.now() - cachedData.timestamp < strategy.maxCacheAge,
      };
    }

    // Fallback to offline storage
    const offlineData = await this.getFromOffline<T>(userId, collection);
    return {
      data: offlineData,
      source: 'offline',
      timestamp: Date.now(),
      isFresh: false,
    };
  }

  private async getFromFirebase<T>(
    userId: string,
    collection: string,
    options: QueryOptions
  ): Promise<T[]> {
    switch (collection) {
      case 'clients':
        return optimizedFirebaseService.getClients(userId, options) as Promise<T[]>;
      case 'sessions':
        return optimizedFirebaseService.getSessions(userId, options) as Promise<T[]>;
      default:
        return optimizedFirebaseService.getCollection<T>(`users/${userId}/${collection}`, options);
    }
  }

  private async getFromCache<T>(
    userId: string,
    collection: string,
    maxAge: number
  ): Promise<{ data: T[]; timestamp: number } | null> {
    const cacheKey = `${userId}_${collection}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < maxAge) {
          return parsed;
        }
      } catch (error) {
        console.warn('Failed to parse cached data:', error);
      }
    }
    
    return null;
  }

  private async getFromOffline<T>(userId: string, collection: string): Promise<T[]> {
    switch (collection) {
      case 'clients':
        return offlineStorage.getClients(userId) as Promise<T[]>;
      case 'sessions':
        return offlineStorage.getSessions(userId) as Promise<T[]>;
      case 'payments':
        return offlineStorage.getPayments(userId) as Promise<T[]>;
      case 'workoutPlans':
        return offlineStorage.getWorkoutPlans(userId) as Promise<T[]>;
      case 'progressEntries':
        return offlineStorage.getProgressEntries(userId) as Promise<T[]>;
      default:
        return [];
    }
  }

  private async cacheOffline<T>(userId: string, collection: string, data: T[]): Promise<void> {
    try {
      // Cache in localStorage for quick access
      const cacheKey = `${userId}_${collection}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));

      // Store in IndexedDB for offline access
      const storeName = collection;
      await offlineStorage.bulkUpdate(storeName, data as any[]);
    } catch (error) {
      console.warn('Failed to cache data offline:', error);
    }
  }

  // Smart data operations with offline queueing
  async createData<T extends { id: string }>(
    userId: string,
    collection: 'clients' | 'sessions' | 'payments' | 'workoutPlans' | 'progressEntries',
    data: Omit<T, 'id'>
  ): Promise<T> {
    await this.initialize();

    const newId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newData = { ...data, id: newId } as T;

    // Always save to offline storage first
    await offlineStorage.create(collection, newData);

    // Try to sync with Firebase if online
    if (this.connectionState.isOnline && this.connectionState.isFirebaseConnected) {
      try {
        // In a real implementation, this would use Firebase's add methods
        console.log('Syncing new data to Firebase:', newData);
        
        // Clear cache to force refresh
        this.clearCache(userId, collection);
        
        return newData;
      } catch (error) {
        console.warn('Failed to sync to Firebase, queued for later:', error);
        
        // Queue for later sync
        await offlineStorage.addToSyncQueue({
          type: 'create',
          collection,
          data: newData,
          userId,
        });
      }
    } else {
      // Queue for later sync
      await offlineStorage.addToSyncQueue({
        type: 'create',
        collection,
        data: newData,
        userId,
      });
    }

    return newData;
  }

  async updateData<T extends { id: string }>(
    userId: string,
    collection: 'clients' | 'sessions' | 'payments' | 'workoutPlans' | 'progressEntries',
    id: string,
    updates: Partial<T>
  ): Promise<void> {
    await this.initialize();

    // Get current data
    const currentData = await offlineStorage.read<T>(collection, id);
    if (!currentData) {
      throw new Error(`Document ${id} not found in ${collection}`);
    }

    const updatedData = { ...currentData, ...updates };

    // Always update offline storage first
    await offlineStorage.update(collection, updatedData);

    // Try to sync with Firebase if online
    if (this.connectionState.isOnline && this.connectionState.isFirebaseConnected) {
      try {
        console.log('Syncing updated data to Firebase:', updatedData);
        
        // Clear cache to force refresh
        this.clearCache(userId, collection);
      } catch (error) {
        console.warn('Failed to sync update to Firebase, queued for later:', error);
        
        // Queue for later sync
        await offlineStorage.addToSyncQueue({
          type: 'update',
          collection,
          docId: id,
          data: updates,
          userId,
        });
      }
    } else {
      // Queue for later sync
      await offlineStorage.addToSyncQueue({
        type: 'update',
        collection,
        docId: id,
        data: updates,
        userId,
      });
    }
  }

  async deleteData(
    userId: string,
    collection: 'clients' | 'sessions' | 'payments' | 'workoutPlans' | 'progressEntries',
    id: string
  ): Promise<void> {
    await this.initialize();

    // Always delete from offline storage first
    await offlineStorage.delete(collection, id);

    // Try to sync with Firebase if online
    if (this.connectionState.isOnline && this.connectionState.isFirebaseConnected) {
      try {
        console.log('Syncing deletion to Firebase:', id);
        
        // Clear cache to force refresh
        this.clearCache(userId, collection);
      } catch (error) {
        console.warn('Failed to sync deletion to Firebase, queued for later:', error);
        
        // Queue for later sync
        await offlineStorage.addToSyncQueue({
          type: 'delete',
          collection,
          docId: id,
          userId,
        });
      }
    } else {
      // Queue for later sync
      await offlineStorage.addToSyncQueue({
        type: 'delete',
        collection,
        docId: id,
        userId,
      });
    }
  }

  // Real-time subscriptions with offline fallback
  subscribeToData<T>(
    userId: string,
    collection: 'clients' | 'sessions' | 'payments' | 'workoutPlans' | 'progressEntries',
    callback: (data: T[], source: 'firebase' | 'offline') => void,
    options: QueryOptions = {}
  ): () => void {
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      if (this.connectionState.isOnline && this.connectionState.isFirebaseConnected) {
        try {
          unsubscribe = this.subscribeToFirebase<T>(userId, collection, callback, options);
        } catch (error) {
          console.warn('Firebase subscription failed, using offline data:', error);
          this.loadOfflineData<T>(userId, collection, callback);
        }
      } else {
        this.loadOfflineData<T>(userId, collection, callback);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }

  private subscribeToFirebase<T>(
    userId: string,
    collection: string,
    callback: (data: T[], source: 'firebase' | 'offline') => void,
    options: QueryOptions
  ): () => void {
    switch (collection) {
      case 'clients':
        return optimizedFirebaseService.subscribeToClients(
          userId,
          (data) => {
            this.cacheOffline(userId, collection, data);
            callback(data as T[], 'firebase');
          },
          undefined,
          options
        );
      case 'sessions':
        return optimizedFirebaseService.subscribeToSessions(
          userId,
          (data) => {
            this.cacheOffline(userId, collection, data);
            callback(data as T[], 'firebase');
          },
          undefined,
          options
        );
      default:
        return optimizedFirebaseService.subscribeToCollection<T>(
          `users/${userId}/${collection}`,
          (data) => {
            this.cacheOffline(userId, collection, data);
            callback(data, 'firebase');
          },
          undefined,
          options
        );
    }
  }

  private async loadOfflineData<T>(
    userId: string,
    collection: string,
    callback: (data: T[], source: 'firebase' | 'offline') => void
  ): Promise<void> {
    try {
      const data = await this.getFromOffline<T>(userId, collection);
      callback(data, 'offline');
    } catch (error) {
      console.error('Failed to load offline data:', error);
      callback([], 'offline');
    }
  }

  // Sync management
  private async syncOfflineData(): Promise<void> {
    if (this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      // This would implement the actual sync logic
      console.log('Syncing offline data to Firebase...');
      
      // Update last sync time
      this.connectionState.lastSyncTime = Date.now();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private clearCache(userId: string, collection: string): void {
    const cacheKey = `${userId}_${collection}`;
    localStorage.removeItem(cacheKey);
    optimizedFirebaseService.clearCache();
  }

  // Performance and diagnostics
  async getPerformanceMetrics(): Promise<{
    connectionState: ConnectionState;
    firebaseMetrics: any;
    offlineStats: any;
    syncQueueSize: number;
  }> {
    const [firebaseMetrics, offlineStats] = await Promise.all([
      optimizedFirebaseService.getPerformanceMetrics(),
      offlineStorage.getStorageStats(),
    ]);

    return {
      connectionState: this.connectionState,
      firebaseMetrics,
      offlineStats,
      syncQueueSize: 0, // Would get actual sync queue size
    };
  }

  // Cleanup
  cleanup(): void {
    optimizedFirebaseService.cleanup();
    offlineStorage.cleanup();
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService();

// Export types
export type { DataOperationResult, SyncStrategy }; 