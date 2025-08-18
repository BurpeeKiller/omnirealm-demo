import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Achievement, Badge, UserProgress } from '@/types/gamification'
import { achievements, badges, calculateLevel, calculatePoints } from '@/data/achievements'
import { logger } from '@/utils/logger'

interface GamificationState {
  userProgress: UserProgress
  unlockedAchievements: string[]
  unlockedBadges: string[]
  recentUnlocks: (Achievement | Badge)[]
  
  // Actions
  addPoints: (points: number) => void
  checkAchievements: (stats: UserProgress['stats']) => void
  unlockAchievement: (achievementId: string) => void
  unlockBadge: (badgeId: string) => void
  clearRecentUnlocks: () => void
  recordExercise: (exerciseType: string) => void
  recordWorkout: (duration: number) => void
  updateStreak: (currentStreak: number) => void
}

const initialProgress: UserProgress = {
  totalPoints: 0,
  currentLevel: 1,
  pointsToNextLevel: 250,
  achievements: [],
  badges: [],
  stats: {
    totalExercises: 0,
    totalMinutes: 0,
    bestStreak: 0,
    currentStreak: 0,
    totalWorkouts: 0
  }
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      userProgress: initialProgress,
      unlockedAchievements: [],
      unlockedBadges: [],
      recentUnlocks: [],

      addPoints: (points: number) => {
        set((state) => {
          const newTotalPoints = state.userProgress.totalPoints + points
          const levelInfo = calculateLevel(newTotalPoints)
          
          // Vérifier si on monte de niveau
          if (levelInfo.level > state.userProgress.currentLevel) {
            logger.info(`🎉 Niveau ${levelInfo.level} atteint!`)
            
            // Débloquer les badges de niveau
            if (levelInfo.level === 10) get().unlockBadge('intermediate')
            if (levelInfo.level === 25) get().unlockBadge('advanced')
            if (levelInfo.level === 50) get().unlockBadge('elite')
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              totalPoints: newTotalPoints,
              currentLevel: levelInfo.level,
              pointsToNextLevel: levelInfo.nextLevel 
                ? levelInfo.nextLevel.requiredPoints - newTotalPoints
                : 0
            }
          }
        })
      },

      checkAchievements: (stats: UserProgress['stats']) => {
        const state = get()
        
        achievements.forEach(achievement => {
          if (state.unlockedAchievements.includes(achievement.id)) return
          
          let shouldUnlock = false
          
          switch (achievement.category) {
            case 'streak':
              shouldUnlock = stats.currentStreak >= achievement.requirement
              break
            case 'exercises':
              shouldUnlock = stats.totalExercises >= achievement.requirement
              break
            case 'time':
              shouldUnlock = stats.totalMinutes >= achievement.requirement
              break
            case 'special':
              // Logique spéciale pour chaque achievement
              if (achievement.id === 'early-bird') {
                const hour = new Date().getHours()
                shouldUnlock = hour < 7
              } else if (achievement.id === 'night-owl') {
                const hour = new Date().getHours()
                shouldUnlock = hour >= 22
              }
              // Autres achievements spéciaux à implémenter
              break
          }
          
          if (shouldUnlock) {
            get().unlockAchievement(achievement.id)
          }
        })
      },

      unlockAchievement: (achievementId: string) => {
        const achievement = achievements.find(a => a.id === achievementId)
        if (!achievement) return
        
        set((state) => {
          if (state.unlockedAchievements.includes(achievementId)) return state
          
          logger.info(`🏆 Achievement débloqué: ${achievement.name}`)
          
          // Ajouter les points
          get().addPoints(achievement.points)
          
          return {
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
            recentUnlocks: [...state.recentUnlocks, { ...achievement, unlockedAt: new Date() }],
            userProgress: {
              ...state.userProgress,
              achievements: [...state.userProgress.achievements, { ...achievement, unlockedAt: new Date() }]
            }
          }
        })
      },

      unlockBadge: (badgeId: string) => {
        const badge = badges.find(b => b.id === badgeId)
        if (!badge) return
        
        set((state) => {
          if (state.unlockedBadges.includes(badgeId)) return state
          
          logger.info(`🎖️ Badge débloqué: ${badge.name}`)
          
          return {
            unlockedBadges: [...state.unlockedBadges, badgeId],
            recentUnlocks: [...state.recentUnlocks, { ...badge, unlockedAt: new Date() }],
            userProgress: {
              ...state.userProgress,
              badges: [...state.userProgress.badges, { ...badge, unlockedAt: new Date() }]
            }
          }
        })
      },

      clearRecentUnlocks: () => {
        set({ recentUnlocks: [] })
      },

      recordExercise: (exerciseType: string) => {
        set((state) => {
          const newStats = {
            ...state.userProgress.stats,
            totalExercises: state.userProgress.stats.totalExercises + 1
          }
          
          // Ajouter les points
          get().addPoints(calculatePoints('exercise'))
          
          // Vérifier les achievements
          get().checkAchievements(newStats)
          
          return {
            userProgress: {
              ...state.userProgress,
              stats: newStats
            }
          }
        })
      },

      recordWorkout: (duration: number) => {
        set((state) => {
          const newStats = {
            ...state.userProgress.stats,
            totalWorkouts: state.userProgress.stats.totalWorkouts + 1,
            totalMinutes: state.userProgress.stats.totalMinutes + duration
          }
          
          // Ajouter les points
          get().addPoints(calculatePoints('workout'))
          
          // Vérifier les achievements
          get().checkAchievements(newStats)
          
          return {
            userProgress: {
              ...state.userProgress,
              stats: newStats
            }
          }
        })
      },

      updateStreak: (currentStreak: number) => {
        set((state) => {
          const newStats = {
            ...state.userProgress.stats,
            currentStreak,
            bestStreak: Math.max(state.userProgress.stats.bestStreak, currentStreak)
          }
          
          // Points bonus pour la série
          if (currentStreak > 0) {
            get().addPoints(calculatePoints('streak'))
          }
          
          // Vérifier les achievements
          get().checkAchievements(newStats)
          
          return {
            userProgress: {
              ...state.userProgress,
              stats: newStats
            }
          }
        })
      }
    }),
    {
      name: 'omnifit-gamification',
      version: 1
    }
  )
)