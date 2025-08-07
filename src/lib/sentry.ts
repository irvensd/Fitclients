import * as Sentry from '@sentry/react';
import { logger } from './logger';

/**
 * Sentry configuration for error tracking and performance monitoring
 */

// Get environment variables
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Only initialize Sentry in production or when DSN is provided
const shouldInitializeSentry = SENTRY_DSN && (ENVIRONMENT === 'production' || import.meta.env.VITE_SENTRY_ENABLED === 'true');

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export function initializeSentry() {
  if (!shouldInitializeSentry) {
    logger.info('Sentry not initialized: DSN not provided or not in production environment');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: `fitclients@${APP_VERSION}`,
    
    // Performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    
    // Capture performance for these operations
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/fitclients-.*\.web\.app/,
      /^https:\/\/.*\.googleapis\.com/,
      /^https:\/\/.*\.firebaseapp\.com/,
    ],
    
    // Capture 100% of errors in development, 10% in production
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Capture user sessions for replay (useful for debugging)
    replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter out noise
    beforeSend(event, hint) {
      // Don't send events for development console errors
      if (ENVIRONMENT === 'development') {
        logger.debug('Sentry event captured (dev mode)', { event });
      }
      
      // Filter out known unimportant errors
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore common browser extension errors
        if (error.message?.includes('Non-Error promise rejection captured')) {
          return null;
        }
        
        // Ignore network errors that are already handled
        if (error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch')) {
          // Only send if not already handled by our error system
          if (!error.message.includes('[HANDLED]')) {
            return event;
          }
          return null;
        }
      }
      
      return event;
    },
    
    // Set user context for better debugging
    initialScope: {
      tags: {
        component: 'fitclients-web',
      },
    },
  });

  // Set up global error handling
  window.addEventListener('unhandledrejection', (event) => {
    Sentry.captureException(event.reason);
  });

  logger.info('Sentry initialized successfully');
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}) {
  if (!shouldInitializeSentry) return;
  
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
    role: user.role,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearSentryUser() {
  if (!shouldInitializeSentry) return;
  
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addSentryBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: any) {
  if (!shouldInitializeSentry) return;
  
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture exception with context
 */
export function captureSentryException(error: Error, context?: {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: any;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}) {
  if (!shouldInitializeSentry) {
    console.error('Sentry not initialized, logging error locally:', error);
    return;
  }
  
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.keys(context.tags).forEach(key => {
        scope.setTag(key, context.tags![key]);
      });
    }
    
    if (context?.extra) {
      Object.keys(context.extra).forEach(key => {
        scope.setExtra(key, context.extra![key]);
      });
    }
    
    if (context?.user) {
      scope.setUser(context.user);
    }
    
    if (context?.level) {
      scope.setLevel(context.level);
    }
    
    Sentry.captureException(error);
  });
}

/**
 * Capture custom message
 */
export function captureSentryMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info', extra?: Record<string, any>) {
  if (!shouldInitializeSentry) {
    console.log('Sentry not initialized, logging message locally:', message);
    return;
  }
  
  Sentry.withScope((scope) => {
    if (extra) {
      Object.keys(extra).forEach(key => {
        scope.setExtra(key, extra[key]);
      });
    }
    
    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
}

/**
 * Start a performance span (modern replacement for transactions)
 */
export function startSentrySpan(name: string, operation: string) {
  if (!shouldInitializeSentry) return null;
  
  return Sentry.startSpan({
    name,
    op: operation,
  }, (span) => {
    return span;
  });
}

/**
 * Higher-order component for error boundary with Sentry
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

/**
 * Profiler for performance monitoring
 */
export const SentryProfiler = Sentry.Profiler;

export { Sentry }; 