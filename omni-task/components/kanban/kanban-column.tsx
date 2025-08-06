'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
import { TaskCard } from './task-card'
import { Button } from '@omnirealm/ui'
import { Plus } from 'lucide-react'
import type { KanbanColumn as KanbanColumnType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  column: KanbanColumnType
  onAddTask: (status: string) => void
  onEditTask: (task: any) => void
}

export function KanbanColumn({ column, onAddTask, onEditTask }: KanbanColumnProps) {
  const isOverLimit = column.limit && column.tasks.length >= column.limit

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 pb-3 flex-shrink-0 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div 
            className="w-1 h-6 rounded-full" 
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            isOverLimit 
              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" 
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          )}>
            {column.tasks.length}
            {column.limit && ` / ${column.limit}`}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-4 space-y-3 overflow-y-auto overflow-x-hidden min-h-0",
              snapshot.isDraggingOver && "bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10"
            )}
            style={{
              minHeight: '100px',
              maxHeight: '600px'
            }}
          >
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="drag-handle"
                  >
                    <TaskCard 
                      task={task} 
                      isDragging={snapshot.isDragging} 
                      onClick={() => onEditTask(task)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}