import React from 'react';

import { cn } from '../../utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variante du skeleton
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /**
   * Largeur du skeleton (peut être un nombre en px ou une string CSS)
   */
  width?: number | string;
  /**
   * Hauteur du skeleton (peut être un nombre en px ou une string CSS)
   */
  height?: number | string;
  /**
   * Animation du skeleton
   */
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Composant Skeleton pour les états de chargement
 */
export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-muted relative overflow-hidden';
  
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-md',
  };
  
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'after:absolute after:inset-0 after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
    none: '',
  };
  
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...props.style,
  };
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={style}
      {...props}
    />
  );
}

/**
 * Groupe de skeletons pour les listes
 */
interface SkeletonGroupProps {
  count?: number;
  className?: string;
  children?: React.ReactNode;
}

export function SkeletonGroup({ 
  count = 3, 
  className,
  children 
}: SkeletonGroupProps) {
  if (children) {
    return <div className={cn('space-y-3', className)}>{children}</div>;
  }
  
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="text" />
      ))}
    </div>
  );
}

/**
 * Skeleton pour les cartes
 */
interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Afficher l'image placeholder
   */
  showImage?: boolean;
  /**
   * Nombre de lignes de texte
   */
  lines?: number;
}

export function CardSkeleton({ 
  className,
  showImage = true,
  lines = 3,
  ...props 
}: CardSkeletonProps) {
  return (
    <div 
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm',
        className
      )}
      {...props}
    >
      {showImage && (
        <Skeleton 
          variant="rounded" 
          height={200} 
          className="mb-4"
        />
      )}
      <Skeleton variant="text" height={24} width="60%" className="mb-2" />
      <SkeletonGroup count={lines} />
    </div>
  );
}

/**
 * Skeleton pour les tableaux
 */
interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Nombre de colonnes
   */
  columns?: number;
  /**
   * Nombre de lignes
   */
  rows?: number;
  /**
   * Afficher l'en-tête
   */
  showHeader?: boolean;
}

export function TableSkeleton({
  className,
  columns = 4,
  rows = 5,
  showHeader = true,
  ...props
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full overflow-hidden rounded-md border', className)} {...props}>
      {showHeader && (
        <div className="border-b bg-muted/50 p-4">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} variant="text" width={`${100 / columns}%`} />
            ))}
          </div>
        </div>
      )}
      <div className="p-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 py-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                variant="text" 
                width={`${100 / columns}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton pour les formulaires
 */
interface FormSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Nombre de champs
   */
  fields?: number;
  /**
   * Afficher le bouton submit
   */
  showSubmit?: boolean;
}

export function FormSkeleton({
  className,
  fields = 3,
  showSubmit = true,
  ...props
}: FormSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width={120} height={16} />
          <Skeleton variant="rounded" height={40} />
        </div>
      ))}
      {showSubmit && (
        <Skeleton variant="rounded" width={120} height={40} />
      )}
    </div>
  );
}