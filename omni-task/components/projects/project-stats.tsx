'use client'

import { useMemo } from 'react'
import { useTaskStore } from '@/lib/store/task-store'
import { TaskStatus } from '@/lib/types'
import { BarChart3, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export function ProjectStats() {
  const { tasks, projects, selectedProjectId } = useTaskStore()

  const stats = useMemo(() => {
    const filteredTasks = selectedProjectId 
      ? tasks.filter(task => task.projectId === selectedProjectId)
      : tasks

    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter(task => task.status === TaskStatus.DONE).length
    const inProgressTasks = filteredTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length
    const urgentTasks = filteredTasks.filter(task => task.priority === 'URGENT').length
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    // Statistiques par projet (uniquement si aucun projet sélectionné)
    const projectStats = !selectedProjectId ? projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id)
      const projectCompleted = projectTasks.filter(task => task.status === TaskStatus.DONE).length
      const projectTotal = projectTasks.length
      const projectCompletionRate = projectTotal > 0 ? Math.round((projectCompleted / projectTotal) * 100) : 0

      return {
        project,
        totalTasks: projectTotal,
        completedTasks: projectCompleted,
        completionRate: projectCompletionRate
      }
    }).filter(stat => stat.totalTasks > 0) : []

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      urgentTasks,
      completionRate,
      projectStats
    }
  }, [tasks, projects, selectedProjectId])

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  return (
    <div className="space-y-4">
      {/* Statistiques globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Urgentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.urgentTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Taux de completion */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            {selectedProject ? `Progression - ${selectedProject.name}` : 'Progression globale'}
          </h3>
          <span className="text-sm font-semibold text-gray-900">{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {stats.completedTasks} sur {stats.totalTasks} tâches terminées
        </p>
      </div>

      {/* Statistiques par projet (si vue globale) */}
      {!selectedProjectId && stats.projectStats.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Progression par projet</h3>
          <div className="space-y-3">
            {stats.projectStats.map(({ project, totalTasks, completedTasks, completionRate }) => (
              <div key={project.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm text-gray-700 truncate">{project.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {completedTasks}/{totalTasks}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-gray-600 h-1 rounded-full" 
                      style={{ 
                        width: `${completionRate}%`,
                        backgroundColor: project.color 
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8">
                    {completionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}