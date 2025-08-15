import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PATCH, DELETE } from '../route'
import { NextRequest } from 'next/server'

// Mock cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn()
  }))
}))

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn()
}))

// Mock validations
vi.mock('@/lib/validations/task', () => ({
  createTaskSchema: {
    parse: vi.fn((data) => data)
  },
  updateTaskSchema: {
    parse: vi.fn((data) => data)
  }
}))

import { createServerClient } from '@supabase/ssr'

describe('Tasks API - Simplified', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => mockSupabase),
    select: vi.fn(() => mockSupabase),
    eq: vi.fn(() => mockSupabase),
    order: vi.fn(() => mockSupabase),
    insert: vi.fn(() => mockSupabase),
    update: vi.fn(() => mockSupabase),
    delete: vi.fn(() => mockSupabase),
    single: vi.fn(() => mockSupabase),
    is: vi.fn(() => mockSupabase),
    or: vi.fn(() => mockSupabase)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)
  })

  describe('GET /api/tasks', () => {
    it('devrait retourner 401 si non authentifié', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'No session' } } as any)

      const request = new NextRequest('http://localhost:3000/api/tasks')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Non authentifié')
    })

    it('devrait retourner les tâches de l\'utilisateur', async () => {
      const mockUser = { id: 'user123' }
      const mockTasks = [
        { id: '1', title: 'Task 1', user_id: 'user123' },
        { id: '2', title: 'Task 2', user_id: 'user123' }
      ]

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null } as any)

      // Simuler la chaîne de requête Supabase
      mockSupabase.order.mockReturnValue({
        data: mockTasks,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/tasks')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ data: mockTasks })
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user123')
    })
  })

  describe('POST /api/tasks', () => {
    it('devrait créer une nouvelle tâche', async () => {
      const mockUser = { id: 'user123' }
      const newTask = {
        title: 'New Task',
        priority: 'HIGH',
        status: 'TODO'
      }

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null } as any)

      // Mock pour la position max
      mockSupabase.order.mockReturnValueOnce({
        data: [{ position: 5 }],
        error: null
      })

      // Mock pour l'insertion
      mockSupabase.single.mockReturnValue({
        data: { ...newTask, id: 'task123', user_id: 'user123' },
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toMatchObject({
        data: expect.objectContaining(newTask)
      })
    })

    it('devrait retourner 401 si non authentifié', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'No session' } } as any)

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' })
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
    })
  })

  describe('PATCH /api/tasks', () => {
    it('devrait retourner 401 si non authentifié', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'No session' } } as any)

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'PATCH',
        body: JSON.stringify({ id: '1', title: 'Updated' })
      })

      const response = await PATCH(request, { params: { id: '1' } })
      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /api/tasks', () => {
    it('devrait retourner 401 si non authentifié', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'No session' } } as any)

      const request = new NextRequest('http://localhost:3000/api/tasks?id=1')
      const response = await DELETE(request, { params: { id: '1' } })
      expect(response.status).toBe(401)
    })
  })
})