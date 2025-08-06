/**
 * Types extraits pour une utilisation plus facile
 */

import type { Database } from './database.types';

// Types des tables
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert'];

export type MediaFile = Database['public']['Tables']['media_files']['Row'];
export type MediaFileInsert = Database['public']['Tables']['media_files']['Insert'];
export type MediaFileUpdate = Database['public']['Tables']['media_files']['Update'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

export type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
export type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];

// Types des enums
export type UserRole = Database['public']['Enums']['user_role'];
export type SubscriptionStatus = Database['public']['Enums']['subscription_status'];
export type NotificationType = Database['public']['Enums']['notification_type'];
