/**
 * Types centralisés pour OmniTask
 * Version: 3.0.0
 * Architecture moderne avec TypeScript strict
 */

// Enums stricts pour éviter les erreurs
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS', 
  REVIEW: 'REVIEW',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
} as const;

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];
export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  position: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  assigneeId?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
  limit?: number;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'team';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'kanban' | 'list' | 'calendar';
  emailNotifications: boolean;
  aiAssistance: boolean;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

// API Response types avec génériques
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Drag and Drop types
export interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
}

// Store types
export interface TaskStore {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'userId'>) => Promise<Task>;
  updateTask: (id: string, updates: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus, newPosition: number) => Promise<void>;
  
  // Projects
  setProjects: (projects: Project[]) => void;
  selectProject: (projectId: string | null) => void;
  
  // Utils
  clearError: () => void;
  reset: () => void;
  fetchTasks: () => Promise<void>;
}

// Form schemas avec Zod
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().positive().optional(),
  tags: z.array(z.string()).optional()
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']).optional(),
  actualHours: z.number().positive().optional(),
  position: z.number().int().min(0).optional()
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;