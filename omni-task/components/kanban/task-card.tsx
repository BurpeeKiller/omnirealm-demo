'use client'

import { Card, Badge } from '@omnirealm/ui'
import { Calendar, Clock, AlertCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Task } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/lib/store/task-store'
import { useToastStore } from '@/lib/store/toast-store'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  onClick?: () => void
}

const priorityColors = {
  LOW: 'bg-green-50 text-green-700 border border-green-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border border-blue-200',
  HIGH: 'bg-orange-50 text-orange-700 border border-orange-200',
  URGENT: 'bg-red-50 text-red-700 border border-red-200'
}

const priorityLabels = {
  LOW: 'Faible',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  URGENT: 'Urgente'
}

export function TaskCard({ task, isDragging, onClick }: TaskCardProps) {
  const { deleteTask } = useTaskStore()
  const { success, error } = useToastStore()
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // Empêcher le déclenchement du onClick de la carte
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTask(task.id)
        success('Tâche supprimée avec succès')
      } catch (err) {
        error('Erreur lors de la suppression')
      }
    }
  }

  return (
    <Card 
      className={cn(
        'task-card cursor-pointer select-none group',
        isDragging && 'opacity-50 rotate-2 scale-105',
        isOverdue && 'border-red-500'
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">{task.title}</h4>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
            title="Supprimer la tâche"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant="secondary" 
            className={cn('text-xs font-medium px-2 py-0.5', priorityColors[task.priority])}
          >
            {priorityLabels[task.priority]}
          </Badge>

          {task.dueDate && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md',
              isOverdue 
                ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            )}>
              {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
              {format(new Date(task.dueDate), 'd MMM', { locale: fr })}
            </div>
          )}

          {task.estimatedHours && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              {task.estimatedHours}h
            </div>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap pt-1">
            {task.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}