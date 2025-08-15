'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { useTaskStore } from '@/lib/store/task-store'
import { useAIStore } from '@/lib/store/ai-store'
import { createLogger } from '@/lib/logger'
const logger = createLogger('ai-task-optimizer.tsx');
import { 
  Zap,
  Loader2,
  CheckCircle,
  ArrowRight,
  Target,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface TaskOptimization {
  taskId: string
  currentTitle: string
  suggestedTitle?: string
  currentDescription?: string
  suggestedDescription?: string
  currentPriority?: 'low' | 'medium' | 'high'
  suggestedPriority?: 'low' | 'medium' | 'high'
  currentEstimate?: number
  suggestedEstimate?: number
  reasoning: string
  confidence: number
}

interface Props {
  taskId: string
  onClose: () => void
}

export function AITaskOptimizer({ taskId, onClose }: Props) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimization, setOptimization] = useState<TaskOptimization | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  
  const { tasks, updateTask } = useTaskStore()
  const { sendMessage } = useAIStore()

  const task = tasks.find(t => t.id === taskId)

  const optimizeTask = async () => {
    if (!task) return
    
    setIsOptimizing(true)
    
    try {
      const optimizationPrompt = `Analyse cette tâche et propose des améliorations concrètes :

Tâche actuelle :
- Titre : "${task.title}"
- Description : "${task.description || 'Aucune'}"
- Statut : ${task.status}
- Projet : ${task.projectId || 'Aucun'}

Propose des améliorations pour :
1. Titre plus clair et actionnable
2. Description plus précise avec étapes
3. Estimation de temps réaliste (en heures)
4. Niveau de priorité approprié

Sois concis et pratique. Focus sur l'impact et l'efficacité.`

      await sendMessage(optimizationPrompt, {
        tasks: [task],
        currentProject: task.projectId
      })

      // Simulation d'optimisation
      const mockOptimization: TaskOptimization = {
        taskId: task.id,
        currentTitle: task.title,
        suggestedTitle: task.title.includes('faire') ? 
          task.title.replace('faire', '✅ Implémenter') : 
          `🎯 ${task.title}`,
        currentDescription: task.description,
        suggestedDescription: task.description ? 
          `${task.description}\n\n📋 Étapes :\n1. Analyser le besoin\n2. Définir l'approche\n3. Implémenter la solution\n4. Tester et valider` : 
          '📋 Étapes à définir lors de la planification',
        suggestedPriority: 'medium',
        suggestedEstimate: Math.ceil(Math.random() * 4) + 1,
        reasoning: "Cette tâche bénéficierait d'un titre plus actionnable et d'une décomposition en étapes claires pour améliorer l'exécution.",
        confidence: 85
      }
      
      setOptimization(mockOptimization)
      
    } catch (error) {
      logger.error('Erreur optimisation tâche:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const applyOptimizations = async () => {
    if (!optimization || !task) return
    
    setIsApplying(true)
    
    try {
      await updateTask(task.id, {
        title: optimization.suggestedTitle || task.title,
        description: optimization.suggestedDescription || task.description
      })
      
      onClose()
    } catch (error) {
      logger.error('Erreur application optimisations:', error)
    } finally {
      setIsApplying(false)
    }
  }

  if (!task) return null

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Optimisation IA
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {!optimization ? (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Optimiser cette tâche avec l'IA
          </h4>
          <p className="text-gray-600 mb-6">
            L'IA analysera votre tâche et proposera des améliorations pour 
            augmenter votre productivité et clarifier l'exécution.
          </p>
          <Button
            onClick={optimizeTask}
            disabled={isOptimizing}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Optimiser avec l'IA
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Confidence Score */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              Confiance de l'analyse
            </span>
            <span className="text-lg font-bold text-blue-600">
              {optimization.confidence}%
            </span>
          </div>

          {/* Reasoning */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
              Analyse
            </h4>
            <p className="text-sm text-gray-700">{optimization.reasoning}</p>
          </div>

          {/* Optimizations */}
          <div className="space-y-4">
            {/* Title */}
            {optimization.suggestedTitle && optimization.suggestedTitle !== optimization.currentTitle && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">📝 Titre</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    Actuel: {optimization.currentTitle}
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Suggéré: {optimization.suggestedTitle}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {optimization.suggestedDescription && optimization.suggestedDescription !== optimization.currentDescription && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">📄 Description</h4>
                <div className="space-y-2">
                  <div className="text-sm text-red-600">
                    <div className="flex items-center mb-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                      Actuelle:
                    </div>
                    <div className="pl-4 text-gray-600">
                      {optimization.currentDescription || 'Aucune description'}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                  </div>
                  <div className="text-sm text-green-600">
                    <div className="flex items-center mb-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Suggérée:
                    </div>
                    <div className="pl-4 text-gray-700 whitespace-pre-line">
                      {optimization.suggestedDescription}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Time Estimate */}
            {optimization.suggestedEstimate && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Estimation temps
                </h4>
                <div className="text-sm text-blue-600">
                  Temps suggéré: {optimization.suggestedEstimate}h
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={applyOptimizations}
              disabled={isApplying}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Application...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Appliquer les optimisations
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isApplying}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}