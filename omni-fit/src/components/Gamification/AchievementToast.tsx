import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal } from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification.store'
import { Achievement, Badge } from '@/types/gamification'

export function AchievementToast() {
  const { recentUnlocks, clearRecentUnlocks } = useGamificationStore()
  
  useEffect(() => {
    if (recentUnlocks.length > 0) {
      const timer = setTimeout(() => {
        clearRecentUnlocks()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [recentUnlocks, clearRecentUnlocks])
  
  const isAchievement = (unlock: Achievement | Badge): unlock is Achievement => {
    return 'category' in unlock
  }
  
  return (
    <AnimatePresence>
      {recentUnlocks.map((unlock, index) => (
        <motion.div
          key={`${unlock.id}-${index}`}
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 25,
            delay: index * 0.1 
          }}
          className="fixed top-20 right-4 z-50"
          style={{ top: `${80 + index * 90}px` }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg shadow-2xl max-w-sm">
            <div className="flex items-center gap-3 text-white">
              <div className="text-3xl animate-bounce">
                {isAchievement(unlock) ? <Trophy className="w-8 h-8" /> : <Medal className="w-8 h-8" />}
              </div>
              <div>
                <p className="font-bold text-lg">{unlock.name}</p>
                <p className="text-sm opacity-90">{unlock.description}</p>
                {isAchievement(unlock) && (
                  <p className="text-xs mt-1 font-semibold">+{unlock.points} points</p>
                )}
              </div>
              <div className="text-4xl ml-auto">{unlock.icon}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}