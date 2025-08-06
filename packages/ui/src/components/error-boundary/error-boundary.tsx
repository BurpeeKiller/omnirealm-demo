'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import React from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ 
    error: Error; 
    reset: () => void;
    errorInfo?: React.ErrorInfo;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

/**
 * ErrorBoundary pour capturer les erreurs React
 * Affiche un fallback personnalisable en cas d'erreur
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Met à jour l'état pour afficher le fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log l'erreur dans la console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Appeler le callback si fourni
    this.props.onError?.(error, errorInfo);
    
    // Mettre à jour l'état avec les infos d'erreur
    this.setState({ errorInfo });
    
    // En production, envoyer à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // TODO: Intégrer avec Sentry ou autre service
      // window.Sentry?.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <div className={cn('error-boundary-wrapper', this.props.className)}>
          <FallbackComponent 
            error={this.state.error} 
            reset={this.reset}
            errorInfo={this.state.errorInfo}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Composant fallback par défaut
 */
function DefaultErrorFallback({ 
  error, 
  reset,
  errorInfo
}: { 
  error: Error; 
  reset: () => void;
  errorInfo?: React.ErrorInfo;
}) {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Icône d'erreur */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        {/* Titre */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Une erreur est survenue
          </h2>
          <p className="text-sm text-muted-foreground">
            Nous sommes désolés, quelque chose s&apos;est mal passé.
          </p>
        </div>
        
        {/* Message d'erreur (dev only) */}
        {isDev && (
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="mb-2 text-sm font-medium">Détails de l&apos;erreur :</p>
            <pre className="overflow-auto text-xs text-muted-foreground">
              {error.message}
            </pre>
            {errorInfo && (
              <>
                <p className="mb-2 mt-4 text-sm font-medium">Stack trace :</p>
                <pre className="max-h-40 overflow-auto text-xs text-muted-foreground">
                  {errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </div>
        
        {/* Message d'aide */}
        <p className="text-xs text-muted-foreground">
          Si le problème persiste, veuillez contacter le support.
        </p>
      </div>
    </div>
  );
}

/**
 * Hook pour déclencher une erreur de manière asynchrone
 * Utile pour les erreurs dans les event handlers
 */
export function useAsyncError() {
  const [, setError] = React.useState();
  
  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
}

/**
 * HOC pour wrapper un composant avec ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}