"use client";

import { useSettingsStore } from "@/stores/settings.store";
import { Button } from "@/components/ui/button";
import { Clock, Bell, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export const SettingsSection = () => {
  const { reminders, setReminderFrequency, setReminderSchedule, setActiveDays, toggleReminders } =
    useSettingsStore();

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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2D3436]">Paramètres des rappels</h2>
      </div>

      {/* Enable/Disable Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#00D9B1]" />
            <div>
              <h2 className="text-lg font-semibold text-[#2D3436]">Rappels actifs</h2>
              <p className="text-sm text-[#636E72]">Activer les notifications de pause</p>
            </div>
          </div>
          <Button
            onClick={toggleReminders}
            variant={reminders.enabled ? "default" : "outline"}
            className={
              reminders.enabled
                ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white border-0"
                : "border-gray-300 text-[#636E72] bg-white hover:bg-[#E6FFF9] hover:border-[#00D9B1]"
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
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-[#74B9FF]" />
          <div>
            <h2 className="text-lg font-semibold text-[#2D3436]">Fréquence</h2>
            <p className="text-sm text-[#636E72]">
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
                  ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white border-0"
                  : "border-gray-300 text-[#636E72] bg-white hover:bg-[#E6FFF9] hover:border-[#00D9B1]"
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
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-[#00D9B1]" />
          <div>
            <h2 className="text-lg font-semibold text-[#2D3436]">Horaires</h2>
            <p className="text-sm text-[#636E72]">
              De {reminders.startTime} à {reminders.endTime}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#636E72] mb-2">Début</label>
            <input
              type="time"
              value={reminders.startTime}
              onChange={e => handleTimeChange("start", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[#2D3436] focus:border-[#00D9B1] focus:outline-none focus:ring-2 focus:ring-[#00D9B1]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#636E72] mb-2">Fin</label>
            <input
              type="time"
              value={reminders.endTime}
              onChange={e => handleTimeChange("end", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[#2D3436] focus:border-[#00D9B1] focus:outline-none focus:ring-2 focus:ring-[#00D9B1]/20"
            />
          </div>
        </div>
      </motion.div>

      {/* Active Days */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-[#E17055]" />
          <div>
            <h2 className="text-lg font-semibold text-[#2D3436]">Jours actifs</h2>
            <p className="text-sm text-[#636E72]">
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
                  isActive
                    ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white border-0"
                    : "border-gray-300 text-[#636E72] bg-white hover:bg-[#E6FFF9] hover:border-[#00D9B1]"
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
        className="bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF] rounded-xl p-6 border border-[#00D9B1]/20 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-[#2D3436] mb-3">Récapitulatif</h3>
        <div className="space-y-2 text-sm">
          <p className="text-[#2D3436]">
            <span className="text-[#00D9B1] font-medium">État :</span>{" "}
            {reminders.enabled ? "Activé" : "Désactivé"}
          </p>
          <p className="text-[#2D3436]">
            <span className="text-[#00D9B1] font-medium">Fréquence :</span> Toutes les{" "}
            {reminders.frequency} minutes
          </p>
          <p className="text-[#2D3436]">
            <span className="text-[#00D9B1] font-medium">Horaires :</span> {reminders.startTime} -{" "}
            {reminders.endTime}
          </p>
          <p className="text-[#2D3436]">
            <span className="text-[#00D9B1] font-medium">Jours :</span>{" "}
            {reminders.activeDays.length}/7 jours actifs
          </p>
        </div>
      </motion.div>
    </div>
  );
};
