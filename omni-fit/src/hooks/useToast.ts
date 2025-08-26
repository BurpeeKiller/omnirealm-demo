"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default", action }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, title, description, variant, action };

      setToasts(prev => [...prev, newToast]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        dismissToast(id);
      }, 5000);

      return id;
    },
    []
  );

  const dismissToast = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  return { toasts, toast, dismissToast };
}
