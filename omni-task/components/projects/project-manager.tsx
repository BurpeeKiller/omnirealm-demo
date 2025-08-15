'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui/modal'
import { ProjectForm } from './project-form'
import { useTaskStore } from '@/lib/store/task-store'
import { projectsApi } from '@/lib/api/projects'
import { useToastStore } from '@/lib/store/toast-store'
import { 
  Plus, 
  Edit2, 
  Archive, 
  Folder,
  BarChart3
} from 'lucide-react'
import type { Project } from '@/lib/types'

interface ProjectManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectManager({ isOpen, onClose }: ProjectManagerProps) {
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { projects, setProjects, tasks } = useTaskStore()
  const { success, error } = useToastStore()

  const handleArchiveProject = async (project: Project) => {
    if (!confirm(`Êtes-vous sûr de vouloir archiver "${project.name}" ?`)) {
      return
    }

    setLoading(true)
    try {
      await projectsApi.archiveProject(project.id)
      const updatedProjects = projects.filter(p => p.id !== project.id)
      setProjects(updatedProjects)
      success('Projet archivé avec succès')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Erreur lors de l\'archivage')
    } finally {
      setLoading(false)
    }
  }

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId)
    const completedTasks = projectTasks.filter(task => task.status === 'DONE').length
    const totalTasks = projectTasks.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      completionRate
    }
  }

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Gestion des projets"
      >
        <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">
                {projects.length} projet{projects.length !== 1 ? 's' : ''} actif{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsProjectFormOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nouveau
              </Button>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun projet
              </h3>
              <p className="text-gray-500 mb-4">
                Créez votre premier projet pour organiser vos tâches
              </p>
              <Button
                onClick={() => setIsProjectFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un projet
              </Button>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-96">
              {projects.map((project) => {
                const stats = getProjectStats(project.id)
                
                return (
                  <div
                    key={project.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full mt-1 flex-shrink-0" 
                          style={{ backgroundColor: project.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {project.icon && <span className="mr-1">{project.icon}</span>}
                              {project.name}
                            </h3>
                          </div>
                          {project.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          
                          {/* Statistiques */}
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              {stats.totalTasks} tâche{stats.totalTasks !== 1 ? 's' : ''}
                            </div>
                            {stats.totalTasks > 0 && (
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="h-1 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${stats.completionRate}%`,
                                      backgroundColor: project.color 
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {stats.completionRate}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProject(project)
                            setIsProjectFormOpen(true)
                          }}
                          disabled={loading}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveProject(project)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Les projets archivés peuvent être restaurés depuis les paramètres
            </p>
          </div>
        </div>
      </Modal>

      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false)
          setEditingProject(null)
        }}
        project={editingProject || undefined}
      />
    </>
  )
}