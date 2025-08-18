import { motion } from 'framer-motion'
import { TrendingUp, Star } from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification.store'
import { calculateLevel } from '@/data/achievements'

export function LevelProgress() {
  const { userProgress } = useGamificationStore()
  const levelInfo = calculateLevel(userProgress.totalPoints)
  
  const progressPercentage = levelInfo.nextLevel
    ? ((userProgress.totalPoints - (levelInfo.level === 1 ? 0 : levelInfo.nextLevel.requiredPoints - userProgress.pointsToNextLevel - userProgress.totalPoints)) / 
       (levelInfo.nextLevel.requiredPoints - (levelInfo.level === 1 ? 0 : levelInfo.nextLevel.requiredPoints - userProgress.pointsToNextLevel - userProgress.totalPoints))) * 100
    : 100
    
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/20 transition-all duration-200 hover:shadow-lg hover:border-purple-500/40 hover:translate-y-[-2px] cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{levelInfo.level === 100 ? '🔥' : '⭐'}</div>
          <div>
            <h3 className="font-bold text-white">Niveau {userProgress.currentLevel}</h3>
            <p className="text-sm text-purple-300">{levelInfo.title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{userProgress.totalPoints}</p>
          <p className="text-xs text-purple-300">points total</p>
        </div>
      </div>
      
      {levelInfo.nextLevel && (
        <>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progression</span>
              <span>{userProgress.pointsToNextLevel} pts restants</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-purple-300">
            <TrendingUp className="w-3 h-3" />
            <span>Prochain niveau : {levelInfo.nextLevel.title}</span>
          </div>
        </>
      )}
      
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-500/20">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{userProgress.stats.totalExercises}</p>
          <p className="text-xs text-gray-400">Exercices</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">{userProgress.achievements.length}</p>
          <p className="text-xs text-gray-400">Trophées</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">{userProgress.badges.length}</p>
          <p className="text-xs text-gray-400">Badges</p>
        </div>
      </div>
    </motion.div>
  )
}