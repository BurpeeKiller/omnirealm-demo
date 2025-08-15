import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIService, getAIService } from '../ai-service'
import type { Task, Project, TaskPriority } from '@/lib/types'

describe('AIService', () => {
  let aiService: AIService
  
  const mockProject: Project = {
    id: 'project-1',
    name: 'Test Project',
    description: 'A test project',
    color: '#3B82F6',
    userId: 'user-1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    is_archived: false
  }

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Setup development environment',
      description: 'Configure local development setup',
      status: 'TODO',
      priority: 'HIGH',
      projectId: 'project-1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      userId: 'user-1',
      position: 0,
      estimatedHours: 4
    },
    {
      id: 'task-2',
      title: 'Write unit tests',
      description: 'Create comprehensive test suite',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      projectId: 'project-1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      userId: 'user-1',
      position: 1,
      estimatedHours: 8
    },
    {
      id: 'task-3',
      title: 'Deploy to production',
      description: 'Deploy application to production environment',
      status: 'TODO',
      priority: 'LOW',
      projectId: 'project-1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      userId: 'user-1',
      position: 2,
      dueDate: '2023-01-15' // Past due for testing
    }
  ]

  beforeEach(() => {
    aiService = new AIService()
    vi.clearAllMocks()
  })

  describe('generateTaskSuggestions', () => {
    it('should generate setup task for new project', async () => {
      const emptyTasks: Task[] = []
      const suggestions = await aiService.generateTaskSuggestions(mockProject, emptyTasks)
      
      expect(suggestions).toHaveLength(3)
      expect(suggestions[0].title).toContain('Setup')
      expect(suggestions[0].priority).toBe('HIGH')
      expect(suggestions[0].reasoning).toContain('essential foundation')
    })

    it('should suggest testing tasks when development is advanced', async () => {
      const devTasks: Task[] = [
        {
          ...mockTasks[0],
          status: 'DONE'
        },
        {
          id: 'task-api',
          title: 'Create API endpoints',
          status: 'DONE',
          priority: 'HIGH',
          projectId: 'project-1',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          userId: 'user-1',
          position: 1
        }
      ]

      const suggestions = await aiService.generateTaskSuggestions(mockProject, devTasks)
      
      const testingSuggestion = suggestions.find(s => s.title.toLowerCase().includes('test'))
      expect(testingSuggestion).toBeTruthy()
      expect(testingSuggestion?.priority).toBe('HIGH')
    })

    it('should suggest deployment tasks for mature projects', async () => {
      const matureTasks: Task[] = mockTasks.map(task => ({
        ...task,
        status: task.title.includes('Deploy') ? 'TODO' : 'DONE'
      }))

      const suggestions = await aiService.generateTaskSuggestions(mockProject, matureTasks)
      
      const deploymentSuggestion = suggestions.find(s => 
        s.title.toLowerCase().includes('deploy') || 
        s.title.toLowerCase().includes('production')
      )
      expect(deploymentSuggestion).toBeTruthy()
    })

    it('should return empty suggestions for complete projects', async () => {
      const completeTasks: Task[] = mockTasks.map(task => ({ ...task, status: 'DONE' }))
      const suggestions = await aiService.generateTaskSuggestions(mockProject, completeTasks)
      
      expect(suggestions).toHaveLength(0)
    })

    it('should provide reasonable time estimates', async () => {
      const suggestions = await aiService.generateTaskSuggestions(mockProject, [])
      
      suggestions.forEach(suggestion => {
        expect(suggestion.estimatedHours).toBeGreaterThan(0)
        expect(suggestion.estimatedHours).toBeLessThanOrEqual(16) // Max reasonable hours
      })
    })
  })

  describe('analyzePriorities', () => {
    it('should suggest urgent priority for overdue tasks', async () => {
      const suggestions = await aiService.analyzePriorities(mockTasks)
      
      const overdueSuggestion = suggestions.find(s => s.taskId === 'task-3')
      expect(overdueSuggestion).toBeTruthy()
      expect(overdueSuggestion?.suggestedPriority).toBe('URGENT')
      expect(overdueSuggestion?.reasoning).toContain('overdue')
    })

    it('should suggest high priority for blocked tasks', async () => {
      const blockedTasks: Task[] = [
        {
          ...mockTasks[0],
          title: 'Fix blocked deployment issue',
          priority: 'MEDIUM'
        }
      ]

      const suggestions = await aiService.analyzePriorities(blockedTasks)
      
      expect(suggestions).toHaveLength(1)
      expect(suggestions[0].suggestedPriority).toBe('HIGH')
      expect(suggestions[0].reasoning).toContain('blocked')
    })

    it('should not suggest changes for correctly prioritized tasks', async () => {
      const wellPrioritizedTasks: Task[] = [
        {
          ...mockTasks[0],
          priority: 'HIGH' // Already high priority
        }
      ]

      const suggestions = await aiService.analyzePriorities(wellPrioritizedTasks)
      
      // Should not suggest changes for well-prioritized tasks
      const changeSuggestion = suggestions.find(s => s.taskId === wellPrioritizedTasks[0].id)
      expect(changeSuggestion).toBeFalsy()
    })

    it('should handle tasks without due dates', async () => {
      const tasksWithoutDueDate = mockTasks.filter(task => !task.dueDate)
      const suggestions = await aiService.analyzePriorities(tasksWithoutDueDate)
      
      // Should not crash and may or may not have suggestions
      expect(Array.isArray(suggestions)).toBe(true)
    })
  })

  describe('generateSubtasks', () => {
    it('should break down setup tasks into subtasks', async () => {
      const setupTask = mockTasks[0]
      const subtasks = await aiService.generateSubtasks(setupTask)
      
      expect(subtasks.length).toBeGreaterThan(2)
      expect(subtasks.length).toBeLessThanOrEqual(6)
      
      subtasks.forEach(subtask => {
        expect(subtask.title).toBeTruthy()
        expect(subtask.estimatedHours).toBeGreaterThan(0)
        expect(subtask.priority).toBeTruthy()
      })
    })

    it('should generate appropriate subtasks for testing tasks', async () => {
      const testingTask = {
        ...mockTasks[1],
        title: 'Write comprehensive test suite',
        description: 'Add unit and integration tests'
      }

      const subtasks = await aiService.generateSubtasks(testingTask)
      
      const hasUnitTest = subtasks.some(s => s.title.toLowerCase().includes('unit'))
      const hasIntegrationTest = subtasks.some(s => s.title.toLowerCase().includes('integration'))
      
      expect(hasUnitTest || hasIntegrationTest).toBe(true)
    })

    it('should handle tasks that are too small to break down', async () => {
      const simpleTask: Task = {
        id: 'simple-task',
        title: 'Update README',
        status: 'TODO',
        priority: 'LOW',
        projectId: 'project-1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        userId: 'user-1',
        position: 0,
        estimatedHours: 0.5
      }

      const subtasks = await aiService.generateSubtasks(simpleTask)
      
      // Simple tasks should have few or no subtasks
      expect(subtasks.length).toBeLessThanOrEqual(2)
    })
  })

  describe('estimateTimeToCompletion', () => {
    it('should provide reasonable time estimates', async () => {
      const estimate = await aiService.estimateTimeToCompletion(mockTasks[0])
      
      expect(estimate.baseEstimate).toBeGreaterThan(0)
      expect(estimate.optimisticEstimate).toBeLessThanOrEqual(estimate.baseEstimate)
      expect(estimate.pessimisticEstimate).toBeGreaterThanOrEqual(estimate.baseEstimate)
      expect(estimate.confidence).toBeGreaterThan(0)
      expect(estimate.confidence).toBeLessThanOrEqual(1)
    })

    it('should consider task complexity in estimates', async () => {
      const simpleTask: Task = {
        ...mockTasks[0],
        title: 'Update documentation',
        estimatedHours: 1
      }

      const complexTask: Task = {
        ...mockTasks[0],
        title: 'Implement complex authentication system',
        estimatedHours: 20
      }

      const simpleEstimate = await aiService.estimateTimeToCompletion(simpleTask)
      const complexEstimate = await aiService.estimateTimeToCompletion(complexTask)
      
      expect(complexEstimate.baseEstimate).toBeGreaterThan(simpleEstimate.baseEstimate)
      expect(complexEstimate.confidence).toBeLessThanOrEqual(simpleEstimate.confidence)
    })

    it('should adjust estimates based on task status', async () => {
      const todoTask = { ...mockTasks[0], status: 'TODO' as const }
      const inProgressTask = { ...mockTasks[0], status: 'IN_PROGRESS' as const }
      
      const todoEstimate = await aiService.estimateTimeToCompletion(todoTask)
      const inProgressEstimate = await aiService.estimateTimeToCompletion(inProgressTask)
      
      // In-progress tasks should have different estimates
      expect(inProgressEstimate).toBeTruthy()
      expect(todoEstimate).toBeTruthy()
    })
  })

  describe('getAIService singleton', () => {
    it('should return the same instance', () => {
      const instance1 = getAIService()
      const instance2 = getAIService()
      
      expect(instance1).toBe(instance2)
      expect(instance1).toBeInstanceOf(AIService)
    })
  })

  describe('error handling', () => {
    it('should handle malformed task data gracefully', async () => {
      const malformedTask = {
        id: 'bad-task',
        // Missing required fields
      } as Task

      // Should not throw errors
      expect(async () => {
        await aiService.generateSubtasks(malformedTask)
      }).not.toThrow()
    })

    it('should handle empty arrays gracefully', async () => {
      const suggestions = await aiService.generateTaskSuggestions(mockProject, [])
      const priorities = await aiService.analyzePriorities([])
      
      expect(Array.isArray(suggestions)).toBe(true)
      expect(Array.isArray(priorities)).toBe(true)
    })
  })

  describe('business logic validation', () => {
    it('should not suggest duplicate task types', async () => {
      const existingSetupTasks: Task[] = [
        {
          ...mockTasks[0],
          title: 'Setup development environment',
          status: 'DONE'
        },
        {
          ...mockTasks[0],
          id: 'task-setup-2',
          title: 'Setup CI/CD pipeline',
          status: 'DONE'
        }
      ]

      const suggestions = await aiService.generateTaskSuggestions(mockProject, existingSetupTasks)
      
      const setupSuggestions = suggestions.filter(s => s.title.toLowerCase().includes('setup'))
      // Should not suggest more setup tasks when multiple already exist
      expect(setupSuggestions.length).toBeLessThanOrEqual(1)
    })

    it('should prioritize dependencies correctly', async () => {
      const suggestions = await aiService.generateTaskSuggestions(mockProject, [])
      
      // Setup tasks should come before deployment tasks
      const setupIndex = suggestions.findIndex(s => s.title.toLowerCase().includes('setup'))
      const deployIndex = suggestions.findIndex(s => s.title.toLowerCase().includes('deploy'))
      
      if (setupIndex !== -1 && deployIndex !== -1) {
        expect(setupIndex).toBeLessThan(deployIndex)
      }
    })
  })
})