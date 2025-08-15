"use client"

import { useState, useEffect } from 'react'
import { Plus, Folder, Archive, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectDialog } from '@/components/projects/project-dialog'
import { useTaskStore } from '@/lib/store/task-store'
import { useToast } from '@/lib/store/toast-store'
import { projectsApi } from '@/lib/api/projects'
import type { Project } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProjectsPage() {
  const { projects, fetchProjects, fetchTasks } = useTaskStore()
  const { showToast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [projectToArchive, setProjectToArchive] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  const handleCreateProject = () => {
    setEditingProject(null)
    setDialogOpen(true)
  }

  const handleArchiveProject = async () => {
    if (!projectToArchive) return

    setIsLoading(true)
    try {
      await projectsApi.archiveProject(projectToArchive.id)
      await fetchProjects()
      await fetchTasks() // Rafraîchir les tâches au cas où
      showToast('success', 'Projet archivé avec succès')
    } catch (error) {
      showToast('error', 'Erreur lors de l\'archivage du projet')
    } finally {
      setIsLoading(false)
      setArchiveDialogOpen(false)
      setProjectToArchive(null)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projets</h2>
          <p className="text-muted-foreground">
            Gérez vos projets et organisez vos tâches
          </p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className="rounded-md p-2"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <Folder
                    className="h-6 w-6"
                    style={{ color: project.color }}
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditProject(project)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setProjectToArchive(project)
                    setArchiveDialogOpen(true)
                  }}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Folder className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Aucun projet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Créez votre premier projet pour commencer à organiser vos tâches
              </p>
              <Button onClick={handleCreateProject}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un projet
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
      />

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver le projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le projet "{projectToArchive?.name}" sera archivé. Les tâches associées ne seront plus visibles dans la vue principale. Vous pourrez restaurer le projet plus tard si nécessaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleArchiveProject}
              disabled={isLoading}
            >
              {isLoading ? 'Archivage...' : 'Archiver'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}