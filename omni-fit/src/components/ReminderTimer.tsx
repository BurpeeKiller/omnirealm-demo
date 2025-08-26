"use client";

import { motion } from "framer-motion";
import { Bell, BellOff, Settings as SettingsIcon, Clock, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addMinutes, differenceInSeconds } from "date-fns";
import { useSettingsStore } from "@/stores/settings.store";
import { useSessionStore, useExerciseCounters, type ExerciseType } from "@/stores/session.store";
import { useRouter } from "next/navigation";

export const ReminderTimer = () => {
  const router = useRouter();
  const { reminders } = useSettingsStore();
  const { incrementExercise, decrementExercise } = useSessionStore();
  const exerciseCounters = useExerciseCounters();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextReminderTime, setNextReminderTime] = useState<string>("--:--");
  const [timeUntilNext, setTimeUntilNext] = useState<string>("--:--");

  console.log("🕐 ReminderTimer: Component rendered", {
    currentTime: format(currentTime, "HH:mm:ss"),
    nextReminderTime,
    isActive: reminders.enabled,
    frequency: reminders.frequency,
  });

  // Calculer le prochain rappel basé sur les settings
  const calculateNextReminder = (now: Date) => {
    if (!reminders.enabled) return null;

    const nextTime = addMinutes(now, reminders.frequency);
    return nextTime;
  };

  // Mettre à jour l'heure actuelle chaque seconde
  useEffect(() => {
    console.log(
      "🕐 ReminderTimer: Setting up timer with frequency",
      reminders.frequency,
      "minutes"
    );

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (reminders.enabled) {
        // Calculer le prochain rappel basé sur la fréquence des settings
        const currentMinutes = now.getMinutes();
        const nextReminderMinutes =
          Math.ceil(currentMinutes / reminders.frequency) * reminders.frequency;

        const nextHour = nextReminderMinutes >= 60 ? now.getHours() + 1 : now.getHours();
        const adjustedMinutes = nextReminderMinutes >= 60 ? 0 : nextReminderMinutes;

        const nextReminderDate = new Date(now);
        nextReminderDate.setHours(nextHour, adjustedMinutes, 0, 0);

        const timeUntilNextSeconds = differenceInSeconds(nextReminderDate, now);
        const minutesLeft = Math.floor(timeUntilNextSeconds / 60);
        const secondsLeft = timeUntilNextSeconds % 60;

        const nextTimeStr = `${String(nextHour).padStart(2, "0")}:${String(adjustedMinutes).padStart(2, "0")}`;
        const countdownStr = `${String(minutesLeft).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;

        setNextReminderTime(nextTimeStr);
        setTimeUntilNext(countdownStr);

        console.log("🕐 ReminderTimer: Updated time", {
          now: format(now, "HH:mm:ss"),
          nextReminder: nextTimeStr,
          countdown: countdownStr,
          frequency: reminders.frequency,
        });
      } else {
        setNextReminderTime("--:--");
        setTimeUntilNext("--:--");
      }
    }, 1000);

    return () => {
      console.log("🕐 ReminderTimer: Cleaning up timer");
      clearInterval(interval);
    };
  }, [reminders.enabled, reminders.frequency]);

  if (!reminders.enabled) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-lg p-4 mx-4 mb-6 flex items-center justify-center gap-3 cursor-pointer hover:bg-[#E6FFF9] transition-colors border border-gray-200 shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => {
          console.log("🕐 ReminderTimer: Opening settings to activate reminders");
          router.push("/settings");
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BellOff className="w-5 h-5 text-[#636E72]" />
        <span className="text-[#636E72]">Rappels inactifs</span>
        <span className="text-xs text-[#636E72]/70 ml-2">(Cliquez pour configurer)</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF] rounded-lg p-6 mx-4 mb-6 border border-[#00D9B1]/20 shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header avec bouton settings */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            console.log("🕐 ReminderTimer: Opening settings");
            router.push("/settings");
          }}
          className="text-[#636E72] hover:text-[#00D9B1] transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Timer et rappel centrés */}
      <div className="flex items-center justify-center gap-8 mb-6">
        {/* Horloge actuelle */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-[#74B9FF]" />
            <span className="text-sm text-[#636E72]">Maintenant</span>
          </div>
          <div className="text-2xl font-bold text-[#2D3436] tabular-nums">
            {format(currentTime, "HH:mm:ss")}
          </div>
        </div>

        {/* Séparateur */}
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#00D9B1] to-transparent"></div>

        {/* Prochain rappel */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell className="w-6 h-6 text-[#00D9B1] animate-pulse" />
            <span className="text-sm text-[#636E72]">Prochain rappel</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00D9B1] to-[#00B89F] bg-clip-text text-transparent tabular-nums">
            {nextReminderTime}
          </div>
          <div className="text-sm text-[#636E72] mt-1">dans {timeUntilNext}</div>
        </div>
      </div>

      {/* Exercices en cours */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-[#2D3436] mb-4 text-center">
          Exercices en cours
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(exerciseCounters).map(exercise => (
            <motion.div
              key={exercise.type}
              className="bg-white/80 backdrop-blur-md rounded-lg p-3 border border-gray-200 shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{exercise.emoji}</span>
                  <span className="text-sm font-medium text-[#2D3436]">{exercise.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => decrementExercise(exercise.type)}
                  className="w-8 h-8 bg-[#E17055] hover:bg-[#E17055]/90 rounded-full flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={exercise.count === 0}
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>

                <div className="text-center">
                  <span className="text-xl font-bold text-[#2D3436]">{exercise.count}</span>
                  <span className="text-[#636E72]">/{exercise.target}</span>
                </div>

                <button
                  onClick={() => incrementExercise(exercise.type)}
                  className="w-8 h-8 bg-[#00D9B1] hover:bg-[#00B89F] rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-2 bg-gray-200 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F] transition-all duration-300"
                  style={{ width: `${Math.min(100, (exercise.count / exercise.target) * 100)}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
