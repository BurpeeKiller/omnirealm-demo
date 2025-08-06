/**
 * Types TypeScript générés depuis Supabase
 *
 * Pour régénérer ces types :
 * npx supabase gen types typescript --project-id [votre-project-id] > lib/supabase/database.types.ts
 *
 * Ce fichier contient les types des tables communes réutilisables dans tous les projets OmniRealm.
 * Chaque projet peut étendre ces types avec ses propres tables spécifiques.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          role: 'user' | 'admin' | 'moderator';
          is_active: boolean;
          email_verified: boolean;
          preferences: Json;
          notification_settings: Json;
          created_at: string;
          updated_at: string;
          last_seen_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          role?: 'user' | 'admin' | 'moderator';
          is_active?: boolean;
          email_verified?: boolean;
          preferences?: Json;
          notification_settings?: Json;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          role?: 'user' | 'admin' | 'moderator';
          is_active?: boolean;
          email_verified?: boolean;
          preferences?: Json;
          notification_settings?: Json;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          settings: Json;
          features: Json;
          subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise';
          subscription_status: 'active' | 'past_due' | 'canceled' | 'trialing';
          trial_ends_at: string | null;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          settings?: Json;
          features?: Json;
          subscription_tier?: 'free' | 'starter' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing';
          trial_ends_at?: string | null;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          settings?: Json;
          features?: Json;
          subscription_tier?: 'free' | 'starter' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing';
          trial_ends_at?: string | null;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type:
            | 'info'
            | 'success'
            | 'warning'
            | 'error'
            | 'mention'
            | 'like'
            | 'comment'
            | 'follow';
          title: string;
          message: string | null;
          data: Json;
          action_url: string | null;
          is_read: boolean;
          read_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type:
            | 'info'
            | 'success'
            | 'warning'
            | 'error'
            | 'mention'
            | 'like'
            | 'comment'
            | 'follow';
          title: string;
          message?: string | null;
          data?: Json;
          action_url?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?:
            | 'info'
            | 'success'
            | 'warning'
            | 'error'
            | 'mention'
            | 'like'
            | 'comment'
            | 'follow';
          title?: string;
          message?: string | null;
          data?: Json;
          action_url?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_start: string;
          current_period_end: string;
          cancel_at: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_start: string;
          current_period_end: string;
          cancel_at?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_start?: string;
          current_period_end?: string;
          cancel_at?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json | null;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_name: string;
          event_properties: Json | null;
          page_url: string | null;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_name: string;
          event_properties?: Json | null;
          page_url?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_name?: string;
          event_properties?: Json | null;
          page_url?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      media_files: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          storage_path: string;
          public_url: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          storage_path: string;
          public_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string;
          storage_path?: string;
          public_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          details: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      active_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          username: string | null;
          role: 'user' | 'admin' | 'moderator';
          is_active: boolean;
          auth_email: string;
          signup_date: string;
        };
      };
      user_stats: {
        Row: {
          total_users: number;
          total_admins: number;
          total_moderators: number;
          new_users_24h: number;
          new_users_7d: number;
          active_users_24h: number;
        };
      };
    };
    Functions: {
      get_current_user_profile: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          email: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          role: 'user' | 'admin' | 'moderator';
          is_active: boolean;
          email_verified: boolean;
          preferences: Json;
          notification_settings: Json;
          created_at: string;
          updated_at: string;
          last_seen_at: string;
        };
      };
      user_has_role: {
        Args: {
          required_role: string;
        };
        Returns: boolean;
      };
      update_last_seen: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      slugify: {
        Args: {
          input_text: string;
        };
        Returns: string;
      };
      generate_unique_slug: {
        Args: {
          base_slug: string;
          table_name: string;
          column_name?: string;
        };
        Returns: string;
      };
      increment_counter: {
        Args: {
          table_name: string;
          column_name: string;
          row_id: string;
          increment_by?: number;
        };
        Returns: number;
      };
    };
    Enums: {
      user_role: 'user' | 'admin' | 'moderator';
      subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise';
      subscription_status: 'active' | 'past_due' | 'canceled' | 'trialing';
      organization_member_role: 'owner' | 'admin' | 'member' | 'viewer';
      notification_type:
        | 'info'
        | 'success'
        | 'warning'
        | 'error'
        | 'mention'
        | 'like'
        | 'comment'
        | 'follow';
    };
  };
}
