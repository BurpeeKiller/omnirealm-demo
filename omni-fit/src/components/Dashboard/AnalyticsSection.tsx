"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Trophy, Calendar, Activity, Timer, Star } from "lucide-react";
import { useState } from "react";

export const AnalyticsSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("7d");

  // Mock data - dans une vraie app, ceci viendrait du store
  const stats = {
    exercisesToday: 12,
    timeToday: 25,
    streakDays: 5,
    totalPoints: 1245,
    weeklyAverage: 18,
    monthlyGoal: 80,
    monthlyProgress: 65,
  };

  const weeklyData = [
    { day: "Lun", exercises: 8, time: 15 },
    { day: "Mar", exercises: 12, time: 22 },
    { day: "Mer", exercises: 6, time: 12 },
    { day: "Jeu", exercises: 15, time: 28 },
    { day: "Ven", exercises: 10, time: 18 },
    { day: "Sam", exercises: 18, time: 32 },
    { day: "Dim", exercises: 14, time: 25 },
  ];

  const maxExercises = Math.max(...weeklyData.map(d => d.exercises));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2D3436]">Analytics</h2>

        {/* Période Selector */}
        <div className="flex gap-1 p-1 bg-white/80 backdrop-blur-md rounded-lg border border-gray-200">
          {[
            { key: "7d", label: "7 jours" },
            { key: "30d", label: "30 jours" },
            { key: "90d", label: "90 jours" },
          ].map(period => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                selectedPeriod === period.key
                  ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] text-white"
                  : "text-[#636E72] hover:text-[#2D3436] hover:bg-gray-50"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-[#00D9B1]" />
            <div>
              <div className="text-2xl font-bold text-[#2D3436]">{stats.exercisesToday}</div>
              <div className="text-xs text-[#636E72]">Aujourd'hui</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Timer className="w-6 h-6 text-[#74B9FF]" />
            <div>
              <div className="text-2xl font-bold text-[#2D3436]">{stats.timeToday}min</div>
              <div className="text-xs text-[#636E72]">Temps</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-[#FDCB6E]" />
            <div>
              <div className="text-2xl font-bold text-[#2D3436]">{stats.streakDays}</div>
              <div className="text-xs text-[#636E72]">Série</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-[#E17055]" />
            <div>
              <div className="text-2xl font-bold text-[#2D3436]">{stats.totalPoints}</div>
              <div className="text-xs text-[#636E72]">Points</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphique hebdomadaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-[#00D9B1]" />
          <h3 className="text-lg font-semibold text-[#2D3436]">Activité hebdomadaire</h3>
        </div>

        <div className="flex items-end gap-2 h-32">
          {weeklyData.map((data, index) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.exercises / maxExercises) * 100}%` }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-[#00D9B1] to-[#00B89F] rounded-t min-h-[4px]"
              />
              <div className="text-xs text-[#636E72]">{data.day}</div>
              <div className="text-xs font-medium text-[#2D3436]">{data.exercises}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Objectif mensuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#74B9FF]" />
            <h3 className="text-lg font-semibold text-[#2D3436]">Objectif mensuel</h3>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#2D3436]">{stats.monthlyProgress}%</div>
            <div className="text-xs text-[#636E72]">{stats.monthlyGoal} exercices</div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.monthlyProgress}%` }}
            transition={{ delay: 0.9, duration: 1 }}
            className="h-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F]"
          />
        </div>

        <div className="flex justify-between text-xs text-[#636E72] mt-2">
          <span>0</span>
          <span>{stats.monthlyGoal} exercices</span>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF] rounded-xl p-6 border border-[#00D9B1]/20 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-[#00D9B1]" />
          <h3 className="text-lg font-semibold text-[#2D3436]">Insights</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#00D9B1] rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-[#2D3436]">
              Votre moyenne hebdomadaire est de <strong>{stats.weeklyAverage} exercices</strong>,
              soit +12% par rapport au mois dernier !
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#74B9FF] rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-[#2D3436]">
              Votre meilleur jour est le <strong>samedi</strong> avec une moyenne de 18 exercices.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#FDCB6E] rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-[#2D3436]">
              Continuez comme ça ! Vous êtes sur le point d'atteindre votre objectif mensuel.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
