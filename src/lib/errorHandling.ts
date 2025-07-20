import { logger, logApiError } from './logger';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

// Error categories for user-friendly messages
export interface ErrorCategory {
  type: ErrorType;
  userMessage: string;
  retryable: boolean;
  maxRetries: number;
  retryDelay: number;
}

// Error categories configuration
export const ERROR_CATEGORIES: Record<string, ErrorCategory> = {
  // Network errors
  'network-error': {
    type: ErrorType.NETWORK,
    userMessage: 'Connection failed. Please check your internet connection and try again.',
    retryable: true,
    maxRetries: 3,
    retryDelay: 1000
  },
  'timeout': {
    type: ErrorType.TIMEOUT,
    userMessage: 'Request timed out. Please try again.',
    retryable: true,
    maxRetries: 2,
    retryDelay: 2000
  },
  
  // Authentication errors
  'auth/user-not-found': {
    type: ErrorType.AUTHENTICATION,
    userMessage: 'User account not found. Please check your credentials.',
    retryable: false,
    maxRetries: 0,
    retryDelay: 0
  },
  'auth/wrong-password': {
    type: ErrorType.AUTHENTICATION,
    userMessage: 'Incorrect password. Please try again.',
    retryable: false,
    maxRetries: 0,
    retryDelay: 0
  },
  'auth/too-many-requests': {
    type: ErrorType.AUTHENTICATION,
    userMessage: 'Too many failed attempts. Please wait a moment before trying again.',
    retryable: true,
    maxRetries: 1,
    retryDelay: 5000
  },
  
  // Authorization errors
  'permission-denied': {
    type: ErrorType.AUTHORIZATION,
    userMessage: 'You don\'t have permission to perform this action.',
    retryable: false,
    maxRetries: 0,
    retryDelay: 0
  },
  
  // Validation errors
  'validation-error': {
    type: ErrorType.VALIDATION,
    userMessage: 'Please check your input and try again.',
    retryable: false,
    maxRetries: 0,
    retryDelay: 0
  },
  
  // Not found errors
  'not-found': {
    type: ErrorType.NOT_FOUND,
    userMessage: 'The requested resource was not found.',
    retryable: false,
    maxRetries: 0,
    retryDelay: 0
  },
  
  // Server errors
  'server-error': {
    type: ErrorType.SERVER_ERROR,
    userMessage: 'Something went wrong on our end. Please try again later.',
    retryable: true,
    maxRetries: 2,
    retryDelay: 3000
  }
};

// Default error category
const DEFAULT_ERROR: ErrorCategory = {
  type: ErrorType.UNKNOWN,
  userMessage: 'An unexpected error occurred. Please try again.',
  retryable: true,
  maxRetries: 1,
  retryDelay: 1000
};

// Error analysis function
export function analyzeError(error: any): ErrorCategory {
  if (!error) return DEFAULT_ERROR;
  
  // Check for Firebase Auth errors
  if (error.code && ERROR_CATEGORIES[error.code]) {
    return ERROR_CATEGORIES[error.code];
  }
  
  // Check for network errors
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return ERROR_CATEGORIES['network-error'];
  }
  
  // Check for timeout errors
  if (error.message?.includes('timeout') || error.name === 'TimeoutError') {
    return ERROR_CATEGORIES['timeout'];
  }
  
  // Check for validation errors
  if (error.message?.includes('validation') || error.name === 'ValidationError') {
    return ERROR_CATEGORIES['validation-error'];
  }
  
  // Check for permission errors
  if (error.message?.includes('permission') || error.code === 'permission-denied') {
    return ERROR_CATEGORIES['permission-denied'];
  }
  
  // Check for not found errors
  if (error.message?.includes('not found') || error.code === 'not-found') {
    return ERROR_CATEGORIES['not-found'];
  }
  
  // Check for server errors (5xx status codes)
  if (error.status >= 500) {
    return ERROR_CATEGORIES['server-error'];
  }
  
  return DEFAULT_ERROR;
}

// Retry mechanism with exponential backoff
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context?: string
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        // Final attempt failed, log and throw
        logApiError(`Operation failed after ${maxRetries + 1} attempts`, error, { 
          context, 
          attempts: attempt + 1,
          maxRetries 
        });
        throw error;
      }
      
      // Analyze error to determine if retryable
      const errorCategory = analyzeError(error);
      if (!errorCategory.retryable) {
        logApiError('Non-retryable error encountered', error, { context, attempt });
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      logger.warn(`Operation failed, retrying in ${delay}ms`, { 
        context, 
        attempt: attempt + 1, 
        maxRetries,
        error: error.message 
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Enhanced error handler with user-friendly messages
export function handleError(
  error: any, 
  context: string, 
  metadata?: Record<string, any>
): { userMessage: string; shouldRetry: boolean; retryDelay: number } {
  const errorCategory = analyzeError(error);
  
  // Log the error with context
  logApiError(context, error, metadata);
  
  return {
    userMessage: errorCategory.userMessage,
    shouldRetry: errorCategory.retryable,
    retryDelay: errorCategory.retryDelay
  };
}

// Error boundary error handler
export function handleErrorBoundaryError(
  error: Error, 
  errorInfo: React.ErrorInfo
): void {
  logger.error('Error boundary caught error', error, {
    componentStack: errorInfo.componentStack,
    errorName: error.name,
    errorMessage: error.message
  });
}

// Loading state management
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  maxRetries: number;
}

export function createLoadingState(maxRetries: number = 3): LoadingState {
  return {
    isLoading: false,
    error: null,
    retryCount: 0,
    maxRetries
  };
}

// Async operation wrapper with loading state
export async function withLoadingState<T>(
  operation: () => Promise<T>,
  setLoadingState: (state: Partial<LoadingState>) => void,
  context: string,
  maxRetries: number = 3
): Promise<T> {
  setLoadingState({ isLoading: true, error: null });
  
  try {
    const result = await retryOperation(operation, maxRetries, 1000, context);
    setLoadingState({ isLoading: false, error: null, retryCount: 0 });
    return result;
  } catch (error) {
    const { userMessage, shouldRetry, retryDelay } = handleError(error, context);
    
    if (shouldRetry) {
      setLoadingState({ 
        isLoading: false, 
        error: userMessage,
        retryCount: 1
      });
      
      // Auto-retry after delay
      setTimeout(() => {
        setLoadingState({ isLoading: true, error: null });
        withLoadingState(operation, setLoadingState, context, maxRetries - 1);
      }, retryDelay);
    } else {
      setLoadingState({ 
        isLoading: false, 
        error: userMessage,
        retryCount: 0
      });
    }
    
    throw error;
  }
}

// Debounced retry function
export function createDebouncedRetry(
  operation: () => Promise<any>,
  delay: number = 1000
): () => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(operation, delay);
  };
}

// Error recovery utilities
export function isRecoverableError(error: any): boolean {
  const errorCategory = analyzeError(error);
  return errorCategory.retryable;
}

export function getRetryDelay(error: any): number {
  const errorCategory = analyzeError(error);
  return errorCategory.retryDelay;
}

export function shouldShowRetryButton(error: any): boolean {
  const errorCategory = analyzeError(error);
  return errorCategory.retryable && errorCategory.maxRetries > 0;
} 