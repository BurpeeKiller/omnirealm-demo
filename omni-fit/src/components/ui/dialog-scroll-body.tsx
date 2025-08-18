import { cn } from "@/lib/utils"
import React from "react"

interface DialogScrollBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  enableScroll?: boolean;
}

export const DialogScrollBody = ({
  className,
  children,
  enableScroll = false,
  ...props
}: DialogScrollBodyProps) => (
  <div
    className={cn(
      "flex-1 min-h-0 bg-gray-50 dark:bg-gray-800",
      enableScroll && "overflow-y-auto",
      className
    )}
    {...props}
  >
    {/* Wrapper interne pour le padding */}
    <div className={cn("h-full", enableScroll && "p-6")}>
      {children}
    </div>
  </div>
)

DialogScrollBody.displayName = "DialogScrollBody"