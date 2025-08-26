import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Un seul composant Modal pour tout gérer
const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

// Overlay simple et efficace
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-40 bg-black/80 backdrop-blur-sm", className)}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

// Content avec variants simples
interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: "centered" | "mobile-bottom";
  hideCloseButton?: boolean;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, variant = "centered", hideCloseButton, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base styles
        "fixed z-50 bg-gray-800 border border-gray-700 shadow-2xl",

        // Variant: centered (default)
        variant === "centered" && [
          "left-[50%] top-[50%]",
          "translate-x-[-50%] translate-y-[-50%]",
          "w-[90vw] max-w-lg",
          "max-h-[85vh]",
          "rounded-lg",
          "p-6",
        ],

        // Variant: mobile-bottom
        variant === "mobile-bottom" && [
          // Mobile
          "bottom-0 left-0 right-0",
          "max-h-[80vh]",
          "rounded-t-2xl",
          // Desktop
          "sm:bottom-auto sm:left-[50%] sm:top-[50%]",
          "sm:right-auto sm:w-[90vw] sm:max-w-2xl",
          "sm:translate-x-[-50%] sm:translate-y-[-50%]",
          "sm:rounded-2xl",
        ],

        "overflow-hidden flex flex-col",
        className
      )}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = "ModalContent";

// Header simple
const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
ModalHeader.displayName = "ModalHeader";

// Body avec scroll
const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto py-4", className)} {...props} />
);
ModalBody.displayName = "ModalBody";

// Footer simple
const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4", className)}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";

// Title
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-white", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

// Description
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
