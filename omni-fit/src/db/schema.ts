import type { Table } from 'dexie';
import Dexie from 'dexie';
import type { Workout, DailyStats } from '@/types';

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

export class FitnessDB extends Dexie {
  workouts!: Table<Workout>;
  dailyStats!: Table<DailyStats>;
  settings!: Table<{ key: string; value: any }>;
  analytics!: Table<AnalyticsEntry>;

  constructor() {
    super('FitnessReminderDB');

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
  }
}

export const db = new FitnessDB();
