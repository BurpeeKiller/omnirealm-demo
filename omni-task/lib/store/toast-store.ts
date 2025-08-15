import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const newToast = { ...toast, id }
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))
    
    // Auto-remove après la durée spécifiée (par défaut 3s)
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }))
    }, toast.duration || 3000)
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
  
  success: (message) => {
    get().addToast({ type: 'success', message, duration: 3000 })
  },
  
  error: (message) => {
    get().addToast({ type: 'error', message, duration: 5000 })
  },
  
  info: (message) => {
    get().addToast({ type: 'info', message, duration: 3000 })
  },
  
  warning: (message) => {
    get().addToast({ type: 'warning', message, duration: 4000 })
  }
}))

// Export alias pour compatibilité
export const useToast = useToastStore