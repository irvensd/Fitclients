import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { LoadingState, handleError, shouldShowRetryButton } from '@/lib/errorHandling';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  state: LoadingState;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onCancel?: () => void;
  showRetryButton?: boolean;
  variant?: 'default' | 'compact' | 'fullscreen';
  className?: string;
}

export function LoadingStateComponent({
  state,
  title = "Loading...",
  description = "Please wait while we process your request.",
  onRetry,
  onCancel,
  showRetryButton = true,
  variant = 'default',
  className
}: LoadingStateProps) {
  const { isLoading, error, retryCount, maxRetries } = state;
  const canRetry = showRetryButton && onRetry && shouldShowRetryButton(error) && retryCount < maxRetries;

  if (isLoading) {
    return (
      <LoadingSpinner 
        title={title} 
        description={description} 
        variant={variant}
        className={className}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        retryCount={retryCount}
        maxRetries={maxRetries}
        onRetry={canRetry ? onRetry : undefined}
        onCancel={onCancel}
        variant={variant}
        className={className}
      />
    );
  }

  return null;
}

interface LoadingSpinnerProps {
  title: string;
  description: string;
  variant: 'default' | 'compact' | 'fullscreen';
  className?: string;
}

function LoadingSpinner({ title, description, variant, className }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm">{description}</p>
    </div>
  );

  if (variant === 'fullscreen') {
    return (
      <div className={cn("min-h-screen flex items-center justify-center p-4 bg-gray-50", className)}>
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-gray-600">{title}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-8">
        {content}
      </CardContent>
    </Card>
  );
}

interface ErrorStateProps {
  error: string | null;
  retryCount: number;
  maxRetries: number;
  onRetry?: () => void;
  onCancel?: () => void;
  variant: 'default' | 'compact' | 'fullscreen';
  className?: string;
}

function ErrorState({ 
  error, 
  retryCount, 
  maxRetries, 
  onRetry, 
  onCancel, 
  variant, 
  className 
}: ErrorStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4 max-w-sm">{error}</p>
      
      {retryCount > 0 && (
        <Badge variant="secondary" className="mb-4">
          Attempt {retryCount} of {maxRetries + 1}
        </Badge>
      )}
      
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );

  if (variant === 'fullscreen') {
    return (
      <div className={cn("min-h-screen flex items-center justify-center p-4 bg-gray-50", className)}>
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-gray-600">{error}</span>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-8">
        {content}
      </CardContent>
    </Card>
  );
}

// Success state component
interface SuccessStateProps {
  title: string;
  description?: string;
  onContinue?: () => void;
  variant?: 'default' | 'compact' | 'fullscreen';
  className?: string;
}

export function SuccessState({ 
  title, 
  description, 
  onContinue, 
  variant = 'default',
  className 
}: SuccessStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4 max-w-sm">{description}</p>
      )}
      
      {onContinue && (
        <Button onClick={onContinue} className="w-full max-w-xs">
          Continue
        </Button>
      )}
    </div>
  );

  if (variant === 'fullscreen') {
    return (
      <div className={cn("min-h-screen flex items-center justify-center p-4 bg-gray-50", className)}>
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm text-gray-600">{title}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-8">
        {content}
      </CardContent>
    </Card>
  );
}

// Network status indicator
interface NetworkStatusProps {
  isOnline: boolean;
  className?: string;
}

export function NetworkStatus({ isOnline, className }: NetworkStatusProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-green-700">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-red-700">Offline</span>
        </>
      )}
    </div>
  );
}

// Hook for managing loading states
export function useLoadingState(maxRetries: number = 3) {
  const [state, setState] = React.useState<LoadingState>({
    isLoading: false,
    error: null,
    retryCount: 0,
    maxRetries
  });

  const setLoading = React.useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: isLoading ? null : prev.error }));
  }, []);

  const setError = React.useCallback((error: string | null) => {
    setState(prev => ({ 
      ...prev, 
      error, 
      isLoading: false,
      retryCount: error ? prev.retryCount + 1 : 0
    }));
  }, []);

  const reset = React.useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      retryCount: 0,
      maxRetries
    });
  }, [maxRetries]);

  const retry = React.useCallback(() => {
    if (state.retryCount < maxRetries) {
      setState(prev => ({ 
        ...prev, 
        retryCount: prev.retryCount + 1,
        error: null,
        isLoading: true
      }));
    }
  }, [state.retryCount, maxRetries]);

  return {
    state,
    setLoading,
    setError,
    reset,
    retry,
    canRetry: state.retryCount < maxRetries
  };
} 