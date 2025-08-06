import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Bell,
  Volume2,
  Vibrate,
  Target,
  Calendar,
  Save,
  RotateCcw,
  Database,
  TestTube,
} from 'lucide-react';
import { useSettingsStore } from '@/stores/settings.store';
import { useOnboarding } from '@/hooks/useOnboarding';
import { BackupManager } from '@/components/Backup';
import { reminderWorkerService } from '@/services/reminder-worker';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings = ({ isOpen, onClose }: SettingsProps) => {
  const settings = useSettingsStore();
  const { resetOnboarding } = useOnboarding();
  const [activeTab, setActiveTab] = useState<'settings' | 'backup'>('settings');

  const tabs = [
    { id: 'settings', label: 'Réglages', icon: '🔔' },
    { id: 'backup', label: 'Backup', icon: '💾' },
  ] as const;

  const [localSettings, setLocalSettings] = useState({
    enabled: settings.enabled,
    startTime: settings.startTime,
    endTime: settings.endTime,
    frequency: settings.frequency,
    exercisesPerReminder: { ...settings.exercisesPerReminder },
    activeDays: [...settings.activeDays],
    soundEnabled: settings.soundEnabled,
    vibrationEnabled: settings.vibrationEnabled,
    dailyGoal: settings.dailyGoal,
  });

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayMap: Record<string, string> = {
    Lun: 'Mon',
    Mar: 'Tue',
    Mer: 'Wed',
    Jeu: 'Thu',
    Ven: 'Fri',
    Sam: 'Sat',
    Dim: 'Sun',
  };

  const handleSave = () => {
    settings.updateSettings(localSettings);
    onClose();
  };

  const handleRestartOnboarding = () => {
    resetOnboarding();
    onClose();
  };

  const toggleDay = (day: string) => {
    const englishDay = dayMap[day];
    setLocalSettings((prev) => ({
      ...prev,
      activeDays: prev.activeDays.includes(englishDay)
        ? prev.activeDays.filter((d) => d !== englishDay)
        : [...prev.activeDays, englishDay],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-16 bottom-4 md:inset-x-auto md:inset-y-[5%] md:left-1/2 md:right-auto md:w-full md:max-w-3xl md:-translate-x-1/2 bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[calc(100vh-5rem)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-gradient flex items-center gap-2">
                <Bell className="w-7 h-7" />
                {activeTab === 'settings' ? 'Réglages' : 'Backup & Données'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'settings' | 'backup')}
                  className={`flex-1 py-4 px-6 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-primary-400 border-b-2 border-primary-400 bg-gray-700/30'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'settings' ? (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-6"
                  >
                    {/* Rappels actifs */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary-400" />
                        Rappels
                      </h3>

                      <div className="px-4 py-2 bg-gray-800 text-gray-100 rounded-2xl rounded-bl-sm border border-gray-700">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="font-medium">Activer les rappels</span>
                          <input
                            type="checkbox"
                            checked={localSettings.enabled}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({ ...prev, enabled: e.target.checked }))
                            }
                            className="w-5 h-5 text-primary-500 bg-gray-600 border-gray-500 rounded focus:ring-primary-500"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Plage horaire */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-400" />
                        Plage horaire
                      </h3>

                      <div className="px-4 py-3 bg-gray-800 text-gray-100 rounded-2xl border border-gray-700">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Début</label>
                            <input
                              type="time"
                              value={localSettings.startTime}
                              onChange={(e) =>
                                setLocalSettings((prev) => ({ ...prev, startTime: e.target.value }))
                              }
                              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Fin</label>
                            <input
                              type="time"
                              value={localSettings.endTime}
                              onChange={(e) =>
                                setLocalSettings((prev) => ({ ...prev, endTime: e.target.value }))
                              }
                              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fréquence */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold">Fréquence des rappels</h3>

                      <div className="px-4 py-3 bg-gray-800 text-gray-100 rounded-2xl border border-gray-700">
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="5"
                            max="120"
                            step="5"
                            value={localSettings.frequency}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                frequency: Number(e.target.value),
                              }))
                            }
                            className="flex-1 accent-primary-500"
                          />
                          <span className="w-20 text-center font-medium text-primary-400">
                            {localSettings.frequency} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Jours actifs */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-400" />
                        Jours actifs
                      </h3>

                      <div className="grid grid-cols-7 gap-2">
                        {days.map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`p-3 rounded-lg font-medium transition-all ${
                              localSettings.activeDays.includes(dayMap[day])
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Exercices par rappel */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold">Exercices par rappel</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="text-2xl">🔥</span>
                            Burpees
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={localSettings.exercisesPerReminder.burpees}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                exercisesPerReminder: {
                                  ...prev.exercisesPerReminder,
                                  burpees: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-20 px-3 py-2 bg-gray-700 rounded-lg text-center"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="text-2xl">💪</span>
                            Pompes
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={localSettings.exercisesPerReminder.pushups}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                exercisesPerReminder: {
                                  ...prev.exercisesPerReminder,
                                  pushups: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-20 px-3 py-2 bg-gray-700 rounded-lg text-center"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="text-2xl">🦵</span>
                            Squats
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={localSettings.exercisesPerReminder.squats}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                exercisesPerReminder: {
                                  ...prev.exercisesPerReminder,
                                  squats: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-20 px-3 py-2 bg-gray-700 rounded-lg text-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Objectif quotidien */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-400" />
                        Objectif quotidien
                      </h3>

                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="50"
                          max="1000"
                          step="50"
                          value={localSettings.dailyGoal}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              dailyGoal: Number(e.target.value),
                            }))
                          }
                          className="flex-1 accent-primary-500"
                        />
                        <span className="w-20 text-center font-medium">
                          {localSettings.dailyGoal}
                        </span>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold">Notifications</h3>

                      <label className="flex items-center justify-between p-4 bg-gray-700 rounded-xl cursor-pointer">
                        <span className="flex items-center gap-3">
                          <Volume2 className="w-5 h-5 text-gray-400" />
                          <span className="font-medium md:text-lg">Sons</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={localSettings.soundEnabled}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              soundEnabled: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 text-primary-500 bg-gray-600 border-gray-500 rounded focus:ring-primary-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-700 rounded-xl cursor-pointer">
                        <span className="flex items-center gap-3">
                          <Vibrate className="w-5 h-5 text-gray-400" />
                          <span className="font-medium md:text-lg">Vibrations</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={localSettings.vibrationEnabled}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              vibrationEnabled: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 text-primary-500 bg-gray-600 border-gray-500 rounded focus:ring-primary-500"
                        />
                      </label>

                      <button
                        onClick={async () => {
                          try {
                            await reminderWorkerService.testReminder();
                          } catch (error) {
                            console.error('Erreur test notification:', error);
                          }
                        }}
                        className="flex items-center justify-center gap-2 w-full p-4 bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                      >
                        <TestTube className="w-5 h-5" />
                        <span className="font-medium">Tester une notification</span>
                      </button>
                    </div>

                    {/* Actions diverses */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold">Actions</h3>

                      <button
                        onClick={handleRestartOnboarding}
                        className="flex items-center justify-between w-full p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <RotateCcw className="w-5 h-5 text-gray-400" />
                          <span className="font-medium md:text-lg">Relancer l'introduction</span>
                        </span>
                        <span className="text-sm text-gray-400">3 étapes</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="backup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <BackupManager />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer - Only show for settings tab */}
            {activeTab === 'settings' && (
              <div className="p-6 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Enregistrer
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
