import React from 'react';

/**
 * Performance monitoring utilities for the FitClients application
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled: boolean = import.meta.env.DEV;

  /**
   * Start timing a performance metric
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  /**
   * End timing a performance metric
   */
  end(name: string): number | undefined {
    if (!this.enabled) return;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log slow operations in development
    if (metric.duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`, metric.metadata);
    }

    return metric.duration;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for measuring function execution time
 */
export function usePerformanceMeasurement() {
  const measure = React.useCallback((name: string, fn: () => void) => {
    performanceMonitor.start(name);
    fn();
    performanceMonitor.end(name);
  }, []);

  const measureAsync = React.useCallback(async (name: string, fn: () => Promise<void>) => {
    performanceMonitor.start(name);
    try {
      await fn();
    } finally {
      performanceMonitor.end(name);
    }
  }, []);

  return { measure, measureAsync };
}

/**
 * Utility for measuring render performance of a component
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = React.useRef(0);
  const lastRenderTime = React.useRef(performance.now());

  React.useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (timeSinceLastRender < 1000) { // Only log if renders are happening frequently
      console.warn(`Frequent renders detected: ${componentName} rendered ${renderCount.current} times in ${timeSinceLastRender.toFixed(2)}ms`);
    }
  });
}

/**
 * Utility for measuring memory usage (if available)
 */
export function getMemoryUsage(): { used: number; total: number; limit: number } | null {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit
    };
  }
  return null;
}

/**
 * Utility for measuring network performance
 */
export function measureNetworkPerformance(url: string): Promise<number> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    fetch(url, { method: 'HEAD' })
      .then(() => {
        const duration = performance.now() - startTime;
        resolve(duration);
      })
      .catch(() => {
        resolve(-1); // Error
      });
  });
}

/**
 * Utility for measuring Firebase operation performance
 */
export function measureFirebaseOperation<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    performanceMonitor.start(operationName);
    
    operation()
      .then((result) => {
        performanceMonitor.end(operationName);
        resolve(result);
      })
      .catch((error) => {
        performanceMonitor.end(operationName);
        reject(error);
      });
  });
} 