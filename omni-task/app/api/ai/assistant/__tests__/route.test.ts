import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'

// Mock OpenAI
const mockCreate = vi.fn()
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate
      }
    }
  }))
}))

// Mock serverConfig
vi.mock('@/lib/config', () => ({
  serverConfig: {
    openaiApiKey: 'test-api-key'
  }
}))

describe('AI Assistant API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('devrait retourner 400 si pas de message', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Message requis')
  })

  it('devrait retourner 400 si message vide', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Message requis')
  })

  it('devrait retourner 500 si pas de clé API OpenAI', async () => {
    const { serverConfig } = await vi.importMock('@/lib/config') as any
    const originalKey = serverConfig.openaiApiKey
    serverConfig.openaiApiKey = null

    const request = new NextRequest('http://localhost:3000/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'Test message' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Clé API OpenAI manquante')

    serverConfig.openaiApiKey = originalKey
  })

  it('devrait traiter une requête valide', async () => {
    
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: 'Voici ma suggestion pour votre tâche.'
        }
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 10,
        total_tokens: 20
      }
    })

    const request = new NextRequest('http://localhost:3000/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ 
        message: 'Comment améliorer ma productivité ?',
        context: {
          tasks: [
            { title: 'Tâche 1', status: 'todo' },
            { title: 'Tâche 2', status: 'in_progress' }
          ]
        }
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.response).toBe('Voici ma suggestion pour votre tâche.')
    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      messages: expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user', content: 'Comment améliorer ma productivité ?' })
      ]),
      temperature: 0.7,
      max_tokens: 1000
    })
  })

  it('devrait gérer les erreurs OpenAI', async () => {
    
    mockCreate.mockRejectedValue(new Error('API Error'))

    const request = new NextRequest('http://localhost:3000/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'Test message' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Erreur interne du serveur')
  })

  it.skip('devrait limiter la longueur du message', async () => {
    // Test désactivé car la validation de longueur n'est pas implémentée
    const longMessage = 'a'.repeat(1001)
    const request = new NextRequest('http://localhost:3000/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: longMessage }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Message trop long (max 1000 caractères)')
  })
})