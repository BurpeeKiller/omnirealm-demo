'use client'

import { useState, useEffect } from 'react'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { TaskForm } from '@/components/task-form'
import { DashboardHeader } from '@/components/dashboard-header'
import { FooterSimple } from '@/components/footer-simple'
import { FeedbackWidget } from '@/components/feedback-widget'
import { ProjectSelector } from '@/components/projects/project-selector'
import { ProjectForm } from '@/components/projects/project-form'
import { ProjectStats } from '@/components/projects/project-stats'
import { ProjectManager } from '@/components/projects/project-manager'
import { AISuggestions } from '@/components/ai/ai-suggestions'
import { Button } from '@/components/ui'
import { Plus, Settings } from 'lucide-react'
import { useTaskStore } from '@/lib/store/task-store'

export default function DashboardPage() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false)
  const [showStats, setShowStats] = useState(true)
  
  const { fetchProjects, fetchTasks, selectedProjectId } = useTaskStore()

  // Charger les données au démarrage
  useEffect(() => {
    const loadData = async () => {
      await fetchProjects()
      await fetchTasks()
    }
    loadData()
  }, [fetchProjects, fetchTasks])

  // Recharger les tâches quand le projet sélectionné change
  useEffect(() => {
    fetchTasks()
  }, [selectedProjectId, fetchTasks])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader />
      
      {/* Barre de contrôle */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Tableau de bord</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Gérez vos projets avec intelligence</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="hidden lg:flex"
              >
                <Settings className="h-4 w-4 mr-2" />
                {showStats ? 'Masquer stats' : 'Afficher stats'}
              </Button>
              <Button 
                onClick={() => setIsTaskFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Nouvelle tâche</span>
                <span className="sm:hidden">Tâche</span>
              </Button>
            </div>
          </div>
          
          {/* Sélecteur de projet */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ProjectSelector 
              onCreateProject={() => setIsProjectFormOpen(true)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProjectManagerOpen(true)}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              <Settings className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Gérer projets</span>
              <span className="sm:hidden">Gérer</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Suggestions IA */}
          <AISuggestions />
          
          {/* Statistiques */}
          {showStats && (
            <ProjectStats />
          )}
          
          {/* Kanban Board */}
          <KanbanBoard />
        </div>
      </main>
      
      <FooterSimple />
      
      <TaskForm 
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
      />
      
      <ProjectForm 
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
      />
      
      <ProjectManager
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
      />
      
      <FeedbackWidget />
    </div>
  )
}