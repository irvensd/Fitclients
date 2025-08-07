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
// Import the proper logger from logger.ts
import { logger as appLogger } from './logger';

export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      appLogger.info(args.join(' '));
    }
  },
  warn: (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
    appLogger.warn(message);
  },
  error: (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
    const firstArg = args[0];
    
    if (firstArg instanceof Error) {
      appLogger.error(message, firstArg);
    } else {
      appLogger.error(message);
    }
  },
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
      appLogger.debug(message);
    }
  },
  info: (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
    appLogger.info(message);
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
