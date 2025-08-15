export type ExerciseType = 'burpees' | 'pushups' | 'squats';

export interface ExerciseDefinition {
  type: ExerciseType;
  name: string;
  emoji: string;
  count: number;
  increment: number;
}

export interface Exercise {
  id: string;
  name: string;
  count: number;
  timestamp: Date;
  synced: boolean;
  completed?: boolean;
  target?: number;
}

export interface Workout {
  id?: number;
  date: Date;
  exercise: ExerciseType;
  count: number;
  timestamp: Date;
}

export interface DailyStats {
  date: string;
  burpees: number;
  pushups: number;
  squats: number;
  total: number;
}

export interface ReminderSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
  frequency: number; // minutes
  exercisesPerReminder: {
    burpees: number;
    pushups: number;
    squats: number;
  };
  activeDays: string[];
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface UserSettings extends ReminderSettings {
  dailyGoal: number;
  theme: 'light' | 'dark' | 'auto';
  firstDayOfWeek: 'sunday' | 'monday';
}
