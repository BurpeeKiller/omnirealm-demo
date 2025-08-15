import { forwardRef } from 'react'
import { Button, ButtonProps } from '@/components/ui'
import { Loader2 } from 'lucide-react'

interface AccessibleButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
  'aria-label'?: string
  'aria-describedby'?: string
  icon?: React.ReactNode
}

export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({ 
  children, 
  isLoading = false, 
  loadingText = "Chargement...",
  disabled,
  icon,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  className = '',
  ...props 
}, ref) => {
  // Générer un label automatique si non fourni
  const computedAriaLabel = ariaLabel || (
    typeof children === 'string' ? children : undefined
  )

  return (
    <Button
      ref={ref}
      disabled={disabled || isLoading}
      aria-label={computedAriaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      className={`
        relative
        ${isLoading ? 'cursor-wait' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Contenu visible */}
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </span>

      {/* Loader centré */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText}</span>
        </span>
      )}
    </Button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

// Variante pour les actions destructives
export const AccessibleDestructiveButton = forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>((props, ref) => {
  return (
    <AccessibleButton
      ref={ref}
      variant="destructive"
      role="button"
      aria-describedby={props['aria-describedby'] || "action-destructive"}
      {...props}
    />
  )
})

AccessibleDestructiveButton.displayName = 'AccessibleDestructiveButton'

// Groupe de boutons avec navigation clavier
interface AccessibleButtonGroupProps {
  children: React.ReactNode
  'aria-label': string
  orientation?: 'horizontal' | 'vertical'
}

export function AccessibleButtonGroup({ 
  children, 
  'aria-label': ariaLabel,
  orientation = 'horizontal' 
}: AccessibleButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={`
        flex gap-2
        ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
      `}
      onKeyDown={(e) => {
        const buttons = e.currentTarget.querySelectorAll('button:not([disabled])')
        const currentIndex = Array.from(buttons).indexOf(document.activeElement as HTMLButtonElement)
        
        let nextIndex = -1
        
        if (orientation === 'horizontal') {
          if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length
          if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
        } else {
          if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % buttons.length
          if (e.key === 'ArrowUp') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
        }
        
        if (nextIndex >= 0) {
          e.preventDefault()
          ;(buttons[nextIndex] as HTMLButtonElement).focus()
        }
      }}
    >
      {children}
    </div>
  )
}