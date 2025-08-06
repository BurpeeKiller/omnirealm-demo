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

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now().toString()
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
    set((state) => {
      const id = Date.now().toString()
      const newToast = { id, type: 'success' as const, message }
      
      setTimeout(() => {
        state.removeToast(id)
      }, 3000)
      
      return {
        toasts: [...state.toasts, newToast]
      }
    })
  },
  
  error: (message) => {
    set((state) => {
      const id = Date.now().toString()
      const newToast = { id, type: 'error' as const, message }
      
      setTimeout(() => {
        state.removeToast(id)
      }, 5000)
      
      return {
        toasts: [...state.toasts, newToast]
      }
    })
  },
  
  info: (message) => {
    set((state) => {
      const id = Date.now().toString()
      const newToast = { id, type: 'info' as const, message }
      
      setTimeout(() => {
        state.removeToast(id)
      }, 3000)
      
      return {
        toasts: [...state.toasts, newToast]
      }
    })
  },
  
  warning: (message) => {
    set((state) => {
      const id = Date.now().toString()
      const newToast = { id, type: 'warning' as const, message }
      
      setTimeout(() => {
        state.removeToast(id)
      }, 4000)
      
      return {
        toasts: [...state.toasts, newToast]
      }
    })
  }
}))