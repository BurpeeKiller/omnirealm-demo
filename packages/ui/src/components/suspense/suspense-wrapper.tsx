import React, { Suspense as ReactSuspense } from 'react';

// import { cn } from '../../lib/utils'; // Commenté car non utilisé
import { ErrorBoundary } from '../error-boundary';

import { Skeleton, CardSkeleton, TableSkeleton, FormSkeleton } from './loading-skeleton';

interface SuspenseWrapperProps {
  /**
   * Les enfants à rendre
   */
  children: React.ReactNode;
  /**
   * Composant de fallback pendant le chargement
   */
  fallback?: React.ReactNode;
  /**
   * Type de skeleton prédéfini
   */
  skeletonType?: 'card' | 'table' | 'form' | 'text' | 'custom';
  /**
   * Props pour le skeleton (si skeletonType est utilisé)
   */
  skeletonProps?: any;
  /**
   * Callback en cas d'erreur
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /**
   * Composant de fallback pour les erreurs
   */
  errorFallback?: React.ComponentType<{ 
    error: Error; 
    reset: () => void;
    errorInfo?: React.ErrorInfo;
  }>;
  /**
   * Classes CSS additionnelles
   */
  className?: string;
  /**
   * Délai minimum d'affichage du skeleton (ms)
   */
  minLoadingTime?: number;
}

/**
 * Wrapper qui combine ErrorBoundary et Suspense
 * avec des skeletons prédéfinis
 */
export function SuspenseWrapper({
  children,
  fallback,
  skeletonType = 'text',
  skeletonProps = {},
  onError,
  errorFallback,
  className,
  minLoadingTime = 0,
}: SuspenseWrapperProps) {
  // Sélectionner le bon skeleton selon le type
  const getDefaultFallback = () => {
    switch (skeletonType) {
      case 'card':
        return <CardSkeleton {...skeletonProps} />;
      case 'table':
        return <TableSkeleton {...skeletonProps} />;
      case 'form':
        return <FormSkeleton {...skeletonProps} />;
      case 'text':
        return <Skeleton variant="text" {...skeletonProps} />;
      case 'custom':
        return null;
      default:
        return <Skeleton variant="text" />;
    }
  };
  
  const finalFallback = fallback || getDefaultFallback();
  
  // Si un temps minimum est défini, on utilise un composant qui gère le délai
  const FallbackWithDelay = minLoadingTime > 0 ? (
    <DelayedFallback delay={minLoadingTime}>
      {finalFallback}
    </DelayedFallback>
  ) : finalFallback;
  
  return (
    <ErrorBoundary 
      onError={onError} 
      fallback={errorFallback}
      className={className}
    >
      <ReactSuspense fallback={FallbackWithDelay}>
        {children}
      </ReactSuspense>
    </ErrorBoundary>
  );
}

/**
 * Composant pour afficher un fallback avec un délai minimum
 * Évite le flash de loading pour les chargements très rapides
 */
interface DelayedFallbackProps {
  delay: number;
  children: React.ReactNode;
}

function DelayedFallback({ delay, children }: DelayedFallbackProps) {
  const [show, setShow] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!show) return null;
  return <>{children}</>;
}

/**
 * Hook pour créer des composants lazy avec retry automatique
 */
export function useLazyWithRetry<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
) {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [attempt, setAttempt] = React.useState(0);
  
  React.useEffect(() => {
    let mounted = true;
    
    const loadComponent = async () => {
      try {
        setLoading(true);
        const module = await importFn();
        if (mounted) {
          setComponent(() => module.default);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          const error = err instanceof Error ? err : new Error('Failed to load component');
          setError(error);
          setLoading(false);
          
          // Retry si on n'a pas atteint la limite
          if (attempt < retries) {
            setTimeout(() => {
              setAttempt(prev => prev + 1);
            }, delay * Math.pow(2, attempt)); // Backoff exponentiel
          }
        }
      }
    };
    
    loadComponent();
    
    return () => {
      mounted = false;
    };
  }, [importFn, attempt, retries, delay]);
  
  return { Component, error, loading, retry: () => setAttempt(0) };
}

/**
 * Composant pour charger des routes lazy
 */
interface LazyRouteProps {
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ 
    error: Error; 
    reset: () => void;
  }>;
}

export function LazyRoute({ 
  importFn, 
  fallback,
  errorFallback 
}: LazyRouteProps) {
  const LazyComponent = React.lazy(importFn);
  
  return (
    <SuspenseWrapper
      fallback={fallback}
      errorFallback={errorFallback}
      skeletonType="card"
    >
      <LazyComponent />
    </SuspenseWrapper>
  );
}