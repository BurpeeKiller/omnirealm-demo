"use client";

import { useSettingsStore } from "@/stores/settings.store";
import { Button } from "@/components/ui/button";
import { Clock, Bell, Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const router = useRouter();
  const { reminders, setReminderFrequency, setReminderSchedule, setActiveDays, toggleReminders } =
    useSettingsStore();

  console.log("⚙️ Settings: Current reminder settings", reminders);

  const handleFrequencyChange = (minutes: number) => {
    console.log("⚙️ Settings: Changing frequency to", minutes, "minutes");
    setReminderFrequency(minutes);
  };

  const handleTimeChange = (field: "start" | "end", value: string) => {
    console.log(`⚙️ Settings: Changing ${field} time to`, value);
    if (field === "start") {
      setReminderSchedule(value, reminders.endTime);
    } else {
      setReminderSchedule(reminders.startTime, value);
    }
  };

  const toggleDay = (day: string) => {
    const dayKey = day.toLowerCase() as any;
    const newDays = reminders.activeDays.includes(dayKey)
      ? reminders.activeDays.filter(d => d !== dayKey)
      : [...reminders.activeDays, dayKey];

    console.log("⚙️ Settings: Updating active days to", newDays);
    setActiveDays(newDays);
  };

  const frequencyOptions = [1, 5, 15, 30, 45, 60, 90, 120];
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-purple-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Paramètres des rappels</h1>
        </motion.div>

        {/* Enable/Disable Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">Rappels actifs</h2>
                <p className="text-sm text-gray-400">Activer les notifications de pause</p>
              </div>
            </div>
            <Button
              onClick={toggleReminders}
              variant={reminders.enabled ? "default" : "outline"}
              className={
                reminders.enabled
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "border-gray-600 text-gray-300"
              }
            >
              {reminders.enabled ? "Activés" : "Désactivés"}
            </Button>
          </div>
        </motion.div>

        {/* Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Fréquence</h2>
              <p className="text-sm text-gray-400">
                Rappel toutes les {reminders.frequency} minutes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {frequencyOptions.map(minutes => (
              <Button
                key={minutes}
                onClick={() => handleFrequencyChange(minutes)}
                variant={reminders.frequency === minutes ? "default" : "outline"}
                size="sm"
                className={
                  reminders.frequency === minutes
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-gray-600 text-gray-300"
                }
              >
                {minutes}min
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-green-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Horaires</h2>
              <p className="text-sm text-gray-400">
                De {reminders.startTime} à {reminders.endTime}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Début</label>
              <input
                type="time"
                value={reminders.startTime}
                onChange={e => handleTimeChange("start", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Fin</label>
              <input
                type="time"
                value={reminders.endTime}
                onChange={e => handleTimeChange("end", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Active Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-orange-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Jours actifs</h2>
              <p className="text-sm text-gray-400">
                {reminders.activeDays.length} jours sélectionnés
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayKey = dayKeys[index];
              const isActive = reminders.activeDays.includes(dayKey as any);

              return (
                <Button
                  key={day}
                  onClick={() => toggleDay(dayKey)}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    isActive ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600 text-gray-300"
                  }`}
                >
                  {day.slice(0, 3)}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Current Settings Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-3">Récapitulatif</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="text-purple-400">État :</span>{" "}
              {reminders.enabled ? "Activé" : "Désactivé"}
            </p>
            <p className="text-gray-300">
              <span className="text-purple-400">Fréquence :</span> Toutes les {reminders.frequency}{" "}
              minutes
            </p>
            <p className="text-gray-300">
              <span className="text-purple-400">Horaires :</span> {reminders.startTime} -{" "}
              {reminders.endTime}
            </p>
            <p className="text-gray-300">
              <span className="text-purple-400">Jours :</span> {reminders.activeDays.length}/7 jours
              actifs
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Retour au Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
