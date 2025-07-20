// Lazy import Firebase to prevent blocking app initialization
interface FirestoreImports {
  collection: any;
  addDoc: any;
  serverTimestamp: any;
}

let firestoreImports: FirestoreImports | null = null;
let db: any = null;

const getFirestore = async () => {
  if (!firestoreImports) {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db: database } = await import('./firebase');
      firestoreImports = { collection, addDoc, serverTimestamp };
      db = database;
    } catch (error) {
      console.warn('Firebase not available for error logging:', error);
      return null;
    }
  }
  return { ...firestoreImports, db };
};

// Global error capture for production debugging
export class ErrorCapture {
  private static instance: ErrorCapture;
  private isEnabled: boolean = true;

  private constructor() {
    this.setupErrorHandlers();
  }

  static getInstance(): ErrorCapture {
    if (!ErrorCapture.instance) {
      ErrorCapture.instance = new ErrorCapture();
    }
    return ErrorCapture.instance;
  }

  private setupErrorHandlers() {
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.logError({
        level: 'error',
        message: event.message,
        stack: event.error?.stack,
        service: 'frontend',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        level: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        service: 'frontend',
        metadata: {
          reason: event.reason?.toString(),
          promise: event.promise?.toString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      });
    });

    // Capture console errors
    const originalError = console.error;
    console.error = (...args) => {
      this.logError({
        level: 'error',
        message: args.map(arg => String(arg)).join(' '),
        service: 'console',
        metadata: {
          arguments: args,
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      });
      originalError.apply(console, args);
    };
  }

  async logError(errorData: {
    level: 'error' | 'warning' | 'info' | 'debug';
    message: string;
    stack?: string;
    service: string;
    metadata?: Record<string, any>;
  }) {
    if (!this.isEnabled) return;

    try {
      // Get Firebase services
      const firestore = await getFirestore();
      if (!firestore) {
        console.warn('Firebase not available, skipping error logging');
        return;
      }

      const { collection, addDoc, serverTimestamp, db } = firestore;

      // Get user context if available
      const userId = localStorage.getItem('userId') || 'anonymous';
      const sessionId = sessionStorage.getItem('sessionId') || this.generateSessionId();

      await addDoc(collection(db, 'errorLogs'), {
        ...errorData,
        timestamp: serverTimestamp(),
        userId,
        sessionId,
        environment: 'production',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      // Silently fail to avoid infinite loop
      console.warn('Failed to log error to Firebase:', error);
    }
  }

  private generateSessionId(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
    return sessionId;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Manual error logging
  static log(level: 'error' | 'warning' | 'info' | 'debug', message: string, metadata?: Record<string, any>) {
    const instance = ErrorCapture.getInstance();
    instance.logError({
      level,
      message,
      service: 'manual',
      metadata
    });
  }
}

// Initialize error capture
export const errorCapture = ErrorCapture.getInstance();

// Export convenience methods
export const logError = (message: string, metadata?: Record<string, any>) => 
  ErrorCapture.log('error', message, metadata);

export const logWarning = (message: string, metadata?: Record<string, any>) => 
  ErrorCapture.log('warning', message, metadata);

export const logInfo = (message: string, metadata?: Record<string, any>) => 
  ErrorCapture.log('info', message, metadata);

export const logDebug = (message: string, metadata?: Record<string, any>) => 
  ErrorCapture.log('debug', message, metadata); 