export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'pro' | 'team'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon: string | null
          user_id: string
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          icon?: string | null
          user_id: string
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string | null
          user_id?: string
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          project_id: string | null
          user_id: string
          assignee_id: string | null
          position: number
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          project_id?: string | null
          user_id: string
          assignee_id?: string | null
          position?: number
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          project_id?: string | null
          user_id?: string
          assignee_id?: string | null
          position?: number
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          default_view: 'kanban' | 'list' | 'calendar'
          email_notifications: boolean
          ai_assistance: boolean
          working_hours_start: string
          working_hours_end: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          default_view?: 'kanban' | 'list' | 'calendar'
          email_notifications?: boolean
          ai_assistance?: boolean
          working_hours_start?: string
          working_hours_end?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          default_view?: 'kanban' | 'list' | 'calendar'
          email_notifications?: boolean
          ai_assistance?: boolean
          working_hours_start?: string
          working_hours_end?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      task_history: {
        Row: {
          id: string
          task_id: string
          user_id: string
          action: string
          changes: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          action: string
          changes?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          action?: string
          changes?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'
      task_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      user_plan: 'free' | 'pro' | 'team'
    }
  }
}