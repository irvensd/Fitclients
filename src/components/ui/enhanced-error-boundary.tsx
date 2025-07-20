import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';
import { handleErrorBoundaryError, shouldShowRetryButton } from '@/lib/errorHandling';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  maxRetries: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      maxRetries: 3
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    handleErrorBoundaryError(error, errorInfo);
    
    // Update state
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when props change (if enabled)
    if (this.props.resetOnPropsChange && prevProps !== this.props) {
      this.resetError();
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  handleRetry = () => {
    const { retryCount, maxRetries } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState(prev => ({ retryCount: prev.retryCount + 1 }));
      this.resetError();
    }
  };

  handleGoHome = () => {
    // This will be handled by the ErrorFallback component
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error fallback
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          maxRetries={this.state.maxRetries}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onGoHome: () => void;
}

function ErrorFallback({ 
  error, 
  errorInfo, 
  retryCount, 
  maxRetries, 
  onRetry, 
  onGoHome 
}: ErrorFallbackProps) {
  const navigate = useNavigate();
  const canRetry = shouldShowRetryButton(error) && retryCount < maxRetries;

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-gray-600">
            {canRetry 
              ? `We encountered an error. You can try again (${retryCount + 1}/${maxRetries + 1}).`
              : "We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists."
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Error Details:</p>
              <p className="text-xs text-gray-600 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            {canRetry && (
              <Button 
                onClick={onRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
            
            <Button 
              onClick={handleGoHome}
              className="w-full"
              variant="outline"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && errorInfo && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Development Details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    handleErrorBoundaryError(error, { componentStack: '' });
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const retry = React.useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      resetError();
    }
  }, [retryCount, resetError]);

  return {
    error,
    retryCount,
    maxRetries,
    handleError,
    resetError,
    retry,
    canRetry: retryCount < maxRetries
  };
} 