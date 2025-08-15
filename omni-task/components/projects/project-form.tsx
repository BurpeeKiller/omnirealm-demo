'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui/modal'
import { Project } from '@/lib/types'
import { projectsApi } from '@/lib/api/projects'
import { useTaskStore } from '@/lib/store/task-store'
import { createLogger } from '@/lib/logger';
const logger = createLogger('project-form.tsx');

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  project?: Project // Pour l'édition
}

const PROJECT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
]

const PROJECT_ICONS = [
  '📁', '🚀', '💡', '⭐', '🎯', '📊', '🔧', '🎨', '📱', '💼',
  '🏠', '🎮', '📚', '🌟', '🔥', '⚡', '🎪', '🌈', '🎵', '🏆'
]

export function ProjectForm({ isOpen, onClose, project }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    color: project?.color || PROJECT_COLORS[0],
    icon: project?.icon || PROJECT_ICONS[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { setProjects, projects } = useTaskStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validation
      if (!formData.name.trim()) {
        setErrors({ name: 'Le nom du projet est requis' })
        return
      }

      if (project) {
        // Édition
        const updatedProject = await projectsApi.updateProject(project.id, formData)
        const updatedProjects = projects.map(p => 
          p.id === project.id ? updatedProject : p
        )
        setProjects(updatedProjects)
      } else {
        // Création
        const newProject = await projectsApi.createProject({
          ...formData,
          is_archived: false
        })
        setProjects([...projects, newProject])
      }

      onClose()
      setFormData({
        name: '',
        description: '',
        color: PROJECT_COLORS[0],
        icon: PROJECT_ICONS[0],
      })
    } catch (error) {
      logger.error('Error saving project:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Une erreur est survenue' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={project ? 'Modifier le projet' : 'Nouveau projet'}
    >
      <div className="w-full max-w-md">

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du projet *
            </label>
            <input
              id="project-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mon projet"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description du projet..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Icône */}
          <div>
            <label htmlFor="project-icon" className="block text-sm font-medium text-gray-700 mb-2">
              Icône
            </label>
            <input type="hidden" id="project-icon" value={formData.icon} />
            <div className="grid grid-cols-10 gap-1">
              {PROJECT_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-sm hover:bg-gray-100 transition-colors ${
                    formData.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label htmlFor="project-color" className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <input type="hidden" id="project-color" value={formData.color} />
            <div className="grid grid-cols-10 gap-1">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-md transition-all hover:scale-110 ${
                    formData.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Erreur globale */}
          {errors.submit && (
            <p className="text-sm text-red-600">{errors.submit}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (project ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}