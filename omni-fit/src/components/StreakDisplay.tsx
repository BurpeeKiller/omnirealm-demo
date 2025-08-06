import { useEffect, useState } from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { getStreakStats } from '@/db/queries';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: Date | null;
}

export default function StreakDisplay() {
  const [stats, setStats] = useState<StreakStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakStats();
  }, []);

  const loadStreakStats = async () => {
    try {
      const streakData = await getStreakStats();
      setStats(streakData);
    } catch (error) {
      console.error('Erreur chargement streaks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>;
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Current Streak */}
      <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-4 rounded-xl text-white shadow-lg backdrop-blur-sm border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <Flame className="w-8 h-8" />
          <span className="text-2xl font-bold">{stats.currentStreak}</span>
        </div>
        <p className="text-sm opacity-90">Série actuelle</p>
        {stats.currentStreak > 0 && (
          <p className="text-xs mt-1 opacity-75">Ne perdez pas votre série !</p>
        )}
      </div>

      {/* Longest Streak */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-xl text-white shadow-lg backdrop-blur-sm border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <Trophy className="w-8 h-8" />
          <span className="text-2xl font-bold">{stats.longestStreak}</span>
        </div>
        <p className="text-sm opacity-90">Record personnel</p>
        {stats.longestStreak > 0 && stats.currentStreak >= stats.longestStreak && (
          <p className="text-xs mt-1 opacity-75">Nouveau record ! 🎉</p>
        )}
      </div>

      {/* Last Workout */}
      {stats.lastWorkoutDate && (
        <div className="col-span-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dernier entraînement</p>
              <p className="font-medium">
                {format(stats.lastWorkoutDate, "EEEE d MMMM 'à' HH'h'mm", { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
