import { useState, useCallback } from 'react';

interface LoadingState {
  loading: boolean;
  error: string | null;
  retry: () => void;
}

interface UseLoadingOptions {
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

/**
 * Custom hook for managing loading states
 * Provides loading, error, and retry functionality
 */
export function useLoading(
  asyncFunction: () => Promise<void>,
  options: UseLoadingOptions = {}
): LoadingState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await asyncFunction();
      options.onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, options]);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  return {
    loading,
    error,
    retry
  };
}

/**
 * Custom hook for managing multiple loading states
 */
export function useMultiLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const setError = useCallback((key: string, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  }, []);

  const executeAsync = useCallback(async (
    key: string,
    asyncFunction: () => Promise<void>
  ) => {
    setLoading(key, true);
    setError(key, null);

    try {
      await asyncFunction();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(key, errorMessage);
    } finally {
      setLoading(key, false);
    }
  }, [setLoading, setError]);

  const isLoading = useCallback((key: string) => loadingStates[key] || false, [loadingStates]);
  const getError = useCallback((key: string) => errors[key] || null, [errors]);
  const hasAnyLoading = Object.values(loadingStates).some(Boolean);
  const hasAnyError = Object.values(errors).some(Boolean);

  return {
    loadingStates,
    errors,
    setLoading,
    setError,
    executeAsync,
    isLoading,
    getError,
    hasAnyLoading,
    hasAnyError
  };
} 