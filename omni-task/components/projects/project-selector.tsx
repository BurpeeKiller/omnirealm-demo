"use client"

import { useState } from 'react'
import { Folder, Plus, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTaskStore } from '@/lib/store/task-store'
import { ProjectDialog } from './project-dialog'
import type { Project } from '@/lib/types'

export function ProjectSelector() {
  const { projects, selectedProjectId, selectProject, fetchTasks } = useTaskStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  const handleProjectSelect = async (projectId: string | null) => {
    selectProject(projectId)
    await fetchTasks()
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  const handleCreateProject = () => {
    setEditingProject(null)
    setDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full sm:w-[200px] justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Folder 
                className="h-4 w-4 shrink-0" 
                style={{ color: selectedProject?.color }}
              />
              <span className="truncate">
                {selectedProject?.name || 'Tous les projets'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuItem onClick={() => handleProjectSelect(null)}>
            <Folder className="h-4 w-4 mr-2" />
            Tous les projets
          </DropdownMenuItem>
          
          {projects.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  className="group"
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 truncate">
                      <Folder 
                        className="h-4 w-4 shrink-0" 
                        style={{ color: project.color }}
                      />
                      <span className="truncate">{project.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProject(project)
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau projet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
      />
    </>
  )
}