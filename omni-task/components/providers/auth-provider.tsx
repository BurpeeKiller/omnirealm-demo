'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useTaskStore } from '@/lib/store/task-store'
import { createLogger } from '@/lib/logger';
const logger = createLogger('auth-provider.tsx');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const fetchTasks = useTaskStore((state) => state.fetchTasks)
  const reset = useTaskStore((state) => state.reset)

  useEffect(() => {
    // Charger les tâches si l'utilisateur est connecté
    const loadInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          await fetchTasks()
        } catch (error) {
          logger.error('Error loading tasks:', error)
        }
      }
    }

    loadInitialData()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchTasks()
        } else if (event === 'SIGNED_OUT') {
          reset()
          await router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchTasks, reset, router])

  return <>{children}</>
}