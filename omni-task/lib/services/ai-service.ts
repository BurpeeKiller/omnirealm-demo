/**
 * Service AI pour OmniTask
 * Fournit des suggestions intelligentes et de l'assistance
 */

import { Task, TaskPriority, Project } from '@/lib/types'

// Types pour les suggestions AI
export interface TaskSuggestion {
  title: string
  description?: string
  priority: TaskPriority
  estimatedHours?: number
  reasoning: string
}

export interface PrioritySuggestion {
  taskId: string
  suggestedPriority: TaskPriority
  currentPriority: TaskPriority
  reasoning: string
  confidence: number
}

export interface SubtaskSuggestion {
  parentTaskId: string
  subtasks: Array<{
    title: string
    estimatedHours?: number
  }>
  reasoning: string
}

export interface TimeEstimate {
  taskId: string
  estimatedHours: number
  confidence: 'low' | 'medium' | 'high'
  factors: string[]
}

export class AIService {
  private apiKey: string | null
  private provider: 'openai' | 'anthropic' | 'local' = 'local'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
  }

  /**
   * Générer des suggestions de tâches basées sur le contexte du projet
   */
  async generateTaskSuggestions(
    project: Project,
    existingTasks: Task[],
    context?: string
  ): Promise<TaskSuggestion[]> {
    // Pour l'instant, utiliser des suggestions basées sur des patterns
    // TODO: Intégrer avec Claude/OpenAI API
    
    const suggestions: TaskSuggestion[] = []
    
    // Analyser les tâches existantes pour identifier des patterns
    const taskTitles = existingTasks.map(t => t.title.toLowerCase())
    
    // Suggestions basées sur le type de projet détecté
    if (project.name.toLowerCase().includes('site') || project.name.toLowerCase().includes('web')) {
      if (!taskTitles.some(t => t.includes('maquette') || t.includes('design'))) {
        suggestions.push({
          title: 'Créer les maquettes',
          description: 'Concevoir les maquettes des pages principales',
          priority: 'HIGH' as TaskPriority,
          estimatedHours: 8,
          reasoning: 'Un projet web nécessite généralement des maquettes avant le développement'
        })
      }
      
      if (!taskTitles.some(t => t.includes('responsive'))) {
        suggestions.push({
          title: 'Implémenter le design responsive',
          description: 'Adapter le site pour mobile et tablette',
          priority: 'MEDIUM' as TaskPriority,
          estimatedHours: 6,
          reasoning: 'Le responsive design est essentiel pour un site web moderne'
        })
      }
    }
    
    // Suggestions génériques basées sur l'absence de certains types de tâches
    if (!taskTitles.some(t => t.includes('test'))) {
      suggestions.push({
        title: 'Écrire les tests',
        description: 'Créer des tests unitaires et d\'intégration',
        priority: TaskPriority.MEDIUM,
        estimatedHours: 4,
        reasoning: 'Les tests sont importants pour la qualité et la maintenance'
      })
    }
    
    if (!taskTitles.some(t => t.includes('documentation'))) {
      suggestions.push({
        title: 'Rédiger la documentation',
        description: 'Documenter le projet et ses fonctionnalités',
        priority: TaskPriority.LOW,
        estimatedHours: 3,
        reasoning: 'La documentation facilite la maintenance et l\'onboarding'
      })
    }
    
    return suggestions.slice(0, 3) // Limiter à 3 suggestions
  }

  /**
   * Analyser les priorités des tâches et suggérer des ajustements
   */
  async analyzePriorities(tasks: Task[]): Promise<PrioritySuggestion[]> {
    const suggestions: PrioritySuggestion[] = []
    
    for (const task of tasks) {
      // Tâches en retard devraient avoir une priorité plus élevée
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate)
        const today = new Date()
        const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysUntilDue < 0 && task.priority !== 'URGENT') {
          suggestions.push({
            taskId: task.id,
            suggestedPriority: 'URGENT' as TaskPriority,
            currentPriority: task.priority,
            reasoning: 'Cette tâche est en retard',
            confidence: 0.9
          })
        } else if (daysUntilDue <= 2 && task.priority === 'LOW') {
          suggestions.push({
            taskId: task.id,
            suggestedPriority: 'HIGH' as TaskPriority,
            currentPriority: task.priority,
            reasoning: 'Cette tâche est due dans moins de 3 jours',
            confidence: 0.8
          })
        }
      }
      
      // Tâches bloquantes devraient avoir une priorité élevée
      if (task.title.toLowerCase().includes('bloqu') && task.priority !== 'HIGH') {
        suggestions.push({
          taskId: task.id,
          suggestedPriority: TaskPriority.HIGH,
          currentPriority: task.priority,
          reasoning: 'Cette tâche semble bloquer d\'autres travaux',
          confidence: 0.7
        })
      }
    }
    
    return suggestions
  }

  /**
   * Générer des sous-tâches pour une tâche complexe
   */
  async generateSubtasks(task: Task): Promise<SubtaskSuggestion | null> {
    // Analyser la complexité de la tâche
    const estimatedHours = task.estimatedHours || 0
    const titleWords = task.title.toLowerCase().split(' ')
    
    // Si la tâche est estimée à plus de 8h, suggérer de la diviser
    if (estimatedHours > 8) {
      const subtasks = this.breakdownTask(task)
      
      if (subtasks.length > 0) {
        return {
          parentTaskId: task.id,
          subtasks,
          reasoning: `Cette tâche est estimée à ${estimatedHours}h. La diviser en sous-tâches facilitera le suivi et la réalisation.`
        }
      }
    }
    
    return null
  }

  /**
   * Estimer le temps nécessaire pour une tâche
   */
  async estimateTaskTime(task: Partial<Task>): Promise<TimeEstimate> {
    const factors: string[] = []
    let baseHours = 2 // Estimation de base
    let confidence: 'low' | 'medium' | 'high' = 'medium'
    
    const title = (task.title || '').toLowerCase()
    const description = (task.description || '').toLowerCase()
    
    // Ajustements basés sur des mots-clés
    if (title.includes('simple') || title.includes('rapide')) {
      baseHours *= 0.5
      factors.push('Tâche identifiée comme simple')
    }
    
    if (title.includes('complexe') || title.includes('refactor')) {
      baseHours *= 2
      factors.push('Tâche identifiée comme complexe')
    }
    
    if (title.includes('test')) {
      baseHours = 3
      factors.push('Les tests prennent généralement 2-4h')
      confidence = 'high'
    }
    
    if (title.includes('documentation')) {
      baseHours = 2
      factors.push('La documentation prend généralement 1-3h')
      confidence = 'high'
    }
    
    if (title.includes('réunion') || title.includes('meeting')) {
      baseHours = 1
      factors.push('Les réunions durent généralement 1h')
      confidence = 'high'
    }
    
    // Ajustement basé sur la priorité
    if (task.priority === 'URGENT') {
      factors.push('Priorité urgente - estimation conservatrice')
      confidence = 'low'
    }
    
    return {
      taskId: task.id || 'new',
      estimatedHours: Math.round(baseHours * 10) / 10,
      confidence,
      factors
    }
  }

  /**
   * Méthode privée pour décomposer une tâche en sous-tâches
   */
  private breakdownTask(task: Task): Array<{ title: string; estimatedHours?: number }> {
    const subtasks: Array<{ title: string; estimatedHours?: number }> = []
    const title = task.title.toLowerCase()
    
    // Patterns courants de décomposition
    if (title.includes('page') || title.includes('écran')) {
      subtasks.push(
        { title: 'Créer la structure HTML', estimatedHours: 2 },
        { title: 'Implémenter les styles CSS', estimatedHours: 3 },
        { title: 'Ajouter les interactions JavaScript', estimatedHours: 3 },
        { title: 'Tester et corriger les bugs', estimatedHours: 2 }
      )
    } else if (title.includes('api') || title.includes('endpoint')) {
      subtasks.push(
        { title: 'Définir le schéma de données', estimatedHours: 1 },
        { title: 'Implémenter la logique métier', estimatedHours: 3 },
        { title: 'Ajouter la validation', estimatedHours: 2 },
        { title: 'Écrire les tests', estimatedHours: 2 },
        { title: 'Documenter l\'API', estimatedHours: 1 }
      )
    } else if (title.includes('fonctionnalité') || title.includes('feature')) {
      subtasks.push(
        { title: 'Analyser les besoins', estimatedHours: 2 },
        { title: 'Concevoir l\'architecture', estimatedHours: 2 },
        { title: 'Implémenter le backend', estimatedHours: 4 },
        { title: 'Implémenter le frontend', estimatedHours: 4 },
        { title: 'Tests et intégration', estimatedHours: 3 }
      )
    }
    
    return subtasks
  }

  /**
   * Analyser le texte pour extraire des informations structurées
   */
  async parseTaskFromText(text: string): Promise<Partial<Task>> {
    const task: Partial<Task> = {}
    
    // Extraire le titre (première ligne ou avant ":")
    const lines = text.trim().split('\n')
    const firstLine = lines[0]
    
    if (firstLine.includes(':')) {
      task.title = firstLine.split(':')[0].trim()
      task.description = firstLine.split(':').slice(1).join(':').trim()
    } else {
      task.title = firstLine
      if (lines.length > 1) {
        task.description = lines.slice(1).join('\n').trim()
      }
    }
    
    // Détecter la priorité
    const textLower = text.toLowerCase()
    if (textLower.includes('urgent') || textLower.includes('asap')) {
      task.priority = 'URGENT' as TaskPriority
    } else if (textLower.includes('important') || textLower.includes('priorité haute')) {
      task.priority = 'HIGH' as TaskPriority
    } else if (textLower.includes('basse priorité') || textLower.includes('peut attendre')) {
      task.priority = 'LOW' as TaskPriority
    } else {
      task.priority = 'MEDIUM' as TaskPriority
    }
    
    // Détecter les dates
    const datePatterns = [
      /pour (demain|aujourd'hui|lundi|mardi|mercredi|jeudi|vendredi)/i,
      /avant le (\d{1,2}\/\d{1,2})/i,
      /deadline[: ](\d{1,2}\/\d{1,2})/i
    ]
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        // TODO: Parser la date correctement
        const today = new Date()
        if (match[1] === 'demain') {
          today.setDate(today.getDate() + 1)
          task.dueDate = today.toISOString()
        } else if (match[1] === "aujourd'hui") {
          task.dueDate = today.toISOString()
        }
        break
      }
    }
    
    // Détecter les estimations de temps
    const timePattern = /(\d+)\s*(h|heure|heures|hour|hours)/i
    const timeMatch = text.match(timePattern)
    if (timeMatch) {
      task.estimatedHours = parseInt(timeMatch[1])
    }
    
    return task
  }
}

// Instance singleton
let aiServiceInstance: AIService | null = null

export function getAIService(apiKey?: string): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(apiKey)
  }
  return aiServiceInstance
}