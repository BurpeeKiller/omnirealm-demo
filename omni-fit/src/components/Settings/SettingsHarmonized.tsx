import { X, Bell, Clock, Calendar, Shield, Database, Volume2, Vibrate, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings.store';
import { useOnboarding } from '@/hooks/useOnboarding';
import DataManagement from '../DataManagement';
import { useState } from 'react';
import { SubscriptionManager } from '@/components/Premium';
import { useSubscription } from '@/hooks/useSubscription';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsHarmonized({ isOpen, onClose }: SettingsProps) {
  const settings = useSettingsStore();
  const { resetOnboarding } = useOnboarding();
  const [activeTab, setActiveTab] = useState<'notifications' | 'schedule' | 'premium' | 'data' | 'about'>('notifications');
  const { isPremium } = useSubscription();

  const tabs = [
    { id: 'notifications', label: 'Rappels', icon: Bell },
    { id: 'schedule', label: 'Horaires', icon: Clock },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'data', label: 'Données', icon: Database },
    { id: 'about', label: 'À propos', icon: Shield },
  ] as const;

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
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-600"></div>
    </label>
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

          {/* Modal comme Stats */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] md:h-auto md:max-h-[90vh] md:inset-x-4 md:inset-y-auto md:top-[5%] md:bottom-[5%] md:max-w-4xl md:mx-auto bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header avec gradient rose */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 modal-header">
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

            {/* Tabs identiques à Stats */}
            <div className="bg-gray-50 dark:bg-gray-800 px-2 py-2">
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                        font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-white dark:bg-gray-900 text-rose-600 dark:text-rose-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600' : ''}`} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800">
              <AnimatePresence mode="wait">
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto modal-content"
                  >
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-xl card-compact space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Bell className="w-5 h-5 text-rose-600" />
                          Notifications
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                                <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                              </div>
                              <div>
                                <p className="font-medium">Rappels actifs</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Recevoir des notifications d'exercices
                                </p>
                              </div>
                            </div>
                            <ToggleSwitch 
                              checked={settings.enabled} 
                              onChange={(checked) => settings.updateSettings({ enabled: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium">Son</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Alertes sonores
                                </p>
                              </div>
                            </div>
                            <ToggleSwitch 
                              checked={settings.soundEnabled} 
                              onChange={(checked) => settings.updateSettings({ soundEnabled: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Vibrate className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium">Vibration</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Retour haptique
                                </p>
                              </div>
                            </div>
                            <ToggleSwitch 
                              checked={settings.vibrationEnabled} 
                              onChange={(checked) => settings.updateSettings({ vibrationEnabled: checked })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'schedule' && (
                  <motion.div
                    key="schedule"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto modal-content"
                  >
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-rose-600" />
                          Plage horaire
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Heure de début
                            </label>
                            <input
                              type="time"
                              value={settings.startTime}
                              onChange={(e) => settings.updateSettings({ startTime: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Heure de fin
                            </label>
                            <input
                              type="time"
                              value={settings.endTime}
                              onChange={(e) => settings.updateSettings({ endTime: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Fréquence des rappels
                          </label>
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
                            <span className="font-bold text-rose-600">{settings.frequency} minutes</span>
                            <span>4 heures</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-rose-600" />
                          Jours actifs
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                          {[
                            { label: 'L', code: 'Mon' },
                            { label: 'M', code: 'Tue' },
                            { label: 'M', code: 'Wed' },
                            { label: 'J', code: 'Thu' },
                            { label: 'V', code: 'Fri' },
                            { label: 'S', code: 'Sat' },
                            { label: 'D', code: 'Sun' },
                          ].map((day) => (
                            <motion.button
                              key={day.code}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const newActiveDays = settings.activeDays.includes(day.code)
                                  ? settings.activeDays.filter((d) => d !== day.code)
                                  : [...settings.activeDays, day.code];
                                settings.updateSettings({ activeDays: newActiveDays });
                              }}
                              className={`
                                aspect-square flex items-center justify-center rounded-xl font-medium
                                transition-all duration-200
                                ${settings.activeDays.includes(day.code)
                                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/25'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }
                              `}
                            >
                              {day.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'premium' && (
                  <motion.div
                    key="premium"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto modal-content"
                  >
                    <div className="space-y-6">
                      <SubscriptionManager />
                      
                      {!isPremium && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-purple-600" />
                            Découvrez OmniFit Premium
                          </h3>
                          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600">✓</span>
                              <span>Coach IA personnalisé qui s'adapte à vos progrès</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600">✓</span>
                              <span>Programmes d'entraînement sur mesure</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600">✓</span>
                              <span>Analytics avancées et insights détaillés</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600">✓</span>
                              <span>Support prioritaire et nouvelles fonctionnalités</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'data' && (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto modal-content"
                  >
                    <DataManagement />
                  </motion.div>
                )}

                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto modal-content"
                  >
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">À propos</h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <p>Version : 1.0.0</p>
                          <p>Développé avec ❤️ pour votre santé</p>
                          <p>100% privé • 100% local • 0% tracking</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Tutoriel</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Redécouvrez les fonctionnalités de l'application
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleResetOnboarding}
                          className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-medium"
                        >
                          Relancer le tutoriel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer avec action principale */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-rose-600">{settings.frequency}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Minutes entre rappels</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{settings.activeDays.length}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Jours actifs</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{settings.enabled ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rappels</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}