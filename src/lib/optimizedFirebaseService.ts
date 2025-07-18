import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  getDoc,
  DocumentSnapshot,
  Query,
  Unsubscribe,
  enableNetwork,
  disableNetwork,
  connectFirestoreEmulator,
  writeBatch,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Client, Session, Payment, WorkoutPlan, ProgressEntry } from "./types";

// Query cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Subscription manager interface
interface SubscriptionManager {
  subscriptions: Map<string, Unsubscribe>;
  cleanup: () => void;
  add: (key: string, unsubscribe: Unsubscribe) => void;
  remove: (key: string) => void;
}

// Pagination interface
interface PaginationOptions {
  pageSize: number;
  lastDoc?: DocumentSnapshot;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

// Query options interface
interface QueryOptions {
  useCache?: boolean;
  cacheTTL?: number;
  realtime?: boolean;
  pagination?: PaginationOptions;
}

class OptimizedFirebaseService {
  private cache = new Map<string, CacheEntry<any>>();
  private subscriptionManager: SubscriptionManager;
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_PAGE_SIZE = 50;
  private isOffline = false;

  constructor() {
    this.subscriptionManager = {
      subscriptions: new Map(),
      cleanup: () => {
        this.subscriptionManager.subscriptions.forEach((unsubscribe) => {
          unsubscribe();
        });
        this.subscriptionManager.subscriptions.clear();
      },
      add: (key: string, unsubscribe: Unsubscribe) => {
        // Clean up existing subscription if it exists
        const existing = this.subscriptionManager.subscriptions.get(key);
        if (existing) {
          existing();
        }
        this.subscriptionManager.subscriptions.set(key, unsubscribe);
      },
      remove: (key: string) => {
        const unsubscribe = this.subscriptionManager.subscriptions.get(key);
        if (unsubscribe) {
          unsubscribe();
          this.subscriptionManager.subscriptions.delete(key);
        }
      },
    };

    // Set up offline detection
    this.setupOfflineDetection();
  }

