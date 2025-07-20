import { logError, logWarning, logInfo, logDebug } from './errorCapture';

// Simple logger utility for consistent logging across the app
export const logger = {
  error: (message: string, error?: Error | unknown, context?: Record<string, any>) => {
    const metadata = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    };
    logError(message, metadata);
  },

  warn: (message: string, context?: Record<string, any>) => {
    logWarning(message, context);
  },

  info: (message: string, context?: Record<string, any>) => {
    logInfo(message, context);
  },

  debug: (message: string, context?: Record<string, any>) => {
    logDebug(message, context);
  }
};

// Convenience functions for common error patterns
export const logApiError = (operation: string, error: Error | unknown, context?: Record<string, any>) => {
  logger.error(`API Error in ${operation}`, error, { operation, ...context });
};

export const logValidationError = (field: string, value: unknown, context?: Record<string, any>) => {
  logger.warn(`Validation error for field: ${field}`, { field, value, ...context });
};

export const logUserAction = (action: string, context?: Record<string, any>) => {
  logger.info(`User action: ${action}`, context);
};

export const logPerformance = (operation: string, duration: number, context?: Record<string, any>) => {
  logger.debug(`Performance: ${operation} took ${duration}ms`, { operation, duration, ...context });
}; 