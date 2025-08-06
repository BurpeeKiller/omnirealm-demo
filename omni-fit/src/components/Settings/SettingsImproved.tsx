import { X, Bell, Volume2, Vibrate, Clock, Calendar, RotateCcw, Shield, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings.store';
import { useOnboarding } from '@/hooks/useOnboarding';
import DataManagement from '../DataManagement';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsImproved({ isOpen, onClose }: SettingsProps) {
  const settings = useSettingsStore();
  const { resetOnboarding } = useOnboarding();

  const handleResetOnboarding = () => {
    if (confirm("Voulez-vous relancer le tutoriel d'introduction ?")) {
      resetOnboarding();
      window.location.reload();
    }
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
    </label>
  );

  const DaySelector = ({ day, dayCode, isActive, onClick }: any) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative px-4 py-3 rounded-xl font-medium transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
    >
      {day}
      {isActive && (
        <motion.div
          layoutId="activeDay"
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl -z-10"
        />
      )}
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header avec gradient rose */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 pb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Shield className="w-8 h-8" />
                  Paramètres
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
              <p className="text-rose-100">Personnalisez votre expérience</p>
            </div>

            {/* Content avec scroll */}
            <div className="overflow-y-auto h-[calc(100%-120px)] pb-20">
              <div className="p-6 space-y-8">
                
                {/* Section Notifications avec carte */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
                >
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-purple-900 dark:text-purple-100">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg">
                          <Bell className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                        </div>
                        <div>
                          <p className="font-medium">Rappels actifs</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Recevoir des notifications</p>
                        </div>
                      </div>
                      <ToggleSwitch 
                        checked={settings.enabled} 
                        onChange={(checked) => settings.updateSettings({ enabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Volume2 className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium">Son</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Alertes sonores</p>
                        </div>
                      </div>
                      <ToggleSwitch 
                        checked={settings.soundEnabled} 
                        onChange={(checked) => settings.updateSettings({ soundEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <Vibrate className="w-5 h-5 text-green-700 dark:text-green-300" />
                        </div>
                        <div>
                          <p className="font-medium">Vibration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Retour haptique</p>
                        </div>
                      </div>
                      <ToggleSwitch 
                        checked={settings.vibrationEnabled} 
                        onChange={(checked) => settings.updateSettings({ vibrationEnabled: checked })}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Section Horaires avec design moderne */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horaires
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Début de journée
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={settings.startTime}
                          onChange={(e) => settings.updateSettings({ startTime: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fin de journée
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={settings.endTime}
                          onChange={(e) => settings.updateSettings({ endTime: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fréquence des rappels
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="5"
                        max="240"
                        step="5"
                        value={settings.frequency}
                        onChange={(e) => settings.updateSettings({ frequency: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span>5 min</span>
                        <span className="font-bold text-purple-600">{settings.frequency} minutes</span>
                        <span>4 heures</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Section Jours actifs avec animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Jours actifs
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Lun', code: 'Mon' },
                      { label: 'Mar', code: 'Tue' },
                      { label: 'Mer', code: 'Wed' },
                      { label: 'Jeu', code: 'Thu' },
                      { label: 'Ven', code: 'Fri' },
                      { label: 'Sam', code: 'Sat' },
                      { label: 'Dim', code: 'Sun' },
                    ].map((day) => (
                      <DaySelector
                        key={day.code}
                        day={day.label}
                        dayCode={day.code}
                        isActive={settings.activeDays.includes(day.code)}
                        onClick={() => {
                          const newActiveDays = settings.activeDays.includes(day.code)
                            ? settings.activeDays.filter((d) => d !== day.code)
                            : [...settings.activeDays, day.code];
                          settings.updateSettings({ activeDays: newActiveDays });
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Data Management avec nouveau style */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DataManagement />
                </motion.div>

                {/* Section Tutoriel avec call-to-action */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <RotateCcw className="w-5 h-5" />
                    Tutoriel
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    Redécouvrez les fonctionnalités de l'application avec notre guide interactif.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResetOnboarding}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25"
                  >
                    Relancer le tutoriel
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}