  private setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.isOffline = false;
      enableNetwork(db).catch(console.error);
    });

    window.addEventListener('offline', () => {
      this.isOffline = true;
      disableNetwork(db).catch(console.error);
    });
  }

  private getCacheKey(collectionPath: string, queryParams?: any): string {
    return `${collectionPath}_${JSON.stringify(queryParams || {})}`;
  }

  private isValidCache<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && this.isValidCache(entry)) {
      return entry.data as T;
    }
    
    // Clean up expired cache
    if (entry) {
      this.cache.delete(key);
    }
    
    return null;
  }

  private clearCachePattern(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern)
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Generic collection operations with optimization
  async getCollection<T>(
    collectionPath: string,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const {
      useCache = true,
      cacheTTL = this.DEFAULT_CACHE_TTL,
      pagination,
    } = options;

    const cacheKey = this.getCacheKey(collectionPath, pagination);
    
    // Return cached data if available and valid
    if (useCache) {
      const cachedData = this.getCache<T[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      let q: Query = collection(db, collectionPath);

      // Apply pagination
      if (pagination) {
        if (pagination.orderByField) {
          q = query(
            q,
            orderBy(pagination.orderByField, pagination.orderDirection || 'asc'),
            limit(pagination.pageSize || this.DEFAULT_PAGE_SIZE)
          );
        } else {
          q = query(q, limit(pagination.pageSize || this.DEFAULT_PAGE_SIZE));
        }

        if (pagination.lastDoc) {
          q = query(q, startAfter(pagination.lastDoc));
        }
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as T[];

      // Cache the results
      if (useCache) {
        this.setCache(cacheKey, data, cacheTTL);
      }

      return data;
    } catch (error) {
      console.error(`Error fetching collection ${collectionPath}:`, error);
      
      // Return cached data as fallback
      if (useCache) {
        const cachedData = this.getCache<T[]>(cacheKey);
        if (cachedData) {
          return cachedData;
        }
      }
      
      throw error;
    }
  }

  // Real-time subscription with optimization
  subscribeToCollection<T>(
    collectionPath: string,
    callback: (data: T[]) => void,
    errorCallback?: (error: Error) => void,
    options: QueryOptions = {}
  ): () => void {
    const subscriptionKey = `${collectionPath}_${Date.now()}`;
    
    let q: Query = collection(db, collectionPath);

    // Apply pagination to real-time queries
    if (options.pagination) {
      if (options.pagination.orderByField) {
        q = query(
          q,
          orderBy(options.pagination.orderByField, options.pagination.orderDirection || 'asc'),
          limit(options.pagination.pageSize || this.DEFAULT_PAGE_SIZE)
        );
      }
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as T[];

        // Update cache
        if (options.useCache !== false) {
          const cacheKey = this.getCacheKey(collectionPath, options.pagination);
          this.setCache(cacheKey, data, options.cacheTTL);
        }

        callback(data);
      },
      (error) => {
        console.error(`Error in subscription ${collectionPath}:`, error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );

    this.subscriptionManager.add(subscriptionKey, unsubscribe);

    return () => {
      this.subscriptionManager.remove(subscriptionKey);
    };
  }

  // Batch operations for better performance
  async batchWrite(operations: Array<{
    type: 'add' | 'update' | 'delete';
    collectionPath: string;
    docId?: string;
    data?: any;
  }>): Promise<void> {
    const batch = writeBatch(db);

    operations.forEach(({ type, collectionPath, docId, data }) => {
      switch (type) {
        case 'add':
          const newDocRef = doc(collection(db, collectionPath));
          batch.set(newDocRef, { ...data, createdAt: serverTimestamp() });
          break;
        case 'update':
          if (docId) {
            const updateDocRef = doc(db, collectionPath, docId);
            batch.update(updateDocRef, { ...data, updatedAt: serverTimestamp() });
          }
          break;
        case 'delete':
          if (docId) {
            const deleteDocRef = doc(db, collectionPath, docId);
            batch.delete(deleteDocRef);
          }
          break;
      }
    });

    await batch.commit();
    
    // Clear relevant caches
    operations.forEach(({ collectionPath }) => {
      this.clearCachePattern(collectionPath);
    });
  }

  // Transaction support for complex operations
  async runTransaction<T>(
    updateFunction: (transaction: any) => Promise<T>
  ): Promise<T> {
    return runTransaction(db, updateFunction);
  }

  // Optimized client operations
  async getClients(userId: string, options: QueryOptions = {}): Promise<Client[]> {
    const collectionPath = `users/${userId}/clients`;
    return this.getCollection<Client>(collectionPath, {
      ...options,
      pagination: options.pagination || {
        pageSize: this.DEFAULT_PAGE_SIZE,
        orderByField: 'dateJoined',
        orderDirection: 'desc',
      },
    });
  }

  subscribeToClients(
    userId: string,
    callback: (clients: Client[]) => void,
    errorCallback?: (error: Error) => void,
    options: QueryOptions = {}
  ): () => void {
    const collectionPath = `users/${userId}/clients`;
    return this.subscribeToCollection<Client>(
      collectionPath,
      callback,
      errorCallback,
      {
        ...options,
        pagination: options.pagination || {
          pageSize: this.DEFAULT_PAGE_SIZE,
          orderByField: 'dateJoined',
          orderDirection: 'desc',
        },
      }
    );
  }

  // Optimized session operations
  async getSessions(userId: string, options: QueryOptions = {}): Promise<Session[]> {
    const collectionPath = `users/${userId}/sessions`;
    return this.getCollection<Session>(collectionPath, {
      ...options,
      pagination: options.pagination || {
        pageSize: this.DEFAULT_PAGE_SIZE,
        orderByField: 'date',
        orderDirection: 'desc',
      },
    });
  }

  subscribeToSessions(
    userId: string,
    callback: (sessions: Session[]) => void,
    errorCallback?: (error: Error) => void,
    options: QueryOptions = {}
  ): () => void {
    const collectionPath = `users/${userId}/sessions`;
    return this.subscribeToCollection<Session>(
      collectionPath,
      callback,
      errorCallback,
      {
        ...options,
        pagination: options.pagination || {
          pageSize: this.DEFAULT_PAGE_SIZE,
          orderByField: 'date',
          orderDirection: 'desc',
        },
      }
    );
  }

  // Performance monitoring
  async getPerformanceMetrics(): Promise<{
    cacheHitRate: number;
    cacheSize: number;
    activeSubscriptions: number;
    isOffline: boolean;
  }> {
    return {
      cacheHitRate: this.calculateCacheHitRate(),
      cacheSize: this.cache.size,
      activeSubscriptions: this.subscriptionManager.subscriptions.size,
      isOffline: this.isOffline,
    };
  }

  private calculateCacheHitRate(): number {
    // This would be implemented with actual hit/miss tracking
    // For now, return a mock value
    return 0.85; // 85% cache hit rate
  }

  // Cleanup method
  cleanup(): void {
    this.subscriptionManager.cleanup();
    this.cache.clear();
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): {
    size: number;
    entries: string[];
  } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const optimizedFirebaseService = new OptimizedFirebaseService();

// Export types for use in components
export type { QueryOptions, PaginationOptions }; 