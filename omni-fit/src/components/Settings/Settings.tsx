import { Bell, Clock, Calendar, Shield, Database, Volume2, Vibrate, Crown, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings.store';
import { useOnboarding } from '@/hooks/useOnboarding';
import DataManagement from '../DataManagement';
import { useState } from 'react';
import { SubscriptionManager } from '@/components/Premium';
import { useSubscription } from '@/hooks/useSubscription';
import { AISettings } from './AISettings';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@/components/ui/adaptive-dialog';
import { DialogTabs } from '@/components/ui/dialog-tabs';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const settings = useSettingsStore();
  const { resetOnboarding } = useOnboarding();
  const [activeTab, setActiveTab] = useState<'notifications' | 'schedule' | 'premium' | 'ai' | 'data' | 'about'>('notifications');
  const { isPremium } = useSubscription();

  const tabs = [
    { id: 'notifications', label: 'Rappels', icon: Bell },
    { id: 'schedule', label: 'Horaires', icon: Clock },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'ai', label: 'Coach IA', icon: Brain },
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton>
        <DialogHeader
          gradient="from-rose-600 to-pink-600"
          icon={<Shield className="w-8 h-8 text-white" />}
          subtitle="Personnalisez votre expérience"
        >
          Paramètres
        </DialogHeader>

        <DialogTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
          activeColor="rose"
        />

        <DialogBody>
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
                      <div className="bg-white dark:bg-gray-900 rounded-lg card-compact space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Bell className="w-5 h-5 text-rose-600" />
                          Notifications
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                                <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Rappels actifs</p>
                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                  Recevoir des notifications d'exercices
                                </p>
                              </div>
                            </div>
                            <ToggleSwitch 
                              checked={settings.enabled} 
                              onChange={(checked) => settings.updateSettings({ enabled: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Son</p>
                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                  Alertes sonores
                                </p>
                              </div>
                            </div>
                            <ToggleSwitch 
                              checked={settings.soundEnabled} 
                              onChange={(checked) => settings.updateSettings({ soundEnabled: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Vibrate className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium">Vibration</p>
                                <p className="text-sm text-gray-700 dark:text-gray-200">
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
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Clock className="w-5 h-5 text-rose-600" />
                          Plage horaire
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                              Heure de début
                            </label>
                            <input
                              type="time"
                              value={settings.startTime}
                              onChange={(e) => settings.updateSettings({ startTime: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                              Heure de fin
                            </label>
                            <input
                              type="time"
                              value={settings.endTime}
                              onChange={(e) => settings.updateSettings({ endTime: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                            Fréquence des rappels
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="240"
                            step="5"
                            value={settings.frequency}
                            onChange={(e) => settings.updateSettingsDebounced({ frequency: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-200 mt-2">
                            <span>5 min</span>
                            <span className="font-bold text-rose-600">{settings.frequency} minutes</span>
                            <span>4 heures</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
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
                                aspect-square flex items-center justify-center rounded-lg font-medium
                                transition-all duration-200
                                ${settings.activeDays.includes(day.code)
                                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/25'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
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
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-purple-600" />
                            Découvrez OmniFit Premium
                          </h3>
                          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
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

                {activeTab === 'ai' && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto modal-content"
                  >
                    <AISettings />
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
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">À propos</h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                          <p>Version : 1.0.0</p>
                          <p>Développé avec ❤️ pour votre santé</p>
                          <p>100% privé • 100% local • 0% tracking</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">Tutoriel</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                          Redécouvrez les fonctionnalités de l'application
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleResetOnboarding}
                          className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-medium"
                        >
                          Relancer le tutoriel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
        </DialogBody>

        <DialogFooter>
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-rose-600">{settings.frequency}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Minutes entre rappels</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{settings.activeDays.length}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Jours actifs</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{settings.enabled ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Rappels</p>
                </div>
              </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}