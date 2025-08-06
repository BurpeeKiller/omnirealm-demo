import React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = {
  variant?: 'default' | 'outline' | 'success' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<'button'>;

export function LuxeButton({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'relative overflow-hidden rounded-xl font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50'
  );

  const variantClasses = {
    default: 'border border-transparent bg-gray-900 text-gray-100 shadow-inner hover:bg-gray-800',
    outline: 'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50',
    success: 'bg-gradient-to-t from-green-700 to-green-600 text-white hover:from-green-800 hover:to-green-700',
    destructive: 'bg-gradient-to-t from-red-700 to-red-600 text-white hover:from-red-800 hover:to-red-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}