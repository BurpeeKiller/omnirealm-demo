import { db } from '@/db';
import { format, startOfWeek, endOfWeek, subDays, isSameDay } from 'date-fns';
import { logger } from '@/utils/logger';

export interface AnalyticsData {
  // Engagement metrics
  totalSessions: number;
  totalExercises: number;
  averageExercisesPerDay: number;

  // Retention metrics
  firstSession: Date | null;
  lastSession: Date | null;
  daysSinceFirstUse: number;
  activeDays: number;

  // Performance metrics
  currentStreak: number;
  longestStreak: number;
  favoriteExercise: string;

  // Weekly trends
  thisWeekTotal: number;
  lastWeekTotal: number;
  weekOverWeekGrowth: number;

  // Usage patterns
  exerciseDistribution: {
    burpees: number;
    pompes: number;
    squats: number;
  };

  // Goals and achievements
  dailyGoalAchieved: boolean;
  weeklyGoalProgress: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track session start
  async trackSessionStart(): Promise<void> {
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      const existing = await db.analytics.get(today);
      const sessions = existing?.sessions || 0;

      await db.analytics.put({
        date: today,
        sessions: sessions + 1,
        exercises: existing?.exercises || 0,
        lastActivity: new Date(),
        exerciseBreakdown: existing?.exerciseBreakdown || {
          burpees: 0,
          pompes: 0,
          squats: 0,
        },
      });
    } catch (error) {
      logger.warn('Failed to track session:', error);
    }
  }

  // Track exercise completion
  async trackExercise(
    exerciseType: 'burpees' | 'pompes' | 'squats',
    count: number = 1,
  ): Promise<void> {
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      const existing = await db.analytics.get(today);
      const currentBreakdown = existing?.exerciseBreakdown || {
        burpees: 0,
        pompes: 0,
        squats: 0,
      };

      await db.analytics.put({
        date: today,
        sessions: existing?.sessions || 1,
        exercises: (existing?.exercises || 0) + count,
        lastActivity: new Date(),
        exerciseBreakdown: {
          ...currentBreakdown,
          [exerciseType]: currentBreakdown[exerciseType] + count,
        },
      });
    } catch (error) {
      logger.warn('Failed to track exercise:', error);
    }
  }

  // Track custom events
  async trackEvent(
    eventName: string,
    eventData?: Record<string, any>
  ): Promise<void> {
    try {
      logger.info(`[Analytics] Event: ${eventName}`, eventData);
      // Pour l'instant, on log juste les événements
      // Dans une vraie app, on pourrait les envoyer à un service d'analytics
    } catch (error) {
      logger.warn('Failed to track event:', error);
    }
  }

  // Get comprehensive analytics data
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const allData = await db.analytics.orderBy('date').toArray();
      const workouts = await db.workouts.orderBy('date').toArray();

      if (allData.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Basic metrics
      const totalSessions = allData.reduce((sum, day) => sum + day.sessions, 0);
      const totalExercises = allData.reduce((sum, day) => sum + day.exercises, 0);
      const activeDays = allData.length;

      // Date calculations
      const firstSession = allData[0]?.lastActivity || null;
      const lastSession = allData[allData.length - 1]?.lastActivity || null;
      const daysSinceFirstUse = firstSession
        ? Math.floor((new Date().getTime() - firstSession.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Exercise distribution
      const exerciseDistribution = allData.reduce(
        (acc, day) => ({
          burpees: acc.burpees + day.exerciseBreakdown.burpees,
          pompes: acc.pompes + day.exerciseBreakdown.pompes,
          squats: acc.squats + day.exerciseBreakdown.squats,
        }),
        { burpees: 0, pompes: 0, squats: 0 },
      );

      // Favorite exercise
      const favoriteExercise =
        Object.entries(exerciseDistribution).sort(([, a], [, b]) => b - a)[0]?.[0] || 'burpees';

      // Streak calculation
      const { currentStreak, longestStreak } = this.calculateStreaks(allData);

      // Weekly metrics
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      const lastWeekStart = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
      const lastWeekEnd = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });

      const thisWeekData = allData.filter((day) => {
        const date = new Date(day.date);
        return date >= weekStart && date <= weekEnd;
      });

      const lastWeekData = allData.filter((day) => {
        const date = new Date(day.date);
        return date >= lastWeekStart && date <= lastWeekEnd;
      });

      const thisWeekTotal = thisWeekData.reduce((sum, day) => sum + day.exercises, 0);
      const lastWeekTotal = lastWeekData.reduce((sum, day) => sum + day.exercises, 0);
      const weekOverWeekGrowth =
        lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 : 0;

      // Goals (simple: 10 exercises per day, 70 per week)
      const todayData = allData.find((day) => isSameDay(new Date(day.date), new Date()));
      const dailyGoalAchieved = (todayData?.exercises || 0) >= 10;
      const weeklyGoalProgress = Math.min((thisWeekTotal / 70) * 100, 100);

      return {
        totalSessions,
        totalExercises,
        averageExercisesPerDay: activeDays > 0 ? totalExercises / activeDays : 0,
        firstSession,
        lastSession,
        daysSinceFirstUse,
        activeDays,
        currentStreak,
        longestStreak,
        favoriteExercise,
        thisWeekTotal,
        lastWeekTotal,
        weekOverWeekGrowth,
        exerciseDistribution,
        dailyGoalAchieved,
        weeklyGoalProgress,
      };
    } catch (error) {
      logger.error('Failed to get analytics:', error);
      return this.getEmptyAnalytics();
    }
  }

  // Calculate streak data
  private calculateStreaks(data: any[]): { currentStreak: number; longestStreak: number } {
    if (data.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const sortedDates = data.map((d) => new Date(d.date)).sort((a, b) => a.getTime() - b.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Check current streak (from today backwards)
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(subDays(today, 1), 'yyyy-MM-dd');

    if (data.some((d) => d.date === todayString)) {
      currentStreak = 1;
      let checkDate = subDays(today, 1);

      while (data.some((d) => d.date === format(checkDate, 'yyyy-MM-dd'))) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      }
    } else if (data.some((d) => d.date === yesterdayString)) {
      // If not today but yesterday, check backwards
      let checkDate = subDays(today, 1);

      while (data.some((d) => d.date === format(checkDate, 'yyyy-MM-dd'))) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currDate = sortedDates[i];
      const daysDiff = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { currentStreak, longestStreak };
  }

  // Get weekly data for progress analysis
  async getWeeklyData(): Promise<{ average: number; total: number; days: number }> {
    try {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const allData = await db.analytics.orderBy('date').toArray();
      
      const weekData = allData.filter((day) => {
        const date = new Date(day.date);
        return date >= weekStart;
      });

      const total = weekData.reduce((sum, day) => sum + day.exercises, 0);
      const days = weekData.length;
      const average = days > 0 ? total / days : 0;

      return { average, total, days };
    } catch (error) {
      logger.error('Failed to get weekly data:', error);
      return { average: 0, total: 0, days: 0 };
    }
  }

  // Export analytics data as CSV
  async exportAnalytics(): Promise<string> {
    const data = await db.analytics.orderBy('date').toArray();

    const headers = ['Date', 'Sessions', 'Exercises', 'Burpees', 'Pompes', 'Squats'];
    const rows = data.map((day) => [
      day.date,
      day.sessions.toString(),
      day.exercises.toString(),
      day.exerciseBreakdown.burpees.toString(),
      day.exerciseBreakdown.pompes.toString(),
      day.exerciseBreakdown.squats.toString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    return csvContent;
  }

  // Clear all analytics (GDPR compliance)
  async clearAnalytics(): Promise<void> {
    try {
      await db.analytics.clear();
    } catch (error) {
      logger.error('Failed to clear analytics:', error);
    }
  }

  private getEmptyAnalytics(): AnalyticsData {
    return {
      totalSessions: 0,
      totalExercises: 0,
      averageExercisesPerDay: 0,
      firstSession: null,
      lastSession: null,
      daysSinceFirstUse: 0,
      activeDays: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteExercise: 'burpees',
      thisWeekTotal: 0,
      lastWeekTotal: 0,
      weekOverWeekGrowth: 0,
      exerciseDistribution: {
        burpees: 0,
        pompes: 0,
        squats: 0,
      },
      dailyGoalAchieved: false,
      weeklyGoalProgress: 0,
    };
  }
}

// Singleton instance
export const analytics = AnalyticsService.getInstance();
