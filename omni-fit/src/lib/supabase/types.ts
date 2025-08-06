// Types générés pour le namespace fitness_reminder
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  fitness_reminder: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          plan: 'free' | 'pro' | 'team';
          plan_expires_at: string | null;
          lemon_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          plan?: 'free' | 'pro' | 'team';
          plan_expires_at?: string | null;
          lemon_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          plan?: 'free' | 'pro' | 'team';
          plan_expires_at?: string | null;
          lemon_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_plan: 'free' | 'pro' | 'team';
    };
  };
}
