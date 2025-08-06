'use client'

import { useToastStore } from '@/lib/store/toast-store'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500'
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div className="flex flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          
          return (
            <div
              key={toast.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg pointer-events-auto',
                'transition-all duration-300 transform',
                colors[toast.type]
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', iconColors[toast.type])} />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}