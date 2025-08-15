'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import { useAIStore } from '@/lib/store/ai-store'
import { useTaskStore } from '@/lib/store/task-store'
import { 
  Send,
  Bot,
  User,
  Trash2,
  Loader2,
  X
} from 'lucide-react'

export function AIChat() {
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIStore()
  const { tasks, projects, selectedProjectId } = useTaskStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const context = {
      tasks: tasks.slice(0, 20), // Limiter le contexte
      projects,
      currentProject: selectedProjectId || undefined
    }

    await sendMessage(input, context)
    setInput('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">Assistant OmniTask</span>
        </div>
        <div className="flex items-center space-x-2">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-1 hover:bg-blue-700 rounded"
              title="Effacer la conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">
              👋 Salut ! Je suis votre assistant IA.<br />
              Posez-moi des questions sur vos tâches et projets !
            </p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex items-start space-x-2 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`p-2 rounded-full ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">❌ {error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez-moi une question..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500">
          💡 Essayez : "Comment optimiser mes tâches ?" ou "Analyse mon projet actuel"
        </div>
      </div>
    </div>
  )
}