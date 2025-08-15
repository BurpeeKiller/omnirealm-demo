import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createLogger } from '@/lib/logger';
const logger = createLogger('ai-store.ts');

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  context?: {
    tasks?: any[]
    projects?: any[]
    currentProject?: string
  }
}

interface AIState {
  // État de la conversation
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  
  // Actions
  sendMessage: (content: string, context?: ChatMessage['context']) => Promise<void>
  clearMessages: () => void
  removeMessage: (id: string) => void
}

export const useAIStore = create<AIState>()(
  immer((set) => ({
    messages: [],
    isLoading: false,
    error: null,

    sendMessage: async (content: string, context?: ChatMessage['context']) => {
      const messageId = `user-${Date.now()}`
      const userMessage: ChatMessage = {
        id: messageId,
        role: 'user',
        content,
        timestamp: new Date(),
        context
      }

      // Ajouter le message utilisateur
      set(state => {
        state.messages.push(userMessage)
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            context
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erreur API')
        }

        const data = await response.json()
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }

        set(state => {
          state.messages.push(assistantMessage)
          state.isLoading = false
        })

      } catch (error) {
        logger.error('Erreur envoi message:', error)
        
        set(state => {
          state.error = error instanceof Error ? error.message : 'Erreur inconnue'
          state.isLoading = false
        })
      }
    },

    clearMessages: () => {
      set(state => {
        state.messages = []
        state.error = null
      })
    },

    removeMessage: (id: string) => {
      set(state => {
        state.messages = state.messages.filter(msg => msg.id !== id)
      })
    }
  }))
)