import { X, RotateCcw, Key, AlertTriangle, Check, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings.store';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useApiStore } from '@/stores/api.store';
import DataManagement from './DataManagement';
import { useState } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const settings = useSettingsStore();
  const { resetOnboarding } = useOnboarding();
  const { openaiApiKey, isApiConfigured, setApiKey, removeApiKey, validateApiKey } = useApiStore();
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');

  const handleResetOnboarding = () => {
    if (confirm("Voulez-vous relancer le tutoriel d'introduction ?")) {
      resetOnboarding();
      window.location.reload();
    }
  };

  const handleSaveApiKey = () => {
    if (!tempApiKey) {
      setApiKeyError('Veuillez entrer une clé API');
      return;
    }
    
    if (!validateApiKey(tempApiKey)) {
      setApiKeyError('Format de clé invalide. La clé doit commencer par "sk-"');
      return;
    }
    
    setApiKey(tempApiKey);
    setTempApiKey('');
    setApiKeyError('');
    setShowApiKey(false);
  };

  const handleRemoveApiKey = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre clé API ?')) {
      removeApiKey();
      setTempApiKey('');
    }
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
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <SettingsIcon className="w-8 h-8" />
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
              <p className="text-blue-100">Personnalisez votre expérience fitness</p>
            </div>

            {/* Content avec scroll */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <div className="p-6 space-y-6">
                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>

                  <div className="flex items-center justify-between">
                    <label htmlFor="enabled" className="text-sm text-gray-700 dark:text-gray-300">
                      Activer les rappels
                    </label>
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={settings.enabled}
                      onChange={(e) => settings.updateSettings({ enabled: e.target.checked })}
                      className="w-5 h-5 text-purple-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="soundEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                      Son des notifications
                    </label>
                    <input
                      type="checkbox"
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onChange={(e) => settings.updateSettings({ soundEnabled: e.target.checked })}
                      className="w-5 h-5 text-purple-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="vibrationEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                      Vibration
                    </label>
                    <input
                      type="checkbox"
                      id="vibrationEnabled"
                      checked={settings.vibrationEnabled}
                      onChange={(e) =>
                        settings.updateSettings({ vibrationEnabled: e.target.checked })
                      }
                      className="w-5 h-5 text-purple-600"
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horaires</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                        Heure de début
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        value={settings.startTime}
                        onChange={(e) => settings.updateSettings({ startTime: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                        Heure de fin
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        value={settings.endTime}
                        onChange={(e) => settings.updateSettings({ endTime: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="frequency" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                      Fréquence (minutes)
                    </label>
                    <input
                      type="number"
                      id="frequency"
                      min="5"
                      max="240"
                      value={settings.frequency}
                      onChange={(e) =>
                        settings.updateSettings({ frequency: parseInt(e.target.value) || 30 })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>

                {/* Active Days */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jours actifs</h3>
                  <div className="flex gap-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                      const dayCode = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
                      return (
                        <button
                          key={day}
                          onClick={() => {
                            const newActiveDays = settings.activeDays.includes(dayCode)
                              ? settings.activeDays.filter((d) => d !== dayCode)
                              : [...settings.activeDays, dayCode];
                            settings.updateSettings({ activeDays: newActiveDays });
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            settings.activeDays.includes(dayCode)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* API Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coach IA Avancé</h3>
                  
                  {/* Avertissement */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          Mode IA Avancé (Optionnel)
                        </p>
                        <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                          <li>• Utilise VOTRE clé API OpenAI personnelle</li>
                          <li>• Communication directe avec OpenAI</li>
                          <li>• Aucune donnée stockée sur nos serveurs</li>
                          <li>• Coûts facturés sur votre compte OpenAI (~0.01€/message)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {isApiConfigured ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-900 dark:text-green-100">
                            Clé API configurée
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveApiKey}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Le Coach IA peut maintenant répondre à des questions complexes et personnalisées.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!showApiKey ? (
                        <button
                          onClick={() => setShowApiKey(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          <Key className="w-4 h-4" />
                          Ajouter une clé API OpenAI
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="apiKey" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                              Clé API OpenAI
                            </label>
                            <input
                              type="password"
                              id="apiKey"
                              value={tempApiKey}
                              onChange={(e) => {
                                setTempApiKey(e.target.value);
                                setApiKeyError('');
                              }}
                              placeholder="sk-..."
                              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            />
                            {apiKeyError && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {apiKeyError}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveApiKey}
                              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={() => {
                                setShowApiKey(false);
                                setTempApiKey('');
                                setApiKeyError('');
                              }}
                              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Obtenez votre clé sur{' '}
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          platform.openai.com
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                {/* Data Management */}
                <DataManagement />

                {/* Onboarding Reset */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tutoriel</h3>
                  <button
                    onClick={handleResetOnboarding}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Relancer le tutoriel
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Relancez le tutoriel d'introduction pour découvrir à nouveau les
                    fonctionnalités.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
