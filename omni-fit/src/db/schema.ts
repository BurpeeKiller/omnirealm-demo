import type { Table } from 'dexie';
import Dexie from 'dexie';
import type { Workout, DailyStats, Exercise } from '@/types';

export interface AnalyticsEntry {
  date: string; // YYYY-MM-DD format
  sessions: number;
  exercises: number;
  lastActivity: Date;
  exerciseBreakdown: {
    burpees: number;
    pompes: number;
    squats: number;
  };
}

export interface ExerciseStats {
  name: string;
  totalCount: number;
  sessionCount: number;
  lastCompleted: Date;
}

export class FitnessDB extends Dexie {
  workouts!: Table<Workout>;
  exercises!: Table<Exercise>;
  exerciseStats!: Table<ExerciseStats>;
  dailyStats!: Table<DailyStats>;
  settings!: Table<{ key: string; value: any }>;
  analytics!: Table<AnalyticsEntry>;

  constructor() {
    super('OmniFitDB');

    this.version(1).stores({
      workouts: '++id, date, exercise, [date+exercise]',
      dailyStats: 'date',
      settings: 'key',
    });

    // Version 2: Add analytics table
    this.version(2).stores({
      workouts: '++id, date, exercise, [date+exercise]',
      dailyStats: 'date',
      settings: 'key',
      analytics: 'date, lastActivity',
    });

    // Version 3: Add exercises and exerciseStats tables
    this.version(3).stores({
      workouts: '++id, date, exercise, [date+exercise]',
      exercises: 'id, name, timestamp, synced',
      exerciseStats: 'name, lastCompleted',
      dailyStats: 'date',
      settings: 'key',
      analytics: 'date, lastActivity',
    });
  }
}

export const db = new FitnessDB();
