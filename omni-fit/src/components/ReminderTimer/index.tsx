import { useReminderStore } from '@/stores/reminder.store';
import { motion } from 'framer-motion';
import { Bell, BellOff } from 'lucide-react';
import { useState } from 'react';
import { Settings } from '@/components/Settings';

export const ReminderTimer = () => {
  const { timeUntilNextReminder, isInActiveHours } = useReminderStore();
  const [showSettings, setShowSettings] = useState(false);

  if (!isInActiveHours) {
    return (
      <>
        <motion.div
          className="bg-gray-800 rounded-lg p-4 mx-4 mb-6 flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-700 transition-colors"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowSettings(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <BellOff className="w-5 h-5 text-gray-500" />
          <span className="text-gray-400">Rappels inactifs</span>
          <span className="text-xs text-gray-500 ml-2">(Cliquez pour activer)</span>
        </motion.div>
        
        {/* Modal Settings */}
        {showSettings && (
          <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
        )}
      </>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 mx-4 mb-6 bg-opacity-95 border border-purple-500/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="text-gray-300">Prochain rappel dans</span>
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tabular-nums">{timeUntilNextReminder}</div>
      </div>
    </motion.div>
  );
};
