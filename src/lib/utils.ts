import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: string) => {
  if (!time || !time.includes(":")) {
    return "Invalid Time";
  }
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatSessionType = (type: string) => {
  switch (type) {
    case "personal-training":
      return "Personal Training";
    case "assessment":
      return "Assessment";
    case "consultation":
      return "Consultation";
    default:
      return type;
  }
};

export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 14) return "1 week ago";
  if (diffDays <= 21) return "2 weeks ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
};

export const formatCancellationTime = (cancelledAt: string) => {
  const date = new Date(cancelledAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

/**
 * Production-friendly logging utility with Sentry integration
 * Only logs in development mode to keep production console clean
 * Sends errors to Sentry in production
 */
export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
    
    // Send warnings to Sentry in production for monitoring
    if (import.meta.env.PROD) {
      try {
        const { captureSentryMessage } = require('./sentry');
        const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
        captureSentryMessage(message, 'warning');
      } catch (error) {
        // Fallback if Sentry is not available
        console.warn('Failed to send warning to Sentry:', error);
      }
    }
  },
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
    
    // Send errors to Sentry in production
    if (import.meta.env.PROD) {
      try {
        const { captureSentryException, captureSentryMessage } = require('./sentry');
        const firstArg = args[0];
        
        if (firstArg instanceof Error) {
          // Send actual Error objects to Sentry
          captureSentryException(firstArg, {
            extra: {
              additionalArgs: args.slice(1),
              timestamp: new Date().toISOString(),
            }
          });
        } else {
          // Send error messages to Sentry
          const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
          captureSentryMessage(message, 'error', {
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        // Fallback if Sentry is not available
        console.error('Failed to send error to Sentry:', error);
      }
    }
  },
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log('[DEBUG]', ...args);
    }
    
    // Optionally send debug info to Sentry for troubleshooting
    if (import.meta.env.VITE_SENTRY_DEBUG === 'true') {
      try {
        const { captureSentryMessage } = require('./sentry');
        const message = '[DEBUG] ' + args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
        captureSentryMessage(message, 'debug');
      } catch (error) {
        // Silent fallback for debug messages
      }
    }
  },
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.info('[INFO]', ...args);
    }
    
    // Send important info to Sentry for monitoring
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_INFO === 'true') {
      try {
        const { captureSentryMessage } = require('./sentry');
        const message = '[INFO] ' + args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
        captureSentryMessage(message, 'info');
      } catch (error) {
        // Silent fallback for info messages
      }
    }
  }
};

/**
 * Performance optimization utilities
 */

// Debounce function to limit how often a function can be called
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function to limit function execution rate
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization helper for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Intersection Observer helper for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};

// Performance measurement helper
export const measurePerformance = <T extends (...args: any[]) => any>(
  name: string,
  func: T
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
};
