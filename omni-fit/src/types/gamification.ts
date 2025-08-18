export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'streak' | 'exercises' | 'time' | 'special'
  requirement: number
  unit?: string
  unlockedAt?: Date
  points: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  unlockedAt?: Date
}

export interface UserProgress {
  totalPoints: number
  currentLevel: number
  pointsToNextLevel: number
  achievements: Achievement[]
  badges: Badge[]
  stats: {
    totalExercises: number
    totalMinutes: number
    bestStreak: number
    currentStreak: number
    favoriteExercise?: string
    totalWorkouts: number
  }
}

export interface LevelSystem {
  level: number
  title: string
  requiredPoints: number
  icon: string
  benefits: string[]
}