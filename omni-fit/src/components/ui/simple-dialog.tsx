import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-black/60",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface CustomDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
  fullHeight?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  CustomDialogContentProps
>(({ className, children, showCloseButton = true, fullHeight = true, ...props }, ref) => {
  // Hauteur de la nav bottom = 64px environ
  const BOTTOM_NAV_HEIGHT = 64;
  
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // Position simple : fixe avec bottom égal à la hauteur de la nav
          "fixed left-0 right-0 z-[101] bg-gray-900 shadow-2xl flex flex-col overflow-hidden",
          // Sur mobile : juste au-dessus de la nav
          // Sur desktop : centré
          `bottom-[${BOTTOM_NAV_HEIGHT}px] h-[80vh] rounded-t-3xl`,
          `md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-auto md:max-h-[90vh] md:w-full md:max-w-4xl md:rounded-3xl`,
          className
        )}
        style={{
          // Forcer le bottom sur mobile
          bottom: window.innerWidth < 768 ? `${BOTTOM_NAV_HEIGHT}px` : undefined
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
})
DialogContent.displayName = DialogPrimitive.Content.displayName

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

const DialogHeader = ({
  className,
  children,
  gradient = "from-purple-600 to-pink-600",
  icon,
  subtitle,
  ...props
}: DialogHeaderProps) => (
  <div
    className={cn(
      "p-6",
      gradient && `bg-gradient-to-r ${gradient}`,
      className
    )}
    {...props}
  >
    {icon || children ? (
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {icon}
          {typeof children === 'string' ? (
            <h2 className="text-2xl font-bold text-white">{children}</h2>
          ) : (
            children
          )}
        </div>
        <DialogPrimitive.Close className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6 text-white" />
        </DialogPrimitive.Close>
      </div>
    ) : null}
    {subtitle && <p className="text-purple-100">{subtitle}</p>}
  </div>
)
DialogHeader.displayName = "DialogHeader"

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800",
      className
    )}
    {...props}
  />
)
DialogBody.displayName = "DialogBody"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-2xl font-bold text-white",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-purple-100", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}