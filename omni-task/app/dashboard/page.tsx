'use client'

import { useState } from 'react'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { TaskForm } from '@/components/task-form'
import { DashboardHeader } from '@/components/dashboard-header'
import { FooterSimple } from '@/components/footer-simple'
import { FeedbackWidget } from '@/components/feedback-widget'
import { Button } from '@omnirealm/ui'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader />
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tableau de bord</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gérez vos projets avec intelligence</p>
            </div>
            <Button 
              onClick={() => setIsTaskFormOpen(true)}
              className="bg-white hover:bg-gray-100 text-black border border-gray-200 shadow-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
          </div>
        </div>
      </div>
      <main className="flex-1 p-8 flex flex-col">
        <KanbanBoard />
      </main>
      
      <FooterSimple />
      
      <TaskForm 
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
      />
      
      <FeedbackWidget />
    </div>
  )
}