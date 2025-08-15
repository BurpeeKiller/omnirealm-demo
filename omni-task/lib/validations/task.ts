import { z } from 'zod'
import { TaskStatus, TaskPriority } from '@/lib/types'

// Validation stricte pour les tâches
export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Le titre est requis')
    .max(500, 'Le titre ne peut pas dépasser 500 caractères')
    .trim()
    .refine(val => val.length > 0, 'Le titre ne peut pas être vide'),
  
  description: z.string()
    .max(5000, 'La description ne peut pas dépasser 5000 caractères')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE, TaskStatus.CANCELLED])
    .default(TaskStatus.TODO),
  
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT])
    .default(TaskPriority.MEDIUM),
  
  projectId: z.string().uuid('ID de projet invalide').optional().nullable(),
  
  dueDate: z.string().datetime().optional().nullable()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return date > new Date()
    }, 'La date d\'échéance doit être dans le futur'),
  
  estimatedHours: z.number()
    .min(0, 'Les heures estimées ne peuvent pas être négatives')
    .max(1000, 'Les heures estimées ne peuvent pas dépasser 1000')
    .optional()
    .nullable(),
  
  tags: z.array(z.string().max(50, 'Un tag ne peut pas dépasser 50 caractères'))
    .max(10, 'Maximum 10 tags par tâche')
    .optional()
    .nullable()
})

export const createTaskSchema = taskSchema.omit({ 
  status: true // Le statut est toujours TODO à la création
})

export const updateTaskSchema = taskSchema.partial()

// Validation pour le déplacement de tâches
export const moveTaskSchema = z.object({
  taskId: z.string().uuid('ID de tâche invalide'),
  newStatus: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE]),
  newPosition: z.number().int().min(0, 'La position doit être positive')
})

// Validation pour les projets
export const projectSchema = z.object({
  name: z.string()
    .min(1, 'Le nom est requis')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères')
    .trim(),
  
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .nullable(),
  
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur doit être au format hexadécimal (#RRGGBB)')
    .default('#6366f1'),
  
  icon: z.string()
    .max(50, 'L\'icône ne peut pas dépasser 50 caractères')
    .default('folder')
})

// Types inférés depuis les schémas
export type TaskInput = z.infer<typeof taskSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type MoveTaskInput = z.infer<typeof moveTaskSchema>
export type ProjectInput = z.infer<typeof projectSchema>