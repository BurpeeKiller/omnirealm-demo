"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { projectsApi } from '@/lib/api/projects'
import { useTaskStore } from '@/lib/store/task-store'
import { useToast } from '@/lib/store/toast-store'
import type { Project } from '@/lib/types'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
]

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    color: project?.color || COLORS[Math.floor(Math.random() * COLORS.length)]
  })

  const { fetchProjects } = useTaskStore()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showToast('error', 'Le nom du projet est requis')
      return
    }

    setIsLoading(true)

    try {
      if (project) {
        // Mise à jour
        await projectsApi.updateProject(project.id, formData)
        showToast('success', 'Projet mis à jour avec succès')
      } else {
        // Création
        await projectsApi.createProject(formData)
        showToast('success', 'Projet créé avec succès')
      }

      await fetchProjects()
      onOpenChange(false)
      
      // Réinitialiser le formulaire
      if (!project) {
        setFormData({
          name: '',
          description: '',
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        })
      }
    } catch (error) {
      showToast('error', project ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Modifier le projet' : 'Nouveau projet'}
          </DialogTitle>
          <DialogDescription>
            {project 
              ? 'Modifiez les informations de votre projet'
              : 'Créez un nouveau projet pour organiser vos tâches'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Site web, App mobile..."
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre projet..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Couleur</Label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    w-8 h-8 rounded-md transition-all
                    ${formData.color === color 
                      ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110' 
                      : 'hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color }}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'En cours...' : project ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}