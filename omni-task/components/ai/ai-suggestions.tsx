'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTaskStore } from '@/lib/store/task-store'
import { useToast } from '@/lib/store/toast-store'
import { getAIService } from '@/lib/services/ai-service'
import { tasksApi } from '@/lib/api/tasks'
import type { TaskSuggestion, PrioritySuggestion } from '@/lib/services/ai-service'
import type { TaskPriority, Task } from '@/lib/types'
import { 
  Lightbulb,
  Sparkles,
  Loader2,
  X,
  CheckCircle,
  Target,
  Calendar,
  BarChart3,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

export function AISuggestions() {
  const [isLoading, setIsLoading] = useState(false)
  const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([])
  const [prioritySuggestions, setPrioritySuggestions] = useState<PrioritySuggestion[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())

  const { tasks, projects, selectedProjectId, fetchTasks } = useTaskStore()
  const { showToast } = useToast()
  const aiService = getAIService()

  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const projectTasks = selectedProjectId 
    ? tasks.filter(t => t.projectId === selectedProjectId)
    : tasks

  // Charger les suggestions au démarrage et quand le projet change
  useEffect(() => {
    if (selectedProject || projectTasks.length > 0) {
      loadSuggestions()
    }
  }, [selectedProjectId, tasks.length])

  const loadSuggestions = async () => {
    setIsLoading(true)
    try {
      // Suggestions de tâches si un projet est sélectionné
      if (selectedProject) {
        const taskSuggs = await aiService.generateTaskSuggestions(
          selectedProject,
          projectTasks
        )
        setTaskSuggestions(taskSuggs)
      }

      // Analyse des priorités
      if (projectTasks.length > 0) {
        const prioritySuggs = await aiService.analyzePriorities(projectTasks)
        setPrioritySuggestions(prioritySuggs)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (suggestion: TaskSuggestion) => {
    try {
      const newTask = {
        title: suggestion.title,
        description: suggestion.description,
        priority: suggestion.priority,
        estimatedHours: suggestion.estimatedHours,
        projectId: selectedProjectId || undefined,
        status: 'TODO' as const
      }

      await tasksApi.createTask(newTask)
      await fetchTasks()
      
      // Retirer la suggestion de la liste
      setTaskSuggestions(prev => prev.filter(s => s.title !== suggestion.title))
      
      showToast('success', 'Tâche créée avec succès')
    } catch (error) {
      showToast('error', 'Erreur lors de la création de la tâche')
    }
  }

  const handleUpdatePriority = async (suggestion: PrioritySuggestion) => {
    try {
      const task = tasks.find(t => t.id === suggestion.taskId)
      if (!task) return

      await tasksApi.updateTask(task.id, {
        ...task,
        priority: suggestion.suggestedPriority
      })
      
      await fetchTasks()
      
      // Retirer la suggestion
      setPrioritySuggestions(prev => prev.filter(s => s.taskId !== suggestion.taskId))
      
      showToast('success', 'Priorité mise à jour')
    } catch (error) {
      showToast('error', 'Erreur lors de la mise à jour')
    }
  }

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions(prev => new Set([...prev, id]))
  }

  const visibleTaskSuggestions = taskSuggestions.filter(
    s => !dismissedSuggestions.has(s.title)
  )
  const visiblePrioritySuggestions = prioritySuggestions.filter(
    s => !dismissedSuggestions.has(s.taskId)
  )

  const hasSuggestions = visibleTaskSuggestions.length > 0 || visiblePrioritySuggestions.length > 0

  if (!hasSuggestions && !isLoading) {
    return null
  }

  return (
    <Card className="relative overflow-hidden border-blue-200 dark:border-blue-800">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Suggestions IA</CardTitle>
              <CardDescription>
                Recommandations pour optimiser votre productivité
              </CardDescription>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="relative space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <>
              {/* Suggestions de nouvelles tâches */}
              {visibleTaskSuggestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Tâches suggérées
                  </h4>
                  
                  {visibleTaskSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="group relative p-3 rounded-lg border bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow"
                    >
                      <button
                        onClick={() => dismissSuggestion(suggestion.title)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      
                      <div className="pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium">{suggestion.title}</h5>
                          <Badge variant={getPriorityVariant(suggestion.priority)} className="text-xs">
                            {getPriorityLabel(suggestion.priority)}
                          </Badge>
                          {suggestion.estimatedHours && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {suggestion.estimatedHours}h
                            </span>
                          )}
                        </div>
                        
                        {suggestion.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {suggestion.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 italic">
                            {suggestion.reasoning}
                          </p>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateTask(suggestion)}
                          >
                            Créer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions de priorités */}
              {visiblePrioritySuggestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Ajustements de priorité recommandés
                  </h4>
                  
                  {visiblePrioritySuggestions.map((suggestion) => {
                    const task = tasks.find(t => t.id === suggestion.taskId)
                    if (!task) return null

                    return (
                      <div
                        key={suggestion.taskId}
                        className="group relative p-3 rounded-lg border bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow"
                      >
                        <button
                          onClick={() => dismissSuggestion(suggestion.taskId)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                        
                        <div className="pr-8">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm">{task.title}</h5>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getPriorityVariant(suggestion.currentPriority)} className="text-xs">
                              {getPriorityLabel(suggestion.currentPriority)}
                            </Badge>
                            <span className="text-xs">→</span>
                            <Badge variant={getPriorityVariant(suggestion.suggestedPriority)} className="text-xs">
                              {getPriorityLabel(suggestion.suggestedPriority)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 italic">
                              {suggestion.reasoning}
                            </p>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdatePriority(suggestion)}
                            >
                              Appliquer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Bouton pour rafraîchir */}
              {!isLoading && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadSuggestions}
                    className="text-xs"
                  >
                    Rafraîchir les suggestions
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}

function getPriorityVariant(priority: TaskPriority): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case 'URGENT': return 'destructive'
    case 'HIGH': return 'default'
    case 'MEDIUM': return 'secondary'
    case 'LOW': return 'outline'
    default: return 'outline'
  }
}

function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case 'URGENT': return 'Urgent'
    case 'HIGH': return 'Haute'
    case 'MEDIUM': return 'Moyenne'
    case 'LOW': return 'Basse'
    default: return priority
  }
}