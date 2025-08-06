'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Label, Textarea } from '@omnirealm/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-modal'
import { Modal, useModalContainer } from '@/components/ui/modal'
import { useTaskStore } from '@/lib/store/task-store'
import { useToastStore } from '@/lib/store/toast-store'
import type { Task, CreateTaskInput, UpdateTaskInput, TaskPriority, TaskStatus } from '@/lib/types'
import { Loader2, Calendar, Clock, Tag } from 'lucide-react'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  defaultStatus?: TaskStatus | null
}

export function TaskForm({ isOpen, onClose, task, defaultStatus }: TaskFormProps) {
  const { projects, addTask, updateTask, isLoading } = useTaskStore()
  const { success, error } = useToastStore()
  const modalContainer = useModalContainer()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskPriority,
    projectId: 'no-project',
    dueDate: '',
    estimatedHours: '',
    tags: ''
  })

  // Remplir le formulaire si on édite une tâche
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        projectId: task.projectId || 'no-project',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours?.toString() || '',
        tags: task.tags?.join(', ') || ''
      })
    } else {
      // Réinitialiser pour une nouvelle tâche
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        projectId: 'no-project',
        dueDate: '',
        estimatedHours: '',
        tags: ''
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const taskData = {
      title: formData.title,
      description: formData.description || undefined,
      status: defaultStatus || 'TODO' as const,
      priority: formData.priority,
      projectId: formData.projectId === 'no-project' ? undefined : formData.projectId || undefined,
      dueDate: formData.dueDate || undefined,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined
    }

    try {
      console.log('Saving task:', taskData)
      if (task) {
        await updateTask(task.id, taskData as UpdateTaskInput)
        success('Tâche modifiée avec succès !')
      } else {
        await addTask(taskData as CreateTaskInput)
        success('Tâche créée avec succès !')
      }
      onClose()
      // Réinitialiser le formulaire après succès
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM' as TaskPriority,
        projectId: 'no-project',
        dueDate: '',
        estimatedHours: '',
        tags: ''
      })
    } catch (err) {
      console.error('Error saving task:', err)
      error(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    }
  }

  const priorityColors = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    URGENT: 'text-red-600'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Modifier la tâche' : 'Nouvelle tâche'}
      className="overflow-visible"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Implémenter la fonctionnalité X"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Détails de la tâche..."
            rows={3}
          />
        </div>

        {/* Priorité et Projet */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: string) => setFormData({ ...formData, priority: value as TaskPriority })}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent container={modalContainer}>
                <SelectItem value="LOW">
                  <span className={priorityColors.LOW}>Faible</span>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <span className={priorityColors.MEDIUM}>Moyenne</span>
                </SelectItem>
                <SelectItem value="HIGH">
                  <span className={priorityColors.HIGH}>Haute</span>
                </SelectItem>
                <SelectItem value="URGENT">
                  <span className={priorityColors.URGENT}>Urgente</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Projet</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value: string) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Sans projet" />
              </SelectTrigger>
              <SelectContent container={modalContainer}>
                <SelectItem value="no-project">Sans projet</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <span className="flex items-center gap-2">
                      {project.icon && <span>{project.icon}</span>}
                      {project.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date et Estimation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dueDate">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date limite
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedHours">
              <Clock className="inline h-4 w-4 mr-1" />
              Heures estimées
            </Label>
            <Input
              id="estimatedHours"
              type="number"
              step="0.5"
              min="0"
              value={formData.estimatedHours}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, estimatedHours: e.target.value })}
              placeholder="Ex: 4.5"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">
            <Tag className="inline h-4 w-4 mr-1" />
            Tags
          </Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Ex: frontend, urgent, bug (séparés par des virgules)"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading || !formData.title}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              task ? 'Modifier' : 'Créer'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}