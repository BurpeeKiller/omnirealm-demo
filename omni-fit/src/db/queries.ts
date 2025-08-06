import { db } from './schema';
import type { ExerciseType, Workout, DailyStats } from '@/types';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { fr } from 'date-fns/locale';

export const addWorkout = async (exercise: ExerciseType, count: number) => {
  const now = new Date();
  const workout: Workout = {
    date: now,
    exercise,
    count,
    timestamp: now,
  };

  await db.workouts.add(workout);
  await updateDailyStats(now);
  return workout;
};

export const updateDailyStats = async (date: Date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const start = startOfDay(date);
  const end = endOfDay(date);

  const workouts = await db.workouts.where('date').between(start, end).toArray();

  const stats: DailyStats = {
    date: dateStr,
    burpees: 0,
    pushups: 0,
    squats: 0,
    total: 0,
  };

  workouts.forEach((w) => {
    switch (w.exercise) {
      case 'burpees':
        stats.burpees += w.count;
        break;
      case 'pushups':
        stats.pushups += w.count;
        break;
      case 'squats':
        stats.squats += w.count;
        break;
    }
    stats.total += w.count;
  });

  await db.dailyStats.put(stats);
};

export const getTodayStats = async (): Promise<DailyStats> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const stats = await db.dailyStats.get(today);

  return (
    stats || {
      date: today,
      burpees: 0,
      pushups: 0,
      squats: 0,
      total: 0,
    }
  );
};

export const getWeekStats = async () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  return db.dailyStats
    .where('date')
    .between(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))
    .toArray();
};

export const getMonthStats = async (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return db.dailyStats
    .where('date')
    .between(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))
    .toArray();
};

export const getYearStats = async (year: number) => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));

  return db.dailyStats
    .where('date')
    .between(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))
    .toArray();
};

export const getTotalByExercise = async (
  exercise: ExerciseType,
  startDate?: Date,
  endDate?: Date,
): Promise<number> => {
  const query = db.workouts.where('exercise').equals(exercise);

  if (startDate && endDate) {
    const workouts = await query.toArray();
    const filtered = workouts.filter((w) => w.date >= startDate && w.date <= endDate);
    return filtered.reduce((sum, w) => sum + w.count, 0);
  }

  const workouts = await query.toArray();
  return workouts.reduce((sum, w) => sum + w.count, 0);
};

export const getAllTimeStats = async () => {
  const totals = {
    burpees: await getTotalByExercise('burpees'),
    pushups: await getTotalByExercise('pushups'),
    squats: await getTotalByExercise('squats'),
    total: 0,
  };

  totals.total = totals.burpees + totals.pushups + totals.squats;
  return totals;
};

export const getHistoryByPeriod = async (startDate: Date, endDate: Date): Promise<DailyStats[]> => {
  return db.dailyStats
    .where('date')
    .between(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
    .toArray();
};

export const exportToCSV = async (startDate?: Date, endDate?: Date) => {
  const workouts = await (startDate && endDate
    ? db.workouts.where('date').between(startDate, endDate).toArray()
    : db.workouts.toArray());

  const headers = ['Date', 'Heure', 'Exercice', 'Nombre'];
  const rows = workouts.map((w) => [
    format(w.date, 'dd/MM/yyyy', { locale: fr }),
    format(w.date, 'HH:mm', { locale: fr }),
    w.exercise === 'burpees' ? 'Burpees' : w.exercise === 'pushups' ? 'Pompes' : 'Squats',
    w.count.toString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csv;
};

export const exportToJSON = async (startDate?: Date, endDate?: Date) => {
  const workouts = await (startDate && endDate
    ? db.workouts.where('date').between(startDate, endDate).toArray()
    : db.workouts.toArray());

  const dailyStats = await (startDate && endDate
    ? db.dailyStats
        .where('date')
        .between(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
        .toArray()
    : db.dailyStats.toArray());

  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: {
      workouts: workouts.map((w) => ({
        ...w,
        date: w.date.toISOString(),
        timestamp: w.timestamp.toISOString(),
      })),
      dailyStats,
    },
    metadata: {
      totalWorkouts: workouts.length,
      totalDays: dailyStats.length,
      dateRange: {
        start: startDate?.toISOString() || workouts[0]?.date.toISOString() || null,
        end: endDate?.toISOString() || workouts[workouts.length - 1]?.date.toISOString() || null,
      },
    },
  };

  return JSON.stringify(exportData, null, 2);
};

export const importFromJSON = async (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);

    // Validation basique
    if (!data.version || !data.data || !data.data.workouts) {
      throw new Error('Format de données invalide');
    }

    // Clear existing data if requested
    const shouldClear = confirm('Voulez-vous remplacer toutes les données existantes ?');
    if (shouldClear) {
      await db.workouts.clear();
      await db.dailyStats.clear();
    }

    // Import workouts
    const workouts = data.data.workouts.map((w: any) => ({
      ...w,
      date: new Date(w.date),
      timestamp: new Date(w.timestamp),
    }));

    await db.workouts.bulkAdd(workouts);

    // Import daily stats if available
    if (data.data.dailyStats) {
      await db.dailyStats.bulkPut(data.data.dailyStats);
    }

    return {
      success: true,
      imported: {
        workouts: workouts.length,
        dailyStats: data.data.dailyStats?.length || 0,
      },
    };
  } catch (error) {
    console.error('Erreur import JSON:', error);
    throw error;
  }
};

// Fonction pour calculer les streaks (séries de jours consécutifs)
export const getStreakStats = async () => {
  const allStats = await db.dailyStats.orderBy('date').toArray();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;
  const today = startOfDay(new Date());

  for (const stat of allStats) {
    if (stat.total > 0) {
      const statDate = new Date(stat.date);

      if (lastDate) {
        const diffDays = Math.floor(
          (statDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }

      lastDate = statDate;

      // Check if current streak is still active
      const daysSinceLastWorkout = Math.floor(
        (today.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysSinceLastWorkout <= 1) {
        currentStreak = tempStreak;
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    lastWorkoutDate: lastDate,
  };
};
